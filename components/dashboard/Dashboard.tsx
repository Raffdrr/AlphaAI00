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
        <div className="space-y-8 animate-enter">
            {/* Header / Net Worth Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Net Worth Card (Hero) */}
                <div className="premium-card lg:col-span-2 relative overflow-hidden group p-8 border-[var(--accent-glow)]">
                    {/* Background Gradient for Hero */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-transparent opacity-50" />

                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <Activity size={180} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-3">Total Net Worth</h2>
                        <div className="flex items-baseline gap-6">
                            <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <MetricBadge value={stats.dayChangePercent} size="md" />
                        </div>

                        <div className="mt-10 flex gap-16">
                            <div>
                                <div className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Total Profit</div>
                                <div className={`text-2xl font-bold ${stats.isPositive ? 'text-[var(--success)] drop-shadow-[0_0_8px_var(--success-glow)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Daily Change</div>
                                <div className={`text-2xl font-bold ${stats.isDayPositive ? 'text-[var(--success)] drop-shadow-[0_0_8px_var(--success-glow)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Mini Stats */}
                <div className="space-y-6">
                    <div className="premium-card h-full flex flex-col justify-center p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-[rgba(99,102,241,0.1)] text-[var(--accent-primary)] border border-[rgba(99,102,241,0.2)]">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-base font-medium text-[var(--text-secondary)]">Performance</span>
                        </div>
                        <div className="text-5xl font-bold text-white mb-2">
                            {stats.totalPnlPercent.toFixed(2)}%
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">All time return</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline & Allocation */}
                <div className="space-y-8">
                    <div className="premium-card p-6">
                        <Timeline events={timelineEvents} title="Upcoming Events" />
                        {timelineEvents.length === 0 && (
                            <div className="text-center py-12 text-[var(--text-tertiary)] text-sm">
                                No upcoming events
                            </div>
                        )}
                    </div>

                    {!isFocusMode && (
                        <div className="premium-card p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Allocation</h3>
                            <PortfolioAllocation />
                        </div>
                    )}
                </div>

                {/* Center/Right Column: Market & News */}
                <div className="lg:col-span-2 space-y-8">
                    {!isFocusMode && (
                        <>
                            <div className="premium-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white">Market Overview</h3>
                                </div>
                                <MarketOverview />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="premium-card p-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Market Heatmap</h3>
                                    <MarketHeatmap />
                                </div>
                                <div className="premium-card p-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Latest News</h3>
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
