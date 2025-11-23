import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { MarketData, CompanyInfo, ChatMessage } from '../types';
import { fetchMarketData, getChartDataForRange } from '../services/marketService';
import StockChart from './charts/StockChart';
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, Send, ExternalLink, BarChart3, Calendar, Users } from 'lucide-react';
import { analyzeStock } from '../services/geminiService';

type ChartType = 'LINE' | 'CANDLE';

interface CompanyDetailViewProps {
   ticker: string;
   data: MarketData | null;
   info: CompanyInfo | null;
   onClose: () => void;
   onAnalyze: () => void;
}

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({ ticker, data, info, onClose, onAnalyze }) => {
   const [selectedRange, setSelectedRange] = useState('1G');
   const [chartPoints, setChartPoints] = useState<number[]>([]);
   const [candles, setCandles] = useState<any[]>([]);
   const [chartType, setChartType] = useState<ChartType>('LINE');

   const [comparisonTicker, setComparisonTicker] = useState<string>('');
   const [comparisonData, setComparisonData] = useState<number[]>([]);

   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
   const [chatInput, setChatInput] = useState('');
   const [isChatLoading, setIsChatLoading] = useState(false);
   const chatContainerRefInternal = useRef<HTMLDivElement>(null);
   const { updateMarketData } = useStore();

   useEffect(() => {
      if (!data && ticker) {
         fetchMarketData(ticker).then(newData => {
            updateMarketData(ticker, newData);
         });
      }
   }, [data, ticker, updateMarketData]);

   useEffect(() => {
      if (data) {
         const initData = async () => {
            const res = await getChartDataForRange(data.price, selectedRange, ticker);
            setChartPoints(res.line);
            setCandles(res.candles);
         };
         initData();
      }
   }, [data, ticker, selectedRange]);

   const handleRangeChange = async (range: string) => {
      setSelectedRange(range);
      if (data) {
         const newData = await getChartDataForRange(data.price, range, ticker);
         setChartPoints(newData.line);
         setCandles(newData.candles);

         if (comparisonTicker) {
            handleCompare(comparisonTicker, range);
         }
      }
   };

   const handleCompare = async (compTicker: string, range: string = selectedRange) => {
      setComparisonTicker(compTicker);
      if (!compTicker) {
         setComparisonData([]);
         return;
      }
      const res = await getChartDataForRange(100, range, compTicker);
      setComparisonData(res.line);
   };

   const handleSendMessage = async (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsChatLoading(true);

      try {
         const analysis = await analyzeStock(ticker, data);
         const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: analysis, timestamp: Date.now() };
         setChatMessages(prev => [...prev, aiMsg]);
      } catch (error) {
         const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: 'Errore nell\'analisi. Verifica che la chiave API Gemini sia configurata nelle Impostazioni.',
            timestamp: Date.now()
         };
         setChatMessages(prev => [...prev, errorMsg]);
      }
      setIsChatLoading(false);
   };

   useEffect(() => {
      if (chatContainerRefInternal.current) {
         chatContainerRefInternal.current.scrollTop = chatContainerRefInternal.current.scrollHeight;
      }
   }, [chatMessages]);

   if (!data) {
      return (
         <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
               <p className="text-gray-400">Caricamento dati per {ticker}...</p>
            </div>
         </div>
      );
   }

   const isPositive = (data.changePercent || 0) >= 0;

   return (
      <div className="min-h-screen bg-[#0a0a0a] animate-fade-in">
         {/* Sticky Header */}
         <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-6 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#141414] rounded-xl transition-colors group"
                     >
                        <ArrowLeft className="text-gray-400 group-hover:text-white transition-colors" size={24} />
                     </button>
                     <div>
                        <h1 className="text-2xl font-bold text-white">{info?.name || ticker}</h1>
                        <p className="text-sm text-gray-500">{ticker} • {info?.sector || 'N/A'}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <p className="text-4xl font-bold font-mono text-white">${data.price?.toFixed(2) || '0.00'}</p>
                        <div className="flex items-center gap-2 justify-end">
                           <span className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {isPositive ? '+' : ''}{data.changeAmount?.toFixed(2) || '0.00'}
                           </span>
                           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {Math.abs(data.changePercent || 0).toFixed(2)}%
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </header>

         <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Main Content - Chart & News */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Chart Section */}
                  <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                     <div className="p-6 border-b border-[#2a2a2a]">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent-500/10 rounded-lg">
                                 <BarChart3 className="text-accent-500" size={20} />
                              </div>
                              <h3 className="font-bold text-white text-lg">Grafico</h3>
                           </div>

                           <div className="flex items-center gap-4">
                              {/* Time Range */}
                              <div className="flex bg-[#1a1a1a] rounded-xl p-1">
                                 {['1G', '5G', '1M', '6M', '1A'].map((range) => (
                                    <button
                                       key={range}
                                       onClick={() => handleRangeChange(range)}
                                       className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedRange === range
                                             ? 'bg-accent-500 text-white shadow-lg'
                                             : 'text-gray-400 hover:text-white'
                                          }`}
                                    >
                                       {range}
                                    </button>
                                 ))}
                              </div>

                              {/* Chart Type */}
                              <div className="flex bg-[#1a1a1a] rounded-xl p-1">
                                 <button
                                    onClick={() => setChartType('LINE')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold ${chartType === 'LINE' ? 'bg-accent-500 text-white' : 'text-gray-400'}`}
                                 >
                                    LINEA
                                 </button>
                                 <button
                                    onClick={() => setChartType('CANDLE')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold ${chartType === 'CANDLE' ? 'bg-accent-500 text-white' : 'text-gray-400'}`}
                                 >
                                    CANDELE
                                 </button>
                              </div>
                           </div>
                        </div>

                        {/* Comparison Selector */}
                        <div className="flex items-center gap-2 mb-4">
                           <span className="text-xs text-gray-400 uppercase font-bold">Confronta:</span>
                           <select
                              value={comparisonTicker}
                              onChange={(e) => handleCompare(e.target.value)}
                              className="bg-[#1a1a1a] text-white text-xs rounded-lg px-3 py-2 border border-[#2a2a2a] focus:border-accent-500 focus:outline-none"
                           >
                              <option value="">Nessuno</option>
                              <option value="SPY">S&P 500 (SPY)</option>
                              <option value="QQQ">Nasdaq (QQQ)</option>
                              <option value="BTC">Bitcoin (BTC)</option>
                              <option value="GLD">Gold (GLD)</option>
                           </select>
                        </div>
                     </div>

                     {/* Chart */}
                     <div className="p-6">
                        <StockChart
                           data={chartPoints}
                           candles={candles}
                           chartType={chartType}
                           isPositive={isPositive}
                           comparisonData={comparisonData}
                        />
                     </div>
                  </div>

                  {/* News Section */}
                  <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                     <div className="p-6 border-b border-[#2a2a2a]">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-accent-500/10 rounded-lg">
                              <Calendar className="text-accent-500" size={20} />
                           </div>
                           <h3 className="font-bold text-white text-lg">Ultime Notizie</h3>
                        </div>
                     </div>

                     <div className="p-6 space-y-4">
                        {data.news && data.news.length > 0 ? (
                           data.news.slice(0, 5).map((item, i) => (
                              <article
                                 key={i}
                                 className="group p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] hover:border-accent-500/50 transition-all cursor-pointer"
                              >
                                 <h4 className="font-bold text-white mb-2 group-hover:text-accent-500 transition-colors line-clamp-2">
                                    {item.title}
                                 </h4>
                                 <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="font-medium">{item.source}</span>
                                    <span>{item.timeAgo}</span>
                                 </div>
                                 <button className="mt-3 flex items-center gap-2 text-accent-500 text-sm font-bold hover:gap-3 transition-all">
                                    Leggi
                                    <ExternalLink size={14} />
                                 </button>
                              </article>
                           ))
                        ) : (
                           <p className="text-center text-gray-500 py-8">Nessuna notizia disponibile</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Sidebar - Stats & AI */}
               <div className="space-y-6">
                  {/* Key Stats */}
                  <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                           <BarChart3 className="text-accent-500" size={20} />
                        </div>
                        <h3 className="font-bold text-white text-lg">Statistiche Chiave</h3>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-[#2a2a2a]">
                           <span className="text-sm text-gray-400">Volume</span>
                           <span className="font-mono font-bold text-white">{data.volume || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-[#2a2a2a]">
                           <span className="text-sm text-gray-400">Market Cap</span>
                           <span className="font-mono font-bold text-white">{data.marketCap || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-[#2a2a2a]">
                           <span className="text-sm text-gray-400">P/E Ratio</span>
                           <span className="font-mono font-bold text-white">{data.peRatio || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                           <span className="text-sm text-gray-400">RSI</span>
                           <span className="font-mono font-bold text-white">{data.rsi || 'N/A'}</span>
                        </div>
                     </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                     <div className="p-6 border-b border-[#2a2a2a]">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-accent-500/10 rounded-lg">
                              <Sparkles className="text-accent-500" size={20} />
                           </div>
                           <h3 className="font-bold text-white text-lg">AI Analysis</h3>
                        </div>
                     </div>

                     <div className="p-6">
                        <div ref={chatContainerRefInternal} className="space-y-4 max-h-96 overflow-y-auto mb-4">
                           {chatMessages.length === 0 ? (
                              <div className="text-center py-8">
                                 <p className="text-gray-500 text-sm mb-4">Chiedi all'AI di analizzare {ticker}</p>
                                 <button
                                    onClick={() => handleSendMessage(`Analizza ${ticker}`)}
                                    className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-all"
                                 >
                                    Analizza Ora
                                 </button>
                              </div>
                           ) : (
                              chatMessages.map((msg) => (
                                 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user'
                                          ? 'bg-accent-500 text-white'
                                          : 'bg-[#1a1a1a] text-gray-300'
                                       }`}>
                                       <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                 </div>
                              ))
                           )}
                           {isChatLoading && (
                              <div className="flex justify-start">
                                 <div className="bg-[#1a1a1a] p-4 rounded-xl">
                                    <div className="flex gap-2">
                                       <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"></div>
                                       <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                       <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="flex gap-2">
                           <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                              placeholder="Chiedi un'analisi..."
                              className="flex-1 bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-[#2a2a2a] focus:border-accent-500 focus:outline-none"
                           />
                           <button
                              onClick={() => handleSendMessage(chatInput)}
                              disabled={isChatLoading}
                              className="p-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50"
                           >
                              <Send size={20} />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CompanyDetailView;