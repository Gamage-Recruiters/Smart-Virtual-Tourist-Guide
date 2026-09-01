import GuideProfile from '../models/GuideProfile.js';
import GuideBid from '../models/GuideBid.js';
import GuideBooking from '../models/GuideBooking.js';
import GuideReview from '../models/GuideReview.js';

const dropIndexes = async (collection, names) => {
  const existing = new Set((await collection.indexes()).map((index) => index.name));
  for (const name of names) {
    if (existing.has(name)) await collection.dropIndex(name);
  }
};

/**
 * Older Guide work used `userId` and a required, unique `guideId` index while
 * the integrated model uses `user`. MongoDB keeps those indexes after a
 * schema changes, so a second modern profile can fail on a duplicate `null`.
 *
 * Copy the legacy relationship first, then remove only the obsolete unique
 * indexes. The current `user_1` unique index remains the authoritative
 * one-profile-per-user constraint.
 */
export default async function migrateGuideProfiles() {
  const collection = GuideProfile.collection;
  const indexes = await collection.indexes();
  const indexNames = new Set(indexes.map((index) => index.name));

  const legacyProfiles = await collection.find({
    user: { $exists: false },
    userId: { $type: 'objectId' },
  }).toArray();

  for (const legacy of legacyProfiles) {
    const current = await collection.findOne({ user: legacy.userId });
    const translated = {
      professionalTitle: legacy.professionalTitle,
      avatarUrl: legacy.profileImage,
      coverImageUrl: legacy.coverImage,
      bio: legacy.bio,
      experienceYears: legacy.yearsExperience,
      languages: Array.isArray(legacy.languages)
        ? legacy.languages.map((item) => typeof item === 'string' ? item : item?.name).filter(Boolean)
        : [],
      highlights: legacy.highlights,
      gallery: legacy.gallery,
      verified: legacy.verified,
      active: legacy.active,
      ratingAverage: legacy.averageRating,
      reviewCount: legacy.reviewCount,
    };
    const usableTranslated = Object.fromEntries(Object.entries(translated).filter(([, value]) => (
      value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length)
    )));

    if (current) {
      const missingOnly = Object.fromEntries(Object.entries(usableTranslated).filter(([key]) => {
        const value = current[key];
        return value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
      }));
      if (Object.keys(missingOnly).length) {
        await collection.updateOne({ _id: current._id }, { $set: missingOnly });
      }
      await collection.deleteOne({ _id: legacy._id });
    } else {
      await collection.updateOne(
        { _id: legacy._id },
        { $set: { user: legacy.userId, ...usableTranslated } },
      );
    }
  }

  if (indexNames.has('userId_1')) {
    await collection.dropIndex('userId_1');
  }
  if (indexNames.has('guideId_1')) {
    await collection.dropIndex('guideId_1');
  }

  // These legacy, non-sparse unique indexes treat every modern document's
  // missing legacy fields as the same `null` value. Keep the modern unique
  // relationship indexes and remove only their obsolete predecessors.
  await dropIndexes(GuideBid.collection, [
    'requestId_1_guideId_1',
    'one_active_bid_per_guide_request',
  ]);
  await dropIndexes(GuideBooking.collection, ['requestId_1', 'bidId_1']);
  await dropIndexes(GuideReview.collection, ['bookingId_1']);
}
