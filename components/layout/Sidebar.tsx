import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
    PieChart,
    List,
    Calendar,
    Users,
    BarChart3,
    Settings,
    Plus,
    User,
    LogOut
} from 'lucide-react';
import { TabType } from '../../types';

interface SidebarProps {
    onAddAsset: () => void;
    onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddAsset, onOpenSettings }) => {
    const { activeTab, setActiveTab, userProfile } = useStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { id: TabType.PORTFOLIO, label: 'Portfolio', icon: PieChart },
        { id: TabType.WATCHLIST, label: 'Watchlist', icon: List },
        { id: TabType.CALENDAR, label: 'Events', icon: Calendar },
        { id: TabType.SOCIAL, label: 'Community', icon: Users },
        { id: TabType.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <aside
            className={`
                hidden md:flex flex-col h-screen border-r border-[var(--border-subtle)] bg-[var(--bg-app)] z-50
                transition-all duration-300 ease-out
                ${isExpanded ? 'w-64' : 'w-20'}
            `}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Brand */}
            <div className="h-20 flex items-center justify-center border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)] shrink-0">
                    <span className="text-white font-bold text-xl">A</span>
                </div>
                {isExpanded && (
                    <div className="ml-3 overflow-hidden whitespace-nowrap animate-enter">
                        <h1 className="font-bold text-lg tracking-tight text-white">AlphaVision</h1>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                                relative flex items-center h-12 rounded-lg transition-all duration-200 group w-full
                                ${isActive
                                    ? 'bg-[var(--bg-card-hover)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)]'
                                }
                                ${isExpanded ? 'px-4' : 'justify-center px-0'}
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_10px_var(--accent-glow)]" />
                            )}

                            <item.icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`shrink-0 transition-colors ${isActive ? 'text-[var(--accent-primary)]' : ''}`}
                            />

                            {isExpanded && (
                                <span className="ml-4 text-sm font-medium whitespace-nowrap animate-enter">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col gap-4">
                <button
                    onClick={onAddAsset}
                    className={`
                        flex items-center justify-center rounded-xl bg-[var(--accent-primary)] text-white font-semibold transition-all hover:brightness-110 shadow-[0_0_15px_var(--accent-glow)]
                        ${isExpanded ? 'w-full py-3 gap-2' : 'w-12 h-12'}
                    `}
                >
                    <Plus size={24} />
                    {isExpanded && <span>Add Asset</span>}
                </button>

                <div
                    onClick={onOpenSettings}
                    className={`
                        flex items-center rounded-lg cursor-pointer hover:bg-[var(--bg-card)] transition-colors w-full
                        ${isExpanded ? 'p-2 gap-3' : 'justify-center p-2'}
                    `}
                >
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                        <User size={18} className="text-[var(--text-secondary)]" />
                    </div>
                    {isExpanded && (
                        <div className="flex-1 min-w-0 overflow-hidden animate-enter">
                            <p className="text-sm font-medium text-white truncate">{userProfile?.displayName || 'User'}</p>
                            <p className="text-xs text-[var(--text-secondary)] truncate">Settings</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
