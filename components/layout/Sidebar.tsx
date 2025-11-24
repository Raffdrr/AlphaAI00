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
    User,
    PieChart
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
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: PieChart },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.CALENDAR, label: 'Events', icon: CalendarIcon },
        { id: TabType.SOCIAL, label: 'Community', icon: Users },
        { id: TabType.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <aside className="w-72 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex-col h-screen hidden md:flex z-50">
            {/* Brand */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <span className="text-white font-bold text-xl font-display">A</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight font-display">
                            Alpha<span className="text-[var(--primary)]">Vision</span>
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] font-mono">PRO TERMINAL</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                <div className="text-xs font-bold text-[var(--text-muted)] px-4 mb-2 uppercase tracking-wider">Menu</div>
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                                ${isActive
                                    ? 'text-white bg-[rgba(255,255,255,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full shadow-[0_0_10px_var(--primary)]" />
                            )}
                            <item.icon
                                size={20}
                                className={`transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-dim)] group-hover:text-white'}`}
                            />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Portfolio Summary */}
            {activePortfolio && (
                <div className="p-4 mx-4 mb-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-[var(--text-muted)]">Total Balance</span>
                        <span className="text-xs text-[var(--success)] font-mono">+2.4%</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-white">$124,592.00</div>
                </div>
            )}

            {/* User & Settings */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)]">
                <button
                    onClick={onAddAsset}
                    className="w-full mb-4 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Quick Add</span>
                </button>

                <div className="flex items-center gap-3 px-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onOpenSettings}>
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center justify-center">
                        <User size={14} className="text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userProfile?.displayName || 'User'}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">Free Plan</p>
                    </div>
                    <Settings size={16} className="text-[var(--text-muted)]" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
