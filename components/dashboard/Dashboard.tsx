import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, Activity, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import NewsFeed from './NewsFeed';
import { MetricBadge } from '../ui/MetricBadge';
import { Timeline, TimelineEvent } from '../ui/Timeline';
import { AllocationDonut } from '../charts/AllocationDonut';
import { DividendBarChart } from '../charts/DividendBarChart';

const Dashboard: React.FC = () => {
    const { portfolios, activePortfolioId, marketData, isFocusMode, calendarEvents } = useStore();

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

    // Mock Allocation Data (Replace with real logic later)
    const allocationData = [
        { label: 'Technology', value: 45000, color: '#6366f1' },
        { label: 'Finance', value: 25000, color: '#8b5cf6' },
        { label: 'Healthcare', value: 15000, color: '#ec4899' },
        { label: 'Energy', value: 10000, color: '#eab308' },
    ];

    // Mock Dividend Data
    const dividendData = [
        { month: 'JAN', amount: 120 },
        { month: 'FEB', amount: 85 },
        { month: 'MAR', amount: 210 },
        { month: 'APR', amount: 95 },
        { month: 'MAY', amount: 150 },
        { month: 'JUN', amount: 300 },
    ];

    // Transform calendar events for Timeline
    const timelineEvents: TimelineEvent[] = useMemo(() => {
        return calendarEvents.slice(0, 8).map(e => {
            let amount: string | undefined;
            if (e.type === 'DIVIDEND' && e.data && typeof e.data === 'object' && 'amount' in e.data) {
                const val = (e.data as any).amount;
                if (typeof val === 'number') amount = `$${val.toFixed(2)}`;
            }
            return {
                id: e.id,
                date: new Date(e.date),
                title: e.ticker || e.title,
                subtitle: e.title,
                type: e.type === 'DIVIDEND' ? 'dividend' : 'earnings',
                amount: amount
            };
        });
    }, [calendarEvents]);

    return (
        <div className="animate-enter space-y-6">

            {/* --- BENTO GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN (Main Stats & Charts) - Spans 8 cols */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* ROW 1: Hero Stats (Compact & Dense) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Net Worth Hero */}
                        <div className="premium-card md:col-span-2 p-6 relative overflow-hidden group border-[var(--accent-primary)]/30">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent opacity-40" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Wallet size={14} /> Net Worth
                                    </h2>
                                    <div className="flex items-end gap-4">
                                        <h1 className="text-4xl font-bold text-white tracking-tight">
                                            ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </h1>
                                        <div className="mb-1">
                                            <MetricBadge value={stats.dayChangePercent} size="sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold">Total P&L</span>
                                        <span className={`text-lg font-bold ${stats.isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                            {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-px h-8 bg-[var(--border-subtle)]" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold">Daily P&L</span>
                                        <span className={`text-lg font-bold ${stats.isDayPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                            {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Metric: Performance */}
                        <div className="premium-card p-6 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Activity size={80} />
                            </div>
                            <div className="flex items-center gap-2 mb-2 text-[var(--accent-secondary)]">
                                <TrendingUp size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Return</span>
                            </div>
                            <span className="text-3xl font-bold text-white">
                                {stats.totalPnlPercent.toFixed(2)}%
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] mt-1">All time weighted return</span>
                        </div>
                    </div>

                    {/* ROW 2: Analytics & Dividends */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Allocation */}
                        <div className="premium-card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <PieChart size={16} className="text-[var(--accent-primary)]" />
                                    Allocation
                                </h3>
                            </div>
                            <div className="flex justify-center">
                                <AllocationDonut data={allocationData} size={220} />
                            </div>
                        </div>

                        {/* Dividends */}
                        <div className="premium-card p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <BarChart3 size={16} className="text-[var(--success)]" />
                                    Dividends
                                </h3>
                                <span className="text-xs font-mono text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">
                                    +12.5% YoY
                                </span>
                            </div>
                            <DividendBarChart data={dividendData} height={180} />
                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex justify-between text-xs">
                                <span className="text-[var(--text-secondary)]">Est. Annual Income</span>
                                <span className="text-white font-bold">$1,240.50</span>
                            </div>
                        </div>
                    </div>

                    {/* ROW 3: Market Heatmap (Wide) */}
                    <div className="premium-card p-6 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Zap size={16} className="text-[var(--warning)]" />
                                Market Heatmap
                            </h3>
                        </div>
                        <MarketHeatmap />
                    </div>

                </div>

                {/* RIGHT COLUMN (Timeline & News) - Spans 4 cols */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Timeline (StockEvents Style) */}
                    <div className="premium-card p-6 flex-1 min-h-[500px]">
                        <Timeline events={timelineEvents} title="Your Feed" />
                        {timelineEvents.length === 0 && (
                            <div className="text-center py-12 text-[var(--text-tertiary)] text-sm">
                                No upcoming events
                            </div>
                        )}
                    </div>

                    {/* Latest News (Compact List) */}
                    <div className="premium-card p-6 max-h-[400px] overflow-y-auto">
                        <h3 className="text-sm font-bold text-white mb-4 sticky top-0 bg-[var(--bg-card)] z-10 py-2 border-b border-[var(--border-subtle)]">
                            Latest News
                        </h3>
                        <NewsFeed />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;
