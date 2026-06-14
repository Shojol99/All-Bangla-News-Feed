import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Check, X, Clock, AlertCircle, User, MapPin, ExternalLink, 
  Trash2, Eye, ChevronDown, ChevronUp, Loader2, Users, Mail, 
  LayoutDashboard, Megaphone, PlusCircle, Download, Ban, 
  CheckCircle2, Image as ImageIcon, Link as LinkIcon, Type, 
  Globe, Send, LogOut, Menu, Newspaper, RefreshCw
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, doc, 
  deleteDoc, db, auth, addDoc, serverTimestamp, getDocs,
  where, Timestamp, signInWithEmailAndPassword, signOut,
  handleFirestoreError, OperationType
} from '../firebase';
import { categories } from '../data/newspapers';

interface NewsArticle {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  location?: string;
  category: string;
  imageUrl?: string;
  authorEmail?: string;
  authorName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked' | 'suspended';
  createdAt: any;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}

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
  createdAt: any;
  expiresAt?: any;
}

type AdminTab = 'overview' | 'users' | 'contacts' | 'news-submissions' | 'post-news' | 'ads';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data States
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adToDelete, setAdToDelete] = useState<Advertisement | null>(null);
  const [contactToDelete, setContactToDelete] = useState<ContactSubmission | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);

  // Form States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adForm, setAdForm] = useState<Partial<Advertisement & { duration: number }>>({
    type: 'image',
    position: 'hero',
    targetPages: ['all'],
    isActive: true,
    duration: 7
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    // Real-time Listeners
    const unsubNews = onSnapshot(
      query(collection(db, 'news'), orderBy('createdAt', 'desc')), 
      (snap) => {
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle)));
        setLoading(false);
      },
      (err) => {
        console.error("News listener error:", err);
        setLoading(false);
      }
    );

    const unsubUsers = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')), 
      (snap) => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile)));
      },
      (err) => console.error("Users listener error:", err)
    );

    const unsubContacts = onSnapshot(
      query(collection(db, 'contacts'), orderBy('createdAt', 'desc')), 
      (snap) => {
        setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactSubmission)));
      },
      (err) => console.error("Contacts listener error:", err)
    );

    const unsubAds = onSnapshot(
      query(collection(db, 'ads'), orderBy('createdAt', 'desc')), 
      (snap) => {
        setAds(snap.docs.map(d => ({ id: d.id, ...d.data() } as Advertisement)));
      },
      (err) => console.error("Ads listener error:", err)
    );

    return () => {
      unsubNews();
      unsubUsers();
      unsubContacts();
      unsubAds();
    };
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Use Firebase Auth for the admin login
      // We use a dummy email shojol@admin.com for the username 'Shojol'
      const adminEmail = username.toLowerCase() === 'shojol' ? 'shojol@admin.com' : username;
      
      await signInWithEmailAndPassword(auth, adminEmail, password);
      
      setIsLoggedIn(true);
      localStorage.setItem('admin_auth', 'true');
    } catch (err: any) {
      console.error("Admin login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid username or password. If you are the owner, please ensure the user "shojol@admin.com" is created in your Firebase Console.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled in your Firebase Console.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      localStorage.removeItem('admin_auth');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // User Actions
  const handleUserStatus = async (userId: string, status: UserProfile['status']) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status });
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  // News Actions
  const handleNewsStatus = async (id: string, status: NewsArticle['status']) => {
    try {
      await updateDoc(doc(db, 'news', id), { 
        status,
        publishedAt: status === 'approved' ? serverTimestamp() : null
      });
    } catch (err) {
      console.error("Error updating news status:", err);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news', id));
      setArticleToDelete(null);
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    // If it's an admin post, maybe we want to go to post-news tab, but user can edit from whichever tab they are in
    // For now, let's just use a modal for editing
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      setContactToDelete(null);
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // Contact Actions
  const downloadContactsCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Date'];
    const rows = contacts.map(c => [
      c.name,
      c.email,
      c.subject,
      c.message.replace(/,/g, ' '),
      c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ad Actions
  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.targetPages || adForm.targetPages.length === 0) {
      setError("Please select at least one target page.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!auth.currentUser) {
        throw new Error("You must be signed in to save ads. Please log in using the Admin Login form or Google Sign In.");
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (adForm.duration || 7));

      const adData = {
        title: adForm.title,
        type: adForm.type,
        position: adForm.position,
        targetPages: adForm.targetPages,
        imageUrl: adForm.imageUrl || null,
        linkUrl: adForm.linkUrl || null,
        textContent: adForm.textContent || null,
        isActive: adForm.isActive,
        expiresAt: Timestamp.fromDate(expirationDate)
      };

      if (editingAdId) {
        await updateDoc(doc(db, 'ads', editingAdId), adData);
      } else {
        await addDoc(collection(db, 'ads'), {
          ...adData,
          createdAt: serverTimestamp()
        });
      }
      
      setAdForm({ type: 'image', position: 'hero', targetPages: ['all'], isActive: true, duration: 7 });
      setEditingAdId(null);
    } catch (err: any) {
      console.error("Error saving ad:", err);
      setError(`Error saving ad: ${err.message || "Please check your internet connection and ensure you are signed in as an admin."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAd = (ad: Advertisement) => {
    setEditingAdId(ad.id);
    setAdForm({
      title: ad.title,
      type: ad.type,
      position: ad.position,
      targetPages: ad.targetPages,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      textContent: ad.textContent,
      isActive: ad.isActive,
      duration: 7 // Default to 7 days for extension
    });
    setActiveTab('ads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRepublishAd = async (ad: Advertisement) => {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // Default 7 days extension

      await updateDoc(doc(db, 'ads', ad.id), {
        isActive: true,
        expiresAt: Timestamp.fromDate(expirationDate)
      });
    } catch (err) {
      console.error("Error republishing ad:", err);
    }
  };

  const toggleAdStatus = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'ads', id), { isActive: !current });
  };

  const deleteAd = async (id: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'ads', id));
      setAdToDelete(null);
    } catch (err) {
      console.error("Error deleting ad:", err);
      handleFirestoreError(err, OperationType.DELETE, `ads/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTargetPage = (page: string) => {
    const current = adForm.targetPages || [];
    if (page === 'all') {
      setAdForm({ ...adForm, targetPages: ['all'] });
      return;
    }
    
    let next = current.filter(p => p !== 'all');
    if (next.includes(page)) {
      next = next.filter(p => p !== page);
    } else {
      next = [...next, page];
    }
    
    if (next.length === 0) next = ['all'];
    setAdForm({ ...adForm, targetPages: next });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main">
        <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
        <p className="text-text-secondary font-bold">Loading dashboard...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-bg-surface p-12 rounded-brand-xl border border-border-subtle text-center shadow-brand-premium"
        >
          <div className="w-20 h-20 bg-brand-red/10 rounded-brand-md flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-brand-red" />
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-2 tracking-tight">Admin Login</h1>
          <p className="text-text-secondary mb-8 font-medium">Please enter your credentials to access the dashboard.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-brand-md flex items-center gap-3 text-brand-red text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
              />
            </div>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-brand-red text-text-on-brand rounded-brand-md font-black text-sm uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-surface border-r border-border-subtle transform transition-transform duration-300 lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-brand-red" />
            <span className="text-xl font-black tracking-tighter uppercase">
              <span className="text-brand-green">Admin</span><span className="text-brand-red">Panel</span>
            </span>
          </div>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">BanglaNewsHub Control</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'users', name: 'Total Users', icon: Users },
            { id: 'contacts', name: 'Contact Forms', icon: Mail },
            { id: 'news-submissions', name: 'News Submissions', icon: Clock },
            { id: 'post-news', name: 'Post New News', icon: PlusCircle },
            { id: 'ads', name: 'Ad Management', icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-brand-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-red text-text-on-brand shadow-brand-md' 
                  : 'text-text-secondary hover:bg-bg-main hover:text-brand-red'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border-subtle">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-brand-lg text-sm font-bold text-brand-red hover:bg-brand-red/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Sidebar />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-bg-surface border-b border-border-subtle p-4 flex items-center justify-between">
        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 text-text-primary">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-black text-brand-red uppercase tracking-tighter">Admin Panel</span>
        <div className="w-10" />
      </div>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-32 lg:pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">Dashboard <span className="text-brand-red">Overview</span></h2>
                <div className="text-xs font-bold text-text-muted bg-bg-surface px-4 py-2 rounded-full border border-border-subtle">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: users.length, icon: Users, color: 'text-brand-green', bg: 'bg-brand-green/10' },
                  { label: 'Pending News', value: articles.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                  { label: 'Total News', value: articles.length, icon: Newspaper, color: 'text-brand-red', bg: 'bg-brand-red/10' },
                  { label: 'Contact Forms', value: contacts.length, icon: Mail, color: 'text-text-primary', bg: 'bg-bg-surface' },
                ].map((stat, i) => (
                  <div key={i} className="bg-bg-surface p-6 rounded-brand-xl border border-border-subtle shadow-brand-sm">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-brand-md flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-text-primary">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-bg-surface p-8 rounded-brand-xl border border-border-subtle shadow-brand-sm">
                  <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-gold" />
                    Recent Submissions
                  </h3>
                  <div className="space-y-4">
                    {articles.slice(0, 5).map(article => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-bg-main rounded-brand-lg border border-border-subtle">
                        <div className="min-w-0">
                          <p className="font-bold text-text-primary truncate">{article.title}</p>
                          <p className="text-xs text-text-muted">{article.authorEmail}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                          article.status === 'approved' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-gold/10 text-brand-gold'
                        }`}>
                          {article.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-bg-surface p-8 rounded-brand-xl border border-border-subtle shadow-brand-sm">
                  <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-green" />
                    New Users
                  </h3>
                  <div className="space-y-4">
                    {users.slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center gap-4 p-4 bg-bg-main rounded-brand-lg border border-border-subtle">
                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} className="w-10 h-10 rounded-full" alt="" />
                        <div className="min-w-0">
                          <p className="font-bold text-text-primary truncate">{user.displayName || 'User'}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-text-primary tracking-tight">User <span className="text-brand-green">Management</span></h2>
              <div className="bg-bg-surface rounded-brand-xl border border-border-subtle overflow-hidden shadow-brand-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-main border-b border-border-subtle">
                        <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">User</th>
                        <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Joined</th>
                        <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-bg-main/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} className="w-10 h-10 rounded-full border border-border-subtle" alt="" />
                              <div>
                                <p className="font-bold text-text-primary">{user.displayName || 'User'}</p>
                                <p className="text-xs text-text-muted">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                              user.role === 'admin' ? 'bg-brand-red/10 text-brand-red' : 'bg-bg-main text-text-muted'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                              user.status === 'active' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-text-muted font-bold">
                            {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {user.status === 'active' ? (
                                <>
                                  <button 
                                    onClick={() => handleUserStatus(user.id, 'suspended')}
                                    className="p-2 text-brand-gold hover:opacity-80 transition-colors"
                                    title="Suspend User"
                                  >
                                    <Clock className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => handleUserStatus(user.id, 'blocked')}
                                    className="p-2 text-text-muted hover:text-brand-red transition-colors"
                                    title="Block User"
                                  >
                                    <Ban className="w-5 h-5" />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleUserStatus(user.id, 'active')}
                                  className="p-2 text-brand-green hover:opacity-80 transition-colors"
                                  title="Activate User"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">Contact <span className="text-brand-red">Submissions</span></h2>
                <button 
                  onClick={downloadContactsCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-green text-text-on-brand rounded-brand-md font-black text-xs uppercase tracking-widest shadow-brand-md hover:opacity-90 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {contacts.map((contact) => (
                  <div key={contact.id} className="group bg-bg-surface p-8 rounded-brand-xl border border-border-subtle shadow-brand-sm hover:border-brand-red transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                      <div>
                        <h3 className="text-xl font-black text-text-primary mb-1">{contact.subject}</h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-text-muted">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {contact.name}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleString() : 'N/A'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setContactToDelete(contact)}
                        className="p-3 bg-bg-main text-text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-brand-md transition-all self-start md:self-center opacity-0 group-hover:opacity-100"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 bg-bg-main rounded-brand-lg border border-border-subtle text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </div>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="text-center py-20 bg-bg-surface rounded-brand-xl border-2 border-dashed border-border-subtle">
                    <Mail className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary font-bold">No contact submissions yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* News Submissions Tab */}
          {activeTab === 'news-submissions' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">News <span className="text-brand-gold">Moderation</span></h2>
                <div className="flex items-center gap-2 bg-bg-surface p-1 rounded-brand-lg border border-border-subtle">
                  <div className="text-xs font-bold text-text-muted px-4 py-2">
                    Submissions: {articles.filter(a => a.authorName !== 'Admin').length}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {articles.filter(a => a.authorName !== 'Admin').length === 0 && (
                  <div className="text-center py-20 bg-bg-surface rounded-brand-xl border-2 border-dashed border-border-subtle">
                    <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-4" />
                    <p className="text-text-secondary font-bold">No news submissions yet.</p>
                  </div>
                )}
                {articles.filter(a => a.authorName !== 'Admin').map((article) => (
                  <div key={article.id} className="bg-bg-surface rounded-brand-xl border border-border-subtle overflow-hidden shadow-brand-sm">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        {article.imageUrl && (
                          <div className="w-full md:w-64 h-48 rounded-brand-lg overflow-hidden shrink-0 shadow-brand-lg">
                            <img 
                              src={article.imageUrl} 
                              alt="" 
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              article.status === 'approved' ? 'bg-brand-green/10 text-brand-green' :
                              article.status === 'rejected' ? 'bg-brand-red/10 text-brand-red' :
                              'bg-brand-gold/10 text-brand-gold'
                            }`}>
                              {article.status}
                            </span>
                            <span className="text-xs text-text-muted font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleString() : 'Recently'}
                            </span>
                            <span className="text-xs font-black text-brand-red bg-brand-red/10 px-2 py-0.5 rounded border border-brand-red/20 uppercase">
                              {article.category}
                            </span>
                          </div>
                          <h2 className="text-2xl font-black text-text-primary mb-3 leading-tight">{article.title}</h2>
                          <p className="text-text-secondary text-sm mb-6 leading-relaxed line-clamp-2">{article.shortDescription}</p>
                          
                          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-text-muted">
                            <span className="flex items-center gap-2"><User className="w-3 h-3" /> {article.authorEmail}</span>
                            {article.location && <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {article.location}</span>}
                          </div>
                        </div>
                        
                        <div className="flex md:flex-col items-center justify-center gap-3 shrink-0 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-border-subtle md:pl-8">
                          {article.status === 'pending' ? (
                            <>
                              <button onClick={() => handleNewsStatus(article.id, 'approved')} title="Approve" className="w-12 h-12 bg-brand-green text-text-on-brand rounded-brand-md flex items-center justify-center hover:bg-brand-green/90 shadow-brand-lg"><Check className="w-6 h-6" /></button>
                              <button onClick={() => handleNewsStatus(article.id, 'rejected')} title="Reject" className="w-12 h-12 bg-brand-red text-text-on-brand rounded-brand-md flex items-center justify-center hover:bg-brand-red/90 shadow-brand-lg"><X className="w-6 h-6" /></button>
                            </>
                          ) : (
                            <button onClick={() => handleNewsStatus(article.id, 'pending')} title="Move to Pending" className="w-12 h-12 bg-bg-main text-text-secondary rounded-brand-md flex items-center justify-center border border-border-subtle"><Clock className="w-6 h-6" /></button>
                          )}
                          <button onClick={() => handleEditArticle(article)} title="Edit Article" className="w-12 h-12 bg-bg-main text-brand-gold rounded-brand-md flex items-center justify-center border border-border-subtle"><Newspaper className="w-6 h-6" /></button>
                          <button onClick={() => setArticleToDelete(article)} title="Delete Article" className="w-12 h-12 bg-bg-main text-brand-red rounded-brand-md flex items-center justify-center border border-border-subtle"><Trash2 className="w-6 h-6" /></button>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border-subtle">
                        <button 
                          onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                          className="flex items-center gap-2 text-sm font-black text-brand-red hover:underline uppercase tracking-widest"
                        >
                          {expandedId === article.id ? <>Hide Details <ChevronUp className="w-4 h-4" /></> : <>Show Full Details <ChevronDown className="w-4 h-4" /></>}
                        </button>
                        
                        <AnimatePresence>
                          {expandedId === article.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                              <div className="mt-6 bg-bg-main rounded-brand-xl border border-border-subtle overflow-hidden shadow-brand-lg">
                                {/* Nice full news details overview */}
                                {article.imageUrl && (
                                  <div className="w-full h-80 overflow-hidden">
                                    <img src={article.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  </div>
                                )}
                                <div className="p-8 md:p-12">
                                  <h1 className="text-4xl font-black text-text-primary mb-6 leading-tight">{article.title}</h1>
                                  <div className="flex items-center gap-6 mb-8 text-sm font-bold text-text-muted">
                                    <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded uppercase tracking-widest">{article.category}</span>
                                    <span>{article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Today'}</span>
                                  </div>
                                  <div className="mb-10 p-6 bg-bg-surface border-l-4 border-brand-red rounded-r-brand-md italic text-lg text-text-secondary">
                                    {article.shortDescription}
                                  </div>
                                  <div className="prose prose-slate dark:prose-invert max-w-none text-text-secondary leading-relaxed text-lg whitespace-pre-wrap font-medium">
                                    {article.fullDescription}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post News Tab */}
          {activeTab === 'post-news' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">Admin <span className="text-brand-red">News Portal</span></h2>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-brand-red/10 border border-brand-red/20 rounded-brand-md text-brand-red text-xs font-bold uppercase tracking-widest">
                    Posted News: {articles.filter(a => a.authorName === 'Admin').length}
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 md:p-12 shadow-brand-premium">
                <div className="flex items-center gap-3 mb-8">
                  <PlusCircle className="w-8 h-8 text-brand-red" />
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Post New Article</h3>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-brand-red/10 border border-brand-red/20 rounded-brand-md flex items-center gap-3 text-brand-red text-sm font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <form className="space-y-8" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setError('');
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  try {
                    await addDoc(collection(db, 'news'), {
                      title: data.get('title'),
                      shortDescription: data.get('shortDescription'),
                      fullDescription: data.get('fullDescription'),
                      location: data.get('location'),
                      category: data.get('category'),
                      imageUrl: data.get('imageUrl'),
                      status: 'approved',
                      authorId: auth.currentUser?.uid,
                      authorEmail: auth.currentUser?.email,
                      authorName: 'Admin',
                      createdAt: serverTimestamp(),
                      publishedAt: serverTimestamp()
                    });
                    form.reset();
                    alert('News published successfully!');
                  } catch (err: any) {
                    console.error(err);
                    setError('Failed to publish news: ' + err.message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">News Title</label>
                      <input name="title" required className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary" placeholder="Enter headline..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Category</label>
                      <select name="category" required className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary">
                        {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Location</label>
                      <input name="location" className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary" placeholder="e.g., Dhaka, Bangladesh" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Image URL</label>
                      <input name="imageUrl" type="url" className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Short Description</label>
                    <textarea name="shortDescription" required rows={3} className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary resize-none" placeholder="Catchy summary..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Full Content</label>
                    <textarea name="fullDescription" required rows={10} className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary resize-none" placeholder="Write story here..." />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-brand-red text-text-on-brand rounded-brand-md font-black text-lg uppercase tracking-widest shadow-brand-lg flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> Publish News</>}
                  </button>
                </form>
              </div>

              {/* List of Published news */}
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-3">
                  <Newspaper className="w-8 h-8 text-brand-red" />
                  Your Published News
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {articles.filter(a => a.authorName === 'Admin').map(article => (
                    <div key={article.id} className="bg-bg-surface p-6 rounded-brand-xl border border-border-subtle flex flex-col md:flex-row gap-6 shadow-brand-sm group hover:border-brand-red transition-all">
                      {article.imageUrl && (
                        <div className="w-full md:w-32 h-24 rounded-brand-lg overflow-hidden shrink-0">
                          <img src={article.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-brand-red/70 uppercase tracking-widest">{article.category}</span>
                          <span className="text-[10px] font-bold text-text-muted">{article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                        </div>
                        <h4 className="font-black text-text-primary text-lg truncate mb-1">{article.title}</h4>
                        <p className="text-xs text-text-secondary line-clamp-1">{article.shortDescription}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditArticle(article)} className="p-3 bg-bg-main text-brand-gold hover:bg-brand-gold/10 rounded-brand-md transition-colors">
                          <Newspaper className="w-5 h-5" />
                        </button>
                        <button onClick={() => setArticleToDelete(article)} className="p-3 bg-bg-main text-brand-red hover:bg-brand-red/10 rounded-brand-md transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {articles.filter(a => a.authorName === 'Admin').length === 0 && (
                    <div className="text-center py-20 bg-bg-surface rounded-brand-xl border-2 border-dashed border-border-subtle">
                      <p className="text-text-muted font-bold">You haven't posted any news yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ads Tab */}
          {activeTab === 'ads' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-text-primary tracking-tight">Advertising <span className="text-brand-green">Management</span></h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-bg-surface p-8 rounded-brand-xl border border-border-subtle shadow-brand-sm sticky top-8">
                    <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-brand-red" />
                      {editingAdId ? 'Edit Advertisement' : 'Create New Ad'}
                    </h3>
                    <form className="space-y-6" onSubmit={handleAdSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Ad Title</label>
                        <input required value={adForm.title || ''} onChange={e => setAdForm({...adForm, title: e.target.value})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-muted uppercase">Type</label>
                          <select value={adForm.type} onChange={e => setAdForm({...adForm, type: e.target.value as any})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm">
                            <option value="image">Image</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-muted uppercase">Position</label>
                          <select value={adForm.position} onChange={e => setAdForm({...adForm, position: e.target.value as any})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm">
                            <option value="hero">Hero Banner</option>
                            <option value="footer">Footer Banner</option>
                            <option value="sidebar-left">Left Sidebar</option>
                            <option value="sidebar-right">Right Sidebar</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Duration (Days)</label>
                        <select value={adForm.duration} onChange={e => setAdForm({...adForm, duration: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm">
                          <option value={1}>1 Day</option>
                          <option value={7}>7 Days</option>
                          <option value={30}>30 Days</option>
                          <option value={90}>90 Days</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Target Pages</label>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-bg-main border border-border-subtle rounded-brand-md max-h-40 overflow-y-auto">
                          {['all', 'home', 'news-page', ...categories.map(c => c.slug)].map(page => (
                            <label key={page} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-brand-red transition-colors">
                              <input 
                                type="checkbox" 
                                checked={adForm.targetPages?.includes(page)} 
                                onChange={() => toggleTargetPage(page)}
                                className="rounded border-border-subtle text-brand-red focus:ring-brand-red"
                              />
                              {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')}
                            </label>
                          ))}
                        </div>
                      </div>
                      {adForm.type === 'image' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-muted uppercase">Image URL</label>
                          <input required type="url" value={adForm.imageUrl || ''} onChange={e => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-muted uppercase">Text Content</label>
                          <textarea required value={adForm.textContent || ''} onChange={e => setAdForm({...adForm, textContent: e.target.value})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm resize-none" rows={3} />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Link URL</label>
                        <input type="url" value={adForm.linkUrl || ''} onChange={e => setAdForm({...adForm, linkUrl: e.target.value})} className="w-full px-4 py-3 bg-bg-main border border-border-subtle rounded-brand-md text-sm" />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-brand-red text-text-on-brand rounded-brand-md font-black text-xs uppercase tracking-widest shadow-brand-md">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingAdId ? 'Update Ad' : 'Publish Ad')}
                      </button>
                      {editingAdId && (
                        <button type="button" onClick={() => { setEditingAdId(null); setAdForm({ type: 'image', position: 'hero', targetPages: ['all'], isActive: true, duration: 7 }); }} className="w-full py-2 text-text-muted font-bold text-xs uppercase tracking-widest hover:text-brand-red transition-colors">
                          Cancel Edit
                        </button>
                      )}
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {ads.map(ad => (
                    <div key={ad.id} className={`bg-bg-surface p-6 rounded-brand-xl border border-border-subtle shadow-brand-sm ${!ad.isActive && 'opacity-60'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-brand-md ${ad.isActive ? 'bg-brand-green/10 text-brand-green' : 'bg-text-muted/10 text-text-muted'}`}>
                            {ad.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <Type className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-text-primary">{ad.title}</h4>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{ad.position} • {ad.targetPages.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleAdStatus(ad.id, ad.isActive)} className={`p-2 rounded-brand-md transition-colors ${ad.isActive ? 'text-brand-green hover:bg-brand-green/10' : 'text-text-muted hover:bg-bg-main'}`}>
                            {ad.isActive ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                          </button>
                          <button onClick={() => setAdToDelete(ad)} className="p-2 text-brand-red hover:bg-brand-red/10 rounded-brand-md transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {ad.type === 'image' && ad.imageUrl && (
                        <div className="w-full h-32 rounded-brand-lg overflow-hidden border border-border-subtle mb-4">
                          <img src={ad.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      {ad.type === 'text' && (
                        <div className="p-4 bg-bg-main rounded-brand-lg border border-border-subtle text-sm text-text-secondary mb-4">
                          {ad.textContent}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Expires At</span>
                            <span className={`text-xs font-bold ${ad.expiresAt?.toDate && new Date() > ad.expiresAt.toDate() ? 'text-brand-red' : 'text-text-secondary'}`}>
                              {ad.expiresAt?.toDate ? ad.expiresAt.toDate().toLocaleString() : 'Never'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditAd(ad)} className="px-3 py-1.5 bg-bg-main border border-border-subtle rounded-brand-md text-xs font-bold text-text-secondary hover:text-brand-red transition-colors flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Edit
                          </button>
                          {ad.expiresAt?.toDate && new Date() > ad.expiresAt.toDate() && (
                            <button onClick={() => handleRepublishAd(ad)} className="px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-brand-md text-xs font-bold hover:bg-brand-green/20 transition-colors flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" /> Republish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal for Ads */}
      <AnimatePresence>
        {adToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdToDelete(null)} className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-bg-surface p-8 rounded-brand-2xl border border-border-subtle shadow-brand-premium">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-8 h-8 text-brand-red" /></div>
              <h3 className="text-2xl font-black text-text-primary text-center mb-2 tracking-tight">Delete Advertisement?</h3>
              <p className="text-text-secondary text-center mb-8">Are you sure you want to delete <span className="font-bold text-text-primary">"{adToDelete.title}"</span>?</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setAdToDelete(null)} className="py-4 px-6 bg-bg-main border border-border-subtle rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-bg-surface transition-all">Cancel</button>
                <button onClick={() => deleteAd(adToDelete.id)} disabled={isSubmitting} className="py-4 px-6 bg-brand-red text-text-on-brand rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg flex items-center justify-center gap-2">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Now'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal for Contacts */}
      <AnimatePresence>
        {contactToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setContactToDelete(null)} className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-bg-surface p-8 rounded-brand-2xl border border-border-subtle shadow-brand-premium">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-8 h-8 text-brand-red" /></div>
              <h3 className="text-2xl font-black text-text-primary text-center mb-2 tracking-tight">Delete Submission?</h3>
              <p className="text-text-secondary text-center mb-8">Are you sure you want to delete <span className="font-bold text-text-primary">"{contactToDelete.subject}"</span>?</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setContactToDelete(null)} className="py-4 px-6 bg-bg-main border border-border-subtle rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-bg-surface transition-all">Cancel</button>
                <button onClick={() => handleDeleteContact(contactToDelete.id)} disabled={isSubmitting} className="py-4 px-6 bg-brand-red text-text-on-brand rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg flex items-center justify-center gap-2">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Now'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal for News */}
      <AnimatePresence>
        {articleToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setArticleToDelete(null)} className="absolute inset-0 bg-bg-main/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-bg-surface p-8 rounded-brand-2xl border border-border-subtle shadow-brand-premium">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 className="w-8 h-8 text-brand-red" /></div>
              <h3 className="text-2xl font-black text-text-primary text-center mb-2 tracking-tight">Delete Article?</h3>
              <p className="text-text-secondary text-center mb-8">Are you sure you want to delete <span className="font-bold text-text-primary">"{articleToDelete.title}"</span>?</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setArticleToDelete(null)} className="py-4 px-6 bg-bg-main border border-border-subtle rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-bg-surface transition-all">Cancel</button>
                <button onClick={() => handleDeleteNews(articleToDelete.id)} disabled={isSubmitting} className="py-4 px-6 bg-brand-red text-text-on-brand rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg flex items-center justify-center gap-2">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Now'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Article Modal */}
      <AnimatePresence>
        {editingArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingArticle(null)} className="fixed inset-0 bg-bg-main/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-4xl bg-bg-surface p-8 rounded-brand-2xl border border-border-subtle shadow-brand-premium my-10">
              <div className="flex items-center justify-between mb-8 border-b border-border-subtle pb-6">
                <h3 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-3">
                  <Newspaper className="w-8 h-8 text-brand-red" />
                  Edit News Article
                </h3>
                <button onClick={() => setEditingArticle(null)} className="p-2 text-text-muted hover:text-brand-red transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form className="space-y-8" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                try {
                  await updateDoc(doc(db, 'news', editingArticle.id), {
                    title: data.get('title'),
                    shortDescription: data.get('shortDescription'),
                    fullDescription: data.get('fullDescription'),
                    location: data.get('location'),
                    category: data.get('category'),
                    imageUrl: data.get('imageUrl'),
                    updatedAt: serverTimestamp()
                  });
                  setEditingArticle(null);
                  alert('Article updated successfully!');
                } catch (err: any) {
                  console.error(err);
                  alert('Failed to update: ' + err.message);
                } finally {
                  setIsSubmitting(false);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">News Title</label>
                    <input name="title" defaultValue={editingArticle.title} required className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Category</label>
                    <select name="category" defaultValue={editingArticle.category} required className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary">
                      {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Location</label>
                    <input name="location" defaultValue={editingArticle.location} className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Image URL</label>
                    <input name="imageUrl" type="url" defaultValue={editingArticle.imageUrl} className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Short Description</label>
                  <textarea name="shortDescription" defaultValue={editingArticle.shortDescription} required rows={3} className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Full Content</label>
                  <textarea name="fullDescription" defaultValue={editingArticle.fullDescription} required rows={10} className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none text-text-primary resize-none" />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingArticle(null)} className="flex-1 py-5 bg-bg-main text-text-secondary rounded-brand-md font-black text-lg uppercase tracking-widest border border-border-subtle">Cancel</button>
                  <button disabled={isSubmitting} type="submit" className="flex-[2] py-5 bg-brand-red text-text-on-brand rounded-brand-md font-black text-lg uppercase tracking-widest shadow-brand-lg flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> Save Changes</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
