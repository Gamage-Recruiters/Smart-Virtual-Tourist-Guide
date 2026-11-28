import User from '../models/User.js';
import Review from '../models/review.model.js';

// GET /api/drivers - Public endpoint for fetching registered drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver_user', status: 'Active' })
      .select('fullName username email contactNumber profileImage vehicleType vehicleNumber vehicleColor vehicleImages createdAt')
      .lean();

    const driverIds = drivers.map(d => d._id.toString());

    // Aggregate rating statistics for drivers
    let ratingStats = {};
    if (driverIds.length > 0) {
      const stats = await Review.aggregate([
        { $match: { targetProviderId: { $in: driverIds }, targetType: 'Driver' } },
        {
          $group: {
            _id: '$targetProviderId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      stats.forEach(s => {
        ratingStats[s._id] = {
          averageRating: Math.round(s.averageRating * 10) / 10,
          totalReviews: s.totalReviews
        };
      });
    }

    const formattedDrivers = drivers.map(d => {
      const dId = d._id.toString();
      const stat = ratingStats[dId] || { averageRating: 0, totalReviews: 0 };
      
      const defaultAvatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300';
      const img = d.profileImage || (d.vehicleImages && d.vehicleImages[0]) || defaultAvatar;

      return {
        _id: dId,
        id: dId,
        name: d.fullName || d.username || 'Registered Driver',
        driverName: d.fullName || d.username || 'Registered Driver',
        title: d.vehicleType ? `${d.vehicleType} Specialist` : 'Professional Tourist Driver',
        price: '8,500',
        priceUnit: 'day',
        rating: stat.averageRating || 5.0,
        totalReviews: stat.totalReviews || 0,
        isVerified: true,
        isOnline: true,
        tags: [d.vehicleType || 'Sedan', d.vehicleNumber || 'Verified', 'Tourist Guide'],
        image: img,
        contactNumber: d.contactNumber,
        email: d.email,
        vehicleNumber: d.vehicleNumber,
        vehicleColor: d.vehicleColor
      };
    });

    res.json({
      success: true,
      data: formattedDrivers
    });
  } catch (error) {
    console.error('Error fetching public drivers:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching drivers', error: error.message });
  }
};

// GET /api/guides - Public endpoint for fetching registered tour guides
export const getGuides = async (req, res) => {
  try {
    const guides = await User.find({ role: 'guide_user', status: 'Active' })
      .select('fullName username email contactNumber profileImage guideId gender createdAt')
      .lean();

    const guideIds = guides.map(g => g._id.toString());

    // Aggregate rating statistics for guides
    let ratingStats = {};
    if (guideIds.length > 0) {
      const stats = await Review.aggregate([
        { $match: { targetProviderId: { $in: guideIds }, targetType: 'Guide' } },
        {
          $group: {
            _id: '$targetProviderId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      stats.forEach(s => {
        ratingStats[s._id] = {
          averageRating: Math.round(s.averageRating * 10) / 10,
          totalReviews: s.totalReviews
        };
      });
    }

    const formattedGuides = guides.map(g => {
      const gId = g._id.toString();
      const stat = ratingStats[gId] || { averageRating: 0, totalReviews: 0 };

      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
      const img = g.profileImage || defaultAvatar;

      return {
        _id: gId,
        id: gId,
        name: g.fullName || g.username || 'Registered Guide',
        title: 'SLTDA Licensed Tourist Guide',
        price: '9,500',
        priceUnit: 'day',
        rating: stat.averageRating || 5.0,
        totalReviews: stat.totalReviews || 0,
        isVerified: true,
        isOnline: true,
        badge: 'SLTDA Certified',
        languages: ['English', 'Sinhala'],
        specialties: ['Cultural Triangle', 'Historical Sites', 'Wildlife'],
        image: img,
        contactNumber: g.contactNumber,
        email: g.email
      };
    });

    res.json({
      success: true,
      data: formattedGuides
    });
  } catch (error) {
    console.error('Error fetching public guides:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching guides', error: error.message });
  }
};
