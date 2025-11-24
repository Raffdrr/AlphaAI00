import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricBadgeProps {
    value: number;
    isPercent?: boolean;
    size?: 'sm' | 'md';
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
    value,
    isPercent = true,
    size = 'md'
}) => {
    const isPositive = value > 0;
    const isNeutral = value === 0;

    const colorClass = isPositive
        ? 'text-[var(--success)] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]'
        : isNeutral
            ? 'text-[var(--text-muted)] bg-[rgba(255,255,255,0.05)] border-[var(--border-subtle)]'
            : 'text-[var(--danger)] bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]';

    const Icon = isPositive ? ArrowUpRight : isNeutral ? Minus : ArrowDownRight;

    return (
        <div className={`
      inline-flex items-center gap-1 rounded-full border ${colorClass}
      ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      font-medium font-mono
    `}>
            <Icon size={size === 'sm' ? 12 : 14} />
            <span>
                {isPositive ? '+' : ''}{value.toFixed(2)}{isPercent ? '%' : ''}
            </span>
        </div>
    );
};
