import rohanAvatar from '../assets/guideBids/rohan-perera.svg'
import malikiAvatar from '../assets/guideBids/maliki-perera.svg'
import ajithAvatar from '../assets/guideBids/ajith-perera.svg'
import johnAvatar from '../assets/guideBids/john-perera.svg'

const reviewSet = (name, rating) => [
  {
    id: `${name.toLowerCase().replaceAll(' ', '-')}-review-1`,
    reviewerName: 'Amelia R.',
    date: '2026-06-18',
    rating,
    content: 'A thoughtful, well-paced tour with clear local insight and plenty of time for questions.',
  },
  {
    id: `${name.toLowerCase().replaceAll(' ', '-')}-review-2`,
    reviewerName: 'Nimal S.',
    date: '2026-04-03',
    rating: Math.max(4, Math.floor(rating)),
    content: 'Friendly, punctual and flexible when our plans changed. The whole family felt comfortable.',
  },
]

const makeGuide = ({
  id,
  name,
  image,
  rating,
  reviewCount,
  experienceYears,
  languages,
  specialities,
  bio,
  completedTours,
  availability = 'Available',
  responseTime = 'Usually responds within 1 hour',
}) => ({
  id,
  name,
  image,
  verified: true,
  rating,
  reviewCount,
  experienceYears,
  location: 'Colombo, Sri Lanka',
  languages: languages.map((language, index) => ({
    name: language,
    proficiency: index === 0 ? 'Native or bilingual' : 'Professional',
  })),
  specialities,
  bio,
  tourStyle: 'Relaxed, informative and tailored to the interests and pace of each group.',
  localKnowledge: 'Cultural Triangle, Colombo, Kandy, Dambulla and the central highlands.',
  qualifications: ['SLTDA licensed national tourist guide', 'Certificate in Sri Lankan heritage'],
  certifications: ['First aid trained', 'Responsible tourism certified'],
  completedTours,
  areasCovered: ['Colombo', 'Sigiriya', 'Dambulla', 'Kandy', 'Polonnaruwa'],
  availability,
  responseTime,
  profileCompletion: 'Identity and guide licence verified',
  reviews: reviewSet(name, rating),
})

