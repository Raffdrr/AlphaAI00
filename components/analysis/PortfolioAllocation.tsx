import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PieChart } from 'lucide-react';

const PortfolioAllocation: React.FC = () => {
    const { portfolios, activePortfolioId, marketData } = useStore();

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
    const portfolioItems = activePortfolio?.items || [];

    const allocation = useMemo(() => {
        const sectorMap: Record<string, number> = {};
        let total = 0;

        portfolioItems.forEach((item) => {
            const data = marketData[item.ticker];
            if (data && item.quantity) {
                const value = data.price * item.quantity;
                const sector = 'Technology'; // TODO: Get real sector from API
                sectorMap[sector] = (sectorMap[sector] || 0) + value;
                total += value;
            }
        });

        return Object.entries(sectorMap).map(([sector, value]) => ({
            sector,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0,
        })).sort((a, b) => b.value - a.value);
    }, [portfolioItems, marketData]);

    const colors = [
        'from-accent-500 to-accent-600',
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
    ];

    return (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-500/10 rounded-lg">
                    <PieChart className="text-accent-500" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Allocazione Portfolio</h3>
            </div>

            {allocation.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Nessun dato disponibile</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allocation.map((item, index) => (
                        <div key={item.sector} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">{item.sector}</span>
                                <span className="text-sm font-bold text-accent-500">{item.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PortfolioAllocation;
