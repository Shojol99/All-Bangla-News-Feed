import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, addDoc, serverTimestamp, auth } from '../firebase';

export default function ContactSupport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      userId: auth.currentUser?.uid || 'guest',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'contacts'), data);
      setIsSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-20 px-4">
      <SEO 
        title="Contact Support | BanglaNewsHub - Get in Touch"
        description="Need help or have feedback? Contact BanglaNewsHub support team via email, phone, or our contact form. We're here to assist you."
        canonical="https://allbanglanewsfeed.netlify.app/contact"
      />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-bold mb-4 border border-brand-red/20">
            <HelpCircle className="w-4 h-4" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight">
            How Can We <span className="text-brand-green">Help You?</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Have questions, feedback, or need technical support? Our team is here to assist you. 
            Reach out to us through any of the channels below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-surface p-10 rounded-brand-xl border border-border-subtle text-center shadow-brand-sm hover:shadow-brand-md transition-all"
          >
            <div className="w-16 h-16 bg-brand-red/10 rounded-brand-md flex items-center justify-center mx-auto mb-6 border border-brand-red/20">
              <Mail className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Email Us</h3>
            <p className="text-sm text-text-muted mb-4">For general inquiries and support.</p>
            <a href="mailto:support@banglanewshub.com" className="text-brand-red font-bold hover:underline">support@banglanewshub.com</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-bg-surface p-10 rounded-brand-xl border border-border-subtle text-center shadow-brand-sm hover:shadow-brand-md transition-all"
          >
            <div className="w-16 h-16 bg-brand-green/10 rounded-brand-md flex items-center justify-center mx-auto mb-6 border border-brand-green/20">
              <Phone className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Call Us</h3>
            <p className="text-sm text-text-muted mb-4">Available Mon-Fri, 9am-6pm.</p>
            <a href="tel:+8801234567890" className="text-brand-green font-bold hover:underline">+880 1234 567890</a>
          </motion.div>
        </div>

        <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-10 md:p-16 shadow-brand-premium">
          <h2 className="text-3xl font-black text-text-primary mb-8 tracking-tight">Send Us a <span className="text-brand-red">Message</span></h2>
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-brand-green" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">Message Sent!</h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Thank you for reaching out. We have received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-brand-red text-text-on-brand rounded-brand-md font-bold hover:bg-brand-red/90 transition-all shadow-brand-lg"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {error && (
                  <div className="md:col-span-2 p-4 bg-brand-red/10 border border-brand-red/20 rounded-brand-md flex items-center gap-3 text-brand-red text-sm font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Full Name</label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    placeholder="John Doe" 
                    defaultValue={auth.currentUser?.displayName || ''}
                    className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Email Address</label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    defaultValue={auth.currentUser?.email || ''}
                    className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Subject</label>
                  <input 
                    required
                    name="subject"
                    type="text" 
                    placeholder="How can we help?" 
                    className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Message</label>
                  <textarea 
                    required
                    name="message"
                    placeholder="Write your message here..." 
                    rows={6} 
                    className="w-full px-6 py-4 bg-bg-main border-2 border-border-subtle rounded-brand-lg focus:border-brand-red outline-none transition-all text-text-primary resize-none" 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="md:col-span-2 py-5 bg-brand-red text-text-on-brand rounded-brand-md font-black text-lg uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-brand-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
