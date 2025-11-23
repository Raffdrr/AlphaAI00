import React, { useEffect, useState } from 'react';
import { getSectorPerformance } from '../../services/marketService';
import { RefreshCw } from 'lucide-react';

interface SectorData {
    sector: string;
    change: number;
}

const MarketHeatmap: React.FC = () => {
    const [sectors, setSectors] = useState<SectorData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const data = await getSectorPerformance();
        // Sort by performance (best to worst)
        setSectors(data.sort((a: SectorData, b: SectorData) => b.change - a.change));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="h-48 flex items-center justify-center text-[#bdc1c6] animate-pulse">Caricamento Heatmap...</div>;
    }

    return (
        <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-[#3c4043] bg-[#202124] flex justify-between items-center">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Market Heatmap</h3>
                <button onClick={fetchData} className="text-[#bdc1c6] hover:text-white transition-colors">
                    <RefreshCw size={14} />
                </button>
            </div>

            <div className="flex-1 p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
                {sectors.map((s) => {
                    const isPositive = s.change >= 0;
                    const intensity = Math.min(Math.abs(s.change) / 3, 1); // Max intensity at 3%
                    // Calculate color based on intensity
                    // Green: 30, 142, 62 (approx #1e8e3e)
                    // Red: 217, 48, 37 (approx #d93025)
                    const bgStyle = isPositive
                        ? `rgba(30, 142, 62, ${0.2 + (intensity * 0.8)})`
                        : `rgba(217, 48, 37, ${0.2 + (intensity * 0.8)})`;

                    return (
                        <div
                            key={s.sector}
                            className="rounded-lg p-3 flex flex-col justify-between min-h-[80px] transition-transform hover:scale-[1.02] cursor-default"
                            style={{ backgroundColor: bgStyle }}
                        >
                            <span className="text-xs font-bold text-white/90 leading-tight">{s.sector}</span>
                            <span className="text-lg font-bold text-white self-end">
                                {isPositive ? '+' : ''}{s.change.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarketHeatmap;
