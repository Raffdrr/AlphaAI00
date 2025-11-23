import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PortfolioItem, WatchlistItem, MarketData, SmartAlert, TabType } from '../types';
import { fetchMarketData } from '../services/marketService';

interface AppState {
    // Data
    portfolio: PortfolioItem[];
    watchlist: WatchlistItem[];
    alerts: SmartAlert[];
    marketData: Record<string, MarketData>;

    // UI State
    activeTab: TabType;
    isFocusMode: boolean;

    // Settings
    apiKeys: {
        fmp: string;
        gemini: string;
    };

    // Actions
    addToPortfolio: (item: PortfolioItem) => void;
    removeFromPortfolio: (id: string) => void;
    addToWatchlist: (item: WatchlistItem) => void;
    removeFromWatchlist: (id: string) => void;
    setApiKeys: (keys: { fmp: string; gemini: string }) => void;
    updateMarketData: (ticker: string, data: MarketData) => void;
    setActiveTab: (tab: TabType) => void;
    toggleFocusMode: () => void;

    // Async Actions
    refreshMarketData: () => Promise<void>;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            portfolio: [],
            watchlist: [],
            alerts: [],
            marketData: {},
            activeTab: TabType.PORTFOLIO, // Default
            isFocusMode: false,
            apiKeys: { fmp: '0F4bHcgWqjf6Bs2X2A6nEkLp4FQxy2fA', gemini: '' },

            addToPortfolio: (item) => set((state) => ({ portfolio: [...state.portfolio, item] })),
            removeFromPortfolio: (id) => set((state) => ({ portfolio: state.portfolio.filter((i) => i.id !== id) })),

            addToWatchlist: (item) => set((state) => ({ watchlist: [...state.watchlist, item] })),
            removeFromWatchlist: (id) => set((state) => ({ watchlist: state.watchlist.filter((i) => i.id !== id) })),

            setApiKeys: (keys) => set({ apiKeys: keys }),

            updateMarketData: (ticker, data) => set((state) => ({
                marketData: { ...state.marketData, [ticker]: data }
            })),

            setActiveTab: (tab) => set({ activeTab: tab }),
            toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),

            refreshMarketData: async () => {
                const { portfolio, watchlist, alerts, updateMarketData } = get();
                const allTickers = new Set([
                    ...portfolio.map((p) => p.ticker),
                    ...watchlist.map((w) => w.ticker),
                    ...alerts.map((a) => a.ticker),
                ]);

                await Promise.all(
                    Array.from(allTickers).map(async (ticker) => {
                        try {
                            const data = await fetchMarketData(ticker);
                            updateMarketData(ticker, data);
                        } catch (e) {
                            console.error(`Failed to update ${ticker}`, e);
                        }
                    })
                );
            },
        }),
        {
            name: 'alpha-vision-storage',
            partialize: (state) => ({
                portfolio: state.portfolio,
                watchlist: state.watchlist,
                alerts: state.alerts,
                apiKeys: state.apiKeys
            }),
        }
    )
);
