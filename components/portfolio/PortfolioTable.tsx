import React from 'react';
import { useStore } from '../../store/useStore';
import { TabType } from '../../types';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PortfolioTableProps {
    onSelectAsset: (ticker: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ onSelectAsset }) => {
    const { activeTab, portfolios, activePortfolioId, watchlist, marketData } = useStore();

    const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
    const items = activeTab === TabType.PORTFOLIO ? (activePortfolio?.items || []) : watchlist;

    if (items.length === 0) {
        return (
            <div className="bg-[#141414] border border-[#2a2a2a] border-dashed rounded-2xl p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="p-4 bg-accent-500/10 rounded-2xl inline-block">
                        <TrendingUp className="text-accent-500" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                        {activeTab === TabType.PORTFOLIO ? 'Portfolio Vuoto' : 'Watchlist Vuota'}
                    </h3>
                    <p className="text-gray-500">
                        Clicca su "Nuovo Asset" per iniziare a tracciare i tuoi investimenti
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-6 gap-4 p-6 border-b border-[#2a2a2a] bg-[#0a0a0a]">
                <div className="col-span-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Asset</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prezzo</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Variazione</span>
                </div>
                {activeTab === TabType.PORTFOLIO && (
                    <>
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Holdings</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">P&L</span>
                        </div>
                    </>
                )}
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#2a2a2a]">
                {items.map((item) => {
                    const data = marketData[item.ticker];
                    const isPositive = (data?.changePercent || 0) >= 0;

                    let pnl = 0;
                    let pnlPercent = 0;
                    if (activeTab === TabType.PORTFOLIO && 'quantity' in item && 'avgCost' in item && item.quantity && item.avgCost) {
                        const currentValue = (data?.price || 0) * item.quantity;
                        const costBasis = item.avgCost * item.quantity;
                        pnl = currentValue - costBasis;
                        pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
                    }
                    const isPnlPositive = pnl >= 0;

                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelectAsset(item.ticker)}
                            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                        >
                            {/* Asset Info */}
                            <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/20">
                                    <span className="text-white font-bold text-lg">{item.ticker.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-white group-hover:text-accent-500 transition-colors">{item.ticker}</p>
                                    <p className="text-sm text-gray-500 line-clamp-1">{item.name}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-left md:text-right">
                                <p className="text-sm text-gray-400 md:hidden mb-1">Prezzo</p>
                                <p className="font-mono font-bold text-white">${data?.price?.toFixed(2) || '0.00'}</p>
                            </div>

                            {/* Change */}
                            <div className="text-left md:text-right">
                                <p className="text-sm text-gray-400 md:hidden mb-1">Variazione</p>
                                <div className="flex md:flex-col md:items-end gap-2">
                                    <span className={`font-mono font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? '+' : ''}{data?.changeAmount?.toFixed(2) || '0.00'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {Math.abs(data?.changePercent || 0).toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            {/* Portfolio Specific */}
                            {activeTab === TabType.PORTFOLIO && 'quantity' in item && 'avgCost' in item && (
                                <>
                                    <div className="text-left md:text-right">
                                        <p className="text-sm text-gray-400 md:hidden mb-1">Holdings</p>
                                        <p className="font-mono font-bold text-white">
                                            {item.quantity} @ ${item.avgCost?.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ${((data?.price || 0) * (item.quantity || 0)).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-sm text-gray-400 md:hidden mb-1">P&L</p>
                                        <div className="flex md:flex-col md:items-end gap-2">
                                            <span className={`font-mono font-bold ${isPnlPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                {isPnlPositive ? '+' : ''}${Math.abs(pnl).toFixed(2)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isPnlPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {isPnlPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                {Math.abs(pnlPercent).toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PortfolioTable;
