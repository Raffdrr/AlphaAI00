import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import { getMarketOverview } from '../../services/marketService';

const MarketOverview: React.FC = () => {
    const [data, setData] = useState<any>({ gainers: [], losers: [], active: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const res = await getMarketOverview();
        setData(res);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-32 bg-[#1a1a1a] rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-[#1a1a1a] rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-[#1a1a1a] rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    const sections = [
        { title: 'Top Gainers', icon: TrendingUp, data: data.gainers, color: 'green' },
        { title: 'Top Losers', icon: TrendingDown, data: data.losers, color: 'red' },
        { title: 'Most Active', icon: Activity, data: data.active, color: 'accent' },
    ];

    return (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                        <Activity className="text-accent-500" size={20} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Market Overview</h3>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
                >
                    <RefreshCw size={18} className="text-gray-400 group-hover:text-accent-500 group-hover:rotate-180 transition-all duration-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-[#2a2a2a]">
                {sections.map((section) => (
                    <div key={section.title} className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <section.icon size={16} className={`text-${section.color}-400`} />
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{section.title}</h4>
                        </div>
                        <div className="space-y-3">
                            {section.data.slice(0, 3).map((stock: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                                >
                                    <div>
                                        <p className="font-bold text-white text-sm group-hover:text-accent-500 transition-colors">{stock.symbol || stock.ticker}</p>
                                        <p className="text-xs text-gray-500">{stock.name?.slice(0, 20) || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-sm text-white">${stock.price?.toFixed(2) || '0.00'}</p>
                                        <p className={`text-xs font-bold ${stock.changesPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stock.changesPercentage >= 0 ? '+' : ''}{stock.changesPercentage?.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketOverview;
