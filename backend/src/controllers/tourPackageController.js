import TourPackage from '../models/TourPackage.js';
import { getDestinationCoordinates } from '../constants/destinations.js';
import { cloudinary, uploadToCloudinary } from '../middleware/upload.js';
import mongoose from 'mongoose';

/**
 * Helper to re-index route stops starting from 1
 */
const reindexRouteStops = (stops) => {
  return stops.map((stop, idx) => ({
    _id: stop._id,
    order: idx + 1,
    name: typeof stop === 'string' ? stop : stop.name,
  }));
};

/**
 * @desc    Create a new tour package (draft or published)
 * @route   POST /api/tour-packages
 * @access  Private (Guide)
 */
export const createPackage = async (req, res) => {
  try {
    const {
      name,
      packageName,
      category,
      description,
      shortDescription,
      destination,
      primaryDestination,
      stops,
      routeStops,
      pricePerItinerary,
      pricePerPerson,
      durationValue,
      durationUnit,
      status = 'draft',
    } = req.body;

    const finalPackageName = packageName || name || 'Untitled Tour Package';
    const finalCategory = category || 'Cultural';
    const finalDestination = primaryDestination || destination || 'Sigiriya';
    const finalDescription = shortDescription || description || '';
    const finalPrice = pricePerPerson !== undefined ? Number(pricePerPerson) : (pricePerItinerary !== undefined ? Number(pricePerItinerary) : 0);

    // Format route stops
    const rawStops = routeStops || stops || [];
    const formattedStops = rawStops.map((s, idx) => ({
      order: idx + 1,
      name: typeof s === 'string' ? s : s.name,
    })).filter((s) => s.name && s.name.trim() !== '');

    // Resolve lat/lng coordinates
    const coordinates = getDestinationCoordinates(finalDestination);

    // If status is published, validate publish readiness
    if (status === 'published') {
      const publishErrors = [];
      if (!finalPackageName || finalPackageName.trim().length < 5) {
        publishErrors.push({ field: 'packageName', message: 'Package Name must be at least 5 characters long' });
      }
      if (finalPrice <= 0) {
        publishErrors.push({ field: 'pricePerPerson', message: 'Price per person must be greater than 0' });
      }
      if (formattedStops.length === 0) {
        publishErrors.push({ field: 'routeStops', message: 'At least 1 route stop is required to publish' });
      }
      if (publishErrors.length > 0) {
        return res.status(400).json({ success: false, errors: publishErrors });
      }
    }

    const newPackage = await TourPackage.create({
      packageName: finalPackageName,
      category: finalCategory,
      shortDescription: finalDescription,
      primaryDestination: finalDestination,
      destinationCoordinates: coordinates,
      routeStops: formattedStops,
      photos: [],
      pricePerPerson: finalPrice,
      durationValue: durationValue ? Number(durationValue) : 1,
      durationUnit: durationUnit || 'Days',
      guide: req.user._id,
      status,
    });

    res.status(201).json({
      success: true,
      message: status === 'published' ? 'Tour package published successfully' : 'Tour package saved as draft',
      data: newPackage,
    });
  } catch (error) {
    console.error('Create Package Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating tour package' });
  }
};

/**
 * @desc    Get list of tour packages (with filters & pagination)
 * @route   GET /api/tour-packages
 * @access  Public / Private
 */
