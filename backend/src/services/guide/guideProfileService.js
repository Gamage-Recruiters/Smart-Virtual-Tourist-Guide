import GuideProfile from '../../models/GuideProfile.js';
import GuideReview from '../../models/GuideReview.js';
import AppError from '../../utils/AppError.js';
import {cleanString,
  cleanStringArray,
  paginationMeta,
  parseBoolean,
  parseOptionalNumber,
  parsePagination,} from '../../utils/guideValidation.js';

const editableFields = [
  'displayName', 'profileImage', 'location', 'bio', 'tourStyle', 'localKnowledge', 'experienceYears',
  'responseTime', 'languages', 'specialities', 'qualifications', 'certifications', 'areasCovered',
  'availability', 'unavailableRanges',
];

const normalizeLanguages = (languages) => {
  if (languages === undefined) return undefined;
  if (!Array.isArray(languages) || languages.length > 20) throw new AppError('Languages must contain at most 20 items.', 400, 'VALIDATION_ERROR');
  return languages.map((item) => {
    if (!item || typeof item !== 'object') throw new AppError('Each language must include a name and proficiency.', 400, 'VALIDATION_ERROR');
    return {
      name: cleanString(item.name ?? item.language, 60, 'Language', { required: true }),
      proficiency: cleanString(item.proficiency, 60, 'Language proficiency', { required: true }),
    };
  });
};

const normalizeUnavailableRanges = (ranges) => {
  if (ranges === undefined) return undefined;
  if (!Array.isArray(ranges) || ranges.length > 100) throw new AppError('Unavailable date ranges must contain at most 100 items.', 400, 'VALIDATION_ERROR');
  return ranges.map((range) => {
    const startDate = new Date(range?.startDate);
    const endDate = new Date(range?.endDate);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
      throw new AppError('Every unavailable date range must have valid ordered dates.', 400, 'INVALID_DATES');
    }
    return { startDate, endDate, reason: cleanString(range.reason, 160, 'Unavailable reason') || '' };
  });
};

