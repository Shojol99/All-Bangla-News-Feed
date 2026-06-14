import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Send, Globe, Image as ImageIcon, CheckCircle2, AlertCircle, X, PlusCircle, Info, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, db, auth, signInWithPopup, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function AddNewspaperPage() {
  const [user, setUser] = useState(auth.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'Daily Bangla',
    logoUrl: '',
    description: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'newspaper_submissions'), {
        ...formData,
        status: 'pending',
        submittedBy: user.email,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      setFormData({
        name: '',
        url: '',
        category: 'Daily Bangla',
        logoUrl: '',
        description: '',
      });
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error("Error submitting newspaper:", err);
      setError("Failed to submit. Please try again.");
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
            <Newspaper className="w-10 h-10 text-brand-red" />
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Add Newspaper</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Please sign in with your Google account to submit a new newspaper to our directory.
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
            <span>Directory Submission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight">
            Add Your <span className="text-brand-red">Newspaper</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Help us expand our directory. Submit a newspaper to be included in our comprehensive list of Bangla news sources.
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
                    Submission Received!
                  </h2>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    Thank you for your contribution. Our team will review the newspaper details and add it to the directory soon.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 bg-brand-red text-text-on-brand rounded-brand-md font-bold hover:bg-brand-red/90 transition-all shadow-brand-lg"
                  >
                    Submit Another
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-brand-red" />
                          Newspaper Name
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Prothom Alo"
                          className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                          <Globe className="w-4 h-4 text-brand-red" />
                          Website URL
                        </label>
                        <input
                          required
                          type="url"
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          placeholder="https://www.prothomalo.com"
                          className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary font-bold"
                        >
                          <option>Daily Bangla</option>
                          <option>Online Bangla</option>
                          <option>Live TV</option>
                          <option>International</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-brand-green" />
                          Logo URL (Optional)
                        </label>
                        <input
                          type="url"
                          name="logoUrl"
                          value={formData.logoUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Briefly describe the newspaper..."
                        rows={4}
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
                        <span>Submit Newspaper</span>
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
                Guidelines
              </h3>
              <ul className="space-y-4">
                {[
                  'Ensure the website URL is correct.',
                  'Select the most appropriate category.',
                  'Provide a high-quality logo if available.',
                  'Include a brief, accurate description.',
                  'Only submit active news sources.'
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
          </div>
        </div>
      </div>
    </div>
  );
}
