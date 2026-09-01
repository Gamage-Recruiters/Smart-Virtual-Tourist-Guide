import mongoose from 'mongoose';

const favoritePlaceSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		placeId: {
			type: String,
			default: null,
			trim: true,
		},
		category: {
			type: String,
			default: 'favorite',
			trim: true,
		},
		imageUrls: {
			type: [String],
			default: [],
		},
		imageUrl: {
			type: String,
			trim: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: process.env.FAVORITE_PLACES_COLLECTION || 'favoritePlaces',
	}
);

export default mongoose.model('FavoritePlace', favoritePlaceSchema);
