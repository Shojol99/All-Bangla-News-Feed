export interface NewsItem {
  id: string;
  name: string;
  url: string;
  logo?: string;
  category: string;
  isTop?: boolean;
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  icon: string;
  slug: string;
  title: string;
  description: string;
  keywords: string;
}

export const categories: Category[] = [
  { 
    id: 'daily-bangla', 
    name: 'Daily Bangla', 
    banglaName: 'দৈনিক বাংলা সংবাদপত্র',
    icon: 'Newspaper',
    slug: 'bangla-newspapers',
    title: 'All Daily Bangla Newspapers List | সব অনলাইন বাংলা সংবাদপত্র',
    description: 'Find the complete list of all daily Bangla newspapers in Bangladesh. সব অনলাইন বাংলা সংবাদপত্র - Access Prothom Alo, Jugantor, Kaler Kantho, and more in one place.',
    keywords: 'all bangla newspaper, bangladesh newspaper list, daily bangla news, সব অনলাইন বাংলা সংবাদপত্র'
  },
  { 
    id: 'online-bangla', 
    name: 'Online Bangla', 
    banglaName: 'অনলাইন নিউজ পোর্টাল',
    icon: 'Globe',
    slug: 'online-news-portals',
    title: 'Top Online Bangla News Portals | অনলাইন নিউজ পোর্টাল বাংলাদেশ',
    description: 'Explore the best online Bangla news portals including bdnews24, banglanews24, and jagonews24. অনলাইন নিউজ পোর্টাল - Stay updated with real-time news.',
    keywords: 'online bangla news, bd news online, bangla news portal, অনলাইন নিউজ পোর্টাল'
  },
  { 
    id: 'live-tv', 
    name: 'Live TV & Channel', 
    banglaName: 'লাইভ টিভি চ্যানেল',
    icon: 'Tv',
    slug: 'live-tv-channels',
    title: 'Live TV Channels Bangladesh | লাইভ টিভি চ্যানেল বাংলাদেশ',
    description: 'Watch all Bangladeshi live TV channels online. লাইভ টিভি চ্যানেল - Stream Somoy TV, Jamuna TV, Channel 24, and other news channels for free.',
    keywords: 'live tv bangladesh, bd news live, bangla tv channel online, লাইভ টিভি চ্যানেল'
  },
  { 
    id: 'local-district', 
    name: 'Local & District', 
    banglaName: 'আঞ্চলিক সংবাদপত্র',
    icon: 'MapPin',
    slug: 'local-news',
    title: 'Local & District Newspapers of Bangladesh | আঞ্চলিক সংবাদপত্র',
    description: 'Access local newspapers from all districts of Bangladesh. আঞ্চলিক সংবাদপত্র - Stay connected with regional news from Chittagong, Sylhet, Rajshahi, and more.',
    keywords: 'local bangla newspaper, district news bd, regional news bangladesh, আঞ্চলিক সংবাদপত্র'
  },
  { 
    id: 'english', 
    name: 'English Newspapers', 
    banglaName: 'ইংরেজি সংবাদপত্র',
    icon: 'Languages',
    slug: 'english-newspapers',
    title: 'English Newspapers in Bangladesh | ইংরেজি সংবাদপত্র বাংলাদেশ',
    description: 'List of all English newspapers published in Bangladesh. ইংরেজি সংবাদপত্র - Read The Daily Star, Dhaka Tribune, and Financial Express online.',
    keywords: 'english newspaper bangladesh, bd english news, dhaka tribune, daily star, ইংরেজি সংবাদপত্র'
  },
  { 
    id: 'international', 
    name: 'International', 
    banglaName: 'আন্তর্জাতিক সংবাদ',
    icon: 'Globe2',
    slug: 'international-news',
    title: 'International News Sites in Bangla | আন্তর্জাতিক সংবাদ মাধ্যম',
    description: 'Read international news from top global sources like BBC Bangla, VOA, and Al Jazeera. আন্তর্জাতিক সংবাদ - Stay informed about world events in Bangla.',
    keywords: 'international news in bangla, bbc bangla, world news bangla, আন্তর্জাতিক সংবাদ'
  },
  { 
    id: 'radio', 
    name: 'Radio Channels', 
    banglaName: 'বেতার ও রেডিও',
    icon: 'Radio',
    slug: 'radio-stations',
    title: 'Bangladesh Radio Stations Online | বেতার ও রেডিও চ্যানেল',
    description: 'Listen to all Bangladeshi radio stations online. বেতার ও রেডিও - Stream Bangladesh Betar, Radio Foorti, and Radio Today live.',
    keywords: 'bangladesh radio online, bd fm radio, live radio bangladesh, বেতার ও রেডিও'
  },
  { 
    id: 'magazine', 
    name: 'Bangla Magazines', 
    banglaName: 'বাংলা ম্যাগাজিন',
    icon: 'bangla-magazines',
    slug: 'bangla-magazines',
    title: 'Popular Bangla Magazines List | বাংলা ম্যাগাজিন তালিকা',
    description: 'Explore the best Bangla magazines including Kishor Alo, Ananda Alo, and Weekly Holiday. বাংলা ম্যাগাজিন - Read your favorite magazines online.',
    keywords: 'bangla magazine list, weekly bangla magazine, monthly bangla magazine, বাংলা ম্যাগাজিন'
  },
  { 
    id: 'jobs', 
    name: 'BD Job Sites', 
    banglaName: 'চাকরির খবর',
    icon: 'Briefcase',
    slug: 'bd-job-sites',
    title: 'Top BD Job Sites List | চাকরির খবর ও নিয়োগ বিজ্ঞপ্তি',
    description: 'Comprehensive list of top job sites in Bangladesh. চাকরির খবর - Find the latest government and private job circulars on BDJobs, Chakri.com, and more.',
    keywords: 'bd job sites, job circular bangladesh, govt job circular bd, চাকরির খবর'
  },
  { 
    id: 'sports', 
    name: 'Sports News', 
    banglaName: 'খেলার খবর',
    icon: 'Trophy',
    slug: 'sports-news',
    title: 'Sports News Bangladesh | খেলার খবর ও লাইভ স্কোর',
    description: 'Get the latest sports news from Bangladesh and around the world. খেলার খবর - Access Pavilion, ESPN Cricinfo, and other sports portals.',
    keywords: 'sports news bangla, bd sports news, cricket news bangladesh, খেলার খবর'
  },
  { 
    id: 'technology', 
    name: 'Tech News', 
    banglaName: 'প্রযুক্তি সংবাদ',
    icon: 'Cpu',
    slug: 'tech-news',
    title: 'Tech News Portals Bangladesh | প্রযুক্তি সংবাদ ও আপডেট',
    description: 'Stay updated with the latest technology news in Bangladesh. প্রযুক্তি সংবাদ - Explore Tech Shohor, DigiBangla, and other tech portals.',
    keywords: 'tech news bangla, technology news bangladesh, gadget news bd, প্রযুক্তি সংবাদ'
  },
  { 
    id: 'education', 
    name: 'Education', 
    banglaName: 'শিক্ষা সংবাদ',
    icon: 'GraduationCap',
    slug: 'education-news',
    title: 'Education News Sites Bangladesh | শিক্ষা সংবাদ ও ফলাফল',
    description: 'Find all education-related news sites in Bangladesh. শিক্ষা সংবাদ - Access Shikkhok Batayon, Admission War, and result portals.',
    keywords: 'education news bangladesh, bd result news, admission news bd, শিক্ষা সংবাদ'
  },
];

