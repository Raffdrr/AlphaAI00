import { CalendarEvent, EarningsEvent, DividendEvent, EconomicEvent } from '../types';
import { useStore } from '../store/useStore';

const BASE_URL = 'https://financialmodelingprep.com/api/v3';

const getApiKey = () => useStore.getState().apiKeys.fmp;

// Fetch Earnings Calendar
export const fetchEarningsCalendar = async (from?: string, to?: string): Promise<EarningsEvent[]> => {
    try {
        const fromDate = from || new Date().toISOString().split('T')[0];
        const toDate = to || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const url = `${BASE_URL}/earning_calendar?from=${fromDate}&to=${toDate}&apikey=${getApiKey()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
            return data.slice(0, 100).map((item: any) => ({
                id: `earnings-${item.symbol}-${item.date}`,
                ticker: item.symbol,
                companyName: item.symbol,
                date: new Date(item.date).getTime(),
                time: item.time || 'Unknown',
                fiscalQuarter: item.fiscalDateEnding || 'Q?',
                fiscalYear: new Date(item.fiscalDateEnding || Date.now()).getFullYear(),
                estimatedEPS: item.epsEstimated,
                actualEPS: item.eps,
                surprise: item.eps && item.epsEstimated ? item.eps - item.epsEstimated : undefined,
                surprisePercent: item.eps && item.epsEstimated ? ((item.eps - item.epsEstimated) / Math.abs(item.epsEstimated)) * 100 : undefined,
                estimatedRevenue: item.revenueEstimated,
                actualRevenue: item.revenue,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch earnings calendar:', error);
    }

    // Mock data fallback
    return generateMockEarnings();
};

// Fetch Dividend Calendar
export const fetchDividendCalendar = async (): Promise<DividendEvent[]> => {
    try {
        const url = `${BASE_URL}/stock_dividend_calendar?apikey=${getApiKey()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
            return data.slice(0, 50).map((item: any) => ({
                id: `dividend-${item.symbol}-${item.date}`,
                ticker: item.symbol,
                companyName: item.label || item.symbol,
                exDate: new Date(item.date).getTime(),
                paymentDate: new Date(item.paymentDate || item.date).getTime(),
                recordDate: new Date(item.recordDate || item.date).getTime(),
                amount: item.dividend || 0,
                frequency: 'Quarterly',
                yield: item.adjDividend,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch dividend calendar:', error);
    }

    return generateMockDividends();
};

// Fetch Economic Calendar
export const fetchEconomicCalendar = async (): Promise<EconomicEvent[]> => {
    try {
        const url = `${BASE_URL}/economic_calendar?apikey=${getApiKey()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
            return data.slice(0, 50).map((item: any) => ({
                id: `economic-${item.event}-${item.date}`,
                title: item.event,
                country: item.country || 'US',
                category: categorizeEconomicEvent(item.event),
                date: new Date(item.date).getTime(),
                importance: item.impact === 'High' ? 'High' : item.impact === 'Medium' ? 'Medium' : 'Low',
                actual: item.actual,
                forecast: item.estimate,
                previous: item.previous,
                impact: determineImpact(item.actual, item.estimate),
            }));
        }
    } catch (error) {
        console.error('Failed to fetch economic calendar:', error);
    }

    return generateMockEconomicEvents();
};

// Convert events to CalendarEvent format
export const convertToCalendarEvents = (
    earnings: EarningsEvent[],
    dividends: DividendEvent[],
    economic: EconomicEvent[]
): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    earnings.forEach(e => {
        events.push({
            id: e.id,
            type: 'EARNINGS',
            date: e.date,
            ticker: e.ticker,
            title: `${e.ticker} Earnings`,
            description: `Q${e.fiscalQuarter} ${e.fiscalYear} Earnings Report`,
            importance: 'High',
            data: e,
        });
    });

    dividends.forEach(d => {
        events.push({
            id: d.id,
            type: 'DIVIDEND',
            date: d.exDate,
            ticker: d.ticker,
            title: `${d.ticker} Dividend`,
            description: `$${d.amount.toFixed(2)} per share`,
            importance: 'Medium',
            data: d,
        });
    });

    economic.forEach(e => {
        events.push({
            id: e.id,
            type: 'ECONOMIC',
            date: e.date,
            title: e.title,
            description: `${e.country} - ${e.category}`,
            importance: e.importance,
            data: e,
        });
    });

    return events.sort((a, b) => a.date - b.date);
};

// Helper functions
const categorizeEconomicEvent = (event: string): EconomicEvent['category'] => {
    const lower = event.toLowerCase();
    if (lower.includes('gdp')) return 'GDP';
    if (lower.includes('inflation') || lower.includes('cpi') || lower.includes('ppi')) return 'Inflation';
    if (lower.includes('employment') || lower.includes('jobs') || lower.includes('unemployment')) return 'Employment';
    if (lower.includes('fed') || lower.includes('fomc') || lower.includes('interest rate')) return 'Fed';
    return 'Other';
};

const determineImpact = (actual?: string, forecast?: string): 'Bullish' | 'Bearish' | 'Neutral' => {
    if (!actual || !forecast) return 'Neutral';
    const actualNum = parseFloat(actual);
    const forecastNum = parseFloat(forecast);
    if (isNaN(actualNum) || isNaN(forecastNum)) return 'Neutral';
    if (actualNum > forecastNum) return 'Bullish';
    if (actualNum < forecastNum) return 'Bearish';
    return 'Neutral';
};

// Mock data generators
const generateMockEarnings = (): EarningsEvent[] => {
    const tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD'];
    const now = Date.now();

    return tickers.map((ticker, i) => ({
        id: `earnings-${ticker}-${i}`,
        ticker,
        companyName: ticker,
        date: now + (i + 1) * 7 * 24 * 60 * 60 * 1000,
        time: i % 2 === 0 ? 'BMO' : 'AMC',
        fiscalQuarter: 'Q4',
        fiscalYear: 2024,
        estimatedEPS: 2.5 + Math.random(),
        actualEPS: undefined,
    }));
};

const generateMockDividends = (): DividendEvent[] => {
    const tickers = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'PEP'];
    const now = Date.now();

    return tickers.map((ticker, i) => ({
        id: `dividend-${ticker}-${i}`,
        ticker,
        companyName: ticker,
        exDate: now + (i + 2) * 7 * 24 * 60 * 60 * 1000,
        paymentDate: now + (i + 4) * 7 * 24 * 60 * 60 * 1000,
        recordDate: now + (i + 3) * 7 * 24 * 60 * 60 * 1000,
        amount: 0.5 + Math.random() * 1.5,
        frequency: 'Quarterly',
        yield: 2 + Math.random() * 2,
    }));
};

const generateMockEconomicEvents = (): EconomicEvent[] => {
    const events = [
        { title: 'Fed Interest Rate Decision', category: 'Fed' as const, importance: 'High' as const },
        { title: 'GDP Growth Rate', category: 'GDP' as const, importance: 'High' as const },
        { title: 'CPI Inflation Rate', category: 'Inflation' as const, importance: 'High' as const },
        { title: 'Unemployment Rate', category: 'Employment' as const, importance: 'Medium' as const },
        { title: 'Retail Sales', category: 'Other' as const, importance: 'Medium' as const },
    ];

    const now = Date.now();

    return events.map((event, i) => ({
        id: `economic-${i}`,
        title: event.title,
        country: 'US',
        category: event.category,
        date: now + (i + 1) * 5 * 24 * 60 * 60 * 1000,
        importance: event.importance,
        actual: undefined,
        forecast: '2.5%',
        previous: '2.3%',
        impact: 'Neutral',
    }));
};
