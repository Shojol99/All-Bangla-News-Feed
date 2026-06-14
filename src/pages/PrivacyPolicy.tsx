import { motion } from 'motion/react';
import { Shield, Eye, Lock, FileText, Globe, Clock } from 'lucide-react';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const lastUpdated = "April 5, 2026";

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-20 px-4">
      <SEO 
        title="Privacy Policy | BanglaNewsHub - Your Data Security"
        description="Read our privacy policy to understand how BanglaNewsHub collects, uses, and protects your personal information and data."
        canonical="https://allbanglanewsfeed.netlify.app/privacy"
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-bold mb-4 border border-brand-red/20">
            <Shield className="w-4 h-4" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
            Privacy <span className="text-brand-green">Policy</span>
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-muted font-bold">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </motion.div>

        <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 md:p-12 shadow-brand-premium space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <Eye className="w-6 h-6 text-brand-red" />
              <h2>Introduction</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              At BanglaNewsHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website. Please read this policy 
              carefully to understand our views and practices regarding your personal data and how we will treat it.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <Lock className="w-6 h-6 text-brand-green" />
              <h2>Information We Collect</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
              <li><strong>Personal Data:</strong> Name, email address, and profile picture when you sign in via Google.</li>
              <li><strong>Derivative Data:</strong> IP address, browser type, operating system, and access times.</li>
              <li><strong>User Content:</strong> News posts, descriptions, and images you submit for publication.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <Globe className="w-6 h-6 text-brand-gold" />
              <h2>How We Use Your Information</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. 
              Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
              <li>Create and manage your account.</li>
              <li>Process and review your news submissions.</li>
              <li>Improve our website and user experience.</li>
              <li>Send you administrative information and updates.</li>
              <li>Prevent fraudulent transactions and monitor against theft.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <FileText className="w-6 h-6 text-brand-red" />
              <h2>Your Rights</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              You have the right to access, update, or delete the personal information we have on you. 
              Whenever made possible, you can update your personal information directly within your account settings section. 
              If you are unable to perform these actions yourself, please contact us to assist you.
            </p>
          </section>

          <div className="pt-12 border-t border-border-subtle text-center">
            <p className="text-sm text-text-muted">
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@banglanewshub.com" className="text-brand-red font-bold hover:underline ml-1">privacy@banglanewshub.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
