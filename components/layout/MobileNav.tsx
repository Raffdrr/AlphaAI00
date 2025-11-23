import React from 'react';
import { LayoutDashboard, List, Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TabType } from '../../types';

const MobileNav: React.FC = () => {
    const { activeTab, setActiveTab } = useStore();

    const navItems = [
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: LayoutDashboard },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.ALERTS, label: 'Alerts', icon: Bell },
    ];

    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#202124] border-t border-[#3c4043] pb-safe pt-2 z-40 flex justify-around items-center h-16">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-[#8ab4f8]' : 'text-[#bdc1c6]'
                            }`}
                    >
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default MobileNav;
