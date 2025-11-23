import React from 'react';

interface AnalystRatingsProps {
    buy: number;
    hold: number;
    sell: number;
    targetPrice: number;
    currentPrice: number;
}

const AnalystRatings: React.FC<AnalystRatingsProps> = ({ buy, hold, sell, targetPrice, currentPrice }) => {
    const total = buy + hold + sell;
    const buyPercent = (buy / total) * 100;
    const holdPercent = (hold / total) * 100;
    const sellPercent = (sell / total) * 100;

    const upside = ((targetPrice - currentPrice) / currentPrice) * 100;

    return (
        <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6">
            <h3 className="text-[#bdc1c6] text-xs font-bold uppercase tracking-wider mb-6">Analyst Ratings</h3>

            {/* Gauge Bar */}
            <div className="flex h-4 rounded-full overflow-hidden mb-2">
                <div style={{ width: `${buyPercent}%` }} className="bg-[#81c995]" title={`Buy: ${buy}`} />
                <div style={{ width: `${holdPercent}%` }} className="bg-[#fbbc04]" title={`Hold: ${hold}`} />
                <div style={{ width: `${sellPercent}%` }} className="bg-[#f28b82]" title={`Sell: ${sell}`} />
            </div>
            <div className="flex justify-between text-[10px] text-[#bdc1c6] font-medium mb-6">
                <span className="text-[#81c995]">Buy {buy}</span>
                <span className="text-[#fbbc04]">Hold {hold}</span>
                <span className="text-[#f28b82]">Sell {sell}</span>
            </div>

            {/* Price Target */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-xs text-[#bdc1c6] font-medium">Target Price Medio</span>
                    <span className="text-lg font-bold text-white">${targetPrice.toFixed(2)}</span>
                </div>
                <div className="relative h-2 bg-[#3c4043] rounded-full">
                    <div
                        className="absolute top-0 bottom-0 bg-[#8ab4f8] rounded-full"
                        style={{ width: '100%' /* Simplified visual for demo */ }}
                    ></div>
                </div>
                <div className="flex justify-end">
                    <span className={`text-xs font-bold ${upside >= 0 ? 'text-[#81c995]' : 'text-[#f28b82]'}`}>
                        {upside >= 0 ? '+' : ''}{upside.toFixed(2)}% Upside
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnalystRatings;