export const mockGuides = [
  makeGuide({
    id: 'rohan-perera', name: 'Rohan Perera', image: rohanAvatar, rating: 4.8, reviewCount: 117,
    experienceYears: 8, languages: ['Sinhala', 'English'],
    specialities: ['Historical tours', 'Photography', 'Cultural tours'], completedTours: 386,
    bio: 'I specialise in cultural heritage and wildlife photography, with carefully timed visits that avoid the busiest crowds.',
  }),
  makeGuide({
    id: 'maliki-perera', name: 'Maliki Perera', image: malikiAvatar, rating: 4.9, reviewCount: 108,
    experienceYears: 5, languages: ['Sinhala', 'English', 'French'],
    specialities: ['Wildlife and nature', 'Family-friendly tours', 'Historical tours'], completedTours: 241,
    bio: 'As a certified naturalist, I connect the history of Sigiriya with the hidden flora and fauna around the fortress.',
  }),
  makeGuide({
    id: 'ajith-perera', name: 'Ajith Perera', image: ajithAvatar, rating: 4.7, reviewCount: 140,
    experienceYears: 10, languages: ['Sinhala', 'English'],
    specialities: ['Cultural tours', 'Religious sites', 'Family-friendly tours'], completedTours: 512,
    bio: 'My in-depth knowledge of the Kingdom of Kandy and Sigiriya creates a premium but welcoming experience for families.',
  }),
  makeGuide({
    id: 'john-perera', name: 'John Perera', image: johnAvatar, rating: 4.8, reviewCount: 89,
    experienceYears: 3, languages: ['English', 'Sinhala'],
    specialities: ['Photography', 'Adventure', 'Historical tours'], completedTours: 156,
    bio: 'I combine cultural heritage, wildlife photography and flexible start times for travellers who want a personal itinerary.',
  }),
  makeGuide({
    id: 'nadeesha-silva', name: 'Nadeesha Silva', image: malikiAvatar, rating: 4.9, reviewCount: 76,
    experienceYears: 6, languages: ['Sinhala', 'English'],
    specialities: ['Food tours', 'Cultural tours', 'Family-friendly tours'], completedTours: 228,
    bio: 'Discover Sigiriya beyond the rock fortress through village walks, local cuisine and stories shared by the community.',
  }),
  makeGuide({
    id: 'dilan-fernando', name: 'Dilan Fernando', image: rohanAvatar, rating: 4.6, reviewCount: 64,
    experienceYears: 7, languages: ['Sinhala', 'English'],
    specialities: ['Wildlife and nature', 'Photography', 'Adventure'], completedTours: 274,
    bio: 'A nature-focused journey with flexible sunrise departures and optional birdwatching around Minneriya.',
  }),
  makeGuide({
    id: 'chamara-de-silva', name: 'Chamara de Silva', image: ajithAvatar, rating: 4.8, reviewCount: 122,
    experienceYears: 9, languages: ['Sinhala', 'English'],
    specialities: ['Historical tours', 'Family-friendly tours', 'Cultural tours'], completedTours: 431,
    bio: 'My relaxed family tours bring Sri Lanka’s ancient kingdoms to life for travellers of every age.',
  }),
  makeGuide({
    id: 'suresh-kumar', name: 'Suresh Kumar', image: johnAvatar, rating: 4.9, reviewCount: 151,
    experienceYears: 12, languages: ['Tamil', 'English', 'Sinhala'],
    specialities: ['Cultural tours', 'Religious sites', 'Accessibility assistance'], completedTours: 608,
    bio: 'A carefully paced cultural tour with clear explanations, comfort stops and personalised planning throughout.',
  }),
  makeGuide({
    id: 'dinithi-jayasinghe', name: 'Dinithi Jayasinghe', image: malikiAvatar, rating: 4.7, reviewCount: 53,
    experienceYears: 4, languages: ['Sinhala', 'English'],
    specialities: ['Cultural tours', 'Photography', 'Historical tours'], completedTours: 142,
    bio: 'I combine local art, archaeology and photo-friendly viewpoints for a memorable first visit to the Cultural Triangle.',
  }),
  makeGuide({
    id: 'kasun-wijeratne', name: 'Kasun Wijeratne', image: rohanAvatar, rating: 4.8, reviewCount: 98,
    experienceYears: 8, languages: ['Sinhala', 'English'],
    specialities: ['Historical tours', 'Adventure', 'Wildlife and nature'], completedTours: 337,
    bio: 'An active heritage itinerary for travellers who enjoy hiking, history and lesser-known viewpoints.',
  }),
  makeGuide({
    id: 'pradeep-senanayake', name: 'Pradeep Senanayake', image: ajithAvatar, rating: 4.6, reviewCount: 71,
    experienceYears: 6, languages: ['Sinhala', 'English', 'German'],
    specialities: ['Historical tours', 'Accessibility assistance', 'Cultural tours'], completedTours: 219,
    bio: 'A safety-conscious multilingual tour with enough time to enjoy each stop comfortably.',
  }),
  makeGuide({
    id: 'shan-peris', name: 'Shan Peris', image: johnAvatar, rating: 5, reviewCount: 134,
    experienceYears: 11, languages: ['English', 'Sinhala'],
    specialities: ['Cultural tours', 'Photography', 'Food tours'], completedTours: 547,
    bio: 'Private guiding for travellers who value personal service, premium comfort and a completely flexible itinerary.',
  }),
]

export const demoGuideRequest = {
  id: 'demo-request-001',
  userId: 'demo-tourist',
  startLocation: 'Colombo',
  destination: 'Sigiriya',
  stops: ['Dambulla Cave Temple'],
  startDate: '2027-11-12',
  endDate: '2027-11-15',
  startTime: '08:00',
  adults: 3,
  children: 0,
  pickupLocation: 'Colombo Fort',
  dropoffLocation: 'Colombo Fort',
  languages: ['English'],
  specialities: ['Historical tours', 'Photography'],
  minBudget: 12000,
  maxBudget: 50000,
  currency: 'LKR',
  description: 'A relaxed cultural trip focused on Sigiriya and nearby heritage sites.',
  specialRequirements: 'Please include regular refreshment stops.',
  accessibilityNeeds: '',
  contactPreference: 'In-app messages',
  status: 'Request Open',
  createdAt: '2026-08-01T09:30:00.000Z',
}

const amounts = [15000, 25000, 27000, 45000, 18500, 22000, 29500, 32000, 16500, 24000, 26500, 35000]

export const mockGuideBids = mockGuides.map((guide, index) => ({
  id: `bid-${guide.id}`,
  requestId: demoGuideRequest.id,
  guideId: guide.id,
  amount: amounts[index],
  currency: 'LKR',
  proposedItinerary: index % 2 === 0
    ? 'Colombo pickup, Dambulla heritage stop, Sigiriya sunset orientation and a guided sunrise climb.'
    : 'Flexible Colombo departure, local village experience, Sigiriya guided visit and optional museum stop.',
  includedServices: ['Private guide service', 'Itinerary planning', 'Bottled water'],
  excludedServices: ['Entrance tickets', 'Meals', 'Transport'],
  cancellationPolicy: 'Free cancellation up to 72 hours before the tour. Later cancellations are non-refundable.',
  status: guide.availability === 'Available' ? 'Available' : 'Unavailable',
  submittedAt: new Date(Date.UTC(2026, 7, index + 1, 8, 0)).toISOString(),
  expiresAt: '2027-11-10T18:00:00.000Z',
}))
