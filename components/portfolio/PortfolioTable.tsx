import React from 'react';
import { useStore } from '../../store/useStore';
import { TabType } from '../../types';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { MetricBadge } from '../ui/MetricBadge';

interface PortfolioTableProps {
    onSelectAsset: (ticker: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ onSelectAsset }) => {
    const { activeTab, portfolios, activePortfolioId, watchlist, marketData } = useStore();

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
    const items = activeTab === TabType.PORTFOLIO ? (activePortfolio?.items || []) : watchlist;

    if (items.length === 0) {
        return (
            <GlassCard className="p-12 text-center border-dashed border-[var(--border-light)]">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="p-4 bg-[rgba(99,102,241,0.1)] rounded-2xl inline-block">
                        <TrendingUp className="text-[var(--primary)]" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                        {activeTab === TabType.PORTFOLIO ? 'Portfolio Empty' : 'Watchlist Empty'}
                    </h3>
                    <p className="text-[var(--text-muted)]">
                        Click "Add Asset" to start tracking your investments
                    </p>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard noPadding className="overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)]">
                <div className="col-span-2">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Asset</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Price</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Change</span>
                </div>
                {activeTab === TabType.PORTFOLIO && (
                    <>
                        <div className="text-right">
                            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Holdings</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">P&L</span>
                        </div>
                    </>
                )}
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[var(--border-subtle)]">
                {items.map((item) => {
                    const data = marketData[item.ticker];

                    let pnl = 0;
                    let pnlPercent = 0;
                    if (activeTab === TabType.PORTFOLIO && 'quantity' in item && 'avgCost' in item && item.quantity && item.avgCost) {
                        const currentValue = (data?.price || 0) * item.quantity;
                        const costBasis = item.avgCost * item.quantity;
                        pnl = currentValue - costBasis;
                        pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
                    }

                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelectAsset(item.ticker)}
                            className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer group"
                        >
                            {/* Asset Info */}
                            <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl flex items-center justify-center shadow-sm text-white font-bold">
                                    {item.ticker.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                                        {item.ticker}
                                    </p>
                                    <p className="text-sm text-[var(--text-muted)] truncate">{item.name}</p>
                                </div>
                                <ChevronRight size={16} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Price */}
                            <div className="text-left md:text-right flex flex-col justify-center">
                                <p className="text-sm text-[var(--text-muted)] md:hidden mb-1">Price</p>
                                <p className="font-mono font-semibold text-white">
                                    ${data?.price?.toFixed(2) || '0.00'}
                                </p>
                            </div>

                            {/* Change */}
                            <div className="text-left md:text-right flex flex-col justify-center items-start md:items-end">
                                <p className="text-sm text-[var(--text-muted)] md:hidden mb-1">Change</p>
                                <div className="flex md:flex-col md:items-end gap-2">
                                    <span className={`font-mono font-semibold text-sm mb-1 ${(data?.changeAmount || 0) >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                        {(data?.changeAmount || 0) >= 0 ? '+' : ''}{data?.changeAmount?.toFixed(2) || '0.00'}
                                    </span>
                                    <MetricBadge value={data?.changePercent || 0} size="sm" />
                                </div>
                            </div>

                            {/* Portfolio Specific */}
                            {activeTab === TabType.PORTFOLIO && 'quantity' in item && 'avgCost' in item && (
                                <>
                                    <div className="text-left md:text-right flex flex-col justify-center">
                                        <p className="text-sm text-[var(--text-muted)] md:hidden mb-1">Holdings</p>
                                        <p className="font-mono font-semibold text-white">
                                            {item.quantity} @ ${item.avgCost?.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            ${((data?.price || 0) * (item.quantity || 0)).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right flex flex-col justify-center items-start md:items-end">
                                        <p className="text-sm text-[var(--text-muted)] md:hidden mb-1">P&L</p>
                                        <div className="flex md:flex-col md:items-end gap-2">
                                            <span className={`font-mono font-semibold text-sm mb-1 ${pnl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toFixed(2)}
                                            </span>
                                            <MetricBadge value={pnlPercent} size="sm" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
};

export default PortfolioTable;
