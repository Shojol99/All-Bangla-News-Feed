import { newsData } from '../data/newspapers';

const CHANNELS = [
  { id: 'somoy-tv', name: 'Somoy TV', channelIds: ['UCxHoBXkY88Tb8z1Ssj6CWsQ', 'UCp6MvXoXm-W-8Pz7Yv1YV-A'] },
  { id: 'jamuna-tv', name: 'Jamuna TV', channelIds: ['UCN6sm8iHiPd0cnoUardDAnw', 'UCvAbYp2pAs_3P7VipE4m0rg'] },
  { id: 'independent-tv', name: 'Independent TV', channelIds: ['UCATUkaOHwO9EP_W87zCiPbA', 'UCp7B6A_G5O7f_6YtWlY3g5A'] },
  { id: 'channel-24', name: 'Channel 24', channelIds: ['UCHLqIOMPk20w-6cFgkA90jw', 'UCf2H_3m6_Gv_CgA_6mE_A_A'] },
  { id: 'ekattor-tv', name: 'Ekattor TV', channelIds: ['UCtqvtAVmad5zywaziN6CbfA', 'UCkS8vV_G_XvN1i-D0_X_fWw'] },
  { id: 'dbc-news', name: 'DBC News', channelIds: ['UClUqM6jY0aTmO2_C-X_H_8g'] },
  { id: 'news-24', name: 'News 24', channelIds: ['UCPREnbhKQP-hsVfsfKP-mCw', 'UCvE6M6I_fD-i_Tq_qB2S6eA'] },
  { id: 'rtv-online', name: 'RTV News', channelIds: ['UC2P5Fd5g41Gtdqf0Uzh8Qaw', 'UCIsmK5L_Uo_kXmXv6zN-v6A'] },
  { id: 'ntv-bd', name: 'NTV News', channelIds: ['UCUDQdVsKssximyFwg4IxnOQ', 'UCtbkWU88p5ks8-D4XW6X6g'] },
  { id: 'channel-i', name: 'Channel i', channelIds: ['UCAz6rveBalVnE6qTmfQnvyQ', 'UCtDuqcFT1_xY'] },
  { id: 'desh-tv', name: 'Desh TV', channelIds: ['UCqyt55f3byoK8rjgO0LBe4Q', 'UCFLcn6114h8A'] }
];

// Simple cache to prevent quota exhaustion
const CACHE_KEY = 'yt_live_cache_v4';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export async function fetchYouTubeLiveStreams(apiKey: string) {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  // Try to get from cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log('Returning YouTube data from cache');
        return data;
      }
    } catch (e) {
      console.error('Cache parse error:', e);
    }
  }

  console.log('Fetching live streams from YouTube API...');

  const promises = CHANNELS.map(async (channel) => {
    const originalSource = newsData.find(n => n.id === channel.id);
    
    try {
      // 1. Try each Channel ID in order for an active live video
      for (const channelId of channel.channelIds) {
        if (!channelId || !channelId.startsWith('UC')) continue;

        try {
          const url = new URL('https://www.googleapis.com/youtube/v3/search');
          url.searchParams.append('part', 'snippet');
          url.searchParams.append('type', 'video');
          url.searchParams.append('eventType', 'live');
          url.searchParams.append('channelId', channelId);
          url.searchParams.append('maxResults', '1');
          url.searchParams.append('key', apiKey);

          const response = await fetch(url.toString());
          const data = await response.json();

          if (data.error) {
             console.warn(`YouTube API error for ${channel.name} (${channelId}):`, data.error.message);
             continue; 
          }

          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            return {
              id: channel.id,
              name: channel.name,
              videoId: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              logo: originalSource?.logo || `https://logo.clearbit.com/${channel.id}.com`,
              isLive: true
            };
          }
        } catch (innerErr) {
          console.error(`Error searching channelId ${channelId} for ${channel.name}:`, innerErr);
        }
      }

      // 2. Fallback: Search by name if all channel searches failed
      try {
        const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
        searchUrl.searchParams.append('part', 'snippet');
        searchUrl.searchParams.append('type', 'video');
        searchUrl.searchParams.append('eventType', 'live');
        searchUrl.searchParams.append('q', `${channel.name} Official Live Streaming Bangladesh`);
        searchUrl.searchParams.append('maxResults', '1');
        searchUrl.searchParams.append('key', apiKey);

        const searchResponse = await fetch(searchUrl.toString());
        const searchData = await searchResponse.json();

        if (searchData.items && searchData.items.length > 0) {
          const item = searchData.items[0];
          return {
            id: channel.id,
            name: channel.name,
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            logo: originalSource?.logo || `https://logo.clearbit.com/${channel.id}.com`,
            isLive: true
          };
        }
      } catch (searchErr) {
        console.error(`Error name-searching for ${channel.name}:`, searchErr);
      }

      // 3. Final Fallback: Direct channel embed URL using the primary channelId
      return {
        id: channel.id,
        name: channel.name,
        videoId: `live_stream?channel=${channel.channelIds[0]}`,
        title: `${channel.name} Live`,
        thumbnail: originalSource?.logo || '',
        logo: originalSource?.logo,
        isLive: true,
        isFallback: true
      };
    } catch (err) {
      console.error(`Fatal error fetching live status for ${channel.name}:`, err);
      return {
        id: channel.id,
        name: channel.name,
        videoId: `live_stream?channel=${channel.channelIds[0]}`,
        logo: originalSource?.logo,
        isLive: true,
        isFallback: true
      };
    }
  });

  const results = await Promise.all(promises);
  
  // Save to cache
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: results,
    timestamp: Date.now()
  }));

  return results;
}
