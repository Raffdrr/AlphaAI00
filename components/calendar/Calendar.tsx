import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, TrendingUp, DollarSign, Globe, Filter, Search } from 'lucide-react';
import { CalendarEvent, EarningsEvent, DividendEvent, EconomicEvent } from '../../types';
import { useStore } from '../../store/useStore';

const Calendar: React.FC = () => {
    const { calendarEvents } = useStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filter, setFilter] = useState<'ALL' | 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Get current month's calendar grid
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days in month
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
    const monthName = selectedDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

    const nextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'EARNINGS': return <TrendingUp size={14} className="text-accent-500" />;
            case 'DIVIDEND': return <DollarSign size={14} className="text-green-400" />;
            case 'ECONOMIC': return <Globe size={14} className="text-blue-400" />;
            default: return <CalendarIcon size={14} className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                            <CalendarIcon className="text-accent-500" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Events Calendar</h1>
                            <p className="text-sm text-gray-500">Track earnings, dividends, and economic events</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search events or tickers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1a1a1a] text-white pl-10 pr-4 py-3 rounded-xl border border-[#2a2a2a] focus:border-accent-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex bg-[#1a1a1a] rounded-xl p-1">
                        {(['ALL', 'EARNINGS', 'DIVIDEND', 'ECONOMIC'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f
                                        ? 'bg-accent-500 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                {/* Month Navigation */}
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-bold text-white capitalize">{monthName}</h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        →
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-[#2a2a2a] bg-[#0a0a0a]">
                    {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
                        <div key={day} className="p-4 text-center text-xs font-bold text-gray-400 uppercase">
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
                                className={`min-h-[120px] p-3 border-r border-b border-[#2a2a2a] ${!day ? 'bg-[#0a0a0a]' : 'bg-[#141414] hover:bg-[#1a1a1a]'
                                    } transition-colors`}
                            >
                                {day && (
                                    <>
                                        <div className={`text-sm font-bold mb-2 ${isToday
                                                ? 'text-accent-500'
                                                : 'text-white'
                                            }`}>
                                            {day.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {events.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="text-xs p-2 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] hover:border-accent-500/50 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {getEventIcon(event.type)}
                                                        {event.ticker && (
                                                            <span className="font-bold text-white">{event.ticker}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-gray-400 line-clamp-1">{event.title}</div>
                                                </div>
                                            ))}
                                            {events.length > 3 && (
                                                <div className="text-xs text-gray-500 text-center">
                                                    +{events.length - 3} more
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

            {/* Upcoming Events List */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                    {calendarEvents
                        .filter(e => {
                            const matchesFilter = filter === 'ALL' || e.type === filter;
                            const matchesSearch = !searchQuery ||
                                e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (e.ticker && e.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
                            return matchesFilter && matchesSearch && e.date >= Date.now();
                        })
                        .sort((a, b) => a.date - b.date)
                        .slice(0, 10)
                        .map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] hover:border-accent-500/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-[#1a1a1a] rounded-lg">
                                        {getEventIcon(event.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {event.ticker && (
                                                <span className="font-bold text-white">{event.ticker}</span>
                                            )}
                                            <span className="text-sm text-gray-400">{event.title}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(event.date).toLocaleDateString('it-IT', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.importance === 'High'
                                        ? 'bg-red-500/10 text-red-400'
                                        : event.importance === 'Medium'
                                            ? 'bg-yellow-500/10 text-yellow-400'
                                            : 'bg-gray-500/10 text-gray-400'
                                    }`}>
                                    {event.importance}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
