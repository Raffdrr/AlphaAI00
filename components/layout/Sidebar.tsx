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
        <aside className="w-72 bg-[#0a0a0a] border-r border-[#2a2a2a] flex-col h-screen hidden md:flex sticky top-0">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-[#2a2a2a]">
                <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg shadow-accent-500/30">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Alpha-Vision</h1>
                    <p className="text-xs text-gray-500">Financial Intelligence</p>
                </div>
            </div>

            {/* Add Asset Button */}
            <div className="p-4">
                <button
                    onClick={onAddAsset}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-accent-500/30 hover:shadow-accent-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span>Nuovo Asset</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${isActive
                                    ? 'bg-gradient-to-r from-accent-500/10 to-accent-600/10 text-accent-500 shadow-sm'
                                    : 'text-gray-400 hover:bg-[#141414] hover:text-white'
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={`transition-all ${isActive
                                        ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]'
                                        : 'group-hover:scale-110'
                                    }`}
                            />
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse"></div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#2a2a2a] space-y-2">
                <button
                    onClick={toggleFocusMode}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isFocusMode
                            ? 'bg-accent-500/10 text-accent-500'
                            : 'text-gray-400 hover:bg-[#141414] hover:text-white'
                        }`}
                >
                    {isFocusMode ? <EyeOff size={20} /> : <Eye size={20} />}
                    <span>Focus Mode</span>
                    {isFocusMode && <div className="ml-auto w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>}
                </button>

                <button
                    onClick={onOpenSettings}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#141414] transition-all text-sm font-semibold group"
                >
                    <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Impostazioni</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
