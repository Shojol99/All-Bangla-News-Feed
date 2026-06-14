import { motion } from 'motion/react';
import { categories } from '../data/newspapers';
import { Link } from 'react-router-dom';
import { Globe, Newspaper, Tv, MapPin, Briefcase, Trophy, Cpu, GraduationCap, Radio, Languages, Info, Shield, FileText, Mail } from 'lucide-react';
import SEO from '../components/SEO';

export default function Sitemap() {
  const mainPages = [
    { name: 'Home', path: '/', icon: <Globe className="w-5 h-5" /> },
    { name: 'Latest News', path: '/news', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Post News', path: '/post-news', icon: <PlusCircleIcon className="w-5 h-5" /> },
    { name: 'Add Newspaper', path: '/add-newspaper', icon: <PlusCircleIcon className="w-5 h-5" /> },
    { name: 'About Us', path: '/about', icon: <Info className="w-5 h-5" /> },
    { name: 'Contact Support', path: '/contact', icon: <Mail className="w-5 h-5" /> },
    { name: 'Privacy Policy', path: '/privacy', icon: <Shield className="w-5 h-5" /> },
    { name: 'Terms of Service', path: '/terms', icon: <FileText className="w-5 h-5" /> },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Newspaper': return <Newspaper className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Tv': return <Tv className="w-5 h-5" />;
      case 'MapPin': return <MapPin className="w-5 h-5" />;
      case 'Languages': return <Languages className="w-5 h-5" />;
      case 'Globe2': return <Globe className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'bangla-magazines': return <Newspaper className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="pt-12 sm:pt-20 md:pt-32 pb-20 min-h-screen bg-bg-main">
      <SEO 
        title="Sitemap | All Bangla latest News Feed - All Bangla Newspaper Directory"
        description="Browse all pages and categories of All Bangla latest News Feed. Find all Bangla newspapers, online news portals, and live TV channels in one place."
        canonical="https://allbanglanewsfeed.netlify.app/sitemap"
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight">
            Website <span className="text-brand-red">Sitemap</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            A comprehensive list of all pages and categories available on All Bangla latest News Feed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Main Pages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-black text-text-primary flex items-center gap-3 border-b border-border-subtle pb-4">
              <Globe className="w-6 h-6 text-brand-red" />
              Main Pages
            </h2>
            <ul className="space-y-4">
              {mainPages.map((page) => (
                <li key={page.path}>
                  <Link 
                    to={page.path}
                    className="flex items-center gap-3 text-text-secondary hover:text-brand-red transition-colors font-bold group"
                  >
                    <div className="p-2 bg-bg-surface rounded-brand-md border border-border-subtle group-hover:border-brand-red/30 transition-all">
                      {page.icon}
                    </div>
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* News Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 lg:col-span-2"
          >
            <h2 className="text-2xl font-black text-text-primary flex items-center gap-3 border-b border-border-subtle pb-4">
              <Newspaper className="w-6 h-6 text-brand-green" />
              News Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <Link 
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  className="p-6 bg-bg-surface rounded-brand-xl border border-border-subtle hover:border-brand-red hover:shadow-brand-premium transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-bg-main rounded-brand-md text-text-muted group-hover:text-brand-red transition-colors">
                      {getIcon(cat.icon)}
                    </div>
                    <div>
                      <h3 className="font-black text-text-primary group-hover:text-brand-red transition-colors">{cat.name}</h3>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">/{cat.slug}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* XML Sitemap CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 p-12 bg-brand-red rounded-brand-3xl text-center text-text-on-brand shadow-brand-premium"
        >
          <h2 className="text-3xl font-black mb-6">Search Engine Sitemap</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
            Are you a search engine crawler? You can access our machine-readable XML sitemap for better indexing.
          </p>
          <a 
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-red rounded-brand-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
          >
            <Globe className="w-5 h-5" />
            View XML Sitemap
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function PlusCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
