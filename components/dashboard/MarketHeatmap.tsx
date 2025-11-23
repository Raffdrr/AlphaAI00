import React, { useEffect, useState } from 'react';
import { getSectorPerformance } from '../../services/marketService';
import { RefreshCw, TrendingUp } from 'lucide-react';

const MarketHeatmap: React.FC = () => {
    const [sectors, setSectors] = useState<{ sector: string; change: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const data = await getSectorPerformance();
        setSectors(data.sort((a, b) => b.change - a.change));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getColor = (change: number) => {
        const intensity = Math.min(Math.abs(change) / 3, 1);
        if (change > 0) {
            return `rgba(52, 168, 83, ${0.1 + intensity * 0.6})`;
        } else {
            return `rgba(234, 67, 53, ${0.1 + intensity * 0.6})`;
        }
    };

    const getTextColor = (change: number) => {
        return change > 0 ? '#34a853' : '#ea4335';
    };

    if (loading) {
        return (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="h-6 w-32 bg-[#1a1a1a] rounded mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-20 bg-[#1a1a1a] rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden h-full">
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                        <TrendingUp className="text-accent-500" size={20} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Market Heatmap</h3>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
                >
                    <RefreshCw size={18} className="text-gray-400 group-hover:text-accent-500 group-hover:rotate-180 transition-all duration-500" />
                </button>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                    {sectors.map((s) => (
                        <div
                            key={s.sector}
                            className="relative p-4 rounded-xl transition-all hover:scale-105 cursor-pointer group overflow-hidden"
                            style={{ backgroundColor: getColor(s.change) }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-white mb-1 line-clamp-2">{s.sector}</p>
                                <p
                                    className="text-lg font-mono font-bold"
                                    style={{ color: getTextColor(s.change) }}
                                >
                                    {s.change > 0 ? '+' : ''}{s.change.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketHeatmap;
