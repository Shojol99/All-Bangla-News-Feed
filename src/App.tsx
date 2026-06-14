import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
import SEOContent from './components/SEOContent';
import AdBanner from './components/AdBanner';
import { newsData, categories } from './data/newspapers';
import { ArrowUp, Sparkles, Loader2 } from 'lucide-react';
import { NewsViewerProvider } from './context/NewsViewerContext';
import { auth, db, doc, setDoc, serverTimestamp } from './firebase';

// Lazy load pages for performance
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const PostNewsPage = lazy(() => import('./pages/PostNewsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactSupport = lazy(() => import('./pages/ContactSupport'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AddNewspaperPage = lazy(() => import('./pages/AddNewspaperPage'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const WeatherNews = lazy(() => import('./pages/WeatherNews'));
const FifaWorldCupLive = lazy(() => import('./pages/FifaWorldCupLive'));

// Lazy load heavy components
const Hero = lazy(() => import('./components/Hero'));
const CategorySection = lazy(() => import('./components/CategorySection'));
const TopTenSection = lazy(() => import('./components/TopTenSection'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
      <p className="text-text-muted font-bold animate-pulse">Loading Feed...</p>
    </div>
  );
}

function UserSync() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', user.uid);
        try {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: (user.email === 'ahamedshahjalal170@gmail.com' || user.email === 'shojol@admin.com') ? 'admin' : 'user',
            status: 'active',
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp() // setDoc with merge: true won't overwrite if it exists
          }, { merge: true });
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Handle hash links (e.g., #daily-bangla)
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Always scroll to top on new page visit
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return newsData;
    const query = searchQuery.toLowerCase();
    return newsData.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Top 10 categories
  const topDaily = newsData.filter(item => item.category === 'daily-bangla' && item.isTop);
  const topOnline = newsData.filter(item => item.category === 'online-bangla' && item.isTop);
  const topTV = newsData.filter(item => item.category === 'live-tv' && item.isTop);
  const topLocal = newsData.filter(item => item.category === 'local-district' && item.isTop);

  return (
    <main>
      <SEO />
      <Suspense fallback={<div className="h-96 bg-bg-surface animate-pulse rounded-brand-xl" />}>
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </Suspense>
      
      {/* Search Bar (Mobile/Sticky) */}
      <div className="sticky top-16 z-40 bg-bg-main/80 backdrop-blur-md border-b border-border-subtle py-4 px-4 md:hidden">
        <input
          type="text"
          placeholder="Search news sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-brand-md bg-bg-surface border border-border-subtle focus:ring-2 focus:ring-brand-red outline-none text-text-primary"
        />
      </div>

      {/* Top 10 Grid */}
      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-brand-red/10 rounded-brand-md">
              <Sparkles className="w-8 h-8 text-brand-red" />
            </div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              Featured <span className="text-brand-red">Top 10</span>
            </h2>
          </div>
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-96 bg-bg-surface animate-pulse" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TopTenSection title="Daily Bangla" items={topDaily} />
              <TopTenSection title="Online Bangla" items={topOnline} />
              <TopTenSection title="Live TV" items={topTV} />
              <TopTenSection title="Local News" items={topLocal} />
            </div>
          </Suspense>
        </div>
      )}

      {/* Dynamic Content Sections */}
      <div className="pb-20">
        <Suspense fallback={<div className="space-y-12 px-4 max-w-7xl mx-auto py-12"><div className="h-64 bg-bg-surface animate-pulse rounded-brand-xl" /><div className="h-64 bg-bg-surface animate-pulse rounded-brand-xl" /></div>}>
          {categories.map((category) => {
            const categoryItems = filteredData.filter(item => item.category === category.id);
            if (categoryItems.length === 0) return null;
            
            return (
              <CategorySection
                key={category.id}
                id={category.id}
                slug={category.slug}
                name={category.name}
                icon={category.icon}
                items={categoryItems}
              />
            );
          })}
        </Suspense>
        
        {filteredData.length === 0 && (
          <div className="py-40 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-text-muted"
            >
              <p className="text-2xl font-bold mb-2">No results found</p>
              <p>Try searching for something else</p>
            </motion.div>
          </div>
        )}

        {!searchQuery && <SEOContent />}
      </div>
    </main>
  );
}

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  // ... (rest of state)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark'; // Only dark if explicitly saved as dark
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <HelmetProvider>
      <Router>
        <NewsViewerProvider>
          <UserSync />
          <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} showBackToTop={showBackToTop} scrollToTop={scrollToTop} />
        </NewsViewerProvider>
      </Router>
    </HelmetProvider>
  );
}

function AppContent({ isDarkMode, toggleTheme, showBackToTop, scrollToTop }: any) {
  const { pathname } = useLocation();
  const isAdminPage = pathname === '/admin';
  const isFifaPage = pathname === '/fifa-world-cup-live';

  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-300 selection:bg-brand-red selection:text-text-on-brand">
      <ScrollToTop />
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className={isFifaPage ? "pt-0" : "pt-32 sm:pt-40 md:pt-48 lg:pt-56"}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/weather-news" element={<WeatherNews />} />
            <Route path="/post-news" element={<PostNewsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactSupport />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/add-newspaper" element={<AddNewspaperPage />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/fifa-world-cup-live" element={<FifaWorldCupLive />} />
            <Route path="/:slug" element={<CategoryPage />} />
          </Routes>
        </Suspense>
      </div>

      {!isAdminPage && !isFifaPage && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <AdBanner position="footer" currentPage="all" />
        </div>
      )}

      <Footer />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-6 p-3 bg-brand-red text-text-on-brand rounded-full shadow-brand-premium hover:bg-brand-red/90 transition-all z-50 group"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
