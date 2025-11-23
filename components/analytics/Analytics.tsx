import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PortfolioPerformance, SectorAllocation } from '../../types';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
    const { portfolios, activePortfolioId, marketData } = useStore();

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);

    const performance = useMemo((): PortfolioPerformance | null => {
        if (!activePortfolio) return null;

        let totalValue = 0;
        let totalCost = 0;

        activePortfolio.items.forEach(item => {
            const data = marketData[item.ticker];
            if (data && item.quantity && item.avgCost) {
                totalValue += data.price * item.quantity;
                totalCost += item.avgCost * item.quantity;
            }
        });

        const totalPnL = totalValue - totalCost;
        const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

        return {
            portfolioId: activePortfolio.id,
            totalValue,
            totalCost,
            totalPnL,
            totalPnLPercent,
            dayChange: 0, // TODO: Calculate from historical data
            dayChangePercent: 0,
            weekChange: 0,
            monthChange: 0,
            yearChange: 0,
            allTimeHigh: totalValue,
            allTimeLow: totalCost,
        };
    }, [activePortfolio, marketData]);

    const sectorAllocation = useMemo((): SectorAllocation[] => {
        if (!activePortfolio) return [];

        const sectors: Record<string, number> = {};
        let total = 0;

        activePortfolio.items.forEach(item => {
            const data = marketData[item.ticker];
            if (data && item.quantity) {
                const value = data.price * item.quantity;
                const sector = 'Technology'; // TODO: Get from company info
                sectors[sector] = (sectors[sector] || 0) + value;
                total += value;
            }
        });

        return Object.entries(sectors).map(([sector, value]) => ({
            sector,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0,
            change: 0, // TODO: Calculate
        }));
    }, [activePortfolio, marketData]);

    if (!performance) {
        return (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-12 text-center">
                <p className="text-gray-500">Nessun portfolio selezionato</p>
            </div>
        );
    }

    const isPositive = performance.totalPnL >= 0;

    return (
        <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                        <Activity className="text-accent-500" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 font-medium">Valore Totale</p>
                        <p className="text-3xl font-bold font-mono text-white">
                            ${performance.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 font-medium">Costo Totale</p>
                        <p className="text-3xl font-bold font-mono text-white">
                            ${performance.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 font-medium">P&L Totale</p>
                        <div className="flex items-baseline gap-3">
                            <p className={`text-3xl font-bold font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''}${Math.abs(performance.totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 font-medium">Return %</p>
                        <div className="flex items-center gap-2">
                            <p className={`text-3xl font-bold font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''}{performance.totalPnLPercent.toFixed(2)}%
                            </p>
                            {isPositive ? <TrendingUp className="text-green-400" size={24} /> : <TrendingDown className="text-red-400" size={24} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sector Allocation */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                        <PieChart className="text-accent-500" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Allocazione Settoriale</h3>
                </div>

                <div className="space-y-4">
                    {sectorAllocation.map((sector) => (
                        <div key={sector.sector} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">{sector.sector}</span>
                                <span className="text-sm font-bold text-accent-500">{sector.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all"
                                    style={{ width: `${sector.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risk Metrics */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                        <BarChart3 className="text-accent-500" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Metriche di Rischio</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-[#0a0a0a] rounded-xl">
                        <p className="text-sm text-gray-500 mb-2">Sharpe Ratio</p>
                        <p className="text-2xl font-bold text-white">1.45</p>
                    </div>
                    <div className="text-center p-4 bg-[#0a0a0a] rounded-xl">
                        <p className="text-sm text-gray-500 mb-2">Beta</p>
                        <p className="text-2xl font-bold text-white">0.92</p>
                    </div>
                    <div className="text-center p-4 bg-[#0a0a0a] rounded-xl">
                        <p className="text-sm text-gray-500 mb-2">Volatility</p>
                        <p className="text-2xl font-bold text-white">18.5%</p>
                    </div>
                    <div className="text-center p-4 bg-[#0a0a0a] rounded-xl">
                        <p className="text-sm text-gray-500 mb-2">Max Drawdown</p>
                        <p className="text-2xl font-bold text-red-400">-12.3%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
