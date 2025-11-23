import React from 'react';
import { LayoutDashboard, List, Bell, Plus, Settings, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TabType } from '../../types';

interface SidebarProps {
    onAddAsset: () => void;
    onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddAsset, onOpenSettings }) => {
    const { activeTab, setActiveTab } = useStore();

    const navItems = [
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: LayoutDashboard },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.ALERTS, label: 'Alerts', icon: Bell },
    ];

    return (
        <aside className="w-72 bg-[#1e1f20] border-r border-[#3c4043] flex-col h-screen hidden md:flex sticky top-0">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-[#3c4043]">
                <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                    <TrendingUp size={24} />
                </div>
                <span className="text-xl font-medium text-white tracking-tight">Alpha-Vision</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6">
                    <button
                        onClick={onAddAsset}
                        className="w-full flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-medium py-3 rounded-full transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        <span>Nuovo Asset</span>
                    </button>
                </div>

                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-r-full text-sm font-medium transition-colors border-l-4 ${isActive
                                    ? 'bg-[#3c4043]/50 text-[#8ab4f8] border-[#8ab4f8]'
                                    : 'text-[#bdc1c6] hover:bg-[#3c4043]/30 border-transparent hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#3c4043]">
                <button
                    onClick={onOpenSettings}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[#bdc1c6] hover:text-white hover:bg-[#3c4043]/30 transition-colors text-sm font-medium"
                >
                    <Settings size={20} />
                    <span>Impostazioni</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
