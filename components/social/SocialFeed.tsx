import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Post, UserProfile } from '../../types';
import { Heart, MessageCircle, Share2, TrendingUp, Send, Image as ImageIcon } from 'lucide-react';

const SocialFeed: React.FC = () => {
    const { socialFeed, userProfile, likePost, addPost } = useStore();
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTicker, setNewPostTicker] = useState('');

    const handleCreatePost = () => {
        if (!newPostContent.trim() || !userProfile) return;

        const post: Post = {
            id: Date.now().toString(),
            userId: userProfile.id,
            username: userProfile.username,
            userAvatar: userProfile.avatar,
            content: newPostContent,
            ticker: newPostTicker || undefined,
            type: newPostTicker ? 'TRADE' : 'TEXT',
            likes: 0,
            comments: 0,
            shares: 0,
            createdAt: Date.now(),
            isLiked: false,
            tags: extractHashtags(newPostContent),
        };

        addPost(post);
        setNewPostContent('');
        setNewPostTicker('');
    };

    const extractHashtags = (text: string): string[] => {
        const matches = text.match(/#\w+/g);
        return matches ? matches.map(tag => tag.slice(1)) : [];
    };

    const formatTimeAgo = (timestamp: number): string => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'ora';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m fa`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h fa`;
        const days = Math.floor(hours / 24);
        return `${days}g fa`;
    };

    return (
        <div className="space-y-6">
            {/* Create Post */}
            {userProfile && (
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                            {userProfile.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Condividi le tue idee di investimento..."
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-[#2a2a2a] focus:border-accent-500 focus:outline-none resize-none"
                                rows={3}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newPostTicker}
                                        onChange={(e) => setNewPostTicker(e.target.value.toUpperCase())}
                                        placeholder="Ticker (opzionale)"
                                        className="bg-[#1a1a1a] text-white px-3 py-2 rounded-lg border border-[#2a2a2a] focus:border-accent-500 focus:outline-none w-32"
                                    />
                                    <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-white">
                                        <ImageIcon size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Pubblica
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feed */}
            <div className="space-y-4">
                {socialFeed.length === 0 ? (
                    <div className="bg-[#141414] border border-[#2a2a2a] border-dashed rounded-2xl p-12 text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="p-4 bg-accent-500/10 rounded-2xl inline-block">
                                <TrendingUp className="text-accent-500" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Nessun post ancora</h3>
                            <p className="text-gray-500">Inizia a condividere le tue idee di investimento!</p>
                        </div>
                    </div>
                ) : (
                    socialFeed.map((post) => (
                        <div key={post.id} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#333] transition-colors">
                            {/* Post Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {post.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{post.username}</span>
                                        {post.ticker && (
                                            <span className="px-2 py-1 bg-accent-500/10 text-accent-500 rounded-lg text-xs font-bold">
                                                ${post.ticker}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="mb-4">
                                <p className="text-white whitespace-pre-wrap">{post.content}</p>
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="text-accent-500 text-sm">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center gap-6 pt-4 border-t border-[#2a2a2a]">
                                <button
                                    onClick={() => likePost(post.id)}
                                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                                        }`}
                                >
                                    <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                                    <span className="text-sm font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                    <MessageCircle size={18} />
                                    <span className="text-sm font-bold">{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                                    <Share2 size={18} />
                                    <span className="text-sm font-bold">{post.shares}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SocialFeed;
