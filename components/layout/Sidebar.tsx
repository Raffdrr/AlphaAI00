import React from 'react';
import { useStore } from '../../store/useStore';
import {
    LayoutDashboard,
    List,
    Calendar as CalendarIcon,
    Users,
    BarChart3,
    Settings,
    Plus,
    User
} from 'lucide-react';
import { TabType } from '../../types';

interface SidebarProps {
    onAddAsset: () => void;
    onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddAsset, onOpenSettings }) => {
    const { activeTab, setActiveTab, userProfile, portfolios, activePortfolioId } = useStore();

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);

    const navItems = [
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: LayoutDashboard },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.CALENDAR, label: 'Events', icon: CalendarIcon },
        { id: TabType.SOCIAL, label: 'Community', icon: Users },
        { id: TabType.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#161616] border-r border-[#e5e5e5] dark:border-[#262626] flex-col h-screen hidden md:flex">
            {/* Logo & Brand */}
            <div className="p-6 border-b border-[#e5e5e5] dark:border-[#262626]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#0a0a0a] dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Alpha Vision
                        </h1>
                        <p className="text-xs text-[#737373]">Ultimate Edition</p>
                    </div>
                </div>
            </div>

            {/* User Profile Card - Getquin Style */}
            {userProfile && (
                <div className="p-4 border-b border-[#e5e5e5] dark:border-[#262626]">
                    <div className="flex items-center gap-3 p-3 bg-[#fafafa] dark:bg-[#1e1e1e] rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#0a0a0a] dark:text-white truncate">
                                {userProfile.displayName}
                            </p>
                            <p className="text-xs text-[#737373] truncate">
                                @{userProfile.username}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Button - Prominent */}
            <div className="p-4">
                <button
                    onClick={onAddAsset}
                    className="w-full flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-3 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Add Asset</span>
                </button>
            </div>

            {/* Navigation - Clean & Minimal */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-[#fff7ed] dark:bg-[#2a1810] text-[#ea580c] dark:text-[#fb923c]'
                                    : 'text-[#525252] dark:text-[#a3a3a3] hover:bg-[#f5f5f5] dark:hover:bg-[#1e1e1e] hover:text-[#0a0a0a] dark:hover:text-white'
                                }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Portfolio Stats - StockEvents Style */}
            {activePortfolio && (
                <div className="p-4 border-t border-[#e5e5e5] dark:border-[#262626]">
                    <div className="bg-[#fafafa] dark:bg-[#1e1e1e] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#737373]">Portfolio</span>
                            <span className="text-xs font-semibold text-[#f97316]">{activePortfolio.items.length} assets</span>
                        </div>
                        <div>
                            <p className="text-xs text-[#737373] mb-1">Total Value</p>
                            <p className="text-lg font-bold text-[#0a0a0a] dark:text-white font-mono">
                                $0.00
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings */}
            <div className="p-4 border-t border-[#e5e5e5] dark:border-[#262626]">
                <button
                    onClick={onOpenSettings}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#525252] dark:text-[#a3a3a3] hover:bg-[#f5f5f5] dark:hover:bg-[#1e1e1e] hover:text-[#0a0a0a] dark:hover:text-white transition-all text-sm font-medium"
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
