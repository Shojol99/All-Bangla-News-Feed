import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { newsData } from '../data/newspapers';

export default function BreakingNewsTicker() {
  // Get some top news items to display as breaking news
  const breakingNews = newsData.filter(item => item.isTop).slice(0, 5);

  return (
    <div className="bg-gradient-to-r from-text-primary via-slate-900 to-text-primary py-1.5 overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-brand-red text-text-on-brand px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter shrink-0 animate-pulse">
          <Zap className="w-2.5 h-2.5 fill-current" />
          Breaking
        </div>
        
        <div className="relative flex-1 h-5 overflow-hidden">
          <motion.div
            animate={{ x: [0, -1500] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex items-center gap-16 whitespace-nowrap"
          >
            {breakingNews.map((news, i) => (
              <span key={i} className="text-[12px] font-medium text-white/80 hover:text-brand-gold transition-colors cursor-pointer">
                <span className="text-brand-red font-bold">{news.name}:</span> {
                  news.category === 'daily-bangla' ? 'Latest headlines and top stories from across Bangladesh' :
                  news.category === 'online-bangla' ? 'Real-time updates and breaking news from digital portals' :
                  news.category === 'live-tv' ? 'Watch live coverage and exclusive news reports' :
                  news.category === 'local-district' ? 'Regional news updates from your local community' :
                  'Stay informed with the latest updates and top stories'
                }
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {breakingNews.map((news, i) => (
              <span key={`dup-${i}`} className="text-[12px] font-medium text-white/80 hover:text-brand-gold transition-colors cursor-pointer">
                <span className="text-brand-red font-bold">{news.name}:</span> {
                  news.category === 'daily-bangla' ? 'Latest headlines and top stories from across Bangladesh' :
                  news.category === 'online-bangla' ? 'Real-time updates and breaking news from digital portals' :
                  news.category === 'live-tv' ? 'Watch live coverage and exclusive news reports' :
                  news.category === 'local-district' ? 'Regional news updates from your local community' :
                  'Stay informed with the latest updates and top stories'
                }
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
