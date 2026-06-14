import { motion } from 'motion/react';
import { FileText, Gavel, CheckCircle, AlertTriangle, Scale, Clock } from 'lucide-react';
import SEO from '../components/SEO';

export default function TermsOfService() {
  const lastUpdated = "April 5, 2026";

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-20 px-4">
      <SEO 
        title="Terms of Service | BanglaNewsHub - Legal Agreement"
        description="Review the terms of service for using BanglaNewsHub. Understand your rights and responsibilities when accessing our news directory."
        canonical="https://allbanglanewsfeed.netlify.app/terms"
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-bold mb-4 border border-brand-red/20">
            <Scale className="w-4 h-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
            Terms of <span className="text-brand-green">Service</span>
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-muted font-bold">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </motion.div>

        <div className="bg-bg-surface rounded-brand-xl border border-border-subtle p-8 md:p-12 shadow-brand-premium space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <Gavel className="w-6 h-6 text-brand-red" />
              <h2>Agreement to Terms</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              By accessing or using BanglaNewsHub, you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, then you may not access the service. 
              These terms apply to all visitors, users, and others who access or use the service.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <CheckCircle className="w-6 h-6 text-brand-green" />
              <h2>User Content & Submissions</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Our service allows you to post, link, store, share, and otherwise make available certain information, 
              text, graphics, videos, or other material. You are responsible for the content that you post to the service, 
              including its legality, reliability, and appropriateness.
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
              <li>You must own the content or have the right to use it.</li>
              <li>Content must not violate privacy, publicity, or intellectual property rights.</li>
              <li>We reserve the right to remove any content that violates these terms.</li>
              <li>We reserve the right to edit or reject any news submission for any reason.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <AlertTriangle className="w-6 h-6 text-brand-gold" />
              <h2>Prohibited Activities</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              You may not use the service for any illegal or unauthorized purpose. 
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
              <li>Spamming, phishing, or sending unsolicited messages.</li>
              <li>Impersonating another person or entity.</li>
              <li>Interfering with or disrupting the service or servers.</li>
              <li>Attempting to gain unauthorized access to any part of the service.</li>
              <li>Posting false, misleading, or defamatory information.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-text-primary">
              <FileText className="w-6 h-6 text-brand-red" />
              <h2>Limitation of Liability</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              In no event shall BanglaNewsHub, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
              access to or use of or inability to access or use the service.
            </p>
          </section>

          <div className="pt-12 border-t border-border-subtle text-center">
            <p className="text-sm text-text-muted">
              If you have any questions about these Terms, please contact us at 
              <a href="mailto:legal@banglanewshub.com" className="text-brand-red font-bold hover:underline ml-1">legal@banglanewshub.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
