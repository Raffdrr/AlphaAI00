import React, { useEffect, useState } from 'react';
import { getCompanyFinancials } from '../../services/marketService';
import { FinancialData } from '../../types';
import { BarChart3 } from 'lucide-react';

interface Props {
    ticker: string;
}

const FinancialsChart: React.FC<Props> = ({ ticker }) => {
    const [data, setData] = useState<FinancialData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const res = await getCompanyFinancials(ticker);
            setData(res);
            setLoading(false);
        };
        fetch();
    }, [ticker]);

    if (loading) return <div className="h-48 flex items-center justify-center text-[#bdc1c6] animate-pulse">Caricamento Bilanci...</div>;

    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.revenue));

    return (
        <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#3c4043] bg-[#202124] flex items-center gap-2">
                <BarChart3 size={16} className="text-[#8ab4f8]" />
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Bilancio (Ultimi 4 Anni)</h3>
            </div>

            <div className="p-6">
                <div className="flex items-end justify-between gap-4 h-48">
                    {data.map((d) => {
                        const revHeight = (d.revenue / maxVal) * 100;
                        const incHeight = (d.netIncome / maxVal) * 100;

                        return (
                            <div key={d.year} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full flex items-end justify-center gap-1 h-full relative">
                                    {/* Revenue Bar */}
                                    <div
                                        className="w-3 md:w-6 bg-[#8ab4f8] rounded-t-sm transition-all group-hover:opacity-80"
                                        style={{ height: `${revHeight}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303134] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                                            Rev: ${(d.revenue / 1e9).toFixed(1)}B
                                        </div>
                                    </div>
                                    {/* Income Bar */}
                                    <div
                                        className="w-3 md:w-6 bg-[#81c995] rounded-t-sm transition-all group-hover:opacity-80"
                                        style={{ height: `${incHeight}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 -translate-x-1/2 bg-[#303134] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                                            Net: ${(d.netIncome / 1e9).toFixed(1)}B
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-[#bdc1c6]">{d.year}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#8ab4f8] rounded-sm" />
                        <span className="text-xs text-[#bdc1c6]">Fatturato</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#81c995] rounded-sm" />
                        <span className="text-xs text-[#bdc1c6]">Utile Netto</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialsChart;
