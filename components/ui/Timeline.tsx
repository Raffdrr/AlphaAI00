import React from 'react';
import { GlassCard } from './GlassCard';

export interface TimelineEvent {
    id: string;
    date: Date;
    title: string;
    subtitle: string;
    amount?: string;
    type: 'dividend' | 'earnings' | 'split';
    logoUrl?: string;
}

interface TimelineProps {
    events: TimelineEvent[];
    title?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, title = "Upcoming Events" }) => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4 px-1">{title}</h3>
            <div className="relative space-y-6 pl-4">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-[var(--border-light)]" />

                {events.map((event, index) => (
                    <div key={event.id} className="relative flex items-start gap-4 group">
                        {/* Dot */}
                        <div className={`
              z-10 w-3 h-3 rounded-full mt-1.5 border-2 border-[var(--bg-app)]
              ${event.type === 'dividend' ? 'bg-[var(--success)]' : 'bg-[var(--primary)]'}
              group-hover:scale-125 transition-transform
            `} />

                        {/* Content */}
                        <div className="flex-1">
                            <GlassCard className="p-4 hover:bg-[var(--bg-glass-hover)] transition-colors" noPadding>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        {event.logoUrl ? (
                                            <img src={event.logoUrl} alt="" className="w-10 h-10 rounded-full bg-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-xs font-bold border border-[var(--border-light)]">
                                                {event.title.substring(0, 2)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-sm">{event.title}</h4>
                                            <p className="text-xs text-[var(--text-muted)]">{event.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-mono text-[var(--text-muted)]">
                                            {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        {event.amount && (
                                            <div className={`text-sm font-mono font-medium ${event.type === 'dividend' ? 'text-[var(--success)]' : 'text-[var(--text-main)]'}`}>
                                                {event.amount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
