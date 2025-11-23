import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, TrendingUp } from 'lucide-react';

const NewsFeed: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        // Mock news data - in real app this would fetch from API
        setNews([
            {
                id: '1',
                title: 'Markets Rally on Strong Economic Data',
                source: 'Financial Times',
                timeAgo: '2h ago',
                imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
                sentiment: 'Positive'
            },
            {
                id: '2',
                title: 'Tech Stocks Lead Market Gains',
                source: 'Bloomberg',
                timeAgo: '4h ago',
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
                sentiment: 'Positive'
            },
            {
                id: '3',
                title: 'Federal Reserve Signals Rate Hold',
                source: 'Reuters',
                timeAgo: '6h ago',
                imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop',
                sentiment: 'Neutral'
            },
        ]);
    }, []);

    return (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-500/10 rounded-lg">
                        <Newspaper className="text-accent-500" size={20} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Market News</h3>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="group cursor-pointer bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-accent-500/50 transition-all hover:scale-[1.02]"
                        >
                            <div className="relative h-40 overflow-hidden bg-[#1a1a1a]">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200/1a1a1a/666666?text=News';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.sentiment === 'Positive'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {item.sentiment}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-500 transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="font-medium">{item.source}</span>
                                    <span>{item.timeAgo}</span>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                <button className="flex items-center gap-2 text-accent-500 text-sm font-bold hover:gap-3 transition-all">
                                    Read More
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsFeed;