export const listPackages = async (req, res) => {
  try {
    const {
      guide,
      status,
      category,
      destination,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (guide === 'current' && req.user) {
      filter.guide = req.user._id;
    } else if (guide && mongoose.Types.ObjectId.isValid(guide)) {
      filter.guide = guide;
    }

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (destination) {
      filter.primaryDestination = destination;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [packages, total] = await Promise.all([
      TourPackage.find(filter)
        .populate('guide', 'fullName email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      TourPackage.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('List Packages Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tour packages' });
  }
};

/**
 * @desc    Get single package details
 * @route   GET /api/tour-packages/:id
 * @access  Public
 */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid package ID' });
    }

    const tourPackage = await TourPackage.findById(id).populate('guide', 'fullName email profilePhoto');

    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    res.status(200).json({ success: true, data: tourPackage });
  } catch (error) {
    console.error('Get Package By ID Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tour package' });
  }
};

/**
 * @desc    Update tour package fields
 * @route   PUT /api/tour-packages/:id
 * @access  Private (Owner Guide)
 */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    // Ownership check
    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this package' });
    }

    const {
      packageName,
      name,
      category,
      shortDescription,
      description,
      primaryDestination,
      destination,
      pricePerPerson,
      pricePerItinerary,
      durationValue,
      durationUnit,
      stops,
      routeStops,
    } = req.body;

    if (packageName || name) tourPackage.packageName = packageName || name;
    if (category) tourPackage.category = category;
    if (shortDescription !== undefined || description !== undefined) {
      tourPackage.shortDescription = shortDescription !== undefined ? shortDescription : description;
    }

    const newDest = primaryDestination || destination;
    if (newDest && newDest !== tourPackage.primaryDestination) {
      tourPackage.primaryDestination = newDest;
      tourPackage.destinationCoordinates = getDestinationCoordinates(newDest);
    }

    if (pricePerPerson !== undefined || pricePerItinerary !== undefined) {
      tourPackage.pricePerPerson = Number(pricePerPerson !== undefined ? pricePerPerson : pricePerItinerary);
    }

    if (durationValue !== undefined) tourPackage.durationValue = Number(durationValue);
    if (durationUnit) tourPackage.durationUnit = durationUnit;

    const rawStops = routeStops || stops;
    if (Array.isArray(rawStops)) {
      tourPackage.routeStops = rawStops.map((s, idx) => ({
        order: idx + 1,
        name: typeof s === 'string' ? s : s.name,
      })).filter((s) => s.name && s.name.trim() !== '');
    }

    await tourPackage.save();

    res.status(200).json({
      success: true,
      message: 'Tour package updated successfully',
      data: tourPackage,
    });
  } catch (error) {
    console.error('Update Package Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating tour package' });
  }
};

/**
 * @desc    Change package status (draft, published, archived)
 * @route   PATCH /api/tour-packages/:id/status
 * @access  Private (Owner Guide)
 */
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status specified' });
    }

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to change status of this package' });
    }

    // Strict readiness check if switching to published
    if (status === 'published') {
      const publishErrors = [];
      if (!tourPackage.packageName || tourPackage.packageName.length < 5) {
        publishErrors.push({ field: 'packageName', message: 'Package Name must be at least 5 characters long' });
      }
      if (tourPackage.pricePerPerson <= 0) {
        publishErrors.push({ field: 'pricePerPerson', message: 'Price per person must be greater than 0' });
      }
      if (!tourPackage.routeStops || tourPackage.routeStops.length === 0) {
        publishErrors.push({ field: 'routeStops', message: 'At least 1 route stop is required to publish' });
      }
      if (!tourPackage.photos || tourPackage.photos.length === 0) {
        publishErrors.push({ field: 'photos', message: 'At least 1 photo is required to publish' });
      }

      if (publishErrors.length > 0) {
        return res.status(400).json({ success: false, errors: publishErrors });
      }
    }

    tourPackage.status = status;
    await tourPackage.save();

    res.status(200).json({
      success: true,
      message: `Tour package status updated to ${status}`,
      data: tourPackage,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

/**
 * @desc    Delete tour package
 * @route   DELETE /api/tour-packages/:id
 * @access  Private (Owner Guide)
 */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this package' });
    }

    // Delete attached Cloudinary photos
    if (tourPackage.photos && tourPackage.photos.length > 0) {
      await Promise.all(
        tourPackage.photos.map(async (photo) => {
          if (photo.publicId) {
            try {
              await cloudinary.uploader.destroy(photo.publicId);
            } catch (err) {
              console.error('Failed to cleanup Cloudinary photo:', photo.publicId);
            }
          }
        })
      );
    }

    await TourPackage.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Tour package deleted successfully' });
  } catch (error) {
    console.error('Delete Package Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting tour package' });
  }
};

