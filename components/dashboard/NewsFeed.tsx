import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { fetchMarketData } from '../../services/marketService';
import { NewsItem } from '../../types';
import { ExternalLink, Clock } from 'lucide-react';

const NewsFeed: React.FC = () => {
    const { portfolio, watchlist } = useStore();
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        const loadNews = async () => {
            // Get news for top holdings or general market
            const tickers = [...portfolio, ...watchlist].slice(0, 3).map(i => i.ticker);
            if (tickers.length === 0) tickers.push('AAPL', 'TSLA', 'NVDA'); // Defaults

            const allNews: NewsItem[] = [];
            for (const t of tickers) {
                const data = await fetchMarketData(t);
                if (data.news) allNews.push(...data.news);
            }
            // Sort by time (mock logic or real date if available) and dedup
            const unique = Array.from(new Map(allNews.map(item => [item.title, item])).values());
            setNews(unique.slice(0, 6));
        };
        loadNews();
    }, [portfolio, watchlist]);

    return (
        <div className="bg-[#111] rounded-xl border border-[#222] p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Market News
            </h3>
            <div className="space-y-4">
                {news.map((item, idx) => (
                    <a
                        key={idx}
                        href="#"
                        className="flex gap-4 group hover:bg-[#1a1a1a] p-3 rounded-lg transition-colors"
                    >
                        {item.imageUrl && (
                            <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#222]">
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <span className="font-medium text-blue-400">{item.source}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock size={10} /> {item.timeAgo}</span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-300 group-hover:text-white leading-snug line-clamp-2">
                                {item.title}
                            </h4>
                        </div>
                        <ExternalLink size={16} className="text-gray-600 group-hover:text-gray-400 self-start opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
                {news.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-4">No recent news available</div>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
