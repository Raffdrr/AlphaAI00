import React from 'react';
import { useStore } from '../../store/useStore';
import { TabType, PortfolioItem } from '../../types';
import { Trash2, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';

interface PortfolioTableProps {
    onSelectAsset: (ticker: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ onSelectAsset }) => {
    const { activeTab, portfolio, watchlist, marketData, removeFromPortfolio, removeFromWatchlist } = useStore();

    const items = activeTab === TabType.PORTFOLIO ? portfolio : watchlist;

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (activeTab === TabType.PORTFOLIO) {
            removeFromPortfolio(id);
        } else {
            removeFromWatchlist(id);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#bdc1c6]">
                <div className="bg-[#3c4043]/50 p-4 rounded-full mb-4">
                    <TrendingUp size={32} className="opacity-50" />
                </div>
                <p className="text-lg font-medium">Nessun asset trovato</p>
                <p className="text-sm opacity-70">Usa il pulsante "Nuovo Asset" per iniziare.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c4043] bg-[#202124] text-xs font-medium text-[#bdc1c6] uppercase tracking-wider">
                <div className="col-span-4">Asset</div>
                <div className="col-span-3 text-right">Prezzo</div>
                <div className="col-span-3 text-right">Variazione</div>
                <div className="col-span-2 text-right">
                    {activeTab === TabType.PORTFOLIO ? 'Valore' : 'Mkt Cap'}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#3c4043]">
                {items.map((item) => {
                    const data = marketData[item.ticker];
                    const price = data?.price || 0;
                    const change = data?.changePercent || 0;
                    const isPositive = change >= 0;
                    const portItem = item as PortfolioItem;

                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelectAsset(item.ticker)}
                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#3c4043]/30 cursor-pointer group transition-colors"
                        >
                            {/* Asset */}
                            <div className="col-span-4 flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${isPositive ? 'bg-[#1e8e3e]/20 text-[#81c995]' : 'bg-[#d93025]/20 text-[#f28b82]'}`}>
                                    {item.ticker[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{item.ticker}</div>
                                    <div className="text-xs text-[#bdc1c6] truncate max-w-[120px]">{item.name}</div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="col-span-3 text-right">
                                <div className="text-sm font-medium text-white tabular-nums">
                                    ${price.toFixed(2)}
                                </div>
                            </div>

                            {/* Change */}
                            <div className="col-span-3 text-right flex justify-end">
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium tabular-nums ${isPositive ? 'bg-[#1e8e3e]/20 text-[#81c995]' : 'bg-[#d93025]/20 text-[#f28b82]'}`}>
                                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(change).toFixed(2)}%
                                </div>
                            </div>

                            {/* Value / Actions */}
                            <div className="col-span-2 text-right flex items-center justify-end gap-4">
                                <div className="hidden md:block">
                                    {activeTab === TabType.PORTFOLIO && portItem.quantity ? (
                                        <div className="text-sm font-medium text-white tabular-nums">
                                            ${(price * portItem.quantity).toFixed(2)}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-[#bdc1c6] tabular-nums">
                                            {data?.marketCap || '--'}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="p-2 text-[#bdc1c6] hover:text-[#f28b82] hover:bg-[#d93025]/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                    title="Rimuovi"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PortfolioTable;
