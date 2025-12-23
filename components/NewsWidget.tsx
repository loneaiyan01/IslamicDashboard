import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/api';
import { NewsItem, NewsTopic } from '../types';
import { Newspaper, Cpu, Globe, ExternalLink } from 'lucide-react';

export const NewsWidget: React.FC = () => {
    const [topic, setTopic] = useState<NewsTopic>('tech');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const refreshNews = async (selectedTopic: NewsTopic) => {
        setLoading(true);
        setIsVisible(false);
        try {
            // Artificial delay for smooth transition
            await new Promise(resolve => setTimeout(resolve, 300));
            const data = await fetchNews(selectedTopic);
            setNews(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsVisible(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshNews(topic);
        const interval = setInterval(() => refreshNews(topic), 300000); // 5 mins
        return () => clearInterval(interval);
    }, [topic]);

    const handleTopicChange = (newTopic: NewsTopic) => {
        if (newTopic === topic) return;
        setTopic(newTopic);
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10 mb-2">
                <div className="flex bg-black/20 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => handleTopicChange('tech')}
                        className={`p-1.5 rounded transition-all ${topic === 'tech' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                        title="Tech News"
                    >
                        <Cpu size={14} />
                    </button>
                    <button
                        onClick={() => handleTopicChange('ai')}
                        className={`p-1.5 rounded transition-all ${topic === 'ai' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                        title="AI News"
                    >
                        <Newspaper size={14} />
                    </button>
                    <button
                        onClick={() => handleTopicChange('world')}
                        className={`p-1.5 rounded transition-all ${topic === 'world' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                        title="World News"
                    >
                        <Globe size={14} />
                    </button>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-500/50 tracking-widest">
                    {topic}
                </span>
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto no-scrollbar transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {loading && news.length === 0 ? (
                    <div className="flex flex-col gap-2 animate-pulse mt-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 bg-white/5 rounded-md w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {news.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-xs font-medium text-white/80 group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                                        {item.title}
                                    </span>
                                    <ExternalLink size={10} className="text-white/20 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1" />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-white/30 uppercase tracking-wide">
                                        {item.source}
                                    </span>
                                    {item.time && (
                                        <span className="text-[9px] text-white/20">
                                            • {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                            </a>
                        ))}
                        {news.length === 0 && !loading && (
                            <div className="text-center text-white/30 text-xs py-4">
                                No news available.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
