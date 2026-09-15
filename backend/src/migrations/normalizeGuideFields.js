import GuideProfile from '../models/GuideProfile.js';
import GuideRequest from '../models/GuideRequest.js';
import GuideBid from '../models/GuideBid.js';
import GuideBooking from '../models/GuideBooking.js';
import GuidePackage from '../models/GuidePackage.js';

// Preserve records written by either Guide implementation. Only fill missing
// canonical fields; keep original fields and existing prices intact.
export function canonicalGuideFields(kind, record) {
  const mappings = {
    profile: { avatar: 'avatarUrl', coverImage: 'coverImageUrl' },
    request: { travellers: 'travelers', language: 'languagePreference', requirements: 'specialRequirements' },
    booking: { travellers: 'travelers', subtotal: 'bidAmount' },
    package: { name: 'title', description: 'shortDescription', stops: 'routeStops' },
  };
  const updates = {};
  for (const [target, source] of Object.entries(mappings[kind] || {})) {
    if (record[target] == null && record[source] != null) updates[target] = record[source];
  }
  if (kind === 'profile' && Array.isArray(record.specialSkills)) {
    updates.specialSkills = record.specialSkills.join(', ');
  }
  if (kind === 'booking' && record.bidAmount != null) {
    const span = (new Date(record.endDate) - new Date(record.startDate)) / 86400000;
    if (Number.isFinite(span) && span >= 0) {
      const days = record.days || Math.max(1, Math.ceil(span) + 1);
      if (record.days == null) updates.days = days;
      if (record.dailyRate == null) updates.dailyRate = Number((record.bidAmount / days).toFixed(2));
    }
  }
  return updates;
}

export default async function normalizeGuideFields() {
  const sources = [
    ['profile', GuideProfile, { $or: [{ avatarUrl: { $exists: true } }, { coverImageUrl: { $exists: true } }, { specialSkills: { $type: 'array' } }] }],
    ['request', GuideRequest, { travelers: { $exists: true } }],
    ['booking', GuideBooking, { bidAmount: { $exists: true } }],
    ['package', GuidePackage, { title: { $exists: true } }],
  ];
  for (const [kind, model, filter] of sources) {
    for await (const record of model.collection.find(filter)) {
      if (kind === 'request' && record.travellers == null) {
        // Incoming requests used a total-trip bid amount. Keep that meaning
        // when the completed daily-rate UI reads an existing bid.
        await GuideBid.collection.updateMany(
          { request: record._id, pricingBasis: { $exists: false } },
          { $set: { pricingBasis: 'trip' } },
        );
      }
      const updates = canonicalGuideFields(kind, record);
      if (Object.keys(updates).length) {
        await model.collection.updateOne({ _id: record._id }, { $set: updates });
      }
    }
  }
}
