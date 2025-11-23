
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  imageUrl?: string;
  sentimentScore: number;
  sentimentLabel: 'Positive' | 'Negative' | 'Neutral';
  associatedChartIndex?: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketData {
  price: number;
  changePercent: number;
  changeAmount: number;
  volume: string;
  marketCap?: string;
  peRatio?: string;
  dividendYield?: string;
  rsi: number;
  news: NewsItem[];
  chartData: number[];
  candles: CandleData[];
}

// Enhanced Portfolio Types
export interface Transaction {
  id: string;
  portfolioId: string;
  ticker: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'SPLIT';
  quantity: number;
  price: number;
  fees?: number;
  date: number; // timestamp
  notes?: string;
}

export interface TaxLot {
  id: string;
  ticker: string;
  quantity: number;
  costBasis: number;
  purchaseDate: number;
  isLongTerm: boolean;
}

export interface PortfolioItem {
  id: string;
  ticker: string;
  name?: string;
  quantity?: number;
  avgCost?: number;
  taxLots?: TaxLot[];
  firstPurchaseDate?: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  items: PortfolioItem[];
  transactions: Transaction[];
  isDefault: boolean;
}

export interface PortfolioPerformance {
  portfolioId: string;
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  monthChange: number;
  yearChange: number;
  allTimeHigh: number;
  allTimeLow: number;
  sharpeRatio?: number;
  beta?: number;
  volatility?: number;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  name?: string;
  addedAt?: number;
  notes?: string;
}

// Events Types (StockEvents-inspired)
export interface EarningsEvent {
  id: string;
  ticker: string;
  companyName: string;
  date: number;
  time?: 'BMO' | 'AMC' | 'Unknown'; // Before Market Open / After Market Close
  fiscalQuarter: string;
  fiscalYear: number;
  estimatedEPS?: number;
  actualEPS?: number;
  surprise?: number;
  surprisePercent?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
}

export interface DividendEvent {
  id: string;
  ticker: string;
  companyName: string;
  exDate: number;
  paymentDate: number;
  recordDate: number;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  yield?: number;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  category: 'GDP' | 'Inflation' | 'Employment' | 'Fed' | 'Other';
  date: number;
  importance: 'Low' | 'Medium' | 'High';
  actual?: string;
  forecast?: string;
  previous?: string;
  impact?: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface CalendarEvent {
  id: string;
  type: 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC' | 'SPLIT' | 'IPO';
  date: number;
  ticker?: string;
  title: string;
  description?: string;
  importance: 'Low' | 'Medium' | 'High';
  data: EarningsEvent | DividendEvent | EconomicEvent | any;
}

// Social Types (Getquin-inspired)
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  investmentStyle?: string;
  joinedAt: number;
  isPublic: boolean;
  stats: {
    followers: number;
    following: number;
    posts: number;
    totalReturn?: number;
    portfolioValue?: number;
  };
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  ticker?: string;
  type: 'TEXT' | 'TRADE' | 'IDEA' | 'QUESTION';
  likes: number;
  comments: number;
  shares: number;
  createdAt: number;
  isLiked?: boolean;
  images?: string[];
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: number;
}

export interface AnalysisResult {
  ticker: string;
  content: string;
  timestamp: number;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector?: string;
  description?: string;
  ceo?: string;
  founded?: string;
  headquarters?: string;
  website?: string;
  employees?: string;
}

export interface SmartAlert {
  id: string;
  ticker: string;
  condition: string;
  isActive: boolean;
  lastChecked?: number;
  status?: 'triggered' | 'safe' | 'pending';
  triggerReason?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface FinancialData {
  year: string;
  revenue: number;
  netIncome: number;
}

// Analytics Types
export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  change: number;
}

export interface AssetAllocation {
  type: 'Stocks' | 'Bonds' | 'Cash' | 'Crypto' | 'Other';
  value: number;
  percentage: number;
}

export interface RiskMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  beta: number;
  alpha: number;
  volatility: number;
  maxDrawdown: number;
  var95: number; // Value at Risk 95%
}

export enum TabType {
  PORTFOLIO = 'PORTFOLIO',
  WATCHLIST = 'WATCHLIST',
  ALERTS = 'ALERTS',
  CALENDAR = 'CALENDAR',
  SOCIAL = 'SOCIAL',
  ANALYTICS = 'ANALYTICS'
}
