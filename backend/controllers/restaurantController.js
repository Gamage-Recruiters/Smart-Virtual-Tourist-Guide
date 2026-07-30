// src/controllers/restaurantController.js
import RestaurantProfile from '../models/RestaurantProfile.js';
import cloudinary from '../config/cloudinary.js';

// Get restaurant profile
export const getProfile = async (req, res) => {
  try {
    const profile = await RestaurantProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update restaurant profile
export const updateProfile = async (req, res) => {
  try {
    const { restaurantInfo, operatingHours, features, menu } = req.body;
    
    let profile = await RestaurantProfile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update existing profile
      if (restaurantInfo) profile.restaurantInfo = { ...profile.restaurantInfo, ...restaurantInfo };
      if (operatingHours) profile.operatingHours = operatingHours;
      if (features) profile.features = features;
      if (menu) profile.menu = menu;
    } else {
      // Create new profile
      profile = new RestaurantProfile({
        user: req.user.id,
        restaurantInfo,
        operatingHours,
        features,
        menu
      });
    }

    await profile.save();
    res.json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload profile photo
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profile = await RestaurantProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Delete old photo if exists
    if (profile.profileImage && profile.profileImage.publicId) {
      await cloudinary.uploader.destroy(profile.profileImage.publicId);
    }

    profile.profileImage = {
      url: req.file.path,
      publicId: req.file.filename
    };

    await profile.save();
    res.json({ 
      success: true, 
      message: 'Profile photo uploaded successfully',
      photo: profile.profileImage 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload gallery images
export const uploadGallery = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const profile = await RestaurantProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    profile.gallery = [...(profile.gallery || []), ...images];
    await profile.save();

    res.json({ 
      success: true, 
      message: 'Gallery images uploaded successfully',
      images 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const profile = await RestaurantProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const imageIndex = profile.gallery.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    if (profile.gallery[imageIndex].publicId) {
      await cloudinary.uploader.destroy(profile.gallery[imageIndex].publicId);
    }

    profile.gallery.splice(imageIndex, 1);
    await profile.save();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};