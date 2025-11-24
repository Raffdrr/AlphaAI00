import React from 'react';
import { MetricBadge } from '../ui/MetricBadge';

interface Holding {
    ticker: string;
    name: string;
    value: number;
    change: number;
    allocation: number;
}

interface TopHoldingsProps {
    holdings: Holding[];
}

export const TopHoldings: React.FC<TopHoldingsProps> = ({ holdings }) => {
    return (
        <div className="flex flex-col gap-4">
            {holdings.map((item, index) => (
                <div key={item.ticker} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors group cursor-pointer">
                    {/* Left: Logo & Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] group-hover:text-white group-hover:bg-[var(--accent-primary)] transition-colors">
                            {item.ticker.substring(0, 2)}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{item.ticker}</h4>
                            <p className="text-xs text-[var(--text-secondary)]">{item.name}</p>
                        </div>
                    </div>

                    {/* Center: Mini Sparkline (CSS Fake) */}
                    <div className="hidden sm:flex items-center gap-1 h-8 w-24 opacity-50">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 rounded-sm ${item.change >= 0 ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`}
                                style={{ height: `${Math.random() * 100}%` }}
                            />
                        ))}
                    </div>

                    {/* Right: Value & Change */}
                    <div className="text-right min-w-[100px]">
                        <div className="font-bold text-white text-sm">
                            ${item.value.toLocaleString()}
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <span className="text-[10px] text-[var(--text-tertiary)]">{item.allocation}%</span>
                            <MetricBadge value={item.change} size="sm" />
                        </div>
                    </div>
                </div>
            ))}

            {/* View All Link */}
            <div className="pt-2 text-center">
                <button className="text-xs font-bold text-[var(--accent-primary)] hover:text-white transition-colors uppercase tracking-wider">
                    View All Holdings
                </button>
            </div>
        </div>
    );
};
