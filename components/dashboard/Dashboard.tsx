import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Activity } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import PortfolioAllocation from '../analysis/PortfolioAllocation';
import NewsFeed from './NewsFeed';

const Dashboard: React.FC = () => {
    const { portfolio, marketData, isFocusMode } = useStore();

    const stats = useMemo(() => {
        let totalValue = 0;
        let totalPnl = 0;
        let totalCost = 0;
        let dayChangeValue = 0;

        portfolio.forEach((item) => {
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

        return { totalValue, totalPnl, totalPnlPercent, dayChangeValue, dayChangePercent };
    }, [portfolio, marketData]);

    const isPositive = stats.totalPnl >= 0;
    const isDayPositive = stats.dayChangeValue >= 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section - Portfolio Summary */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                            <TrendingUp className="text-accent-500" size={20} />
                        </div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Il Tuo Portfolio</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Value */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500 font-medium">Valore Totale</p>
                            <p className="text-4xl font-bold font-mono text-white tracking-tight">
                                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Total P&L */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500 font-medium">Profitto/Perdita</p>
                            <div className="flex items-baseline gap-3">
                                <p className={`text-3xl font-bold font-mono tracking-tight ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPositive ? '+' : ''}{stats.totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {Math.abs(stats.totalPnlPercent).toFixed(2)}%
                                </span>
                            </div>
                        </div>

                        {/* Day Change */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500 font-medium">Variazione Giornaliera</p>
                            <div className="flex items-baseline gap-3">
                                <p className={`text-3xl font-bold font-mono tracking-tight ${isDayPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {isDayPositive ? '+' : ''}{stats.dayChangeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isDayPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {isDayPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {Math.abs(stats.dayChangePercent).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Market Overview & Heatmap */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <MarketOverview />
                    </div>
                    <div>
                        <MarketHeatmap />
                    </div>
                </div>
            )}

            {/* Portfolio Allocation & Tools */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PortfolioAllocation />
                    {/* Placeholder for future tools */}
                    <div className="bg-[#141414] border border-[#2a2a2a] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-accent-500/10 rounded-2xl">
                            <Activity className="text-accent-500" size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Nuovi Strumenti in Arrivo</h3>
                            <p className="text-sm text-gray-500">Stiamo lavorando a nuove funzionalità per migliorare la tua esperienza</p>
                        </div>
                    </div>
                </div>
            )}

            {/* News Feed */}
            {!isFocusMode && <NewsFeed />}
        </div>
    );
};

export default Dashboard;
