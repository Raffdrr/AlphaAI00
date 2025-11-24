import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar as CalendarIcon } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import PortfolioAllocation from '../analysis/PortfolioAllocation';
import NewsFeed from './NewsFeed';
import { GlassCard } from '../ui/GlassCard';
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
        return calendarEvents.slice(0, 5).map(e => ({
            id: e.id,
            date: new Date(e.date),
            title: e.symbol,
            subtitle: e.title,
            type: e.type === 'DIVIDEND' ? 'dividend' : 'earnings',
            amount: e.type === 'DIVIDEND' ? `$${e.estimate?.toFixed(2)}` : undefined
        }));
    }, [calendarEvents]);

    return (
        <div className="space-y-8 animate-in">
            {/* Header / Net Worth Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Net Worth Card */}
                <GlassCard className="lg:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={120} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wider mb-1">Net Worth</h2>
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-5xl font-bold font-mono text-white tracking-tight">
                                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <MetricBadge value={stats.dayChangePercent} size="md" />
                        </div>

                        <div className="mt-6 flex gap-8">
                            <div>
                                <div className="text-xs text-[var(--text-muted)] mb-1">Total Profit</div>
                                <div className={`text-lg font-mono font-medium ${stats.isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--text-muted)] mb-1">Daily Change</div>
                                <div className={`text-lg font-mono font-medium ${stats.isDayPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Quick Actions / Mini Stats */}
                <div className="space-y-6">
                    <GlassCard className="h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-[rgba(99,102,241,0.1)] text-[var(--primary)]">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-sm font-medium text-[var(--text-muted)]">Performance</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {stats.totalPnlPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">All time return</div>
                    </GlassCard>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline & Allocation */}
                <div className="space-y-8">
                    <GlassCard>
                        <Timeline events={timelineEvents} title="Upcoming Events" />
                        {timelineEvents.length === 0 && (
                            <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                                No upcoming events
                            </div>
                        )}
                    </GlassCard>

                    {!isFocusMode && (
                        <GlassCard>
                            <h3 className="text-lg font-semibold mb-4">Allocation</h3>
                            <PortfolioAllocation />
                        </GlassCard>
                    )}
                </div>

                {/* Center/Right Column: Market & News */}
                <div className="lg:col-span-2 space-y-8">
                    {!isFocusMode && (
                        <>
                            <GlassCard>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">Market Overview</h3>
                                </div>
                                <MarketOverview />
                            </GlassCard>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GlassCard>
                                    <h3 className="text-lg font-semibold mb-4">Market Heatmap</h3>
                                    <MarketHeatmap />
                                </GlassCard>
                                <GlassCard>
                                    <h3 className="text-lg font-semibold mb-4">Latest News</h3>
                                    <NewsFeed />
                                </GlassCard>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