export const newsData: NewsItem[] = [
  // Top 10 Daily Bangla
  { id: 'prothom-alo', name: 'Prothom Alo', url: 'https://www.prothomalo.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/prothomalo.com' },
  { id: 'bangladesh-pratidin', name: 'Bangladesh Pratidin', url: 'https://www.bd-pratidin.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/bd-pratidin.com' },
  { id: 'jugantor', name: 'Jugantor', url: 'https://www.jugantor.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/jugantor.com' },
  { id: 'kaler-kantho', name: 'Kaler Kantho', url: 'https://www.kalerkantho.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/kalerkantho.com' },
  { id: 'daily-star-bangla', name: 'The Daily Star (Bangla)', url: 'https://bangla.thedailystar.net/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/thedailystar.net' },
  { id: 'samakal', name: 'Samakal', url: 'https://samakal.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/samakal.com' },
  { id: 'ittefaq', name: 'Ittefaq', url: 'https://www.ittefaq.com.bd/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/ittefaq.com.bd' },
  { id: 'inkilab', name: 'Inkilab', url: 'https://www.dailyinkilab.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/dailyinkilab.com' },
  { id: 'nayadiganta', name: 'Nayadiganta', url: 'https://www.dailynayadiganta.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/dailynayadiganta.com' },
  { id: 'amader-shomoy', name: 'Amader Shomoy', url: 'https://www.dainikamadershomoy.com/', category: 'daily-bangla', isTop: true, logo: 'https://logo.clearbit.com/dainikamadershomoy.com' },

  // Top 10 Online Bangla
  { id: 'bdnews24', name: 'BD News 24', url: 'https://bdnews24.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/bdnews24.com' },
  { id: 'banglanews24', name: 'Bangla News 24', url: 'https://www.banglanews24.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/banglanews24.com' },
  { id: 'jagonews24', name: 'Jago News 24', url: 'https://www.jagonews24.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/jagonews24.com' },
  { id: 'risingbd', name: 'Rising BD', url: 'https://www.risingbd.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/risingbd.com' },
  { id: 'dhakapost', name: 'Dhaka Post', url: 'https://www.dhakapost.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/dhakapost.com' },
  { id: 'bd24live', name: 'BD24Live', url: 'https://www.bd24live.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/bd24live.com' },
  { id: 'bbc-bangla', name: 'BBC Bangla', url: 'https://www.bbc.com/bengali', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/bbc.com' },
  { id: 'news-bangla24', name: 'News Bangla 24', url: 'https://www.newsbangla24.com/', category: 'online-bangla', isTop: true, logo: 'https://logo.clearbit.com/newsbangla24.com' },

  // Top 10 Live TV (YouTube Live Streams)
  { id: 'somoy-tv', name: 'Somoy TV Live', url: 'https://www.youtube.com/embed/live_stream?channel=UC8S_u_f04nK9_2_f6t6O2yA', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/somoynews.tv' },
  { id: 'jamuna-tv', name: 'Jamuna TV Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCvAbYp2pAs_3P7VipE4m0rg', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/jamuna.tv' },
  { id: 'independent-tv', name: 'Independent TV Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCp7B6A_G5O7f_6YtWlY3g5A', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/independent24.tv' },
  { id: 'channel-24', name: 'Channel 24 Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCf2H_3m6_Gv_CgA_6mE_A_A', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/channel24bd.tv' },
  { id: 'ekattor-tv', name: 'Ekattor TV Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCkS8vV_G_XvN1i-D0_X_fWw', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/ekattor.tv' },
  { id: 'dbc-news', name: 'DBC News Live', url: 'https://www.youtube.com/embed/live_stream?channel=UClUqM6jY0aTmO2_C-X_H_8g', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/dbcnews.tv' },
  { id: 'news-24', name: 'News 24 Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCvE6M6I_fD-i_Tq_qB2S6eA', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/news24bd.tv' },
  { id: 'rtv-online', name: 'RTV Live', url: 'https://www.youtube.com/embed/live_stream?channel=', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/rtvonline.com' },
  { id: 'ntv-bd', name: 'NTV Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCtbkWU88p5ks8-D4XW6X6g', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/ntvbd.com' },
  { id: 'channel-i', name: 'Channel I Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCtDuqcFT1_xY', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/channelionline.com' },
  { id: 'desh-tv', name: 'Desh TV Live', url: 'https://www.youtube.com/embed/live_stream?channel=UCFLcn6114h8A', category: 'live-tv', isTop: true, logo: 'https://logo.clearbit.com/desh.tv' },

  // Local & District
  { id: 'dainik-azadi', name: 'Dainik Azadi', url: 'https://dainikazadi.net/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/dainikazadi.net' },
  { id: 'dainik-purbokone', name: 'Dainik Purbokone', url: 'https://purbokone.net/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/purbokone.net' },
  { id: 'rajshahi-news-24', name: 'Rajshahi News 24', url: 'https://rajshahinews24.com/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/rajshahinews24.com' },
  { id: 'amader-comilla', name: 'Amader Comilla', url: 'https://amadercomilla.com/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/amadercomilla.com' },
  { id: 'dainik-purbanchal', name: 'Dainik Purbanchal', url: 'https://purbanchal.com/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/purbanchal.com' },
  { id: 'gramer-kagoj', name: 'Gramer Kagoj', url: 'https://gramerkagoj.com/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/gramerkagoj.com' },
  { id: 'dainik-coxsbazar', name: 'Dainik Coxsbazar', url: 'https://dainikcoxsbazar.com/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/dainikcoxsbazar.com' },
  { id: 'amader-barisal', name: 'Amader Barisal', url: 'https://amaderbarisal.com/', category: 'local-district', isTop: true, logo: 'https://logo.clearbit.com/amaderbarisal.com' },

  // More Local
  { id: 'matha-bhanga', name: 'Matha Bhanga', url: 'https://mathabhanga.com/', category: 'local-district', logo: 'https://logo.clearbit.com/mathabhanga.com' },
  { id: 'daily-khowai', name: 'Daily Khowai', url: 'https://dailykhowai.com/', category: 'local-district', logo: 'https://logo.clearbit.com/dailykhowai.com' },
  { id: 'dainik-sylhet', name: 'Dainik Sylhet', url: 'https://dainiksylhet.com/', category: 'local-district', logo: 'https://logo.clearbit.com/dainiksylhet.com' },
  { id: 'daily-sylhet', name: 'Daily Sylhet', url: 'https://dailysylhet.com/', category: 'local-district', logo: 'https://logo.clearbit.com/dailysylhet.com' },
  { id: 'bogra-sangbad', name: 'Bogra Sangbad', url: 'https://bograsangbad.com/', category: 'local-district', logo: 'https://logo.clearbit.com/bograsangbad.com' },
  { id: 'rajshahi-somoy', name: 'Rajshahi Somoy', url: 'https://rajshahisomoy.com/', category: 'local-district', logo: 'https://logo.clearbit.com/rajshahisomoy.com' },

  // More International
  { id: 'bbc-world', name: 'BBC World News', url: 'https://www.bbc.com/news', category: 'international', logo: 'https://logo.clearbit.com/bbc.com' },
  { id: 'washington-post', name: 'The Washington Post', url: 'https://www.washingtonpost.com/', category: 'international', logo: 'https://logo.clearbit.com/washingtonpost.com' },
  { id: 'wall-street-journal', name: 'The Wall Street Journal', url: 'https://www.wsj.com/', category: 'international', logo: 'https://logo.clearbit.com/wsj.com' },
  { id: 'telegraph', name: 'The Telegraph', url: 'https://www.telegraph.co.uk/', category: 'international', logo: 'https://logo.clearbit.com/telegraph.co.uk' },
  { id: 'hindustan-times', name: 'Hindustan Times', url: 'https://www.hindustantimes.com/', category: 'international', logo: 'https://logo.clearbit.com/hindustantimes.com' },

  // English Newspapers
  { id: 'daily-star', name: 'The Daily Star', url: 'https://www.thedailystar.net/', category: 'english', logo: 'https://logo.clearbit.com/thedailystar.net' },
  { id: 'business-standard', name: 'The Business Standard', url: 'https://www.tbsnews.net/', category: 'english', logo: 'https://logo.clearbit.com/tbsnews.net' },
  { id: 'new-age', name: 'New Age', url: 'https://www.newagebd.net/', category: 'english', logo: 'https://logo.clearbit.com/newagebd.net' },
  { id: 'daily-sun', name: 'Daily Sun', url: 'https://www.daily-sun.com/', category: 'english', logo: 'https://logo.clearbit.com/daily-sun.com' },
  { id: 'dhaka-tribune', name: 'Dhaka Tribune', url: 'https://www.dhakatribune.com/', category: 'english', logo: 'https://logo.clearbit.com/dhakatribune.com' },
  { id: 'financial-express', name: 'Financial Express', url: 'https://thefinancialexpress.com.bd/', category: 'english', logo: 'https://logo.clearbit.com/thefinancialexpress.com.bd' },

  // International
  { id: 'guardian', name: 'The Guardian', url: 'https://www.theguardian.com/', category: 'international', logo: 'https://logo.clearbit.com/theguardian.com' },
  { id: 'nytimes', name: 'The New York Times', url: 'https://www.nytimes.com/', category: 'international', logo: 'https://logo.clearbit.com/nytimes.com' },
  { id: 'cnn', name: 'CNN', url: 'https://edition.cnn.com/', category: 'international', logo: 'https://logo.clearbit.com/cnn.com' },
  { id: 'al-jazeera', name: 'Al Jazeera', url: 'https://www.aljazeera.com/', category: 'international', logo: 'https://logo.clearbit.com/aljazeera.com' },
  { id: 'reuters', name: 'Reuters', url: 'https://www.reuters.com/', category: 'international', logo: 'https://logo.clearbit.com/reuters.com' },

  // Radio
  { id: 'betar', name: 'Bangladesh Betar', url: 'https://betar.gov.bd/', category: 'radio', logo: 'https://logo.clearbit.com/betar.gov.bd' },
  { id: 'radio-foorti', name: 'Radio Foorti', url: 'https://radiofoorti.fm/', category: 'radio', logo: 'https://logo.clearbit.com/radiofoorti.fm' },
  { id: 'radio-today', name: 'Radio Today', url: 'https://radiotodaybd.fm/', category: 'radio', logo: 'https://logo.clearbit.com/radiotodaybd.fm' },
  { id: 'dhaka-fm', name: 'Dhaka FM', url: 'https://dhakafm.com.bd/', category: 'radio', logo: 'https://logo.clearbit.com/dhakafm.com.bd' },

  // Job Sites
  { id: 'bdjobs', name: 'BDJobs', url: 'https://www.bdjobs.com/', category: 'jobs', logo: 'https://logo.clearbit.com/bdjobs.com' },
  { id: 'chakri-com', name: 'Chakri.com', url: 'https://www.chakri.com/', category: 'jobs', logo: 'https://logo.clearbit.com/chakri.com' },
  { id: 'jagojobs', name: 'JagoJobs', url: 'https://www.jagojobs.com/', category: 'jobs', logo: 'https://logo.clearbit.com/jagojobs.com' },

  // More Daily Bangla
  { id: 'manab-zamin', name: 'Daily Manab Zamin', url: 'https://mzamin.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/mzamin.com' },
  { id: 'kalbela', name: 'Kalbela', url: 'https://www.kalbela.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/kalbela.com' },
  { id: 'janakantha', name: 'Janakantha', url: 'https://www.dailyjanakantha.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/dailyjanakantha.com' },
  { id: 'jaijaidin', name: 'Jai Jai Din', url: 'https://www.jaijaidinbd.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/jaijaidinbd.com' },
  { id: 'sangbad', name: 'Sangbad', url: 'https://sangbad.net.bd/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/sangbad.net.bd' },
  { id: 'desh-rupantor', name: 'Desh Rupantor', url: 'https://www.deshrupantor.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/deshrupantor.com' },
  { id: 'rupali-bangladesh', name: 'Rupali Bangladesh', url: 'https://rupalibangladesh.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/rupalibangladesh.com' },
  { id: 'daily-bartoman', name: 'Daily Bartoman', url: 'https://dailybartoman.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/dailybartoman.com' },
  { id: 'manob-kantha', name: 'Manob Kantha', url: 'https://www.manobkantha.com.bd/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/manobkantha.com.bd' },
  { id: 'ajker-patrika', name: 'Ajker Patrika', url: 'https://www.ajkerpatrika.com/', category: 'daily-bangla', logo: 'https://logo.clearbit.com/ajkerpatrika.com' },

  // More Online
  { id: 'sorobangla', name: 'Sarabangla', url: 'https://sarabangla.net/', category: 'online-bangla', logo: 'https://logo.clearbit.com/sarabangla.net' },
  { id: 'gonews24', name: 'Go News 24', url: 'https://www.gonews24.com/', category: 'online-bangla', logo: 'https://logo.clearbit.com/gonews24.com' },
  { id: 'bangla-insider', name: 'Bangla Insider', url: 'https://www.banglainsider.com/', category: 'online-bangla', logo: 'https://logo.clearbit.com/banglainsider.com' },
  { id: 'priyo', name: 'Priyo', url: 'https://www.priyo.com/', category: 'online-bangla', logo: 'https://logo.clearbit.com/priyo.com' },
  { id: 'voa-bangla', name: 'VOA Bangla', url: 'https://www.voabangla.com/', category: 'online-bangla', logo: 'https://logo.clearbit.com/voabangla.com' },
  { id: 'zoom-bangla', name: 'Zoom Bangla', url: 'https://zoombangla.com/', category: 'online-bangla', logo: 'https://logo.clearbit.com/zoombangla.com' },

  // Magazines
  { id: 'kishor-alo', name: 'Kishor Alo', url: 'https://www.kishoraloo.com/', category: 'magazine', logo: 'https://logo.clearbit.com/kishoraloo.com' },
  { id: 'ananda-alo', name: 'Ananda Alo', url: 'https://ananda-alo.com/', category: 'magazine', logo: 'https://logo.clearbit.com/ananda-alo.com' },
  { id: 'dhaka-courier', name: 'Dhaka Courier', url: 'https://dhakacourier.com.bd/', category: 'magazine', logo: 'https://logo.clearbit.com/dhakacourier.com.bd' },
  { id: 'holiday', name: 'Holiday', url: 'http://www.weeklyholiday.net/', category: 'magazine', logo: 'https://logo.clearbit.com/weeklyholiday.net' },

  // Sports
  { id: 'pavilion', name: 'Pavilion', url: 'https://pavilion.com.bd/', category: 'sports', logo: 'https://logo.clearbit.com/pavilion.com.bd' },
  { id: 'kheladhula24', name: 'Kheladhula24', url: 'https://kheladhula24.com/', category: 'sports', logo: 'https://logo.clearbit.com/kheladhula24.com' },
  { id: 'espn-cricinfo', name: 'ESPN Cricinfo', url: 'https://www.espncricinfo.com/', category: 'sports', logo: 'https://logo.clearbit.com/espncricinfo.com' },

  // Technology
  { id: 'tech-shohor', name: 'Tech Shohor', url: 'https://techshohor.com/', category: 'technology', logo: 'https://logo.clearbit.com/techshohor.com' },
  { id: 'digibangla', name: 'DigiBangla', url: 'https://digibangla.tech/', category: 'technology', logo: 'https://logo.clearbit.com/digibangla.tech' },
  { id: 'pc-world-bangla', name: 'PC World Bangla', url: 'https://pcworldbangla.com/', category: 'technology', logo: 'https://logo.clearbit.com/pcworldbangla.com' },

  // Education
  { id: 'shikkhok-batayon', name: 'Shikkhok Batayon', url: 'https://www.teachers.gov.bd/', category: 'education', logo: 'https://logo.clearbit.com/teachers.gov.bd' },
  { id: 'eduresource', name: 'EduResource', url: 'https://eduresource.com.bd/', category: 'education', logo: 'https://logo.clearbit.com/eduresource.com.bd' },
  { id: 'admission-war', name: 'Admission War', url: 'https://admissionwar.com/', category: 'education', logo: 'https://logo.clearbit.com/admissionwar.com' },
];
