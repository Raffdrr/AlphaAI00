import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, Wallet, PieChart, BarChart3, Zap, ArrowRight } from 'lucide-react';
import MarketOverview from './MarketOverview';
import MarketHeatmap from './MarketHeatmap';
import NewsFeed from './NewsFeed';
import { MetricBadge } from '../ui/MetricBadge';
import { EventsRail, EventItem } from './EventsRail';
import { TopHoldings } from './TopHoldings';
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

    // Mock Data for UI Demo
    const allocationData = [
        { label: 'Tech', value: 45, color: '#6366f1' },
        { label: 'Finance', value: 25, color: '#8b5cf6' },
        { label: 'Health', value: 15, color: '#ec4899' },
        { label: 'Energy', value: 10, color: '#eab308' },
        { label: 'Crypto', value: 5, color: '#22c55e' },
    ];

    const dividendData = [
        { month: 'J', amount: 120 },
        { month: 'F', amount: 85 },
        { month: 'M', amount: 210 },
        { month: 'A', amount: 95 },
        { month: 'M', amount: 150 },
        { month: 'J', amount: 300 },
    ];

    const topHoldings = portfolioItems.slice(0, 5).map(item => ({
        ticker: item.ticker,
        name: item.name || item.ticker,
        value: (marketData[item.ticker]?.price || 0) * item.quantity,
        change: marketData[item.ticker]?.changePercent || 0,
        allocation: 15 // Mock
    }));

    // If no holdings, add mocks for demo
    if (topHoldings.length === 0) {
        topHoldings.push(
            { ticker: 'AAPL', name: 'Apple Inc.', value: 15420.50, change: 1.25, allocation: 25 },
            { ticker: 'MSFT', name: 'Microsoft', value: 12300.00, change: -0.45, allocation: 20 },
            { ticker: 'TSLA', name: 'Tesla Inc.', value: 8500.20, change: 3.10, allocation: 12 },
            { ticker: 'NVDA', name: 'NVIDIA', value: 5600.00, change: 0.80, allocation: 8 },
            { ticker: 'O', name: 'Realty Income', value: 4200.00, change: 0.15, allocation: 6 }
        );
    }

    // Transform calendar events for Rail
    const railEvents: EventItem[] = useMemo(() => {
        return calendarEvents.slice(0, 10).map(e => {
            let amount: string | undefined;
            if (e.type === 'DIVIDEND' && e.data && typeof e.data === 'object' && 'amount' in e.data) {
                const val = (e.data as any).amount;
                if (typeof val === 'number') amount = `$${val.toFixed(2)}`;
            }
            return {
                id: e.id,
                date: new Date(e.date),
                ticker: e.ticker || e.title,
                type: e.type === 'DIVIDEND' ? 'dividend' : 'earnings',
                amount: amount
            };
        });
    }, [calendarEvents]);

    return (
        <div className="animate-enter space-y-8 pb-10">

            {/* 1. EVENTS RAIL (StockEvents Style - Horizontal) */}
            <div className="w-full">
                <EventsRail events={railEvents} />
            </div>

            {/* 2. HERO SECTION (Getquin Style - Dense) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Net Worth & PnL */}
                <div className="premium-card lg:col-span-2 p-8 relative overflow-hidden group border-[var(--accent-primary)]/40">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 via-transparent to-transparent opacity-30" />
                    {/* Background Chart Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none">
                        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0 20 L0 10 Q 20 5 40 12 T 100 8 L 100 20 Z" fill="var(--accent-primary)" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet size={16} className="text-[var(--text-secondary)]" />
                                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Total Net Worth</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <div className="flex items-center gap-4">
                                <MetricBadge value={stats.totalPnlPercent} size="lg" />
                                <span className={`text-lg font-bold ${stats.isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isPositive ? '+' : ''}${Math.abs(stats.totalPnl).toLocaleString()}
                                </span>
                                <span className="text-sm text-[var(--text-tertiary)]">All time</span>
                            </div>
                        </div>

                        {/* Daily Stats (Right aligned on desktop) */}
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Today's Change</span>
                            <div className="flex items-center gap-3">
                                <span className={`text-2xl font-bold ${stats.isDayPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                    {stats.isDayPositive ? '+' : ''}${Math.abs(stats.dayChangeValue).toLocaleString()}
                                </span>
                                <MetricBadge value={stats.dayChangePercent} size="md" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Allocation Preview */}
                <div className="premium-card p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <PieChart size={16} className="text-[var(--accent-secondary)]" />
                            Allocation
                        </h3>
                        <button className="text-[var(--text-secondary)] hover:text-white transition-colors">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex justify-center py-4">
                        <AllocationDonut data={allocationData} size={140} />
                    </div>
                </div>
            </div>

            {/* 3. MAIN GRID (Dense Data) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Top Holdings (Getquin Style List) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="premium-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-[var(--accent-primary)]" />
                                Top Holdings
                            </h3>
                        </div>
                        <TopHoldings holdings={topHoldings} />
                    </div>

                    {/* News Feed (Compact) */}
                    <div className="premium-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Latest News</h3>
                        <NewsFeed />
                    </div>
                </div>

                {/* RIGHT: Dividends & Heatmap */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                    {/* Dividends */}
                    <div className="premium-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart3 size={20} className="text-[var(--success)]" />
                                Dividend Income
                            </h3>
                            <span className="text-xs font-bold text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">
                                +$1,240.50 Est.
                            </span>
                        </div>
                        <DividendBarChart data={dividendData} height={160} />
                    </div>

                    {/* Compact Heatmap */}
                    <div className="premium-card p-6 flex-1 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Zap size={20} className="text-[var(--warning)]" />
                                Market Map
                            </h3>
                        </div>
                        <div className="h-[250px] overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                            <MarketHeatmap />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
