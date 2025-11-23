import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Dashboard from './components/dashboard/Dashboard';
import PortfolioTable from './components/portfolio/PortfolioTable';
import SettingsModal from './components/SettingsModal';
import AddAssetModal from './components/AddAssetModal';
import CompanyDetailView from './components/CompanyDetailView';
import { TabType, CompanyInfo, PortfolioItem, WatchlistItem } from './types';
import { searchCompanies, getCompanyInfo, getCompanyInfoSync } from './services/marketService';
import { Plus } from 'lucide-react';

const REFRESH_RATE = 15000; // 15s refresh for real data

const App: React.FC = () => {
   // Global Store
   const {
      activeTab,
      refreshMarketData,
      addToPortfolio,
      addToWatchlist,
      portfolio,
      watchlist,
      marketData
   } = useStore();

   // Local UI State
   const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

   // Add Asset Form State (kept local as it's transient)
   const [inputTicker, setInputTicker] = useState('');
   const [inputQty, setInputQty] = useState('');
   const [inputCost, setInputCost] = useState('');
   const [suggestions, setSuggestions] = useState<CompanyInfo[]>([]);

   // Initial Data Load & Polling
   useEffect(() => {
      refreshMarketData();
      const interval = setInterval(refreshMarketData, REFRESH_RATE);
      return () => clearInterval(interval);
   }, [refreshMarketData]);

   // Handlers
   const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputTicker(val);
      if (val.length > 1) {
         const results = await searchCompanies(val);
         setSuggestions(results);
      } else {
         setSuggestions([]);
      }
   };

   const selectSuggestion = (company: CompanyInfo) => {
      setInputTicker(company.symbol);
      setSuggestions([]);
   };

   const handleAddSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputTicker) return;

      const info = await getCompanyInfo(inputTicker);

      if (activeTab === TabType.PORTFOLIO) {
         if (portfolio.some(p => p.ticker === info.symbol)) { alert("Asset già presente"); return; }
         const newItem: PortfolioItem = {
            id: Date.now().toString(),
            ticker: info.symbol,
            name: info.name,
            quantity: inputQty ? parseFloat(inputQty) : 0,
            avgCost: inputCost ? parseFloat(inputCost) : 0
         };
         addToPortfolio(newItem);
      } else {
         if (watchlist.some(w => w.ticker === info.symbol)) { alert("Asset già presente"); return; }
         const newItem: WatchlistItem = { id: Date.now().toString(), ticker: info.symbol, name: info.name };
         addToWatchlist(newItem);
      }

      // Reset & Close
      setInputTicker('');
      setInputQty('');
      setInputCost('');
      setIsAddModalOpen(false);
   };

   // View
   if (selectedTicker) {
      return (
         <CompanyDetailView
            ticker={selectedTicker}
            data={marketData[selectedTicker]}
            info={getCompanyInfoSync(selectedTicker)}
            onClose={() => setSelectedTicker(null)}
            onAnalyze={() => { }} // TODO: Hook up global chat if needed
         />
      );
   }

   return (
      <div className="flex h-screen bg-[#202124] text-[#e8eaed] font-sans selection:bg-[#8ab4f8]/30">

         <Sidebar
            onAddAsset={() => setIsAddModalOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
         />

         <main className="flex-1 flex flex-col overflow-hidden relative">
            {/* Header (Mobile Only) */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-[#3c4043] bg-[#202124]">
               <span className="text-lg font-medium">Alpha-Vision</span>
               <button onClick={() => setIsSettingsOpen(true)} className="p-2">
                  {/* Settings Icon */}
               </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
               <div className="max-w-6xl mx-auto">

                  {activeTab === TabType.PORTFOLIO && <Dashboard />}

                  <div className="mb-4 flex items-center justify-between">
                     <h2 className="text-xl font-medium">
                        {activeTab === TabType.PORTFOLIO ? 'Il tuo Portfolio' : (activeTab === TabType.WATCHLIST ? 'Watchlist' : 'Avvisi Smart')}
                     </h2>
                  </div>

                  <PortfolioTable onSelectAsset={setSelectedTicker} />

               </div>
            </div>

            {/* Mobile FAB */}
            <button
               onClick={() => setIsAddModalOpen(true)}
               className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-[#8ab4f8] text-[#202124] rounded-full shadow-lg flex items-center justify-center z-50"
            >
               <Plus size={28} />
            </button>

            <MobileNav />
         </main>

         {/* Modals */}
         <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
         />

         <AddAssetModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            activeTab={activeTab}
            searchTerm={inputTicker}
            onSearchChange={handleSearchChange}
            suggestions={suggestions}
            onSelectSuggestion={selectSuggestion}
            qty={inputQty}
            setQty={setInputQty}
            cost={inputCost}
            setCost={setInputCost}
            onAdd={handleAddSubmit}
         />

      </div>
   );
};

export default App;