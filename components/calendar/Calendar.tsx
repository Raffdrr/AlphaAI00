import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, TrendingUp, DollarSign, Globe, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { useStore } from '../../store/useStore';

const Calendar: React.FC = () => {
    const { calendarEvents } = useStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState<'ALL' | 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        const dateStr = date.toDateString();
        return calendarEvents.filter(event => {
            const eventDate = new Date(event.date).toDateString();
            const matchesDate = eventDate === dateStr;
            const matchesFilter = filter === 'ALL' || event.type === filter;
            const matchesSearch = !searchQuery ||
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.ticker && event.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesDate && matchesFilter && matchesSearch;
        });
    };

    const days = getDaysInMonth(selectedDate);
    const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const nextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'EARNINGS': return <TrendingUp size={12} className="text-[#f97316]" />;
            case 'DIVIDEND': return <DollarSign size={12} className="text-[#22c55e]" />;
            case 'ECONOMIC': return <Globe size={12} className="text-[#3b82f6]" />;
            default: return <CalendarIcon size={12} className="text-[#737373]" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header - StockEvents Style */}
            <div className="bg-white dark:bg-[#161616] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#fff7ed] dark:bg-[#2a1810] rounded-xl">
                            <CalendarIcon className="text-[#f97316]" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#0a0a0a] dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                Events Calendar
                            </h1>
                            <p className="text-sm text-[#737373]">Track earnings, dividends & economic events</p>
                        </div>
                    </div>
                </div>

                {/* Filters - Clean & Minimal */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373]" size={18} />
                            <input
                                type="text"
                                placeholder="Search events or tickers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#fafafa] dark:bg-[#1e1e1e] text-[#0a0a0a] dark:text-white pl-10 pr-4 py-3 rounded-xl border border-[#e5e5e5] dark:border-[#262626] focus:border-[#f97316] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex bg-[#fafafa] dark:bg-[#1e1e1e] rounded-xl p-1 border border-[#e5e5e5] dark:border-[#262626]">
                        {(['ALL', 'EARNINGS', 'DIVIDEND', 'ECONOMIC'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filter === f
                                        ? 'bg-[#f97316] text-white shadow-sm'
                                        : 'text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Grid - Clean Design */}
            <div className="bg-white dark:bg-[#161616] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl overflow-hidden shadow-sm">
                {/* Month Navigation */}
                <div className="p-6 border-b border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-[#737373]" />
                    </button>
                    <h2 className="text-lg font-bold text-[#0a0a0a] dark:text-white">{monthName}</h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} className="text-[#737373]" />
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-[#e5e5e5] dark:border-[#262626] bg-[#fafafa] dark:bg-[#1e1e1e]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-3 text-center text-xs font-semibold text-[#737373] uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const events = getEventsForDate(day);
                        const isToday = day && day.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={index}
                                className={`min-h-[100px] p-2 border-r border-b border-[#e5e5e5] dark:border-[#262626] ${!day ? 'bg-[#fafafa] dark:bg-[#1e1e1e]' : 'bg-white dark:bg-[#161616] hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e]'
                                    } transition-colors`}
                            >
                                {day && (
                                    <>
                                        <div className={`text-sm font-semibold mb-2 ${isToday
                                                ? 'text-[#f97316]'
                                                : 'text-[#0a0a0a] dark:text-white'
                                            }`}>
                                            {day.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {events.slice(0, 2).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="text-xs p-1.5 bg-[#fafafa] dark:bg-[#1e1e1e] rounded border border-[#e5e5e5] dark:border-[#262626] hover:border-[#f97316] transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-1 mb-0.5">
                                                        {getEventIcon(event.type)}
                                                        {event.ticker && (
                                                            <span className="font-semibold text-[#0a0a0a] dark:text-white">{event.ticker}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[#737373] line-clamp-1">{event.title}</div>
                                                </div>
                                            ))}
                                            {events.length > 2 && (
                                                <div className="text-xs text-[#737373] text-center">
                                                    +{events.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
