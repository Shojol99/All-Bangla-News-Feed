import { motion } from 'motion/react';
import { Newspaper, Globe, Tv, MapPin, Languages, Globe2, Radio, BookOpen, Briefcase, Trophy, Cpu, GraduationCap, ArrowRight } from 'lucide-react';
import { NewsItem } from '../data/newspapers';
import NewsCard from './NewsCard';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = {
  Newspaper,
  Globe,
  Tv,
  MapPin,
  Languages,
  Globe2,
  Radio,
  BookOpen,
  Briefcase,
  Trophy,
  Cpu,
  GraduationCap,
};

interface CategorySectionProps {
  id: string;
  slug: string;
  name: string;
  icon: string;
  items: NewsItem[];
  key?: string;
}

export default function CategorySection({ id, slug, name, icon, items }: CategorySectionProps) {
  const IconComponent = iconMap[icon] || Globe;

  return (
    <section id={id} className="py-12 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-8 border-b border-border-subtle pb-4"
      >
        <div className="p-3 bg-brand-green/10 rounded-brand-md">
          <IconComponent className="w-6 h-6 text-brand-green" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          {name}
        </h2>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden sm:inline-block text-sm font-bold text-text-muted bg-bg-surface px-3 py-1 rounded-full border border-border-subtle">
            {items.length} Sources
          </span>
          <Link 
            to={`/${slug}`}
            className="flex items-center gap-2 text-sm font-black text-brand-red uppercase tracking-widest hover:translate-x-1 transition-transform"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <NewsCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
