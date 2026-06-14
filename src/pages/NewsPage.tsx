import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, User, MapPin, ExternalLink, RefreshCw, Loader2, Globe, TrendingUp } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, db } from '../firebase';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';
import { useNewsViewer } from '../context/NewsViewerContext';

interface NewsArticle {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  location?: string;
  imageUrl?: string;
  authorEmail?: string;
  createdAt: any;
  link?: string;
  pubDate?: string;
  thumbnail?: string;
  description?: string;
  author?: string;
  source?: string;
}

const RSS_FEEDS = [
  { name: 'Prothom Alo', url: 'https://www.prothomalo.com/feed/' },
  { name: 'BBC Bangla', url: 'https://www.bbc.com/bengali/index.xml' },
  { name: 'Daily Star', url: 'https://www.thedailystar.net/rss.xml' }
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [externalNews, setExternalNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { openNews } = useNewsViewer();

  useEffect(() => {
    // 1. Fetch Community News from Firestore
    const q = query(
      collection(db, 'news'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsArticle[];
      setArticles(newsData);
    }, (error) => {
      console.error("Error fetching news:", error);
    });

    // 2. Fetch External News from multiple sources
    const fetchAllExternalNews = async () => {
      setLoading(true);
      try {
        const fetchPromises = RSS_FEEDS.map(async (feed) => {
          try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&t=${new Date().getTime()}`);
            const data = await response.json();
            if (data.status === 'ok') {
              return data.items.map((item: any) => ({
                ...item,
                source: feed.name,
                thumbnail: item.thumbnail || item.enclosure?.link || ''
              }));
            }
          } catch (e) {
            console.error(`Error fetching ${feed.name}:`, e);
          }
          return [];
        });

        const results = await Promise.all(fetchPromises);
        const combinedNews = results.flat().sort((a, b) => 
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );
        
        setExternalNews(combinedNews);
      } catch (err) {
        console.error("Error fetching external news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllExternalNews();

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-20 px-4">
      <SEO 
        title="Latest News Feed | Bangla News 24/7 Updates"
        description="Stay updated with the latest news from Bangladesh and around the world. সব অনলাইন বাংলা সংবাদপত্র - Real-time updates from trusted sources and our community."
        canonical="https://allbanglanewsfeed.netlify.app/news"
        breadcrumbItems={[
          { name: 'Home', item: 'https://allbanglanewsfeed.netlify.app' },
          { name: 'News Feed', item: 'https://allbanglanewsfeed.netlify.app/news' }
        ]}
        schemaItems={[...externalNews, ...articles].slice(0, 20).map(news => ({
          name: news.title,
          url: news.link || `https://allbanglanewsfeed.netlify.app/news#${news.id}`
        }))}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-bold mb-4 border border-brand-green/20">
            <RefreshCw className="w-4 h-4" />
            <span>Live News Updates</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight">
            Latest <span className="text-brand-red">News Feed</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Stay informed with the latest happenings from across Bangladesh and the world, 
            curated from trusted sources and our community.
          </p>
        </motion.div>

        <AdBanner position="hero" currentPage="news-page" />

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-bg-surface rounded-brand-xl p-6 border border-border-subtle animate-pulse">
                  <div className="h-4 bg-border-subtle rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-border-subtle rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-border-subtle rounded w-full mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-border-subtle rounded w-1/4"></div>
                    <div className="h-4 bg-border-subtle rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-8">
              <div className="bg-bg-surface rounded-brand-xl p-6 border border-border-subtle animate-pulse">
                <div className="h-6 bg-border-subtle rounded w-1/2 mb-6"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-border-subtle rounded w-full mb-4"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-12">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <h2 className="text-2xl font-black text-text-primary flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-brand-red" />
                  Top Stories
                </h2>
                <span className="text-xs font-black text-text-muted uppercase tracking-widest bg-bg-surface px-3 py-1 rounded border border-border-subtle">
                  {externalNews.length + articles.length} Updates
                </span>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* External News */}
                {externalNews.map((news, index) => (
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
                      <div className="p-8 flex-1">
                        <div className="flex items-center gap-4 text-xs font-bold text-text-muted mb-4 uppercase tracking-widest">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(news.pubDate).toLocaleDateString()}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-bg-main rounded text-text-muted border border-border-subtle">
                            {news.source || 'General'}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-text-primary mb-3 leading-tight group-hover:text-brand-red transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2 mb-6 leading-relaxed">
                          {(news.description || '').replace(/<[^>]*>?/gm, '')}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-bg-main border border-border-subtle flex items-center justify-center text-text-muted text-xs font-bold">
                              {news.author?.[0] || 'P'}
                            </div>
                            <span className="text-xs font-bold text-text-secondary">
                              {news.author || news.source}
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

                {/* Community News */}
                {articles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (externalNews.length + index) * 0.05 }}
                    className="bg-bg-surface rounded-brand-xl border border-border-subtle overflow-hidden shadow-brand-sm hover:shadow-brand-lg transition-all group cursor-pointer"
                    onClick={() => openNews(null, article.title, article.fullDescription)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {article.imageUrl && (
                        <div className="md:w-64 h-48 md:h-auto overflow-hidden shrink-0">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="p-8 flex-1">
                        <div className="flex items-center gap-4 text-xs font-bold text-text-muted mb-4 uppercase tracking-widest">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green rounded text-xs font-bold border border-brand-green/20">
                            Community
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-text-primary mb-3 leading-tight group-hover:text-brand-red transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2 mb-6 leading-relaxed">
                          {article.shortDescription}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-text-on-brand text-xs font-bold">
                              {article.authorEmail?.[0].toUpperCase() || 'U'}
                            </div>
                            <span className="text-xs font-bold text-text-secondary">
                              {article.authorEmail?.split('@')[0] || 'Anonymous'}
                            </span>
                          </div>
                          {article.location && (
                            <div className="flex items-center gap-1 text-xs font-bold text-text-muted">
                              <MapPin className="w-3 h-3 text-brand-red" />
                              <span>{article.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-brand-red rounded-brand-xl p-8 text-text-on-brand shadow-brand-premium">
                <h3 className="text-xl font-black mb-4 tracking-tight">Post Your News</h3>
                <p className="text-text-on-brand/80 text-sm mb-8 leading-relaxed">
                  Have something important to share with the community? Submit your news and get featured on our platform.
                </p>
                <a 
                  href="/post-news" 
                  className="w-full py-4 bg-bg-main text-brand-red rounded-brand-md font-black text-sm uppercase tracking-widest hover:bg-bg-surface transition-all flex items-center justify-center gap-2"
                >
                  Submit Now
                </a>
              </div>

              <AdBanner position="sidebar-right" currentPage="news-page" />

              <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 shadow-brand-sm">
                <h3 className="text-lg font-black text-text-primary mb-6">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Bangladesh', 'Politics', 'Sports', 'Technology', 'Economy', 'Education', 'Health', 'Entertainment'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-bg-main border border-border-subtle text-text-secondary rounded-brand-md text-xs font-bold hover:bg-brand-red hover:text-text-on-brand transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
