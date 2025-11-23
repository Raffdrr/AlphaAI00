import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import PortfolioAllocation from '../analysis/PortfolioAllocation';
import NewsFeed from './NewsFeed';

const Dashboard: React.FC = () => {
    const { portfolio, marketData, isFocusMode } = useStore();

    const stats = useMemo(() => {
        let totalValue = 0;
        let totalCost = 0;
        let dayChangeValue = 0;

        portfolio.forEach(item => {
            const data = marketData[item.ticker];
            const qty = item.quantity || 0;
            if (data) {
                const currentVal = data.price * qty;
                totalValue += currentVal;
                totalCost += (item.avgCost || 0) * qty;
                dayChangeValue += currentVal * (data.changePercent / 100);
            }
        });

        const totalPnl = totalValue - totalCost;
        const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

        return { totalValue, totalPnl, totalPnlPercent, dayChangeValue };
    }, [portfolio, marketData]);

    const isPositive = stats.totalPnl >= 0;
    const isDayPositive = stats.dayChangeValue >= 0;

    return (
        <div className="space-y-8">
            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <MarketOverview />
                    </div>
                    <div>
                        <MarketHeatmap />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Value Card */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden group hover:border-[#333] transition-colors">
                    <div className="absolute top-4 right-4 p-2 bg-[#222] rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <DollarSign size={20} />
                    </div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Valore Totale</h3>
                    <div className="text-3xl font-medium text-white tabular-nums tracking-tight">
                        ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                {/* P&L Card */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden hover:border-[#333] transition-colors">
                    <div className="absolute top-4 right-4 p-2 bg-[#222] rounded-lg text-gray-400">
                        {isPositive ? <ArrowUpRight size={20} className="text-green-400" /> : <ArrowDownRight size={20} className="text-red-400" />}
                    </div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">P&L Totale</h3>
                    <div className="flex items-baseline gap-3">
                        <span className={`text-2xl font-medium tabular-nums tracking-tight ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{stats.totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${isPositive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                            {stats.totalPnlPercent.toFixed(2)}%
                        </span>
                    </div>
                </div>

                {/* Day Change Card */}
                <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden hover:border-[#333] transition-colors">
                    <div className="absolute top-4 right-4 p-2 bg-[#222] rounded-lg text-gray-400">
                        <PieChart size={20} />
                    </div>
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Variazione Giornaliera</h3>
                    <div className="text-2xl font-medium text-white tabular-nums tracking-tight mb-1">
                        <span className={isDayPositive ? 'text-green-400' : 'text-red-400'}>
                            {isDayPositive ? '+' : ''}{stats.dayChangeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">Stima Intraday</div>
                </div>
            </div>

            {!isFocusMode && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PortfolioAllocation />
                    {/* Placeholder for future Comparison Tool or similar */}
                    <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 flex items-center justify-center text-[#bdc1c6] border-dashed">
                        <span className="text-sm">Altri strumenti in arrivo...</span>
                    </div>
                </div>
            )}

            {!isFocusMode && <NewsFeed />}
        </div>
    );
};

export default Dashboard;
