import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Globe, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NewsViewerProps {
  url: string | null;
  onClose: () => void;
  title?: string;
  content?: string | null;
}

export default function NewsViewer({ url, onClose, title, content }: NewsViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (url || content) {
      setIsLoading(true);
      setError(false);
      // Prevent scrolling on body when viewer is open
      document.body.style.overflow = 'hidden';
      if (content) setIsLoading(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [url, content]);

  if (!url && !content) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      >
        {/* Browser Header */}
        <div className="bg-bg-surface border-b border-border-subtle px-4 py-3 flex items-center gap-4 shadow-brand-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-main rounded-full transition-colors text-text-primary group"
              title="Close Viewer"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            {/* Mobile-only Open Original button on the left */}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-brand-red text-text-on-brand rounded-brand-md font-black text-[10px] uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-sm"
              >
                Open <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex-1 max-w-3xl mx-auto">
            <div className="bg-bg-main border border-border-subtle rounded-full px-4 py-1.5 flex items-center gap-3 text-sm text-text-muted">
              <Shield className="w-4 h-4 text-brand-green" />
              <div className="flex-1 truncate font-medium">
                {title || url || 'Community News'}
              </div>
              <Globe className="w-4 h-4 opacity-50" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop-only Open Original button on the right */}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-red text-text-on-brand rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-sm"
              >
                Open Original <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-bg-main border border-border-subtle text-text-primary rounded-brand-md font-black text-xs uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 relative bg-bg-main overflow-y-auto">
          {isLoading && url && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-main z-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin" />
                <RefreshCw className="w-6 h-6 text-brand-red absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="mt-4 text-text-muted font-black uppercase tracking-widest text-xs animate-pulse">
                Loading Secure Preview...
              </p>
            </div>
          )}

          {content ? (
            <div className="max-w-4xl mx-auto p-8 md:p-16">
              <h1 className="text-3xl md:text-5xl font-black text-text-primary mb-8 leading-tight">{title}</h1>
              <div className="prose prose-slate dark:prose-invert max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap text-lg">
                {content}
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-main p-8 text-center">
              <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mb-6">
                <X className="w-10 h-10 text-brand-red" />
              </div>
              <h3 className="text-2xl font-black text-text-primary mb-4">Connection Refused</h3>
              <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
                This website prevents being embedded in an iframe for security reasons. 
                Please click the button below to open it in a new tab.
              </p>
              <a
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-red text-text-on-brand rounded-brand-md font-black uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg flex items-center gap-3"
              >
                Open in New Tab <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          ) : (
            <iframe
              src={url!}
              className="w-full h-full border-none bg-white"
              onLoad={() => setIsLoading(false)}
              onError={() => setError(true)}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="News Article"
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
