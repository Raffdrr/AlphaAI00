import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export interface TimelineEvent {
    id: string;
    date: Date;
    title: string;
    subtitle: string;
    type: 'dividend' | 'earnings' | 'other';
    amount?: string;
}

interface TimelineProps {
    events: TimelineEvent[];
    title?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, title = "Upcoming" }) => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-6 px-1 text-white flex items-center gap-2">
                <Calendar size={20} className="text-[var(--accent-primary)]" />
                {title}
            </h3>

            <div className="relative space-y-0 pl-2">
                {/* Continuous Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-6 w-[2px] bg-[var(--border-subtle)]" />

                {events.map((event, index) => {
                    const isDividend = event.type === 'dividend';
                    const isLast = index === events.length - 1;

                    return (
                        <div key={event.id} className="relative flex items-start gap-6 pb-8 group">
                            {/* Dot Indicator */}
                            <div className={`
                                z-10 w-4 h-4 rounded-full mt-1.5 border-2 border-[var(--bg-app)] shadow-lg
                                ${isDividend
                                    ? 'bg-[var(--success)] shadow-[0_0_10px_var(--success-glow)]'
                                    : 'bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]'
                                }
                                transition-transform group-hover:scale-125
                            `} />

                            {/* Content */}
                            <div className="flex-1 -mt-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-white text-base group-hover:text-[var(--accent-primary)] transition-colors">
                                            {event.title}
                                        </h4>
                                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                            {event.subtitle}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">
                                            {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                        {event.amount && (
                                            <div className="text-sm font-mono font-medium text-[var(--success)]">
                                                {event.amount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