const normalizeProfileInput = (input = {}, { partial = false } = {}) => {
  if (Object.keys(input).some((field) => !editableFields.includes(field))) throw new AppError('The profile contains fields that guides cannot change.', 400, 'UNSAFE_UPDATE');
  const output = {};
  const set = (field, value) => { if (value !== undefined) output[field] = value; };
  set('displayName', cleanString(input.displayName, 120, 'Display name', { required: !partial }));
  set('profileImage', cleanString(input.profileImage, 2048, 'Profile image'));
  if (output.profileImage && !/^https?:\/\//i.test(output.profileImage) && !output.profileImage.startsWith('/')) throw new AppError('Profile image must be an HTTP URL or application path.', 400, 'VALIDATION_ERROR');
  set('location', cleanString(input.location, 160, 'Location'));
  set('bio', cleanString(input.bio, 2000, 'Bio'));
  set('tourStyle', cleanString(input.tourStyle, 500, 'Tour style'));
  set('localKnowledge', cleanString(input.localKnowledge, 500, 'Local knowledge'));
  set('experienceYears', parseOptionalNumber(input.experienceYears, 'Experience', { min: 0, max: 80 }));
  set('responseTime', cleanString(input.responseTime, 120, 'Response time'));
  set('languages', normalizeLanguages(input.languages));
  set('specialities', cleanStringArray(input.specialities, 'Specialities', { maxItems: 30, maxLength: 100 }));
  set('qualifications', cleanStringArray(input.qualifications, 'Qualifications', { maxItems: 30, maxLength: 200 }));
  set('certifications', cleanStringArray(input.certifications, 'Certifications', { maxItems: 30, maxLength: 200 }));
  set('areasCovered', cleanStringArray(input.areasCovered, 'Areas covered', { maxItems: 50, maxLength: 120 }));
  if (input.availability !== undefined) {
    if (!['Available', 'Unavailable'].includes(input.availability)) throw new AppError('Invalid guide availability.', 400, 'VALIDATION_ERROR');
    output.availability = input.availability;
  }
  set('unavailableRanges', normalizeUnavailableRanges(input.unavailableRanges));
  return output;
};

const serializeReview = (review) => ({
  id: String(review._id),
  reviewerName: review.touristId?.fullName || 'Verified traveller',
  date: review.createdAt,
  rating: review.rating,
  content: review.comment,
});

const serializePublicProfile = (profile, reviews = [], ratingDistribution = {}) => ({
  id: String(profile._id),
  name: profile.displayName,
  image: profile.profileImage,
  verified: profile.verified,
  rating: profile.averageRating,
  averageRating: profile.averageRating,
  reviewCount: profile.reviewCount,
  ratingDistribution,
  experienceYears: profile.experienceYears,
  location: profile.location,
  languages: profile.languages,
  specialities: profile.specialities,
  bio: profile.bio,
  tourStyle: profile.tourStyle,
  localKnowledge: profile.localKnowledge,
  qualifications: profile.qualifications,
  certifications: profile.certifications,
  completedTours: profile.completedTours,
  areasCovered: profile.areasCovered,
  availability: profile.availability,
  responseTime: profile.responseTime,
  profileCompletion: profile.verified ? 'Identity and guide licence verified' : 'Verification pending',
  reviews: reviews.map(serializeReview),
  createdAt: profile.createdAt,
});

const getPublicProfile = async (guideId) => {
  const profile = await GuideProfile.findOne({ _id: guideId, active: true });
  if (!profile) throw new AppError('Guide profile not found.', 404, 'GUIDE_NOT_FOUND');
  const [reviews, distribution] = await Promise.all([
    GuideReview.find({ guideId: profile._id, status: 'Published' }).populate('touristId', 'fullName').sort({ createdAt: -1 }).limit(20).lean(),
    GuideReview.aggregate([
      { $match: { guideId: profile._id, status: 'Published' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]),
  ]);
  const ratingDistribution = Object.fromEntries([1, 2, 3, 4, 5].map((rating) => [rating, distribution.find((item) => item._id === rating)?.count || 0]));
  return serializePublicProfile(profile, reviews, ratingDistribution);
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listPublicProfiles = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query, 12);
  const filter = { active: true };
  const minRating = parseOptionalNumber(query.minRating, 'Minimum rating', { min: 0, max: 5 });
  const minExperience = parseOptionalNumber(query.minExperience, 'Minimum experience', { min: 0, max: 80 });
  const verified = parseBoolean(query.verified, 'Verified');

  if (query.search) {
    const search = cleanString(query.search, 120, 'Search');
    filter.$or = [
      { displayName: { $regex: escapeRegex(search), $options: 'i' } },
      { location: { $regex: escapeRegex(search), $options: 'i' } },
      { specialities: { $regex: escapeRegex(search), $options: 'i' } },
    ];
  }
  if (query.language) filter['languages.name'] = cleanString(query.language, 60, 'Language');
  if (query.speciality) filter.specialities = cleanString(query.speciality, 100, 'Speciality');
  if (query.availability) {
    if (!['Available', 'Unavailable'].includes(query.availability)) throw new AppError('Invalid guide availability filter.', 400, 'INVALID_FILTER');
    filter.availability = query.availability;
  }
  if (minRating !== undefined) filter.averageRating = { $gte: minRating };
  if (minExperience !== undefined) filter.experienceYears = { $gte: minExperience };
  if (verified !== undefined) filter.verified = verified;

  const sorts = {
    recommended: { verified: -1, averageRating: -1, reviewCount: -1, displayName: 1 },
    rating_desc: { averageRating: -1, reviewCount: -1 },
    experience_desc: { experienceYears: -1, averageRating: -1 },
    newest: { createdAt: -1 },
  };
  const sort = sorts[query.sort || 'recommended'];
  if (!sort) throw new AppError('Invalid guide sort option.', 400, 'INVALID_SORT');

  const [profiles, totalItems] = await Promise.all([
    GuideProfile.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    GuideProfile.countDocuments(filter),
  ]);
  return {
    guides: profiles.map((profile) => serializePublicProfile(profile)),
    pagination: paginationMeta({ page, limit, totalItems }),
  };
};

const getOwnProfile = async (user) => GuideProfile.findOne({ userId: user._id });

const createOwnProfile = async (user, input) => {
  if (await GuideProfile.exists({ userId: user._id })) throw new AppError('A guide profile already exists for this account.', 409, 'PROFILE_EXISTS');
  return GuideProfile.create({
    ...normalizeProfileInput(input),
    userId: user._id,
    guideIdNumber: user.guideId || String(user._id),
  });
};

const updateOwnProfile = async (user, input) => {
  const profile = await GuideProfile.findOne({ userId: user._id });
  if (!profile) throw new AppError('Guide profile not found.', 404, 'GUIDE_NOT_FOUND');
  Object.assign(profile, normalizeProfileInput(input, { partial: true }));
  await profile.save();
  return profile;
};

export { getPublicProfile, listPublicProfiles, getOwnProfile, createOwnProfile, updateOwnProfile, serializePublicProfile };
