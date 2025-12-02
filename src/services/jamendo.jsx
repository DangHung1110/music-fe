import axios from 'axios';

const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

const jamendoApi = axios.create({
  baseURL: JAMENDO_BASE_URL,
});

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

// Fetch popular albums
export async function fetchPopularAlbums({ clientId, limit = 20, offset = 0, order = 'popularity_total' } = {}) {
  if (!clientId) throw new Error('Missing Jamendo clientId');
  try {
    const { data } = await jamendoApi.get('/albums', {
      params: {
        client_id: clientId,
        format: 'jsonpretty',
        limit,
        offset,
        order,
        include: 'musicinfo+stats',
        imagesize: 200,
      },
    });
    return data?.results || [];
  } catch (error) {
    console.error('Jamendo API error fetching albums:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

// Fetch tracks by IDs
// Jamendo API có giới hạn về số lượng IDs có thể query cùng lúc, nên chia thành batch
export async function fetchTracksByIds({ clientId, trackIds = [] } = {}) {
  if (!clientId) throw new Error('Missing Jamendo clientId');
  if (!trackIds || trackIds.length === 0) return [];
  
  try {
    console.log('Fetching tracks with IDs:', trackIds);
    
    // Fetch từng track riêng lẻ vì Jamendo API có thể không hỗ trợ multiple IDs
    const trackPromises = trackIds.map(async (trackId) => {
      try {
        const { data } = await jamendoApi.get('/tracks', {
          params: {
            client_id: clientId,
            format: 'jsonpretty',
            id: trackId, // Fetch từng ID riêng
            include: 'musicinfo+stats',
            audioformat: 'mp31',
            imagesize: 200,
          },
        });
        
        console.log(`Track ${trackId} response:`, data);
        return data?.results?.[0] || null;
      } catch (error) {
        console.error(`Error fetching track ${trackId}:`, error.message);
        return null;
      }
    });
    
    const tracks = await Promise.all(trackPromises);
    const validTracks = tracks.filter(track => track !== null);
    
    console.log(`Fetched ${validTracks.length}/${trackIds.length} tracks successfully`);
    return validTracks;
  } catch (error) {
    console.error('Jamendo API error fetching tracks by IDs:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

// Fetch tracks by album ID
export async function fetchAlbumTracks({ clientId, albumId, limit = 20 } = {}) {
  if (!clientId) throw new Error('Missing Jamendo clientId');
  if (!albumId) throw new Error('Missing albumId');
  
  try {
    const { data } = await jamendoApi.get('/tracks', {
      params: {
        client_id: clientId,
        format: 'jsonpretty',
        album_id: albumId,
        limit,
        include: 'musicinfo+stats',
        audioformat: 'mp31',
        imagesize: 200,
      },
    });
    
    console.log(`Fetched ${data?.results?.length || 0} tracks for album ${albumId}`);
    return data?.results || [];
  } catch (error) {
    console.error(`Error fetching tracks for album ${albumId}:`, error.message);
    throw error;
  }
}

export function getTrackStreamUrl(track) {
   return track?.audio || track?.audiodownload || null;
}

export default {
  fetchPopularTracks,
  searchTracks,
  fetchLatestTracks,
  fetchPopularAlbums,
  fetchTracksByIds,
  fetchAlbumTracks, // Thêm hàm mới
  getTrackStreamUrl,
};



