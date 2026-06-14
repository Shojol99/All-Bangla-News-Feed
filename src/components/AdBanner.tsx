import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Info } from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  type: 'image' | 'text';
  position: 'hero' | 'footer' | 'sidebar-left' | 'sidebar-right';
  targetPages: string[];
  imageUrl?: string;
  linkUrl?: string;
  textContent?: string;
  isActive: boolean;
  expiresAt?: any;
}

interface AdBannerProps {
  position: Advertisement['position'];
  currentPage: string; // 'home', 'news-page', or category slug
}

export default function AdBanner({ position, currentPage }: AdBannerProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'ads'),
      where('isActive', '==', true),
      where('position', '==', position)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allAds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement));
      const now = new Date();
      
      // Filter by target page and expiration
      const filteredAds = allAds.filter(ad => {
        const isTargeted = ad.targetPages.includes('all') || ad.targetPages.includes(currentPage);
        
        // Check if expired
        let isExpired = false;
        if (ad.expiresAt) {
          const expirationDate = ad.expiresAt.toDate ? ad.expiresAt.toDate() : new Date(ad.expiresAt);
          isExpired = now > expirationDate;
        }
        
        return isTargeted && !isExpired;
      });
      setAds(filteredAds);
    });

    return () => unsubscribe();
  }, [position, currentPage]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
      }, 5000); // Rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [ads]);

  if (ads.length === 0) {
    return null;
  }

  const ad = ads[currentAdIndex];
  
  // Safety check: Ensure the ad has content to display
  const hasContent = ad.type === 'image' ? !!ad.imageUrl : !!ad.textContent;
  if (!hasContent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ad.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`relative group overflow-hidden rounded-brand-xl border border-border-subtle shadow-brand-premium bg-bg-surface ${
          position === 'hero' ? 'w-full max-w-5xl mx-auto mb-12' : 
          position === 'footer' ? 'w-full max-w-7xl mx-auto mt-12' : 
          'w-full mb-8'
        }`}
      >
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          <Info className="w-2 h-2" /> Sponsored
        </div>

        {ad.linkUrl ? (
          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative">
            {ad.type === 'image' ? (
              <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[32/9]">
                <img 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <span>{ad.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gradient-to-br from-brand-red/5 to-brand-green/5 min-h-[120px] flex flex-col items-center justify-center">
                <h4 className="text-xl font-black text-text-primary mb-2">{ad.title}</h4>
                <p className="text-text-secondary line-clamp-2">{ad.textContent}</p>
                <div className="mt-4 flex items-center gap-2 text-brand-red font-bold text-sm">
                  Learn More <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            )}
          </a>
        ) : (
          <div className="relative">
            {ad.type === 'image' ? (
              <div className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[32/9]">
                <img 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-gradient-to-br from-brand-red/5 to-brand-green/5 min-h-[120px] flex flex-col items-center justify-center">
                <h4 className="text-xl font-black text-text-primary mb-2">{ad.title}</h4>
                <p className="text-text-secondary">{ad.textContent}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
