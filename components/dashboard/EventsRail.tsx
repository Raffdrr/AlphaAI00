import React from 'react';
import { Calendar } from 'lucide-react';

export interface EventItem {
    id: string;
    date: Date;
    ticker: string;
    type: 'dividend' | 'earnings';
    amount?: string;
}

interface EventsRailProps {
    events: EventItem[];
}

export const EventsRail: React.FC<EventsRailProps> = ({ events }) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
            <div className="flex gap-4 min-w-min px-1">
                {/* Header / Add Button Placeholder */}
                <div className="flex flex-col items-center justify-center min-w-[80px] h-[100px] rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] border-dashed opacity-50">
                    <Calendar size={24} className="text-[var(--text-secondary)] mb-2" />
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Upcoming</span>
                </div>

                {events.map((event) => {
                    const isDividend = event.type === 'dividend';
                    const dateStr = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                        <div
                            key={event.id}
                            className="group relative flex flex-col items-center justify-between min-w-[100px] h-[100px] p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-all hover:-translate-y-1 cursor-pointer"
                        >
                            {/* Top Badge (Date) */}
                            <div className="px-2 py-0.5 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                                {dateStr}
                            </div>

                            {/* Icon / Ticker */}
                            <div className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black ${isDividend ? 'bg-[var(--success)]' : 'bg-[var(--accent-primary)]'}`}>
                                    {event.ticker.substring(0, 2)}
                                </div>
                                <span className="text-xs font-bold text-white">{event.ticker}</span>
                            </div>

                            {/* Bottom Badge (Type/Amount) */}
                            <div className={`text-[10px] font-medium ${isDividend ? 'text-[var(--success)]' : 'text-[var(--accent-primary)]'}`}>
                                {isDividend ? event.amount || 'Div' : 'Earn'}
                            </div>

                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity ${isDividend ? 'bg-[var(--success)]' : 'bg-[var(--accent-primary)]'}`} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
