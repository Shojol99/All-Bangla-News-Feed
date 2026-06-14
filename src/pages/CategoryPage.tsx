import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { categories, newsData } from '../data/newspapers';
import CategorySection from '../components/CategorySection';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';
import { useNewsViewer } from '../context/NewsViewerContext';
import { AlertCircle, Calendar, ExternalLink, Loader2, Newspaper, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { fetchYouTubeLiveStreams } from '../api/youtubeService';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const CATEGORY_FEEDS: Record<string, string> = {
  'daily-bangla': 'https://www.prothomalo.com/feed/',
  'local-district': 'https://www.prothomalo.com/feed/bangladesh',
  'international': 'https://www.bbc.com/bengali/index.xml',
  'jobs': 'https://www.prothomalo.com/feed/chakri',
  'sports': 'https://www.prothomalo.com/feed/sports',
  'technology': 'https://www.prothomalo.com/feed/technology',
  'education': 'https://www.prothomalo.com/feed/education',
  'english': 'https://www.thedailystar.net/rss.xml',
  'radio': 'https://www.prothomalo.com/feed/entertainment',
  'magazine': 'https://www.prothomalo.com/feed/entertainment'
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [categoryNews, setCategoryNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const playersRef = useRef<Record<string, any>>({});
  const { openNews } = useNewsViewer();
  
  const category = categories.find(c => c.slug === slug);

  const fetchLiveStreams = async () => {
    if (category?.id !== 'live-tv') return;
    setLiveLoading(true);
    setApiError(null);
    try {
      console.log("Fetching live streams from /api/live-tv...");
      const response = await fetch('/api/live-tv');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.error) {
        throw new Error(data.error);
      } else {
        setLiveStreams(data);
      }
    } catch (err) {
      console.warn("Backend API failed, trying client-side fallback:", err);
      try {
        // FALLBACK: Call YouTube API directly from the browser
        // This ensures it works even if Netlify Functions are not configured correctly
        const apiKey = "AIzaSyCVrAkr7nOyKrkgNUBA03MY-armVaYHKVY";
        const data = await fetchYouTubeLiveStreams(apiKey);
        setLiveStreams(data);
      } catch (fallbackErr) {
        console.error("Client-side fallback also failed:", fallbackErr);
        setApiError("Failed to connect to live detection service.");
      }
    } finally {
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    if (category?.id === 'live-tv') {
      fetchLiveStreams();
      const interval = setInterval(fetchLiveStreams, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [category?.id]);

  // Load YouTube API
  useEffect(() => {
    if (category?.id === 'live-tv') {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          setIsApiReady(true);
        };
      } else {
        setIsApiReady(true);
      }
    }
  }, [category?.id]);

  // Initialize players when API is ready or live streams change
  useEffect(() => {
    if (isApiReady && category?.id === 'live-tv' && liveStreams.length > 0) {
      liveStreams.forEach(channel => {
        if (channel.isLive && !playersRef.current[channel.id]) {
          new window.YT.Player(`player-${channel.id}`, {
            events: {
              onReady: (e: any) => onPlayerReady(e, channel.id)
            }
          });
        }
      });
    }
  }, [isApiReady, category?.id, liveStreams]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    Object.values(playersRef.current).forEach(player => {
      if (player && typeof player.mute === 'function') {
        if (newMutedState) {
          player.mute();
        } else {
          player.unMute();
        }
      }
    });
  };

  const onPlayerReady = (event: any, id: string) => {
    playersRef.current[id] = event.target;
    if (isMuted) {
      event.target.mute();
    } else {
      event.target.unMute();
    }
    // Autoplay is handled by URL param, but we can force it here too
    event.target.playVideo();
  };
  
  useEffect(() => {
    // Reset news state immediately when category changes
    setCategoryNews([]);
    
    if (category && CATEGORY_FEEDS[category.id]) {
      fetchNews(CATEGORY_FEEDS[category.id]);
    }
  }, [category?.id]); // Use ID as dependency for more reliable updates

  const fetchNews = async (feedUrl: string) => {
    setLoadingNews(true);
    try {
      // Use a timestamp to bypass any caching
      const timestamp = new Date().getTime();
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&t=${timestamp}`);
      const data = await response.json();
      
      if (data.status === 'ok' && Array.isArray(data.items)) {
        // Process items to ensure thumbnails are captured correctly
        const processedItems = data.items.map((item: any) => ({
          ...item,
          thumbnail: item.thumbnail || item.enclosure?.link || ''
        }));
        setCategoryNews(processedItems);
      } else {
        console.warn(`RSS fetch failed for ${feedUrl}:`, data.message);
        setCategoryNews([]);
      }
    } catch (err) {
      console.error("Error fetching category news:", err);
      setCategoryNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-bg-main">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary">Category Not Found</h1>
          <p className="text-text-secondary mt-2">The category you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const items = newsData.filter(item => item.category === category.id);

  return (
    <div className="pt-12 sm:pt-20 md:pt-32 min-h-screen bg-bg-main">
      <SEO 
        title={category.title}
        description={category.description}
        keywords={category.keywords}
        canonical={`https://allbanglanewsfeed.netlify.app/${category.slug}`}
        breadcrumbItems={[
          { name: 'Home', item: 'https://allbanglanewsfeed.netlify.app' },
          { name: category.name, item: `https://allbanglanewsfeed.netlify.app/${category.slug}` }
        ]}
        schemaItems={items.map(item => ({
          name: item.name,
          url: item.url
        }))}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
            {category.name} <span className="text-brand-red">Directory</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
            {category.description} We have curated the most trusted and popular {category.name.toLowerCase()} sources in Bangladesh to help you stay informed.
          </p>
        </motion.div>

        <AdBanner position="hero" currentPage={category.slug} />

        {/* Live TV Special Layout */}
        {category.id === 'live-tv' ? (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-text-primary tracking-tight">
                  24/7 Live <span className="text-brand-red">News Channels</span>
                </h2>
                {liveStreams.some(s => s.isLive) && (
                  <button
                    onClick={toggleMute}
                    className="p-3 bg-brand-red text-text-on-brand rounded-full shadow-brand-premium hover:scale-110 transition-transform flex items-center gap-2"
                    title={isMuted ? "Unmute All" : "Mute All"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                      {isMuted ? 'Unmute All' : 'Mute All'}
                    </span>
                  </button>
                )}
                <button 
                  onClick={fetchLiveStreams}
                  disabled={liveLoading}
                  className="p-3 bg-bg-surface border border-border-subtle rounded-full text-text-muted hover:text-brand-red transition-colors disabled:opacity-50"
                  title="Refresh Live Status"
                >
                  <RefreshCw className={`w-5 h-5 ${liveLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest bg-brand-red/10 text-brand-red px-3 py-1 rounded border border-brand-red/20 animate-pulse">
                  Auto-Detecting Live
                </span>
              </div>
            </div>

            {apiError && (
              <div className="p-6 bg-brand-red/5 border border-brand-red/20 rounded-brand-xl mb-8 flex items-center gap-4 text-brand-red">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <p className="font-bold">API Configuration Required</p>
                  <p className="text-sm opacity-80">{apiError}</p>
                  <button 
                    onClick={fetchLiveStreams}
                    className="mt-2 text-xs underline font-bold"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {liveLoading && liveStreams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-bg-surface rounded-brand-xl border border-border-subtle border-dashed">
                <Loader2 className="w-10 h-10 text-brand-red animate-spin mb-4" />
                <p className="text-text-muted font-bold">Scanning Bangladeshi channels for live broadcasts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {liveStreams.map((channel, index) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-bg-surface rounded-brand-xl border border-border-subtle overflow-hidden shadow-brand-lg group ${!channel.isLive ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="aspect-video relative bg-black">
                      {channel.isLive ? (
                        <iframe
                          id={`player-${channel.id}`}
                          src={`https://www.youtube.com/embed/${channel.videoId}${channel.videoId?.includes('?') ? '&' : '?'}enablejsapi=1&autoplay=1&mute=1&rel=0&modestbranding=1`}
                          className="w-full h-full border-none"
                          allow="autoplay; encrypted-media"
                          title={channel.name}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-4">
                          <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                            <VolumeX className="w-8 h-8" />
                          </div>
                          <p className="font-black uppercase tracking-widest text-sm">Currently Offline</p>
                        </div>
                      )}
                      
                      {channel.isLive && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-brand-red text-text-on-brand text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                          LIVE NOW
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {channel.logo && (
                          <img src={channel.logo} alt="" className="w-10 h-10 rounded-brand-md border border-border-subtle p-1 bg-white" />
                        )}
                        <div>
                          <h3 className="font-black text-text-primary group-hover:text-brand-red transition-colors">{channel.name}</h3>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                            {channel.isLive ? 'Active Broadcast' : 'Channel Offline'}
                          </p>
                        </div>
                      </div>
                      {channel.isLive && (
                        <button 
                          onClick={() => openNews(`https://www.youtube.com/watch?v=${channel.videoId}`, channel.name)}
                          className="p-2 hover:bg-bg-main rounded-full transition-colors text-text-muted hover:text-brand-red"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {liveStreams.length === 0 && !liveLoading && !apiError && (
              <div className="p-12 text-center bg-bg-surface rounded-brand-xl border border-border-subtle border-dashed">
                <Newspaper className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-text-secondary font-medium">No live channels detected at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        ) : CATEGORY_FEEDS[category.id] && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => category && CATEGORY_FEEDS[category.id] && fetchNews(CATEGORY_FEEDS[category.id])}
                  disabled={loadingNews}
                  className="p-2 bg-brand-red/10 rounded-brand-md hover:bg-brand-red/20 transition-colors disabled:opacity-50"
                  title="Refresh News"
                >
                  <RefreshCw className={`w-5 h-5 text-brand-red ${loadingNews ? 'animate-spin' : ''}`} />
                </button>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">
                  Latest <span className="text-brand-red">{category.name}</span> News
                </h2>
              </div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest bg-bg-surface px-3 py-1 rounded border border-border-subtle">
                Updated Live
              </span>
            </div>

            {loadingNews ? (
              <div className="flex flex-col items-center justify-center py-20 bg-bg-surface rounded-brand-xl border border-border-subtle border-dashed">
                <Loader2 className="w-10 h-10 text-brand-red animate-spin mb-4" />
                <p className="text-text-muted font-bold">Fetching latest {category.name.toLowerCase()} updates...</p>
              </div>
            ) : categoryNews.length > 0 ? (
              <div className="space-y-6">
                {categoryNews.slice(0, 10).map((news, index) => (
                  <motion.article
                    key={news.guid || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-bg-surface rounded-brand-xl border border-border-subtle overflow-hidden shadow-brand-sm hover:shadow-brand-lg transition-all group cursor-pointer"
                    onClick={() => openNews(news.link, news.title)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {news.thumbnail && (
                        <div className="md:w-64 h-48 md:h-auto overflow-hidden shrink-0">
                          <img 
                            src={news.thumbnail} 
                            alt={news.title} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-xs font-bold text-text-muted mb-4 uppercase tracking-widest">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(news.pubDate).toLocaleDateString()}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-bg-main rounded border border-border-subtle">
                            {news.categories?.[0] || category.name}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-text-primary mb-3 leading-tight group-hover:text-brand-red transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2 mb-6 leading-relaxed">
                          {(news.description || '').replace(/<[^>]*>?/gm, '')}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-bg-main border border-border-subtle flex items-center justify-center text-text-muted text-xs font-bold uppercase">
                              {news.author?.[0] || 'S'}
                            </div>
                            <span className="text-xs font-bold text-text-secondary">
                              {news.author || 'Source'}
                            </span>
                          </div>
                          <button 
                            className="text-brand-red text-xs font-black flex items-center gap-1 hover:underline uppercase tracking-widest"
                          >
                            Read Full <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-bg-surface rounded-brand-xl border border-border-subtle border-dashed">
                <Newspaper className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-20" />
                <p className="text-text-secondary font-medium">No live news available for this category at the moment.</p>
              </div>
            )}
          </div>
        )}

        <CategorySection 
          id={category.id}
          slug={category.slug}
          name={category.name}
          icon={category.icon}
          items={items}
        />

        {/* SEO Content for Category */}
        <div className="mt-20 space-y-12">
          <div className="p-8 md:p-12 bg-bg-surface rounded-brand-2xl border border-border-subtle shadow-brand-premium">
            <h2 className="text-3xl font-black text-text-primary mb-8 tracking-tight">
              {category.name} 2026 – বাংলাদেশ সেরা সংবাদ প্ল্যাটফর্ম
            </h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-6">
            <p>
              <strong>All Bangla latest News Feed</strong> is a complete bangla newspaper directory where users can find all bangla newspaper sources in one place. 
              এখানে আপনি বাংলাদেশের শতাধিক বাংলা সংবাদপত্র, অনলাইন নিউজ পোর্টাল এবং লাইভ টিভি চ্যানেল সহজেই অ্যাক্সেস করতে পারবেন।
            </p>
              
              <p>
                If you are searching for <strong>{category.keywords}</strong>, this page helps you discover trusted sources quickly. 
                Stay updated with bangla news 24/7 from reliable platforms across Bangladesh and worldwide.
              </p>

              <hr className="border-border-subtle my-10" />

              <h3 className="text-2xl font-black text-text-primary tracking-tight">About This Page</h3>
              <p>
                This page is designed to help users find the best <strong>{category.name}</strong> in Bangladesh. 
                Instead of searching multiple websites, you can explore everything in one place.
              </p>
              <p>
                We have listed 50+ trusted sources to ensure you always get accurate and updated information. 
                From real-time updates to in-depth analysis, these platforms cover everything from politics and economy to sports and entertainment.
              </p>

              <h3 className="text-2xl font-black text-text-primary tracking-tight">What You Can Find Here</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-brand-red rounded-full" /> Popular and trusted sources</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-brand-red rounded-full" /> Easy access to all platforms</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-brand-red rounded-full" /> Updated and verified listings</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-brand-red rounded-full" /> Fast browsing experience</li>
              </ul>

              <h3 className="text-2xl font-black text-text-primary tracking-tight">Why This Page is Useful</h3>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-brand-green/10 rounded flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-brand-green rounded-full" />
                  </div>
                  <span>Saves time by listing everything in one place</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-brand-green/10 rounded flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-brand-green rounded-full" />
                  </div>
                  <span>Provides access to trusted bangla news sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-brand-green/10 rounded flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-brand-green rounded-full" />
                  </div>
                  <span>Helps users stay updated with latest information</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-brand-green/10 rounded flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-brand-green rounded-full" />
                  </div>
                  <span>Works for users in Bangladesh and abroad</span>
                </li>
              </ul>

              <h3 className="text-2xl font-black text-text-primary tracking-tight">Frequently Asked Questions</h3>
              <div className="space-y-8 not-prose">
                <div className="p-6 bg-bg-main rounded-brand-xl border border-border-subtle">
                  <h4 className="font-bold text-text-primary mb-2">What is the best source for {category.keywords}?</h4>
                  <p className="text-text-secondary text-sm">There are many trusted sources listed on this page including popular platforms in Bangladesh.</p>
                </div>
                <div className="p-6 bg-bg-main rounded-brand-xl border border-border-subtle">
                  <h4 className="font-bold text-text-primary mb-2">How can I access these resources?</h4>
                  <p className="text-text-secondary text-sm">You can simply click and visit the official websites directly from All Bangla latest News Feed.</p>
                </div>
                <div className="p-6 bg-bg-main rounded-brand-xl border border-border-subtle">
                  <h4 className="font-bold text-text-primary mb-2">এই তথ্যগুলো কি নিয়মিত আপডেট করা হয়?</h4>
                  <p className="text-text-secondary text-sm">হ্যাঁ, আমরা নিয়মিত তালিকা আপডেট করি যাতে আপনি সর্বশেষ তথ্য পান।</p>
                </div>
                <div className="p-6 bg-bg-main rounded-brand-xl border border-border-subtle">
                  <h4 className="font-bold text-text-primary mb-2">Is this page free to use?</h4>
                  <p className="text-text-secondary text-sm">Yes, all listings on All Bangla latest News Feed are completely free to access.</p>
                </div>
              </div>

              <h3 className="text-2xl font-black text-text-primary tracking-tight">Stay Updated with Bangla News</h3>
              <p>
                Bookmark <strong>All Bangla latest News Feed</strong> to easily access all bangla newspapers, online bangla news, and live TV channels anytime. 
                Stay informed with the latest updates from Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
