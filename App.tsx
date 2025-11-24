import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Dashboard from './components/dashboard/Dashboard';
import PortfolioTable from './components/portfolio/PortfolioTable';
import Calendar from './components/calendar/Calendar';
import SocialFeed from './components/social/SocialFeed';
import Analytics from './components/analytics/Analytics';
import SettingsModal from './components/SettingsModal';
import AddAssetModal from './components/AddAssetModal';
import CompanyDetailView from './components/CompanyDetailView';
import { TabType, CompanyInfo, PortfolioItem, WatchlistItem } from './types';
import { searchCompanies, getCompanyInfo } from './services/marketService';
import { fetchEarningsCalendar, fetchDividendCalendar, fetchEconomicCalendar, convertToCalendarEvents } from './services/calendarService';
import { Plus } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

const REFRESH_RATE = 15000; // 15s refresh

const App: React.FC = () => {
   const {
      activeTab,
      setActiveTab,
      refreshMarketData,
      portfolios,
      activePortfolioId,
      addToPortfolio,
      addToWatchlist,
      watchlist,
      marketData,
      isFocusMode,
      calendarEvents,
      addCalendarEvent,
      userProfile,
      setUserProfile
   } = useStore();

   const activePortfolio = portfolios.find(p => p.id === activePortfolioId);

   const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [inputTicker, setInputTicker] = useState('');
   const [inputQty, setInputQty] = useState('');
   const [inputCost, setInputCost] = useState('');
   const [suggestions, setSuggestions] = useState<CompanyInfo[]>([]);

   // Initialize user profile if not exists
   useEffect(() => {
      if (!userProfile) {
         setUserProfile({
            id: 'user-1',
            username: 'Investor',
            displayName: 'Alpha Investor',
            bio: 'Passionate about investing',
            joinedAt: Date.now(),
            isPublic: true,
            stats: {
               followers: 0,
               following: 0,
               posts: 0,
            }
         });
      }
   }, [userProfile, setUserProfile]);

   // Load calendar events
   useEffect(() => {
      const loadCalendarEvents = async () => {
         if (calendarEvents.length === 0) {
            try {
               const [earnings, dividends, economic] = await Promise.all([
                  fetchEarningsCalendar(),
                  fetchDividendCalendar(),
                  fetchEconomicCalendar(),
               ]);

               const events = convertToCalendarEvents(earnings, dividends, economic);
               events.forEach(event => addCalendarEvent(event));
            } catch (error) {
               console.error('Failed to load calendar events:', error);
            }
         }
      };

      loadCalendarEvents();
   }, [calendarEvents.length, addCalendarEvent]);

   // Market data refresh
   useEffect(() => {
      refreshMarketData();
      const interval = setInterval(refreshMarketData, REFRESH_RATE);
      return () => clearInterval(interval);
   }, [refreshMarketData]);

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

   const handleAddAsset = async () => {
      if (!inputTicker.trim()) return;

      const ticker = inputTicker.toUpperCase();
      const info = await getCompanyInfo(ticker);

      if (activeTab === TabType.PORTFOLIO && activePortfolio) {
         const item: PortfolioItem = {
            id: Date.now().toString(),
            ticker,
            name: info.name,
            quantity: parseFloat(inputQty) || 0,
            avgCost: parseFloat(inputCost) || 0,
         };
         addToPortfolio(activePortfolio.id, item);
      } else if (activeTab === TabType.WATCHLIST) {
         const item: WatchlistItem = {
            id: Date.now().toString(),
            ticker,
            name: info.name,
         };
         addToWatchlist(item);
      }

      setInputTicker('');
      setInputQty('');
      setInputCost('');
      setIsAddModalOpen(false);
   };

   const renderContent = () => {
      if (selectedTicker) {
         const data = marketData[selectedTicker];
         const info = data ? { symbol: selectedTicker, name: selectedTicker } : null;

         return (
            <ErrorBoundary>
               <CompanyDetailView
                  ticker={selectedTicker}
                  data={data || null}
                  info={info}
                  onClose={() => setSelectedTicker(null)}
                  onAnalyze={() => { }}
               />
            </ErrorBoundary>
         );
      }

      switch (activeTab) {
         case TabType.PORTFOLIO:
            return (
               <div className="space-y-8">
                  <Dashboard />
                  <PortfolioTable onSelectAsset={setSelectedTicker} />
               </div>
            );

         case TabType.WATCHLIST:
            return <PortfolioTable onSelectAsset={setSelectedTicker} />;

         case TabType.CALENDAR:
            return <Calendar />;

         case TabType.SOCIAL:
            return <SocialFeed />;

         case TabType.ANALYTICS:
            return <Analytics />;

         default:
            return <Dashboard />;
      }
   };

   return (
      <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden">
         <Sidebar
            onAddAsset={() => setIsAddModalOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
         />

         <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
               {renderContent()}
            </div>
         </main>

         <MobileNav />

         {isAddModalOpen && (
            <AddAssetModal
               inputTicker={inputTicker}
               inputQty={inputQty}
               inputCost={inputCost}
               suggestions={suggestions}
               onSearchChange={handleSearchChange}
               onSelectSuggestion={selectSuggestion}
               onQtyChange={(e) => setInputQty(e.target.value)}
               onCostChange={(e) => setInputCost(e.target.value)}
               onAdd={handleAddAsset}
               onClose={() => setIsAddModalOpen(false)}
               isPortfolio={activeTab === TabType.PORTFOLIO}
            />
         )}

         {isSettingsOpen && (
            <SettingsModal onClose={() => setIsSettingsOpen(false)} />
         )}

         {/* Floating Add Button (Mobile) */}
         <button
            onClick={() => setIsAddModalOpen(true)}
            className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full shadow-lg shadow-accent-500/30 flex items-center justify-center text-white z-40"
         >
            <Plus size={24} strokeWidth={2.5} />
         </button>
      </div>
   );
};

export default App;