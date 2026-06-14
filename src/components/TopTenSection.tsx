import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { NewsItem } from '../data/newspapers';
import NewsCard from './NewsCard';

interface TopTenSectionProps {
  items: NewsItem[];
  title: string;
}

export default function TopTenSection({ items, title }: TopTenSectionProps) {
  return (
    <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 shadow-brand-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-gold/10 rounded-brand-md">
          <Trophy className="w-6 h-6 text-brand-gold" />
        </div>
        <h3 className="font-black text-text-primary uppercase tracking-[0.2em] text-sm">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.slice(0, 10).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <NewsCard item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
