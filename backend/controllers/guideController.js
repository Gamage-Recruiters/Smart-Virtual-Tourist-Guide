// src/controllers/guideController.js
import GuideProfile from '../models/GuideProfile.js';
import cloudinary from '../config/cloudinary.js';

// Get guide profile
export const getProfile = async (req, res) => {
  try {
    const profile = await GuideProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update guide profile
export const updateProfile = async (req, res) => {
  try {
    const { personalInfo, guideDetails, aboutMe } = req.body;
    
    let profile = await GuideProfile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update existing profile
      if (personalInfo) profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
      if (guideDetails) profile.guideDetails = { ...profile.guideDetails, ...guideDetails };
      if (aboutMe) profile.aboutMe = { ...profile.aboutMe, ...aboutMe };
    } else {
      // Create new profile
      profile = new GuideProfile({
        user: req.user.id,
        personalInfo,
        guideDetails,
        aboutMe
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

    const profile = await GuideProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Delete old photo if exists
    if (profile.profilePhoto && profile.profilePhoto.publicId) {
      await cloudinary.uploader.destroy(profile.profilePhoto.publicId);
    }

    profile.profilePhoto = {
      url: req.file.path,
      publicId: req.file.filename
    };

    await profile.save();
    res.json({ 
      success: true, 
      message: 'Profile photo uploaded successfully',
      photo: profile.profilePhoto 
    });
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
    const profile = await GuideProfile.findOne({ user: req.user.id });
    
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
    
    const profile = await GuideProfile.findOne({ user: req.user.id });
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

// Get profile status
export const getStatus = async (req, res) => {
  try {
    const profile = await GuideProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ 
      success: true,
      isComplete: profile.isProfileComplete,
      profile 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};