import { categories, newsData } from '../data/newspapers';

import { fetchYouTubeLiveStreams } from './youtubeService.ts';

let liveCache: {
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export async function getLiveStreams(apiKey: string | undefined) {
  const finalKey = apiKey || "AIzaSyCVrAkr7nOyKrkgNUBA03MY-armVaYHKVY";
  
  if (liveCache && Date.now() - liveCache.timestamp < CACHE_DURATION) {
    return liveCache.data;
  }

  try {
    const results = await fetchYouTubeLiveStreams(finalKey);
    
    liveCache = {
      data: results,
      timestamp: Date.now()
    };
    
    return results;
  } catch (error) {
    console.error("Failed to fetch live streams:", error);
    throw error;
  }
}
