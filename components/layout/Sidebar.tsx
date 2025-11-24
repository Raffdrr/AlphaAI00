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
    Menu
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
                hidden md:flex flex-col h-[96vh] my-[2vh] ml-4 rounded-2xl 
                fluent-acrylic transition-all duration-300 ease-out z-50
                ${isExpanded ? 'w-64' : 'w-20'}
            `}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Header / Brand */}
            <div className="p-6 flex items-center justify-center h-20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-default)] to-[var(--accent-dark)] flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-black font-bold text-xl">A</span>
                </div>
                {isExpanded && (
                    <div className="ml-3 overflow-hidden whitespace-nowrap animate-fluent">
                        <h1 className="font-bold text-lg tracking-tight">AlphaVision</h1>
                    </div>
                )}
            </div>

            {/* Navigation Rail */}
            <nav className="flex-1 px-3 space-y-2 py-4 flex flex-col items-center w-full">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                                relative flex items-center h-12 rounded-lg transition-all duration-200 group w-full
                                ${isActive
                                    ? 'bg-[rgba(255,255,255,0.08)] text-[var(--accent-light)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                                }
                                ${isExpanded ? 'px-4' : 'justify-center px-0'}
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--accent-default)] rounded-r-full" />
                            )}

                            <item.icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="shrink-0"
                            />

                            {isExpanded && (
                                <span className="ml-4 text-sm font-medium whitespace-nowrap animate-fluent">
                                    {item.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {!isExpanded && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#2d2d2d] border border-[var(--border-card)] rounded-md text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 flex flex-col gap-4 items-center w-full border-t border-[var(--border-card)] bg-[rgba(0,0,0,0.2)] rounded-b-2xl">
                <button
                    onClick={onAddAsset}
                    className={`
                        flex items-center justify-center rounded-xl bg-[var(--accent-default)] text-black font-semibold transition-all hover:brightness-110
                        ${isExpanded ? 'w-full py-3 gap-2' : 'w-12 h-12'}
                    `}
                >
                    <Plus size={24} />
                    {isExpanded && <span>Add Asset</span>}
                </button>

                <div
                    onClick={onOpenSettings}
                    className={`
                        flex items-center rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors w-full
                        ${isExpanded ? 'p-2 gap-3' : 'justify-center p-2'}
                    `}
                >
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-solid)] border border-[var(--border-card)] flex items-center justify-center shrink-0">
                        <User size={16} className="text-[var(--text-secondary)]" />
                    </div>
                    {isExpanded && (
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-medium truncate">{userProfile?.displayName || 'User'}</p>
                            <p className="text-xs text-[var(--text-tertiary)] truncate">Settings</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
