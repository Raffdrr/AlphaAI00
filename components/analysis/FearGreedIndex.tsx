import React from 'react';

interface FearGreedIndexProps {
    value: number; // 0-100
}

const FearGreedIndex: React.FC<FearGreedIndexProps> = ({ value }) => {
    // Determine label and color
    let label = 'Neutral';
    let color = '#fbbc04';

    if (value <= 25) { label = 'Extreme Fear'; color = '#f28b82'; }
    else if (value <= 45) { label = 'Fear'; color = '#f6aea9'; }
    else if (value >= 75) { label = 'Extreme Greed'; color = '#81c995'; }
    else if (value >= 55) { label = 'Greed'; color = '#a8dab5'; }

    const rotation = (value / 100) * 180 - 90; // -90 to 90 degrees

    return (
        <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 flex flex-col items-center">
            <h3 className="text-[#bdc1c6] text-xs font-bold uppercase tracking-wider mb-4 self-start">Fear & Greed Index</h3>

            <div className="relative w-40 h-20 overflow-hidden mt-2">
                {/* Semi-circle background */}
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-[#3c4043] border-b-0"></div>

                {/* Gradient Arc (Simplified with CSS conic if needed, but using simple colored segments for now) */}
                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom transition-transform duration-1000 ease-out"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                ></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{Math.round(value)}</div>
                <div className="text-sm font-bold uppercase tracking-wide" style={{ color }}>{label}</div>
            </div>

            <div className="text-[10px] text-[#bdc1c6] mt-4 text-center max-w-[200px]">
                Il sentiment di mercato è un indicatore contrarian.
            </div>
        </div>
    );
};

export default FearGreedIndex;
