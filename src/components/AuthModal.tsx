import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogIn, UserPlus, Github, Chrome, Ghost, AlertCircle, Loader2 } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, updateProfile } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      onClose();
    } catch (err: any) {
      let message = err.message || 'An error occurred during authentication';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is not enabled in your Firebase Console. Please enable it in Authentication > Sign-in method.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = `This domain (${window.location.hostname}) is not authorized in your Firebase Console. Please add it to Authentication > Settings > Authorized domains.`;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      let message = err.message || 'Google sign-in failed';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Google sign-in is not enabled in your Firebase Console. Please enable it in Authentication > Sign-in method.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = `This domain (${window.location.hostname}) is not authorized in your Firebase Console. Please add it to Authentication > Settings > Authorized domains.`;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      let message = err.message || 'Anonymous sign-in failed';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Anonymous sign-in is not enabled in your Firebase Console. Please enable it in Authentication > Sign-in method.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-bg-surface rounded-brand-xl shadow-brand-premium border border-border-subtle overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-text-primary opacity-40 hover:opacity-100 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-text-secondary">
              {isLogin ? 'Sign in to access your account' : 'Join our community today'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-brand-red/10 border border-brand-red/20 rounded-brand-md flex items-center gap-3 text-brand-red text-sm font-bold"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-green outline-none transition-all text-text-primary"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-green outline-none transition-all text-text-primary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-green outline-none transition-all text-text-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-red text-text-on-brand rounded-brand-md font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-brand-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-surface text-text-muted font-bold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg hover:bg-bg-surface transition-all font-bold text-text-primary disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
              Google
            </button>
            <button
              onClick={handleAnonymousSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-3 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg hover:bg-bg-surface transition-all font-bold text-text-primary disabled:opacity-50"
            >
              <Ghost className="w-5 h-5 text-text-muted" />
              Guest
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-text-muted hover:text-brand-red transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
