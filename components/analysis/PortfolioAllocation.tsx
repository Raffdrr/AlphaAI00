import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PieChart } from 'lucide-react';

const COLORS = ['#8ab4f8', '#81c995', '#f28b82', '#fdd663', '#c58af9', '#78d9ec', '#ff8bcb'];

const PortfolioAllocation: React.FC = () => {
    const { portfolio, marketData } = useStore();

    const data = useMemo(() => {
        let totalValue = 0;
        const items = portfolio.map(item => {
            const price = marketData[item.ticker]?.price || 0;
            const value = price * (item.quantity || 0);
            totalValue += value;
            return { ticker: item.ticker, value };
        }).filter(i => i.value > 0);

        return items.sort((a, b) => b.value - a.value).map((item, index) => ({
            ...item,
            percent: (item.value / totalValue) * 100,
            color: COLORS[index % COLORS.length]
        }));
    }, [portfolio, marketData]);

    if (data.length === 0) {
        return (
            <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[300px] text-[#bdc1c6]">
                <PieChart size={48} className="opacity-20 mb-4" />
                <p>Nessun dato per l'analisi</p>
            </div>
        );
    }

    // SVG Pie Chart Logic
    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-[#3c4043] bg-[#202124]">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Allocazione Portfolio</h3>
            </div>

            <div className="p-6 flex flex-col md:flex-row items-center gap-8">
                {/* Pie Chart */}
                <div className="relative w-48 h-48 shrink-0">
                    <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                        {data.map((slice, i) => {
                            const start = cumulativePercent;
                            cumulativePercent += slice.percent / 100;
                            const end = cumulativePercent;

                            // If single item, draw full circle
                            if (data.length === 1) {
                                return <circle key={slice.ticker} cx="0" cy="0" r="1" fill={slice.color} />;
                            }

                            const [startX, startY] = getCoordinatesForPercent(start);
                            const [endX, endY] = getCoordinatesForPercent(end);
                            const largeArcFlag = slice.percent > 50 ? 1 : 0;

                            const pathData = [
                                `M 0 0`,
                                `L ${startX} ${startY}`,
                                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                `Z`
                            ].join(' ');

                            return (
                                <path
                                    key={slice.ticker}
                                    d={pathData}
                                    fill={slice.color}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <title>{slice.ticker}: {slice.percent.toFixed(1)}%</title>
                                </path>
                            );
                        })}
                    </svg>
                    {/* Inner Circle for Donut Effect */}
                    <div className="absolute inset-0 m-auto w-32 h-32 bg-[#1e1f20] rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#bdc1c6]">{portfolio.length} Asset</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 w-full space-y-3 overflow-y-auto max-h-[200px] pr-2">
                    {data.map((item) => (
                        <div key={item.ticker} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="font-medium text-white">{item.ticker}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[#bdc1c6]">${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                <span className="font-bold text-white w-12 text-right">{item.percent.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioAllocation;