/**
 * @desc    Add route stop
 * @route   POST /api/tour-packages/:id/route-stops
 * @access  Private (Owner Guide)
 */
export const addRouteStop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Route stop name is required' });
    }

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const newOrder = tourPackage.routeStops.length + 1;
    tourPackage.routeStops.push({ order: newOrder, name: name.trim() });
    await tourPackage.save();

    res.status(200).json({ success: true, data: tourPackage.routeStops });
  } catch (error) {
    console.error('Add Route Stop Error:', error);
    res.status(500).json({ success: false, message: 'Server error adding route stop' });
  }
};

/**
 * @desc    Update route stop name
 * @route   PUT /api/tour-packages/:id/route-stops/:stopId
 * @access  Private (Owner Guide)
 */
export const updateRouteStop = async (req, res) => {
  try {
    const { id, stopId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Route stop name is required' });
    }

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const stop = tourPackage.routeStops.id(stopId);
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Route stop not found' });
    }

    stop.name = name.trim();
    await tourPackage.save();

    res.status(200).json({ success: true, data: tourPackage.routeStops });
  } catch (error) {
    console.error('Update Route Stop Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating route stop' });
  }
};

/**
 * @desc    Remove route stop
 * @route   DELETE /api/tour-packages/:id/route-stops/:stopId
 * @access  Private (Owner Guide)
 */
export const removeRouteStop = async (req, res) => {
  try {
    const { id, stopId } = req.params;

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    tourPackage.routeStops = tourPackage.routeStops.filter(
      (s) => s._id.toString() !== stopId
    );

    // Re-index order values
    tourPackage.routeStops.forEach((stop, index) => {
      stop.order = index + 1;
    });

    await tourPackage.save();

    res.status(200).json({ success: true, data: tourPackage.routeStops });
  } catch (error) {
    console.error('Remove Route Stop Error:', error);
    res.status(500).json({ success: false, message: 'Server error removing route stop' });
  }
};

/**
 * @desc    Upload multiple photos for a package
 * @route   POST /api/tour-packages/:id/photos
 * @access  Private (Owner Guide)
 */
export const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one photo file' });
    }

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Check max total limit of 10 photos
    if (tourPackage.photos.length + files.length > 10) {
      return res.status(400).json({
        success: false,
        message: `Maximum 10 photos allowed per package. You already have ${tourPackage.photos.length} photo(s).`,
      });
    }

    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, {
          folder: 'smart_tourist/tours/photos',
          public_id: `tour-${id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          transformation: [{ width: 1200, height: 800, crop: 'limit' }],
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
          fileName: file.originalname,
          mimeType: file.mimetype,
          uploadedAt: new Date(),
        };
      })
    );

    tourPackage.photos.push(...uploadedPhotos);
    await tourPackage.save();

    res.status(200).json({ success: true, data: tourPackage.photos });
  } catch (error) {
    console.error('Upload Tour Photos Error:', error);
    res.status(500).json({ success: false, message: 'Server error uploading photos' });
  }
};

/**
 * @desc    Remove a specific photo from a package
 * @route   DELETE /api/tour-packages/:id/photos/:photoId
 * @access  Private (Owner Guide)
 */
export const removePhoto = async (req, res) => {
  try {
    const { id, photoId } = req.params;

    const tourPackage = await TourPackage.findById(id);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.guide.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const photo = tourPackage.photos.find((p) => p._id.toString() === photoId);
    if (photo?.publicId) {
      try {
        await cloudinary.uploader.destroy(photo.publicId);
      } catch (err) {
        console.error('Failed to destroy Cloudinary photo:', err);
      }
    }

    tourPackage.photos = tourPackage.photos.filter((p) => p._id.toString() !== photoId);
    await tourPackage.save();

    res.status(200).json({ success: true, data: tourPackage.photos });
  } catch (error) {
    console.error('Remove Photo Error:', error);
    res.status(500).json({ success: false, message: 'Server error removing photo' });
  }
};
