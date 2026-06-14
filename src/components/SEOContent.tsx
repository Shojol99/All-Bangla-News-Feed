import { motion } from 'motion/react';
import { Newspaper, Globe, Tv, Zap, Shield, Search, CheckCircle, Info, HelpCircle, ArrowRight, MapPin, Radio, Briefcase, GraduationCap, Trophy, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SEOContent() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 border-t border-border-subtle">
      <div className="space-y-24">
        {/* H1 Header & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-text-primary mb-10 tracking-tight leading-tight">
            <span className="text-brand-red">All Bangla latest News Feed</span>: Your Ultimate <span className="text-brand-green">Bangla News</span> & <span className="text-brand-red">Latest News BD</span> Directory
          </h1>
          <div className="prose prose-xl dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-8">
            <p className="text-2xl font-medium text-text-primary">
              Welcome to <strong>All Bangla latest News Feed</strong> (formerly BanglaNewsHub), the most comprehensive and trusted <strong>Bangla Newspaper Directory</strong> on the web. 
              If you are searching for <strong>Bangladeshi news</strong>, <strong>Bd news</strong>, or <strong>All bangla news paper</strong>, 
              you have arrived at the right place. Our platform is meticulously designed to provide a <strong>List of all bangla news papers</strong>, ensuring you stay updated with <strong>Bd all news</strong> 24/7.
            </p>
            <p>
              In an era where information travels at the speed of light, having a reliable source for <strong>Bd latest news</strong> 
              is essential. Whether you are looking for a <strong>List of all bd news</strong> or specific <strong>Latest news bd</strong> updates, 
              <strong>All Bangla latest News Feed</strong> provides instant access to every major <strong>Bengali Newspaper</strong>, 
              <strong>BD News Live</strong> streams, and <strong>Live TV Bangladesh</strong> channels.
            </p>
          </div>
        </motion.div>

        {/* Why Choose Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              Why Choose All Bangla latest News Feed for <span className="text-brand-red">Bangla News</span>?
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              With hundreds of news portals emerging every day, finding a <strong>List of all bangla news papers</strong> that provides accurate 
              and unbiased <strong>Bangladeshi news</strong> can be a daunting task. <strong>All Bangla latest News Feed</strong> simplifies this 
              by curating only the most reputable sources. We are not just a list of links; we are a dedicated <strong>Bd news</strong> 
              ecosystem built for speed, security, and reliability.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8 text-brand-green" />,
                  title: "Verified BD News Sources",
                  desc: "Every <strong>Bangla Newspaper</strong> and portal in our directory undergoes a strict verification process to filter out misinformation."
                },
                {
                  icon: <Zap className="w-8 h-8 text-brand-red" />,
                  title: "Instant Bangla News 24 Updates",
                  desc: "Our high-speed infrastructure ensures you get the <strong>Latest Bangla News</strong> as it happens, without any delay."
                },
                {
                  icon: <Tv className="w-8 h-8 text-brand-gold" />,
                  title: "Live TV Bangladesh Streaming",
                  desc: "Access <strong>BD News Live</strong> from top channels like Somoy TV, Jamuna TV, and Independent TV directly from our site."
                },
                {
                  icon: <Globe className="w-8 h-8 text-brand-green" />,
                  title: "Global & Local SEO Coverage",
                  desc: "From <strong>Dhaka</strong> and <strong>Chittagong</strong> to international headlines, we cover the <strong>Latest Bangla News</strong> globally."
                }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-bg-surface rounded-brand-xl border border-border-subtle shadow-brand-sm hover:shadow-brand-premium transition-all">
                  <div className="mb-6">{item.icon}</div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">{item.title}</h4>
                  <p className="text-sm text-text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
                </div>
              ))}
            </div>

            {/* Quick Links in Bangla */}
            <div className="p-10 bg-bg-surface rounded-brand-2xl border border-border-subtle">
              <h3 className="text-2xl font-black text-text-primary mb-8 tracking-tight">
                দ্রুত লিঙ্ক (Quick Links)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "দৈনিক পত্রিকা", path: "/bangla-newspapers" },
                  { name: "অনলাইন নিউজ", path: "/online-news-portals" },
                  { name: "লাইভ টিভি", path: "/live-tv-channels" },
                  { name: "চাকরির খবর", path: "/bd-job-sites" },
                  { name: "খেলার খবর", path: "/sports-news" },
                  { name: "প্রযুক্তি সংবাদ", path: "/tech-news" },
                  { name: "শিক্ষা সংবাদ", path: "/education-news" },
                  { name: "আঞ্চলিক খবর", path: "/local-news" }
                ].map((link, i) => (
                  <Link 
                    key={i} 
                    to={link.path}
                    className="flex items-center gap-2 text-text-secondary hover:text-brand-red font-bold transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface p-12 rounded-brand-2xl border border-border-subtle shadow-brand-premium sticky top-24"
          >
            <h3 className="text-2xl font-black text-text-primary mb-10 tracking-tight">
              Explore Our <span className="text-brand-red">BD News</span> Categories
            </h3>
            <div className="space-y-5">
              {[
                { name: "Daily Bangla Newspapers", path: "/bangla-newspapers", count: "50+", icon: <Newspaper className="w-5 h-5" /> },
                { name: "Online News Portals", path: "/online-news-portals", count: "120+", icon: <Globe className="w-5 h-5" /> },
                { name: "Live TV Channels", path: "/live-tv-channels", count: "35+", icon: <Tv className="w-5 h-5" /> },
                { name: "Local & District News", path: "/local-news", count: "250+", icon: <MapPin className="w-5 h-5" /> },
                { name: "BD Job Sites", path: "/bd-job-sites", count: "25+", icon: <Briefcase className="w-5 h-5" /> },
                { name: "International News", path: "/international-news", count: "45+", icon: <Globe className="w-5 h-5" /> },
                { name: "Sports News", path: "/sports-news", count: "15+", icon: <Trophy className="w-5 h-5" /> },
                { name: "Tech News", path: "/tech-news", count: "10+", icon: <Cpu className="w-5 h-5" /> }
              ].map((cat, i) => (
                <Link 
                  key={i} 
                  to={cat.path}
                  className="flex items-center justify-between p-5 bg-bg-main rounded-brand-lg border border-border-subtle hover:border-brand-red hover:translate-x-2 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-text-muted group-hover:text-brand-red transition-colors">{cat.icon}</div>
                    <span className="font-bold text-text-primary group-hover:text-brand-red transition-colors">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-text-muted bg-bg-surface px-3 py-1 rounded-full border border-border-subtle">{cat.count}</span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-red transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-surface rounded-brand-2xl border border-border-subtle p-16 shadow-brand-premium"
        >
          <h2 className="text-4xl font-black text-text-primary mb-16 text-center tracking-tight">
            Featured <span className="text-brand-red">Bengali Newspaper</span> & <span className="text-brand-green">Live TV</span> Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-red/10 rounded-brand-md">
                  <Newspaper className="w-8 h-8 text-brand-red" />
                </div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-wider">Top Bangla Newspapers</h3>
              </div>
              <ul className="space-y-5 text-text-secondary font-medium text-lg">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Prothom Alo (Daily Bangla)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Jugantor (Bengali Newspaper)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Kaler Kantho (BD News)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Ittefaq (Traditional News)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Bangladesh Pratidin</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Daily Inqilab</li>
              </ul>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-green/10 rounded-brand-md">
                  <Globe className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-wider">Online News Portals</h3>
              </div>
              <ul className="space-y-5 text-text-secondary font-medium text-lg">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> BD News 24 (Online Bangla News)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Banglanews24.com</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Dhaka Tribune (English/Bangla)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> RisingBD</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Jago News 24</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Priyo.com</li>
              </ul>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-gold/10 rounded-brand-md">
                  <Tv className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-wider">Live TV Bangladesh</h3>
              </div>
              <ul className="space-y-5 text-text-secondary font-medium text-lg">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Somoy TV (BD News Live)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Jamuna TV Live</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Independent TV</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> News24 Live</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> Channel i Live</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-brand-green shrink-0" /> ATN News Live</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Deep Dive Content Section */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-20">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              The Importance of a Reliable <span className="text-brand-red">Bangla Newspaper Directory</span>
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              In the digital age, the way we consume <strong>Bangladesh News</strong> has changed forever. No longer are we dependent on the physical 
              delivery of a <strong>Bangla Newspaper</strong> to our doorstep. Instead, we demand <strong>Latest Bangla News</strong> at our 
              fingertips, 24 hours a day. This is where <strong>All Bangla latest News Feed</strong> steps in. As a premier <strong>Bangla Newspaper Directory</strong>, 
              we bridge the gap between traditional journalism and modern technology.
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              Our directory is designed to cater to the diverse needs of the Bengali-speaking population worldwide. Whether you are interested in 
              <strong>Online Bangla News</strong>, <strong>BD News Live</strong>, or <strong>Bangladesh Online News</strong> portals, we provide 
              a seamless experience. We understand that for many, reading a <strong>Bengali Newspaper</strong> is a daily ritual, and we strive to 
              make that ritual as accessible as possible.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              Comprehensive Coverage: From <span className="text-brand-green">Dhaka</span> to the World
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              <strong>All Bangla latest News Feed</strong> offers unparalleled coverage of <strong>BD News</strong>. We list newspapers and portals from every corner 
              of <strong>Bangladesh</strong>. From the bustling streets of <strong>Dhaka</strong> and the commercial hub of <strong>Chittagong</strong> 
              to the tea gardens of <strong>Sylhet</strong> and the historic sites of <strong>Rajshahi</strong>, our <strong>Bangla Newspaper Directory</strong> 
              leaves no stone unturned.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 not-prose">
              <div className="p-10 bg-bg-surface rounded-brand-2xl border border-border-subtle">
                <h3 className="text-2xl font-black text-text-primary mb-6">Local & District News</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Stay connected with your roots by accessing local newspapers from your home district. We cover all 64 districts of 
                  <strong>Bangladesh</strong>, ensuring you never miss an update from your community.
                </p>
                <ul className="grid grid-cols-2 gap-3 text-sm font-bold text-text-muted">
                  <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-red" /> Dhaka News</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-red" /> Chittagong News</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-red" /> Sylhet News</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-red" /> Khulna News</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-red" /> Rajshahi News</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3 h-3 text-brand-red" /> Barisal News</li>
                </ul>
              </div>
              <div className="p-10 bg-bg-surface rounded-brand-2xl border border-border-subtle">
                <h3 className="text-2xl font-black text-text-primary mb-6">Specialized News Portals</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Beyond general news, we provide access to specialized portals covering niche topics that matter to you.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-text-primary font-bold">
                    <Briefcase className="w-5 h-5 text-brand-gold" /> BD Job Sites & Circulars
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-bold">
                    <GraduationCap className="w-5 h-5 text-brand-green" /> Education & Result News
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-bold">
                    <Radio className="w-5 h-5 text-brand-red" /> Online Radio Stations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              The Evolution of <span className="text-brand-red">Bangla News 24</span>
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              The concept of <strong>Bangla News 24</strong> has revolutionized how we perceive information. In the past, we had to wait for the 
              morning <strong>Bangla Newspaper</strong> to know what happened yesterday. Today, <strong>Online Bangla News</strong> portals 
              provide updates in real-time. <strong>All Bangla latest News Feed</strong> is at the forefront of this revolution, providing a platform where 
              <strong>Latest Bangla News</strong> is always just a click away.
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              Our <strong>BD News Live</strong> section is particularly popular among those who prefer visual information. Watching 
              <strong>Live TV Bangladesh</strong> allows you to experience news as it unfolds. Whether it's a major political event in 
              <strong>Dhaka</strong> or a sports victory in <strong>Chittagong</strong>, <strong>All Bangla latest News Feed</strong> ensures you are 
              part of the action.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              Why <span className="text-brand-green">Bangladesh Online News</span> is the Future
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              The rise of <strong>Bangladesh Online News</strong> is a testament to the digital progress of our nation. With increasing internet 
              penetration, more people are turning to <strong>Online Bangla News</strong> for their daily updates. <strong>All Bangla latest News Feed</strong> 
              is committed to supporting this digital growth by providing a safe and efficient way to access <strong>all Bangla newspapers online</strong>.
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              We believe that access to information is a fundamental right. By curating the best <strong>BD News</strong> sources, we empower 
              our readers to make informed decisions. Whether you are looking for a <strong>Bengali Newspaper</strong> for in-depth analysis 
              or <strong>Bangla News 24</strong> for quick updates, <strong>All Bangla latest News Feed</strong> is your ultimate companion.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              How to Use <span className="text-brand-red">All Bangla latest News Feed</span> Effectively
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              Navigating our <strong>Bangla Newspaper Directory</strong> is designed to be intuitive. For the best experience, we recommend 
              starting with our 'Featured' section to see the most popular <strong>Bangladesh News</strong> sources. If you are looking for 
              something specific, our categorized navigation allows you to filter by <strong>Online Bangla News</strong>, 
              <strong>Live TV Bangladesh</strong>, or even <strong>BD Job Sites</strong>.
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              One of the unique features of <strong>All Bangla latest News Feed</strong> is our focus on <strong>Latest Bangla News</strong> 24/7. 
              By bookmarking our site, you can ensure that you are always just a second away from the most critical <strong>BD News</strong> 
              updates. We also encourage our users to explore the <strong>Bengali Newspaper</strong> archives of our listed partners for 
              historical context on major events in <strong>Bangladesh</strong>.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              The Role of <span className="text-brand-green">Bengali Newspaper</span> in Society
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              A <strong>Bengali Newspaper</strong> is more than just a collection of stories; it is a reflection of our culture, values, and 
              aspirations. From the early days of the language movement to the current era of economic growth, newspapers have played a 
              pivotal role in shaping <strong>Bangladesh</strong>. <strong>All Bangla latest News Feed</strong> honors this legacy by providing a platform 
              that respects the tradition of journalism while embracing the future of <strong>Online Bangla News</strong>.
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              We take our responsibility as a <strong>Bangla Newspaper Directory</strong> seriously. By providing access to diverse 
              <strong>BD News</strong> perspectives, we foster a more informed and engaged citizenry. Whether it's through a 
              <strong>Bangla News 24</strong> portal or a traditional <strong>Bangla Newspaper</strong>, the goal remains the same: 
              to provide truth and clarity in an increasingly complex world.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto">
              <HelpCircle className="w-10 h-10 text-brand-red" />
            </div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              Frequently Asked Questions about <span className="text-brand-red">BD News</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our <strong>Bangla Newspaper Directory</strong> and how to access <strong>Latest Bangla News</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                q: "What is All Bangla latest News Feed?",
                a: "All Bangla latest News Feed is the most comprehensive <strong>Bangla Newspaper Directory</strong> on the internet. We provide a centralized platform to access <strong>all Bangla newspapers online</strong>, <strong>Online Bangla News</strong> portals, and <strong>Live TV Bangladesh</strong> channels from one place."
              },
              {
                q: "How can I read Bangla newspapers online for free?",
                a: "Simply visit <strong>All Bangla latest News Feed</strong> and choose your preferred <strong>Bengali Newspaper</strong> from our categorized list. We provide direct links to the official websites of all major <strong>Bangladesh News</strong> sources for free."
              },
              {
                q: "Where can I watch Live TV Bangladesh news streams?",
                a: "Our 'Live TV' section features high-quality streams from top <strong>BD News Live</strong> channels like <strong>Somoy TV</strong>, <strong>Jamuna TV</strong>, and <strong>Independent TV</strong>. You can watch them directly on our platform."
              },
              {
                q: "Does All Bangla latest News Feed cover local news from Dhaka and Chittagong?",
                a: "Yes! We have a dedicated section for <strong>Local & District News</strong> that covers <strong>Dhaka</strong>, <strong>Chittagong</strong>, <strong>Sylhet</strong>, <strong>Khulna</strong>, and all other districts in <strong>Bangladesh</strong>."
              },
              {
                q: "Is All Bangla latest News Feed updated with Latest Bangla News?",
                a: "Absolutely. We list portals that provide <strong>Bangla News 24</strong> updates. Our directory is constantly monitored to ensure that you have access to the most current <strong>Bangladesh Online News</strong>."
              },
              {
                q: "Can I find job circulars on All Bangla latest News Feed?",
                a: "Yes, we have a specialized category for <strong>BD Job Sites</strong> where you can find the latest government and private job circulars from the most trusted portals in <strong>Bangladesh</strong>."
              },
              {
                q: "Is it safe to browse news through All Bangla latest News Feed?",
                a: "Yes, we prioritize your security. We only list verified <strong>BD News</strong> sources and ensure that our platform is free from malicious links, providing a safe environment for reading your favorite <strong>Bangla Newspaper</strong>."
              },
              {
                q: "Can I access All Bangla latest News Feed from outside Bangladesh?",
                a: "Yes, <strong>All Bangla latest News Feed</strong> is accessible worldwide. It is the perfect tool for the Bangladeshi diaspora to stay connected with <strong>Latest Bangla News</strong> and <strong>BD News Live</strong> from anywhere."
              }
            ].map((faq, i) => (
              <div key={i} className="p-10 bg-bg-surface rounded-brand-2xl border border-border-subtle shadow-brand-sm hover:shadow-brand-premium transition-all">
                <h4 className="text-xl font-black text-text-primary mb-6 flex items-start gap-4">
                  <Info className="w-6 h-6 text-brand-red shrink-0 mt-1" />
                  <span dangerouslySetInnerHTML={{ __html: faq.q }} />
                </h4>
                <p className="text-lg text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-red p-16 md:p-24 rounded-brand-3xl text-center text-text-on-brand shadow-brand-premium relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Experience the Best <br /> <span className="text-brand-gold">Bangla News</span> Directory
            </h2>
            <p className="text-2xl md:text-3xl font-medium opacity-90 max-w-4xl mx-auto leading-relaxed">
              Join millions of readers who trust <strong>All Bangla latest News Feed</strong> for their daily <strong>Bangladesh News</strong>. 
              Access <strong>all Bangla newspapers online</strong> and <strong>Live TV Bangladesh</strong> in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
              <Link 
                to="/news" 
                className="px-12 py-6 bg-white text-brand-red rounded-brand-lg font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Read Latest News
              </Link>
              <Link 
                to="/live-tv-channels" 
                className="px-12 py-6 bg-brand-gold text-text-primary rounded-brand-lg font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Watch Live TV
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Final SEO Footer Text */}
        <div className="text-center text-text-muted text-base max-w-5xl mx-auto leading-relaxed pt-16 border-t border-border-subtle">
          <p>
            <strong>All Bangla latest News Feed</strong> is the ultimate <strong>Bangla Newspaper Directory</strong> designed for the modern reader. 
            We provide a centralized platform for <strong>Bangladeshi news</strong>, <strong>Bd news</strong>, and <strong>All bangla news paper</strong>. 
            Our mission is to ensure that every <strong>List of all bd news</strong> and <strong>Latest news bd</strong> portal is 
            accessible to everyone, everywhere. Stay informed with <strong>Bd all news</strong> and <strong>Bd latest news</strong> 
            through our verified directory. From <strong>Dhaka</strong> to <strong>Chittagong</strong>, we bring you the 
            <strong>Latest Bangla News</strong> with integrity and speed. 
            Copyright © 2026 All Bangla latest News Feed - The #1 Bangla News Directory.
          </p>
        </div>
      </div>
    </section>
  );
}
