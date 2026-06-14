import { motion } from 'motion/react';
import { Search, Globe, Newspaper, Zap } from 'lucide-react';
import AdBanner from './AdBanner';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Hero({ searchQuery, setSearchQuery }: HeroProps) {
  return (
    <div id="hero" className="relative pt-12 sm:pt-20 md:pt-32 pb-12 sm:pb-20 px-4 overflow-hidden bg-bg-main">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 border border-brand-green/20"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>The Ultimate News Directory of Bangladesh</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-text-primary mb-4 sm:mb-6 tracking-tight leading-tight"
        >
          All Bangla Newspapers <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-green">
            In One Place
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-12 px-2"
        >
          Access over 500+ trusted news sources, live TV channels, and online portals instantly. 
          Stay updated with the latest happenings across Bangladesh and the world.
        </motion.p>

        <AdBanner position="hero" currentPage="home" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto relative group"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-text-muted group-focus-within:text-brand-red transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for your favorite newspaper or channel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-bg-surface rounded-brand-xl border-2 border-border-subtle focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all shadow-brand-lg text-lg text-text-primary"
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-bg-main border border-border-subtle rounded-brand-md text-xs font-bold text-text-muted">
              <span className="text-base">⌘</span> K
            </kbd>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2 font-bold text-text-secondary">
            <Globe className="w-5 h-5" />
            <span>500+ Portals</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-text-secondary">
            <Newspaper className="w-5 h-5" />
            <span>100+ Dailies</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-text-secondary">
            <Zap className="w-5 h-5" />
            <span>Real-time Updates</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
