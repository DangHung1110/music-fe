import axios from 'axios';

const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

const jamendoApi = axios.create({
  baseURL: JAMENDO_BASE_URL,
});

// Fetch popular/public tracks
export async function fetchPopularTracks({ clientId, limit = 20, offset = 0, order = 'popularity_total' } = {}) {
  if (!clientId) throw new Error('Missing Jamendo clientId');
  const { data } = await jamendoApi.get('/tracks', {
    params: {
      client_id: clientId,
      format: 'jsonpretty',
      limit,
      offset,
      order,
      include: 'musicinfo+stats',
      audioformat: 'mp31',
      imagesize: 100,
    },
  });
  return data?.results || [];
}

// Search tracks by keyword
export async function searchTracks({ clientId, query, limit = 20, offset = 0, order = 'popularity_total' } = {}) {
  if (!clientId) throw new Error('Missing Jamendo clientId');
  const { data } = await jamendoApi.get('/tracks', {
    params: {
      client_id: clientId,
      format: 'jsonpretty',
      limit,
      offset,
      order,
      include: 'musicinfo+stats',
      audioformat: 'mp31',
      imagesize: 100,
      namesearch: query,
    },
  });
  return data?.results || [];
}

// Fetch latest tracks (newest first)
export async function fetchLatestTracks({ clientId, limit = 10, offset = 0 } = {}) {
  if (!clientId) throw new Error('Missing Jamendo clientId');
  
  try {
    const { data } = await jamendoApi.get('/tracks', {
      params: {
        client_id: clientId,
        format: 'jsonpretty',
        limit,
        offset,
        order: 'releasedate_desc', // Order by release date descending (newest first)
        include: 'musicinfo+stats',
        audioformat: 'mp31',
        imagesize: 200,
      },
    });
    
    // Jamendo API returns { results: [...] } or { headers: {...}, results: [...] }
    const tracks = data?.results || data?.data || [];
    console.log('Jamendo API response:', { data, tracksCount: tracks.length });
    return tracks;
  } catch (error) {
    console.error('Jamendo API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

// Build a stream URL for a track (if audio is provided)
export function getTrackStreamUrl(track) {
  // Jamendo returns `audio` or `audiodownload` links depending on format
  return track?.audio || track?.audiodownload || null;
}

export default {
  fetchPopularTracks,
  searchTracks,
  fetchLatestTracks,
  getTrackStreamUrl,
};



