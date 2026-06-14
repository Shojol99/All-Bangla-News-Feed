import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, Newspaper, Moon, Sun, PlusCircle, Shield, User as UserIcon, LogOut, ChevronDown, Globe, Tv, MapPin, Briefcase, Trophy, Cpu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, signOut } from '../firebase';
import AuthModal from './AuthModal';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: 'FIFA Live ⚽', href: '/fifa-world-cup-live' },
    { name: 'Weather News', href: '/weather-news' },
    { name: 'Daily Bangla', href: '/bangla-newspapers' },
    { name: 'Online Bangla', href: '/online-news-portals' },
    { name: 'Live TV', href: '/live-tv-channels' },
    { name: 'International', href: '/international-news' },
    { name: 'News', href: '/news' },
  ];

  const categories = [
    { name: "Daily Bangla Newspapers", path: "/bangla-newspapers", count: "50+", icon: <Newspaper className="w-4 h-4" /> },
    { name: "Online News Portals", path: "/online-news-portals", count: "120+", icon: <Globe className="w-4 h-4" /> },
    { name: "Live TV Channels", path: "/live-tv-channels", count: "35+", icon: <Tv className="w-4 h-4" /> },
    { name: "Local & District News", path: "/local-news", count: "250+", icon: <MapPin className="w-4 h-4" /> },
    { name: "BD Job Sites", path: "/bd-job-sites", count: "25+", icon: <Briefcase className="w-4 h-4" /> },
    { name: "International News", path: "/international-news", count: "45+", icon: <Globe className="w-4 h-4" /> },
    { name: "Sports News", path: "/sports-news", count: "15+", icon: <Trophy className="w-4 h-4" /> },
    { name: "Tech News", path: "/tech-news", count: "", icon: <Cpu className="w-4 h-4" /> }
  ];

  const isAdmin = user?.email === 'ahamedshahjalal170@gmail.com' || user?.email === 'shojol@admin.com';

  return (
    <>
      <nav
        className={`transition-all duration-300 border-b border-border-subtle ${
          isScrolled
            ? 'bg-bg-main shadow-brand-lg py-2'
            : 'bg-bg-main/95 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                  isCategoriesOpen ? 'text-brand-red' : 'text-text-primary hover:text-brand-red'
                }`}
              >
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 w-72 bg-bg-surface border border-border-subtle rounded-brand-xl shadow-brand-premium p-2 z-50"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center justify-between p-3 rounded-brand-lg hover:bg-bg-main group transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-text-muted group-hover:text-brand-red transition-colors">
                              {cat.icon}
                            </div>
                            <span className="text-sm font-bold text-text-primary group-hover:text-brand-red transition-colors">
                              {cat.name}
                            </span>
                          </div>
                          {cat.count && (
                            <span className="text-[10px] font-black text-text-muted bg-bg-surface px-2 py-0.5 rounded-full border border-border-subtle group-hover:border-brand-red/30 transition-colors">
                              {cat.count}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    className={`text-sm font-bold transition-colors ${
                      location.pathname === '/' ? 'text-text-primary hover:text-brand-red' : 'text-text-primary hover:text-brand-red'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`text-sm font-bold transition-colors ${
                      location.pathname === link.href ? 'text-brand-red' : 'text-text-primary hover:text-brand-red'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </motion.div>
            ))}
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border-subtle">
              <Link
                to="/post-news"
                className="px-4 py-2 bg-brand-green text-text-on-brand rounded-brand-md text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-brand-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Post News
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 bg-bg-surface rounded-brand-md text-text-primary hover:bg-brand-gold hover:text-text-on-brand transition-all border border-border-subtle"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-surface rounded-full border border-border-subtle">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-text-primary max-w-[100px] truncate">{user.displayName || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-text-primary hover:text-brand-red transition-colors opacity-60"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)} 
                  className="px-6 py-2 bg-text-primary text-text-on-brand rounded-brand-md text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-1.5 lg:hidden ml-auto">
            <Link
              to="/post-news"
              className="p-1.5 bg-brand-green text-text-on-brand rounded-brand-md"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-1.5 text-text-primary"
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              className="p-1.5 text-text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-bg-main border-t border-border-subtle px-4 py-6 flex flex-col gap-4 overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="space-y-2">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Main Menu</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-bold text-text-primary hover:text-brand-red py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-border-subtle space-y-2">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">News Categories</p>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 bg-bg-surface rounded-brand-lg border border-border-subtle"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-brand-red">{cat.icon}</div>
                        <span className="text-sm font-bold text-text-primary">{cat.name}</span>
                      </div>
                      {cat.count && (
                        <span className="text-[10px] font-black text-text-muted bg-bg-main px-2 py-0.5 rounded-full border border-border-subtle">
                          {cat.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              {user ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-border-subtle">
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-text-primary">{user.displayName || 'User'}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="text-lg font-bold text-brand-red text-left">Logout</button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }} 
                  className="text-lg font-bold text-brand-red text-left"
                >
                  Login / Signup
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
