import Destination from '../models/Destination.js';

// Create a new destination
export const createDestination = async (req, res) => {
  try {
    const destination = new Destination(req.body);
    const savedDestination = await destination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all destinations with filtering
export const getAllDestinations = async (req, res) => {
  try {
    const {
      q, // Search query
      category,
      province,
      minPrice,
      maxPrice,
      adventureLevel,
      isFamilyFriendly,
      isSoloTravel,
      isCoupleFriendly,
      isGroupFriendly,
      isActive,
      isFeatured,
      bestSeason,
      sort // sorting parameter
    } = req.query;

    const query = {};

    // 1. Text Search (using the index we created)
    if (q) {
      query.$text = { $search: q };
    }

    // 2. Exact matches
    if (category) query.categories = category;
    if (province) query.province = province;
    if (adventureLevel) query.adventureLevel = adventureLevel;
    
    // Arrays overlapping (e.g. bestSeason)
    if (bestSeason) {
      // Assuming bestSeason is sent as a comma separated string in query
      const seasons = bestSeason.split(',');
      query.bestSeason = { $in: seasons };
    }

    // 3. Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Boolean Flags
    if (isFamilyFriendly === 'true') query.isFamilyFriendly = true;
    if (isSoloTravel === 'true') query.isSoloTravel = true;
    if (isCoupleFriendly === 'true') query.isCoupleFriendly = true;
    if (isGroupFriendly === 'true') query.isGroupFriendly = true;
    
    // By default only show active destinations unless explicitly asked for all/inactive
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true; // Default to active only
    }

    if (isFeatured === 'true') query.isFeatured = true;

    // Determine sorting
    let sortOption = {};
    if (sort === 'priceAsc') sortOption = { price: 1 };
    else if (sort === 'priceDesc') sortOption = { price: -1 };
    else if (sort === 'ratingDesc') sortOption = { rating: -1 };
    else if (q) sortOption = { score: { $meta: "textScore" } }; // Default sort for search is relevance
    else sortOption = { createdAt: -1 }; // Default sort is newest

    const destinations = await Destination.find(query)
      .sort(sortOption)
      .exec();

    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
