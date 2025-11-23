import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Portfolio,
    PortfolioItem,
    WatchlistItem,
    MarketData,
    SmartAlert,
    TabType,
    Transaction,
    CalendarEvent,
    UserProfile,
    Post
} from '../types';
import { fetchMarketData } from '../services/marketService';

interface AppState {
    // Portfolio Data
    portfolios: Portfolio[];
    activePortfolioId: string | null;
    watchlist: WatchlistItem[];
    alerts: SmartAlert[];
    marketData: Record<string, MarketData>;

    // Events & Calendar
    calendarEvents: CalendarEvent[];
    upcomingEarnings: any[];
    upcomingDividends: any[];

    // Social
    userProfile: UserProfile | null;
    socialFeed: Post[];
    following: string[];
    followers: string[];

    // UI State
    activeTab: TabType;
    isFocusMode: boolean;

    // Settings
    apiKeys: {
        fmp: string;
        gemini: string;
    };

    // Portfolio Actions
    createPortfolio: (name: string, description?: string) => void;
    deletePortfolio: (id: string) => void;
    setActivePortfolio: (id: string) => void;
    addToPortfolio: (portfolioId: string, item: PortfolioItem) => void;
    removeFromPortfolio: (portfolioId: string, itemId: string) => void;
    addTransaction: (transaction: Transaction) => void;

    // Watchlist Actions
    addToWatchlist: (item: WatchlistItem) => void;
    removeFromWatchlist: (id: string) => void;

    // Settings Actions
    setApiKeys: (keys: { fmp: string; gemini: string }) => void;

    // Market Data Actions
    updateMarketData: (ticker: string, data: MarketData) => void;
    refreshMarketData: () => Promise<void>;

    // UI Actions
    setActiveTab: (tab: TabType) => void;
    toggleFocusMode: () => void;

    // Calendar Actions
    addCalendarEvent: (event: CalendarEvent) => void;
    removeCalendarEvent: (id: string) => void;

    // Social Actions
    setUserProfile: (profile: UserProfile) => void;
    addPost: (post: Post) => void;
    likePost: (postId: string) => void;
    followUser: (userId: string) => void;
    unfollowUser: (userId: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            portfolios: [{
                id: 'default',
                name: 'Il Mio Portfolio',
                description: 'Portfolio principale',
                createdAt: Date.now(),
                items: [],
                transactions: [],
                isDefault: true
            }],
            activePortfolioId: 'default',
            watchlist: [],
            alerts: [],
            marketData: {},
            calendarEvents: [],
            upcomingEarnings: [],
            upcomingDividends: [],
            userProfile: null,
            socialFeed: [],
            following: [],
            followers: [],
            activeTab: TabType.PORTFOLIO,
            isFocusMode: false,
            apiKeys: { fmp: '0F4bHcgWqjf6Bs2X2A6nEkLp4FQxy2fA', gemini: '' },

            // Portfolio Actions
            createPortfolio: (name, description) => set((state) => ({
                portfolios: [...state.portfolios, {
                    id: Date.now().toString(),
                    name,
                    description,
                    createdAt: Date.now(),
                    items: [],
                    transactions: [],
                    isDefault: false
                }]
            })),

            deletePortfolio: (id) => set((state) => ({
                portfolios: state.portfolios.filter(p => p.id !== id && !p.isDefault)
            })),

            setActivePortfolio: (id) => set({ activePortfolioId: id }),

            addToPortfolio: (portfolioId, item) => set((state) => ({
                portfolios: state.portfolios.map(p =>
                    p.id === portfolioId
                        ? { ...p, items: [...p.items, item] }
                        : p
                )
            })),

            removeFromPortfolio: (portfolioId, itemId) => set((state) => ({
                portfolios: state.portfolios.map(p =>
                    p.id === portfolioId
                        ? { ...p, items: p.items.filter(i => i.id !== itemId) }
                        : p
                )
            })),

            addTransaction: (transaction) => set((state) => ({
                portfolios: state.portfolios.map(p =>
                    p.id === transaction.portfolioId
                        ? { ...p, transactions: [...p.transactions, transaction] }
                        : p
                )
            })),

            // Watchlist Actions
            addToWatchlist: (item) => set((state) => ({
                watchlist: [...state.watchlist, { ...item, addedAt: Date.now() }]
            })),

            removeFromWatchlist: (id) => set((state) => ({
                watchlist: state.watchlist.filter((i) => i.id !== id)
            })),

            // Settings
            setApiKeys: (keys) => set({ apiKeys: keys }),

            // Market Data
            updateMarketData: (ticker, data) => set((state) => ({
                marketData: { ...state.marketData, [ticker]: data }
            })),

            refreshMarketData: async () => {
                const { portfolios, activePortfolioId, watchlist, alerts, updateMarketData } = get();
                const activePortfolio = portfolios.find(p => p.id === activePortfolioId);

                const allTickers = new Set([
                    ...(activePortfolio?.items.map((p) => p.ticker) || []),
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

            // UI Actions
            setActiveTab: (tab) => set({ activeTab: tab }),
            toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),

            // Calendar Actions
            addCalendarEvent: (event) => set((state) => ({
                calendarEvents: [...state.calendarEvents, event]
            })),

            removeCalendarEvent: (id) => set((state) => ({
                calendarEvents: state.calendarEvents.filter(e => e.id !== id)
            })),

            // Social Actions
            setUserProfile: (profile) => set({ userProfile: profile }),

            addPost: (post) => set((state) => ({
                socialFeed: [post, ...state.socialFeed]
            })),

            likePost: (postId) => set((state) => ({
                socialFeed: state.socialFeed.map(post =>
                    post.id === postId
                        ? { ...post, likes: post.likes + 1, isLiked: true }
                        : post
                )
            })),

            followUser: (userId) => set((state) => ({
                following: [...state.following, userId]
            })),

            unfollowUser: (userId) => set((state) => ({
                following: state.following.filter(id => id !== userId)
            })),
        }),
        {
            name: 'alpha-vision-storage',
            partialize: (state) => ({
                portfolios: state.portfolios,
                activePortfolioId: state.activePortfolioId,
                watchlist: state.watchlist,
                alerts: state.alerts,
                apiKeys: state.apiKeys,
                userProfile: state.userProfile,
                following: state.following,
            }),
        }
    )
);
