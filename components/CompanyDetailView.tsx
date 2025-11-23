import React, { useState, useEffect, useRef } from 'react';
import { MarketData, CompanyInfo, ChatMessage } from '../types';
import { getChartDataForRange } from '../services/marketService';
import { chatWithAlphaVision } from '../services/geminiService';
import StockChart from './charts/StockChart';
import AnalystRatings from './analysis/AnalystRatings';
import FearGreedIndex from './analysis/FearGreedIndex';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CompanyDetailViewProps {
   ticker: string;
   data: MarketData | null;
   info: CompanyInfo;
   onClose: () => void;
   onAnalyze: () => void;
}

type ChartType = 'LINE' | 'CANDLE';

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({ ticker, data, info, onClose, onAnalyze }) => {
   const [selectedRange, setSelectedRange] = useState('1G');
   const [chartPoints, setChartPoints] = useState<number[]>([]);
   const [candles, setCandles] = useState<any[]>([]); // Using any for lightweight-charts compatibility
   const [chartType, setChartType] = useState<ChartType>('LINE');

   // Chat State
   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
   const [chatInput, setChatInput] = useState('');
   const [isChatLoading, setIsChatLoading] = useState(false);
   const chatContainerRefInternal = useRef<HTMLDivElement>(null);

   // Initialize chart data
   useEffect(() => {
      if (data) {
         setChartPoints(data.chartData);
         setCandles(data.candles || []);
         setChatMessages([{
            id: 'welcome', role: 'ai', timestamp: Date.now(),
            text: `Ciao! Sono Alpha-Vision. Chiedimi qualsiasi cosa su ${info.name} (${ticker}).`
         }]);
      }
   }, [data, ticker, info.name]);

   const handleRangeChange = async (range: string) => {
      setSelectedRange(range);
      if (data) {
         const newData = await getChartDataForRange(data.price, range, ticker);
         setChartPoints(newData.line);
         setCandles(newData.candles);
      }
   };

   const handleSendMessage = async (text: string) => {
      if (!text.trim() || !data) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text, timestamp: Date.now() };
      setChatMessages(prev => [...prev, userMsg]);
      setIsChatLoading(true);

      const history = [...chatMessages, userMsg].map(m => ({ role: m.role, text: m.text }));
      const aiText = await chatWithAlphaVision(ticker, history, data);

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText, timestamp: Date.now() };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsChatLoading(false);
   };

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(chatInput);
      setChatInput('');
   };

   if (!data) return <div className="flex h-full items-center justify-center text-[#bdc1c6] animate-pulse">Caricamento dati...</div>;

   const isPositive = data.changePercent >= 0;

   return (
      <div className="absolute inset-0 bg-[#202124] overflow-y-auto animate-in fade-in slide-in-from-right-8 duration-300 pb-24 md:pb-0 z-50">

         {/* Header */}
         <div className="sticky top-0 z-20 bg-[#202124]/90 backdrop-blur-md border-b border-[#3c4043] px-4 py-4 flex items-center justify-between">
            <button onClick={onClose} className="flex items-center gap-2 text-[#bdc1c6] hover:text-white transition-colors">
               <ArrowLeft size={20} />
               <span className="font-medium">Indietro</span>
            </button>
            <div className="text-sm font-bold text-white">{ticker}</div>
         </div>

         <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

            {/* Top Section: Price & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  {/* Price Block */}
                  <div>
                     <h1 className="text-3xl font-bold text-white mb-1">{info.name}</h1>
                     <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-medium text-white tracking-tight">${data.price.toFixed(2)}</span>
                        <span className={`text-xl font-medium ${isPositive ? 'text-[#81c995]' : 'text-[#f28b82]'}`}>
                           {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                        </span>
                     </div>
                  </div>

                  {/* Chart Controls */}
                  <div className="flex justify-between items-center">
                     <div className="flex gap-2">
                        {['1G', '5G', '1M', '6M', 'YTD', '1A'].map((r) => (
                           <button key={r} onClick={() => handleRangeChange(r)} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${selectedRange === r ? 'bg-[#8ab4f8] text-[#202124]' : 'text-[#bdc1c6] hover:bg-[#3c4043]'}`}>
                              {r}
                           </button>
                        ))}
                     </div>
                     <div className="flex bg-[#3c4043] rounded-lg p-1">
                        <button onClick={() => setChartType('LINE')} className={`px-3 py-1 rounded text-xs font-bold ${chartType === 'LINE' ? 'bg-[#202124] text-white' : 'text-[#bdc1c6]'}`}>LINEA</button>
                        <button onClick={() => setChartType('CANDLE')} className={`px-3 py-1 rounded text-xs font-bold ${chartType === 'CANDLE' ? 'bg-[#202124] text-white' : 'text-[#bdc1c6]'}`}>CANDELE</button>
                     </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl p-4 h-[450px]">
                     <StockChart data={chartPoints} candles={candles} chartType={chartType} isPositive={isPositive} />
                  </div>
               </div>

               {/* Right Column: Analysis & Chat */}
               <div className="space-y-6">
                  {/* AI Chat */}
                  <div className="bg-[#1e1f20] border border-[#3c4043] rounded-xl flex flex-col h-[400px] overflow-hidden">
                     <div className="p-4 border-b border-[#3c4043] bg-[#202124] flex items-center gap-2">
                        <Sparkles size={16} className="text-[#8ab4f8]" />
                        <span className="text-xs font-bold text-[#bdc1c6] uppercase">Alpha-Vision AI</span>
                     </div>
                     <div ref={chatContainerRefInternal} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#202124]/50">
                        {chatMessages.map((msg) => (
                           <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-[#8ab4f8] text-[#202124]' : 'bg-[#3c4043] text-[#e8eaed]'}`}>
                                 {msg.text}
                              </div>
                           </div>
                        ))}
                        {isChatLoading && <div className="text-xs text-[#bdc1c6] animate-pulse">Analisi in corso...</div>}
                     </div>
                     <form onSubmit={onFormSubmit} className="p-3 border-t border-[#3c4043] bg-[#202124]">
                        <input
                           type="text"
                           value={chatInput}
                           onChange={e => setChatInput(e.target.value)}
                           placeholder="Chiedi un'analisi..."
                           className="w-full bg-[#303134] border-none rounded-full px-4 py-2 text-sm text-white focus:ring-1 focus:ring-[#8ab4f8]"
                        />
                     </form>
                  </div>

                  {/* New Analysis Components */}
                  <AnalystRatings
                     buy={12} hold={5} sell={1}
                     targetPrice={data.price * 1.15}
                     currentPrice={data.price}
                  />

                  <FearGreedIndex value={65} />
               </div>
            </div>

         </div>
      </div>
   );
};

export default CompanyDetailView;