import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Activity } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import PortfolioAllocation from '../analysis/PortfolioAllocation';
import NewsFeed from './NewsFeed';

const Dashboard: React.FC = () => {
    const { portfolios, activePortfolioId, marketData, isFocusMode } = useStore();

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
    const portfolioItems = activePortfolio?.items || [];

    const stats = useMemo(() => {
        let totalValue = 0;
        let totalPnl = 0;
        let totalCost = 0;
        let dayChangeValue = 0;

        portfolioItems.forEach((item) => {
            const data = marketData[item.ticker];
            if (data && item.quantity && item.avgCost) {
                const currentValue = data.price * item.quantity;
                const costBasis = item.avgCost * item.quantity;
                totalValue += currentValue;
                totalCost += costBasis;
                totalPnl += (currentValue - costBasis);
                dayChangeValue += (data.changeAmount * item.quantity);
            }
        });

        const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
        const dayChangePercent = totalValue > 0 ? (dayChangeValue / totalValue) * 100 : 0;

        return {
            totalValue,
            totalPnl,
            totalPnlPercent,
            dayChangeValue,
            dayChangePercent,
            isPositive: totalPnl >= 0,
            isDayPositive: dayChangeValue >= 0,
        };
    }, [portfolioItems, marketData]);

    return (
        <div className="space-y-8">
            {/* Hero Section - Portfolio Summary */}
            <div className="relative bg-gradient-to-br from-[#141414] via-[#0a0a0a] to-[#000000] border border-[#2a2a2a] rounded-3xl p-8 overflow-hidden">
                {/* Gradient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-accent-500/10 to-transparent blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                            <DollarSign className="text-accent-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-gray-400">Valore Totale Portfolio</h2>
                            <p className="text-5xl font-bold font-mono text-white mt-1">
                                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total P&L */}
                        <div className="bg-[#0a0a0a]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#2a2a2a]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-400">P&L Totale</span>
                                {stats.isPositive ? (
                                    <ArrowUpRight className="text-green-400" size={20} />
                                ) : (
                                    <ArrowDownRight className="text-red-400" size={20} />
                                )}
                            </div>
                            <p className={`text-3xl font-bold font-mono ${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-sm font-bold mt-1 ${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {stats.isPositive ? '+' : ''}{stats.totalPnlPercent.toFixed(2)}%
                            </p>
                        </div>

                        {/* Day Change */}
                        <div className="bg-[#0a0a0a]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#2a2a2a]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-400">Variazione Giornaliera</span>
                                <Activity className="text-accent-500" size={20} />
                            </div>
                            <p className={`text-3xl font-bold font-mono ${stats.isDayPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-sm font-bold mt-1 ${stats.isDayPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {stats.isDayPositive ? '+' : ''}{stats.dayChangePercent.toFixed(2)}%
                            </p>
                        </div>

                        {/* Holdings */}
                        <div className="bg-[#0a0a0a]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#2a2a2a]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-400">Holdings</span>
                                <TrendingUp className="text-accent-500" size={20} />
                            </div>
                            <p className="text-3xl font-bold font-mono text-white">
                                {portfolioItems.length}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Asset nel portfolio
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Market Overview & Heatmap */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MarketOverview />
                    <MarketHeatmap />
                </div>
            )}

            {/* Portfolio Allocation & News */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PortfolioAllocation />
                    <NewsFeed />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
