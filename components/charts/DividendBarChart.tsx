import React from 'react';

interface DividendData {
    month: string;
    amount: number;
}

interface DividendBarChartProps {
    data: DividendData[];
    height?: number;
}

export const DividendBarChart: React.FC<DividendBarChartProps> = ({ data, height = 150 }) => {
    const maxVal = Math.max(...data.map(d => d.amount), 1); // Avoid div by zero

    return (
        <div className="w-full" style={{ height }}>
            <div className="flex items-end justify-between h-full gap-2 pt-6">
                {data.map((item, index) => {
                    const barHeight = (item.amount / maxVal) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                            {/* Tooltip */}
                            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                                ${item.amount.toFixed(2)}
                            </div>

                            {/* Bar */}
                            <div
                                className="w-full rounded-t-sm bg-[var(--accent-primary)] opacity-60 group-hover:opacity-100 transition-all relative overflow-hidden"
                                style={{ height: `${barHeight}%` }}
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            {/* Label */}
                            <span className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                                {item.month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
