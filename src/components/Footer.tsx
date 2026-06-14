import { motion } from 'motion/react';
import { Newspaper, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdBanner from './AdBanner';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-surface text-text-secondary pt-16 pb-8 px-4 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-red rounded-brand-md shadow-brand-sm">
                <Newspaper className="w-5 h-5 text-text-on-brand" />
              </div>
              <span className="text-lg font-black tracking-tighter text-text-primary uppercase flex items-center gap-1.5">
                <span className="text-brand-green">All Bangla</span>
                <span className="text-brand-red">News</span>
                <span className="text-brand-green">Feed</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs">
              The most comprehensive directory of Bangladeshi news sources. 
              Providing quick access to daily newspapers, online portals, 
              TV channels, and more since 2024.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { icon: <Facebook className="w-4 h-4" />, href: "#" },
              { icon: <Twitter className="w-4 h-4" />, href: "#" },
              { icon: <Instagram className="w-4 h-4" />, href: "#" },
              { icon: <Youtube className="w-4 h-4" />, href: "#" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                className="p-2.5 border border-border-subtle hover:border-brand-red hover:text-brand-red transition-all rounded-brand-md text-text-muted"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-text-primary font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm opacity-80">
            <li><Link to="/fifa-world-cup-live" className="hover:text-brand-red transition-colors font-semibold text-brand-red">FIFA Live ⚽</Link></li>
            <li><Link to="/bangla-newspapers" className="hover:text-brand-red transition-colors">Daily Bangla Newspapers</Link></li>
            <li><Link to="/online-news-portals" className="hover:text-brand-red transition-colors">Online News Portals</Link></li>
            <li><Link to="/live-tv-channels" className="hover:text-brand-red transition-colors">Live TV Channels</Link></li>
            <li><Link to="/bd-job-sites" className="hover:text-brand-red transition-colors">BD Job Sites</Link></li>
            <li><Link to="/international-news" className="hover:text-brand-red transition-colors">International News</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-text-primary font-bold mb-6 uppercase tracking-wider text-xs">Support</h4>
          <ul className="flex flex-col gap-3 text-sm opacity-80">
            <li><Link to="/about" className="hover:text-brand-red transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-red transition-colors">Contact Support</Link></li>
            <li><Link to="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-brand-red transition-colors">Terms of Service</Link></li>
            <li><Link to="/add-newspaper" className="hover:text-brand-red transition-colors">Add Your Newspaper</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">
        <p>© {currentYear} All Bangla News Feed. All Rights Reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/sitemap" className="hover:text-brand-red transition-colors">Sitemap</Link>
          <a href="/sitemap.xml" className="hover:text-brand-red transition-colors">XML Sitemap</a>
          <Link to="/privacy" className="hover:text-brand-red transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-brand-red transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
