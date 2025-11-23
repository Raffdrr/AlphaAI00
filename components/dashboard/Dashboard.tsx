import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart } from 'lucide-react';
import { getCompanyInfoSync } from '../../services/marketService';

const Dashboard: React.FC = () => {
    const { portfolio, marketData } = useStore();

    const stats = useMemo(() => {
        let totalValue = 0;
        let totalCost = 0;
        let dayChangeValue = 0;

        portfolio.forEach(item => {
            const data = marketData[item.ticker];
            const qty = item.quantity || 0;
            if (data) {
                const currentVal = data.price * qty;
                totalValue += currentVal;
                totalCost += (item.avgCost || 0) * qty;
                dayChangeValue += currentVal * (data.changePercent / 100);
            }
        });

        const totalPnl = totalValue - totalCost;
        const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

        return { totalValue, totalPnl, totalPnlPercent, dayChangeValue };
    }, [portfolio, marketData]);

    const isPositive = stats.totalPnl >= 0;
    const isDayPositive = stats.dayChangeValue >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Value Card */}
            <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-4 right-4 p-2 bg-[#3c4043]/50 rounded-lg text-[#bdc1c6] group-hover:text-white transition-colors">
                    <DollarSign size={20} />
                </div>
                <h3 className="text-[#bdc1c6] text-xs font-medium uppercase tracking-wider mb-2">Valore Totale</h3>
                <div className="text-3xl font-medium text-white tabular-nums tracking-tight">
                    ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>

            {/* P&L Card */}
            <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 p-2 bg-[#3c4043]/50 rounded-lg text-[#bdc1c6]">
                    {isPositive ? <ArrowUpRight size={20} className="text-[#81c995]" /> : <ArrowDownRight size={20} className="text-[#f28b82]" />}
                </div>
                <h3 className="text-[#bdc1c6] text-xs font-medium uppercase tracking-wider mb-2">P&L Totale</h3>
                <div className="flex items-baseline gap-3">
                    <span className={`text-2xl font-medium tabular-nums tracking-tight ${isPositive ? 'text-[#81c995]' : 'text-[#f28b82]'}`}>
                        {isPositive ? '+' : ''}{stats.totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${isPositive ? 'bg-[#81c995]/10 text-[#81c995]' : 'bg-[#f28b82]/10 text-[#f28b82]'}`}>
                        {stats.totalPnlPercent.toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Day Change Card */}
            <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 p-2 bg-[#3c4043]/50 rounded-lg text-[#bdc1c6]">
                    <PieChart size={20} />
                </div>
                <h3 className="text-[#bdc1c6] text-xs font-medium uppercase tracking-wider mb-2">Variazione Giornaliera</h3>
                <div className="text-2xl font-medium text-white tabular-nums tracking-tight mb-1">
                    <span className={isDayPositive ? 'text-[#81c995]' : 'text-[#f28b82]'}>
                        {isDayPositive ? '+' : ''}{stats.dayChangeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="text-xs text-[#bdc1c6]">Stima Intraday</div>
            </div>
        </div>
    );
};

export default Dashboard;
