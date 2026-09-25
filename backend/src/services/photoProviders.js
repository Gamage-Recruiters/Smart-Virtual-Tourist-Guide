import { fetchCommonsPhotos } from '../controllers/placePhotoController.js';

const pexelsProvider = {
  name: 'Pexels',
  cooldownUntil: 0,
  async search(place, max) {
    if (!process.env.PEXELS_API_KEY || process.env.PEXELS_API_KEY === 'your_pexels_api_key_here') return [];
    
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(place.name + ' Sri Lanka')}&per_page=${max}`;
    const res = await fetch(url, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      }
    });

    if (!res.ok) {
      const err = new Error('Pexels API error');
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return (data.photos || []).map(p => p.src.large).slice(0, max);
  }
};

const pixabayProvider = {
  name: 'Pixabay',
  cooldownUntil: 0,
  async search(place, max) {
    if (!process.env.PIXABAY_API_KEY || process.env.PIXABAY_API_KEY === 'your_pixabay_api_key_here') return [];

    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(place.name)}&image_type=photo&per_page=${max}`;
    const res = await fetch(url);

    if (!res.ok) {
      const err = new Error('Pixabay API error');
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return (data.hits || []).map(h => h.largeImageURL).slice(0, max);
  }
};

const wikimediaProvider = {
  name: 'Wikimedia',
  cooldownUntil: 0,
  async search(place, max) {
    return await fetchCommonsPhotos(place.lat, place.lng, max);
  }
};

const providers = [pexelsProvider, pixabayProvider, wikimediaProvider];

export async function searchPlacePhotos(place, max) {
  for (const provider of providers) {
    if (provider.cooldownUntil > Date.now()) {
      console.log(`[Photo Fallback] Skipping ${provider.name} (in cooldown)`);
      continue;
    }
    
    try {
      const photos = await provider.search(place, max);
      if (photos && photos.length > 0) {
        console.log(`[Photo Fallback] Fetched ${photos.length} photos from ${provider.name} for "${place.name}"`);
        return photos;
      }
    } catch (err) {
      if (err.status === 429 || err.status >= 500) {
        console.warn(`[Photo Fallback] ${provider.name} returned ${err.status}. Setting 5 min cooldown.`);
        provider.cooldownUntil = Date.now() + 5 * 60_000;
      } else {
        console.warn(`[Photo Fallback] ${provider.name} failed:`, err.message);
      }
    }
  }
  
  return [];
}
