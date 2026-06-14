import { motion } from 'motion/react';
import { ExternalLink, Share2 } from 'lucide-react';
import { NewsItem } from '../data/newspapers';
import { cn } from '../lib/utils';
import { useNewsViewer } from '../context/NewsViewerContext';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const { openNews } = useNewsViewer();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: item.name,
      text: `Read ${item.name} on All Bangla latest News Feed`,
      url: window.location.origin + `/${item.category.split('-')[0]}-news` // Fallback to category page
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.origin).then(() => {
        alert('Site link copied to clipboard!');
      });
    }
  };

  return (
    <motion.button
      onClick={() => openNews(item.url, item.name)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col items-center justify-center p-4 md:p-8 bg-bg-surface rounded-brand-lg border border-border-subtle shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 overflow-hidden min-h-[140px] md:min-h-[180px] hover:border-brand-gold/30 w-full text-left"
    >
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleShare}
          className="p-2 bg-bg-main rounded-full border border-border-subtle hover:bg-brand-red hover:text-white transition-all shadow-sm"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <div className="p-2 bg-bg-main rounded-full border border-border-subtle hover:bg-brand-red hover:text-white transition-all shadow-sm">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
      
      <div className="w-full h-16 md:h-20 flex items-center justify-center mb-4">
        {item.logo ? (
          <img 
            src={item.logo} 
            alt={item.name} 
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span className={cn("text-lg md:text-2xl font-black text-text-primary text-center line-clamp-2 leading-tight tracking-tight", item.logo && "hidden")}>
          {item.name}
        </span>
      </div>
      
      <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="mt-4 text-[12px] uppercase tracking-[0.3em] text-text-muted font-black">
        {item.url.replace('https://', '').replace('www.', '').split('/')[0]}
      </div>
    </motion.button>
  );
}
