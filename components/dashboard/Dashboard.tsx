import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
        <div className="space-y-6">
            {/* Hero Stats - Getquin Style Clean Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Value */}
                <div className="bg-white dark:bg-[#161616] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#737373]">Total Value</span>
                        <div className="p-2 bg-[#fafafa] dark:bg-[#1e1e1e] rounded-lg">
                            <DollarSign size={18} className="text-[#f97316]" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0a0a0a] dark:text-white font-mono">
                        ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-[#737373] mt-2">
                        {portfolioItems.length} assets
                    </p>
                </div>

                {/* Total P&L */}
                <div className="bg-white dark:bg-[#161616] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#737373]">Total P&L</span>
                        <div className={`p-2 rounded-lg ${stats.isPositive ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'}`}>
                            {stats.isPositive ? (
                                <TrendingUp size={18} className="text-[#22c55e]" />
                            ) : (
                                <TrendingDown size={18} className="text-[#ef4444]" />
                            )}
                        </div>
                    </div>
                    <p className={`text-3xl font-bold font-mono ${stats.isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-sm font-semibold ${stats.isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                            {stats.isPositive ? '+' : ''}{stats.totalPnlPercent.toFixed(2)}%
                        </span>
                        <span className="text-sm text-[#737373]">all time</span>
                    </div>
                </div>

                {/* Day Change */}
                <div className="bg-white dark:bg-[#161616] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#737373]">Today</span>
                        <div className="p-2 bg-[#fafafa] dark:bg-[#1e1e1e] rounded-lg">
                            <Activity size={18} className="text-[#f97316]" />
                        </div>
                    </div>
                    <p className={`text-3xl font-bold font-mono ${stats.isDayPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-sm font-semibold ${stats.isDayPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                            {stats.isDayPositive ? '+' : ''}{stats.dayChangePercent.toFixed(2)}%
                        </span>
                        {stats.isDayPositive ? (
                            <ArrowUpRight size={14} className="text-[#22c55e]" />
                        ) : (
                            <ArrowDownRight size={14} className="text-[#ef4444]" />
                        )}
                    </div>
                </div>
            </div>

            {/* Market Overview & Allocation */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MarketOverview />
                    <PortfolioAllocation />
                </div>
            )}

            {/* Heatmap & News */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MarketHeatmap />
                    <NewsFeed />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
