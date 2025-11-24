import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar as CalendarIcon } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import PortfolioAllocation from '../analysis/PortfolioAllocation';
import NewsFeed from './NewsFeed';
import { MetricBadge } from '../ui/MetricBadge';
import { Timeline, TimelineEvent } from '../ui/Timeline';

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

    // Transform calendar events for Timeline
    const timelineEvents: TimelineEvent[] = useMemo(() => {
        return calendarEvents.slice(0, 5).map(e => {
            let amount: string | undefined;
            // Safe access to data for dividends
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
        <div className="space-y-8 animate-fluent">
            {/* Header / Net Worth Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Net Worth Card */}
                <div className="fluent-card lg:col-span-2 relative overflow-hidden group p-8">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <Activity size={180} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-[var(--text-tertiary)] text-sm font-medium uppercase tracking-wider mb-2">Net Worth</h2>
                        <div className="flex items-baseline gap-6">
                            <h1 className="text-6xl font-bold text-white tracking-tight">
                                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <MetricBadge value={stats.dayChangePercent} size="md" />
                        </div>

                        <div className="mt-8 flex gap-12">
                            <div>
                                <div className="text-xs text-[var(--text-tertiary)] mb-1">Total Profit</div>
                                <div className={`text-xl font-semibold ${stats.isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--text-tertiary)] mb-1">Daily Change</div>
                                <div className={`text-xl font-semibold ${stats.isDayPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Mini Stats */}
                <div className="space-y-6">
                    <div className="fluent-card h-full flex flex-col justify-center p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-lg bg-[rgba(96,205,255,0.1)] text-[var(--accent-default)]">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-base font-medium text-[var(--text-secondary)]">Performance</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {stats.totalPnlPercent.toFixed(2)}%
                        </div>
                        <div className="text-sm text-[var(--text-tertiary)]">All time return</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline & Allocation */}
                <div className="space-y-8">
                    <div className="fluent-card p-6">
                        <Timeline events={timelineEvents} title="Upcoming Events" />
                        {timelineEvents.length === 0 && (
                            <div className="text-center py-8 text-[var(--text-tertiary)] text-sm">
                                No upcoming events
                            </div>
                        )}
                    </div>

                    {!isFocusMode && (
                        <div className="fluent-card p-6">
                            <h3 className="text-lg font-semibold mb-4">Allocation</h3>
                            <PortfolioAllocation />
                        </div>
                    )}
                </div>

                {/* Center/Right Column: Market & News */}
                <div className="lg:col-span-2 space-y-8">
                    {!isFocusMode && (
                        <>
                            <div className="fluent-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">Market Overview</h3>
                                </div>
                                <MarketOverview />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="fluent-card p-6">
                                    <h3 className="text-lg font-semibold mb-4">Market Heatmap</h3>
                                    <MarketHeatmap />
                                </div>
                                <div className="fluent-card p-6">
                                    <h3 className="text-lg font-semibold mb-4">Latest News</h3>
                                    <NewsFeed />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
