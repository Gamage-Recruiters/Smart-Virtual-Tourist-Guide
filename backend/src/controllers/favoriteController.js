import FavoritePlace from '../models/favoritePlace.js';

const DEFAULT_USER_ID = process.env.RECENT_PLACES_DEFAULT_USER_ID || 'testUser01';

const resolveUserId = (req) => {
	return req.body?.userId || req.query?.userId || DEFAULT_USER_ID;
};

const normalizeImageUrls = (imageUrls) => {
	if (!Array.isArray(imageUrls)) return [];
	return [...new Set(imageUrls.filter(Boolean))].slice(0, 2);
};

const resolvePlaceId = (req) => {
	return req.body?.placeId || req.body?.place_id || req.query?.placeId || req.query?.place_id || null;
};

const fetchPlaceImageUrls = async (placeId) => {
	const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
	if (!apiKey) return [];
	if (!placeId) return [];

	const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
	url.searchParams.set('place_id', placeId);
	url.searchParams.set('fields', 'photos');
	url.searchParams.set('key', apiKey);

	try {
		const response = await fetch(url.toString());
		if (!response.ok) return [];
		const payload = await response.json();
		const photos = payload?.result?.photos || [];
		return photos.slice(0, 2).map((photo) => {
			const reference = photo.photo_reference;
			return reference
				? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${encodeURIComponent(reference)}&key=${apiKey}`
				: '';
		}).filter(Boolean);
	} catch (error) {
		console.error('Failed to fetch place image urls:', error);
		return [];
	}
};

const getFavoritePlaces = async (req, res) => {
	try {
		const { category } = req.query;
		const resolvedUserId = resolveUserId(req);
		const filter = { userId: resolvedUserId };
		if (category) filter.category = category;

		const favoritePlaces = await FavoritePlace.find(filter)
			.sort({ timestamp: -1 })
			.limit(200);

		const uniqueMap = new Map();
		for (const place of favoritePlaces) {
			const key = place.placeId || place.name;
			if (!uniqueMap.has(key)) {
				uniqueMap.set(key, place);
			}
		}

		const deduplicatedPlaces = Array.from(uniqueMap.values());

		res.status(200).json({
			success: true,
			count: deduplicatedPlaces.length,
			data: deduplicatedPlaces,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch favorite places',
			error: error.message,
		});
	}
};

const createFavoritePlace = async (req, res) => {
	try {
		const {
			name,
			placeId,
			category,
			imageUrls,
			imageUrl,
			timestamp,
		} = req.body;

		const resolvedUserId = resolveUserId(req);
		const resolvedName = name || req.body.placeName;
		const resolvedPlaceId = placeId || resolvePlaceId(req);
		const resolvedCategory = category || 'favorite';
		
		if (!resolvedName) {
			return res.status(400).json({
				success: false,
				message: 'name is required',
			});
		}

		const resolvedImageUrls = normalizeImageUrls(imageUrls || (imageUrl ? [imageUrl] : []));
		const fetchedImageUrls = resolvedImageUrls.length > 0 ? resolvedImageUrls : await fetchPlaceImageUrls(resolvedPlaceId);
		const imageUrlsToStore = normalizeImageUrls(fetchedImageUrls);

		const lookupQuery = {
			userId: resolvedUserId,
			category: resolvedCategory,
			...(resolvedPlaceId ? { placeId: resolvedPlaceId } : { name: resolvedName }),
		};

		let existingFavorite = await FavoritePlace.findOne(lookupQuery);

		if (!existingFavorite) {
			const favoritePlace = await FavoritePlace.create({
				userId: resolvedUserId,
				name: resolvedName,
				placeId: resolvedPlaceId,
				category: resolvedCategory,
				imageUrls: imageUrlsToStore,
				imageUrl: imageUrlsToStore[0] || imageUrl || undefined,
				timestamp,
			});

			return res.status(201).json({
				success: true,
				message: 'Favorite place saved successfully',
				data: favoritePlace,
			});
		}

		const updates = {};
		if (imageUrlsToStore.length > 0) {
			updates.imageUrls = imageUrlsToStore;
			updates.imageUrl = imageUrlsToStore[0];
		} else if (imageUrl && !existingFavorite.imageUrl) {
			updates.imageUrl = imageUrl;
		}

		if (timestamp && !existingFavorite.timestamp) {
			updates.timestamp = timestamp;
		}

		if (Object.keys(updates).length > 0) {
			await FavoritePlace.updateOne(lookupQuery, { $set: updates });
		}

		const updatedFavorite = await FavoritePlace.findOne(lookupQuery);

		res.status(200).json({
			success: true,
			message: Object.keys(updates).length > 0 ? 'Favorite place updated' : 'Favorite place already exists',
			data: updatedFavorite || existingFavorite,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to save favorite place',
			error: error.message,
		});
	}
};

const deleteFavoritePlace = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await FavoritePlace.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: 'Favorite place not found',
			});
		}
		res.status(200).json({
			success: true,
			message: 'Favorite place removed',
			data: deleted,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to delete favorite place',
			error: error.message,
		});
	}
};

export { getFavoritePlaces, createFavoritePlace, deleteFavoritePlace };
