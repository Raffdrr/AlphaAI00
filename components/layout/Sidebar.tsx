import React from 'react';
import { LayoutDashboard, List, Bell, Plus, Settings, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TabType } from '../../types';

interface SidebarProps {
    onAddAsset: () => void;
    onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddAsset, onOpenSettings }) => {
    const { activeTab, setActiveTab, isFocusMode, toggleFocusMode } = useStore();

    const navItems = [
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: LayoutDashboard },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.ALERTS, label: 'Alerts', icon: Bell },
    ];

    return (
        <aside className="w-72 bg-[#050505] border-r border-[#222] flex-col h-screen hidden md:flex sticky top-0">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-[#222]">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <TrendingUp size={24} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Alpha-Vision</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6">
                    <button
                        onClick={onAddAsset}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)]"
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
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-[#111] text-blue-400 shadow-[inset_0_0_0_1px_#333]'
                                : 'text-gray-400 hover:bg-[#111] hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" : ""} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#222] space-y-2">
                <button
                    onClick={toggleFocusMode}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isFocusMode ? 'text-blue-400 bg-[#111]' : 'text-gray-400 hover:text-white hover:bg-[#111]'}`}
                >
                    {isFocusMode ? <EyeOff size={20} /> : <Eye size={20} />}
                    <span>Focus Mode</span>
                </button>
                <button
                    onClick={onOpenSettings}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#111] transition-colors text-sm font-medium"
                >
                    <Settings size={20} />
                    <span>Impostazioni</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
