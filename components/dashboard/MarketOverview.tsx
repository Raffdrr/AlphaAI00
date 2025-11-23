import React, { useEffect, useState } from 'react';
import { getMarketOverview } from '../../services/marketService';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface MarketItem {
    symbol: string;
    name: string;
    price: number;
    changesPercentage: number;
}

const MarketOverview: React.FC = () => {
    const [data, setData] = useState<{ gainers: MarketItem[], losers: MarketItem[], active: MarketItem[] } | null>(null);

    useEffect(() => {
        const load = async () => {
            const res = await getMarketOverview();
            setData(res);
        };
        load();
    }, []);

    if (!data) return <div className="animate-pulse h-32 bg-[#111] rounded-xl mb-6"></div>;

    const Section = ({ title, items, color }: { title: string, items: MarketItem[], color: string }) => (
        <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                {title === 'Top Gainers' ? <ArrowUp size={16} className="text-green-400" /> :
                    title === 'Top Losers' ? <ArrowDown size={16} className="text-red-400" /> :
                        <Activity size={16} className="text-blue-400" />}
                {title}
            </h3>
            <div className="space-y-3">
                {items.slice(0, 3).map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between group cursor-pointer hover:bg-[#1a1a1a] p-1 rounded transition-colors">
                        <div>
                            <div className="font-bold text-sm text-gray-200">{item.symbol}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[100px]">{item.name}</div>
                        </div>
                        <div className={`text-sm font-mono font-medium ${item.changesPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.changesPercentage > 0 ? '+' : ''}{item.changesPercentage.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Section title="Top Gainers" items={data.gainers} color="green" />
            <Section title="Top Losers" items={data.losers} color="red" />
            <Section title="Most Active" items={data.active} color="blue" />
        </div>
    );
};

export default MarketOverview;
