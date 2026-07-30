// src/controllers/hotelController.js
import HotelProfile from '../models/HotelProfile.js';
import cloudinary from '../config/cloudinary.js';

// Get hotel profile
export const getProfile = async (req, res) => {
  try {
    const profile = await HotelProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update hotel profile
export const updateProfile = async (req, res) => {
  try {
    const { hotelInfo, amenities, roomTypes } = req.body;
    
    let profile = await HotelProfile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update existing profile
      if (hotelInfo) profile.hotelInfo = { ...profile.hotelInfo, ...hotelInfo };
      if (amenities) profile.amenities = amenities;
      if (roomTypes) profile.roomTypes = roomTypes;
    } else {
      // Create new profile
      profile = new HotelProfile({
        user: req.user.id,
        hotelInfo,
        amenities,
        roomTypes
      });
    }

    await profile.save();
    res.json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload hotel images
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const profile = await HotelProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      isMain: false
    }));

    // Set first image as main if no main image exists
    if (!profile.images || profile.images.length === 0) {
      images[0].isMain = true;
    }

    profile.images = [...(profile.images || []), ...images];
    await profile.save();

    res.json({ 
      success: true, 
      message: 'Images uploaded successfully',
      images 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const profile = await HotelProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const imageIndex = profile.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary
    if (profile.images[imageIndex].publicId) {
      await cloudinary.uploader.destroy(profile.images[imageIndex].publicId);
    }

    // If deleting main image, set another as main
    if (profile.images[imageIndex].isMain && profile.images.length > 1) {
      const newMainIndex = imageIndex === 0 ? 1 : 0;
      profile.images[newMainIndex].isMain = true;
    }

    profile.images.splice(imageIndex, 1);
    await profile.save();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type, name } = req.body;
    const profile = await HotelProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const document = {
      name: name || req.file.originalname,
      type: type || 'other',
      url: req.file.path,
      publicId: req.file.filename
    };

    profile.documents.push(document);
    await profile.save();

    res.json({ 
      success: true, 
      message: 'Document uploaded successfully',
      document 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const profile = await HotelProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const docIndex = profile.documents.findIndex(doc => doc._id.toString() === documentId);
    if (docIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from Cloudinary
    if (profile.documents[docIndex].publicId) {
      await cloudinary.uploader.destroy(profile.documents[docIndex].publicId);
    }

    profile.documents.splice(docIndex, 1);
    await profile.save();

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};