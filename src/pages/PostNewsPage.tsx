import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Send, MapPin, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, X, PlusCircle, Info, Loader2, ChevronDown } from 'lucide-react';
import { collection, addDoc, serverTimestamp, db, auth, signInWithPopup, googleProvider, getDocs, query, where } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/newspapers';

export default function PostNewsPage() {
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    location: '',
    imageUrl: '',
    category: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        // Fetch user profile to check status
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', u.uid)));
        if (!userDoc.empty) {
          setUserProfile(userDoc.docs[0].data());
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      handleLogin();
      return;
    }

    if (userProfile?.status === 'blocked' || userProfile?.status === 'suspended') {
      setError(`Your account has been ${userProfile.status}. You cannot submit news at this time.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'news'), {
        ...formData,
        status: 'pending',
        authorId: user.uid,
        authorEmail: user.email,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        location: '',
        imageUrl: '',
        category: '',
      });
      setTimeout(() => navigate('/news'), 3000);
    } catch (err) {
      console.error("Error submitting news:", err);
      setError("Failed to submit news. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-bg-surface p-12 rounded-brand-xl border border-border-subtle text-center shadow-brand-premium"
        >
          <div className="w-20 h-20 bg-brand-red/10 rounded-brand-md flex items-center justify-center mx-auto mb-8">
            <PlusCircle className="w-10 h-10 text-brand-red" />
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Post Your News</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Please sign in with your Google account to submit news articles to our community feed.
          </p>
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-brand-red text-text-on-brand rounded-brand-md font-black text-sm uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-bold mb-4 border border-brand-green/20">
            <PlusCircle className="w-4 h-4" />
            <span>Community Submission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight">
            Share Your <span className="text-brand-red">Story</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Submit your news article for review. Once approved by our editors, it will be visible to millions of users on our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-bg-surface rounded-brand-xl border border-border-subtle p-12 text-center shadow-brand-premium"
                >
                  <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-brand-green" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4 tracking-tight">
                    Submission Successful!
                  </h2>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    Thank you for contributing to our community. Your news post is now pending review and will be published once approved.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 bg-brand-red text-text-on-brand rounded-brand-md font-bold hover:bg-brand-red/90 transition-all shadow-brand-lg"
                  >
                    Submit Another Story
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 md:p-12 shadow-brand-premium space-y-8"
                >
                  {error && (
                    <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-brand-md flex items-center gap-3 text-brand-red text-sm font-bold">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                      <button onClick={() => setError(null)} className="ml-auto">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-brand-red" />
                        News Title
                      </label>
                      <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter a catchy title for your news..."
                        className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-red" />
                          Location
                        </label>
                        <input
                          required
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g. Dhaka, Bangladesh"
                          className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-brand-gold" />
                          News Category
                        </label>
                        <div className="relative">
                          <select
                            required
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary appearance-none"
                          >
                            <option value="" disabled>Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                            <option value="other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-brand-green" />
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-gold" />
                        Short Description
                      </label>
                      <textarea
                        required
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Provide a brief summary of the news story..."
                        rows={3}
                        className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-red" />
                        Full News Content
                      </label>
                      <textarea
                        required
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleInputChange}
                        placeholder="Write the complete news story here..."
                        rows={10}
                        className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-brand-red text-text-on-brand rounded-brand-md font-black text-lg uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit News for Review</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 shadow-brand-sm">
              <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-gold" />
                Submission Rules
              </h3>
              <ul className="space-y-4">
                {[
                  'Information must be accurate and verified.',
                  'No hate speech or offensive content.',
                  'Include clear images if possible.',
                  'Mention the exact location of the event.',
                  'Avoid promotional or spam content.'
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <div className="w-5 h-5 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 border border-brand-red/20">
                      {i + 1}
                    </div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-text-primary rounded-brand-xl p-8 text-text-on-brand shadow-brand-premium">
              <h3 className="text-lg font-black mb-4">Need Help?</h3>
              <p className="text-text-on-brand/70 text-sm mb-6 leading-relaxed">
                If you encounter any issues while submitting your news, please contact our support team.
              </p>
              <a href="/contact" className="text-brand-gold font-bold hover:underline">Contact Support →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
