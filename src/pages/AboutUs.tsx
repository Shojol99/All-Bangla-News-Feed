import { motion } from 'motion/react';
import { Newspaper, Globe, Users, Shield, Zap, Heart } from 'lucide-react';
import SEO from '../components/SEO';

export default function AboutUs() {
  const stats = [
    { label: 'News Sources', value: '500+', icon: Newspaper },
    { label: 'Monthly Visitors', value: '1M+', icon: Users },
    { label: 'Countries Covered', value: '20+', icon: Globe },
    { label: 'Trusted Partners', value: '100+', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-20 px-4">
      <SEO 
        title="About Us | All Bangla latest News Feed - Our Mission & Story"
        description="Learn about All Bangla latest News Feed, the leading directory for all Bangla newspapers and news portals. Discover our mission to connect Bangladesh through information."
        canonical="https://allbanglanewsfeed.netlify.app/about"
      />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-bold mb-4 border border-brand-red/20">
            <Zap className="w-4 h-4" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight">
            Connecting Bangladesh <br />
            <span className="text-brand-green">Through Information</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            All Bangla latest News Feed is the most comprehensive directory of Bangladeshi news sources, 
            designed to provide quick and easy access to trusted information for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-surface p-8 rounded-brand-xl border border-border-subtle text-center shadow-brand-sm"
            >
              <stat.icon className="w-8 h-8 text-brand-red mx-auto mb-4" />
              <div className="text-3xl font-black text-text-primary mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-text-primary mb-6 tracking-tight">
              Our <span className="text-brand-red">Story</span>
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Founded in 2024, All Bangla latest News Feed (formerly BanglaNewsHub) started as a small school project with a big vision: 
                to organize the vast landscape of Bangladeshi media into a single, user-friendly platform. 
                We realized that finding reliable news across hundreds of portals was difficult, 
                so we built a solution.
              </p>
              <p>
                Today, we serve millions of users monthly, providing them with instant access to 
                daily newspapers, online portals, live TV channels, and more. Our platform is 
                built on the principles of transparency, accessibility, and community contribution.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-green rounded-brand-xl p-12 text-text-on-brand shadow-brand-premium"
          >
            <Heart className="w-12 h-12 mb-6 fill-current text-brand-gold" />
            <h3 className="text-2xl font-bold mb-4">Why We Do It</h3>
            <p className="opacity-90 leading-relaxed">
              We believe that access to information is a fundamental right. 
              By providing a centralized hub for news, we empower citizens 
              to stay informed, engaged, and connected with their roots, 
              no matter where they are in the world.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
