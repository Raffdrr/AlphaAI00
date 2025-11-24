import React from 'react';
import { PieChart, List, Bell, Calendar, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TabType } from '../../types';

const MobileNav: React.FC = () => {
    const { activeTab, setActiveTab } = useStore();

    const navItems = [
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: PieChart },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.CALENDAR, label: 'Events', icon: Calendar },
        { id: TabType.SOCIAL, label: 'Social', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-[var(--bg-glass)] backdrop-blur-xl border-t border-[var(--border-subtle)] pb-safe pt-2 z-50 flex justify-around items-center h-20 px-2">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16
                            ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
                    >
                        <div className={`
                            p-1.5 rounded-full transition-all
                            ${isActive ? 'bg-[rgba(99,102,241,0.15)]' : 'bg-transparent'}
                        `}>
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default MobileNav;
