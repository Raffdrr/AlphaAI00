import React from 'react';

interface DataPoint {
    label: string;
    value: number;
    color: string;
}

interface AllocationDonutProps {
    data: DataPoint[];
    size?: number;
}

export const AllocationDonut: React.FC<AllocationDonutProps> = ({ data, size = 200 }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let currentAngle = 0;
    const radius = size / 2;
    const innerRadius = radius * 0.65;
    const center = size / 2;

    // If no data, show empty state
    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
                <div className="w-32 h-32 rounded-full border-4 border-[var(--border-subtle)] opacity-20 mb-2" />
                <span className="text-xs">No Data</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-8">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const percentage = item.value / total;
                        const angle = percentage * 360;
                        const largeArcFlag = angle > 180 ? 1 : 0;

                        // Calculate coordinates
                        const x1 = center + radius * Math.cos((Math.PI * currentAngle) / 180);
                        const y1 = center + radius * Math.sin((Math.PI * currentAngle) / 180);
                        const x2 = center + radius * Math.cos((Math.PI * (currentAngle + angle)) / 180);
                        const y2 = center + radius * Math.sin((Math.PI * (currentAngle + angle)) / 180);

                        const pathData = [
                            `M ${center} ${center}`,
                            `L ${x1} ${y1}`,
                            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            'Z'
                        ].join(' ');

                        const startAngle = currentAngle;
                        currentAngle += angle;

                        return (
                            <path
                                key={item.label}
                                d={pathData}
                                fill={item.color}
                                stroke="var(--bg-card)"
                                strokeWidth="4"
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        );
                    })}
                    {/* Inner Circle for Donut Effect */}
                    <circle cx={center} cy={center} r={innerRadius} fill="var(--bg-card)" />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-[var(--text-secondary)]">Total</span>
                    <span className="text-lg font-bold text-white">${total.toLocaleString()}</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
                {data.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color }} />
                        <div className="flex flex-col">
                            <span className="text-xs text-[var(--text-secondary)] font-medium">{item.label}</span>
                            <span className="text-sm font-bold text-white">
                                {((item.value / total) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
