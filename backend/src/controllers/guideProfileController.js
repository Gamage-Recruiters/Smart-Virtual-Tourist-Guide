import GuideProfile from '../models/GuideProfile.js';
import { cloudinary, uploadToCloudinary } from '../middleware/upload.js';
import mongoose from 'mongoose';

/**
 * Resolve the guide profile from the request.
 * - If id === 'current'  → look up by req.user._id
 * - If id is a valid ObjectId → try _id OR userId match
 * - Otherwise              → try guideIdNumber match
 * Auto-creates a blank profile if the authenticated user doesn't have one yet.
 */
const resolveProfile = async (id, user) => {
  let profile = null;

  if (id === 'current') {
    if (!user || !user._id) return null;
    profile = await GuideProfile.findOne({ userId: user._id });
  } else if (mongoose.Types.ObjectId.isValid(id)) {
    profile = await GuideProfile.findOne({
      $or: [{ _id: id }, { userId: id }],
    });
  } else {
    profile = await GuideProfile.findOne({ guideIdNumber: id });
  }

  // Auto-create initial profile for authenticated guide user if fetching their own profile and it does not exist yet
  const isSelfLookup = id === 'current' || (user && user._id && id === user._id.toString());
  if (!profile && user && user._id && isSelfLookup) {
    const randomId = 'GD-' + Math.floor(10000 + Math.random() * 90000);
    try {
      profile = await GuideProfile.create({
        userId: user._id,
        fullName: user.fullName || 'Guide User',
        email: user.email,
        contactNumber: user.contactNumber || '',
        guideIdNumber: randomId,
      });
    } catch (err) {
      if (err.code === 11000) {
        // Race condition: profile created concurrently by parallel request
        profile = await GuideProfile.findOne({ userId: user._id });
      } else {
        throw err;
      }
    }
  }

  return profile;
};

/**
 * @desc    Get Guide Profile by Guide ID or Auth User
 * @route   GET /api/guides/:id/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Guide profile not found' });
  }

  res.status(200).json({ success: true, data: profile });
};

/**
 * @desc    Update Guide Profile Text Fields
 * @route   PUT /api/guides/:id/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  if (req.user && req.user._id.toString() !== profile.userId.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
  }

  const {
    fullName, gender, dateOfBirth, contactNumber, email,
    yearsOfExperience, languagesSpoken, areasOfExpertise, shortBio, specialSkills,
  } = req.body;

  if (fullName) profile.fullName = fullName;
  if (gender) profile.gender = gender;
  if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
  if (contactNumber) profile.contactNumber = contactNumber;
  if (email) profile.email = email;
  if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
  if (languagesSpoken) profile.languagesSpoken = languagesSpoken;
  if (areasOfExpertise) profile.areasOfExpertise = areasOfExpertise;
  if (shortBio !== undefined) profile.shortBio = shortBio;
  if (specialSkills !== undefined) profile.specialSkills = specialSkills;

  await profile.save();

  res.status(200).json({ success: true, data: profile, message: 'Profile updated successfully' });
};

/**
 * @desc    Upload/Replace Profile Photo
 * @route   POST /api/guides/:id/profile/photo
 * @access  Private
 */
export const uploadProfilePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }

  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  // Delete old Cloudinary image if present
  if (profile.profilePhoto?.publicId) {
    try {
      await cloudinary.uploader.destroy(profile.profilePhoto.publicId);
    } catch (err) {
      console.error('Failed to delete previous Cloudinary image:', err);
    }
  }

  const result = await uploadToCloudinary(req.file.buffer, {
    folder: 'smart_tourist/guides/photos',
    public_id: `${req.params.id}-photo-${Date.now()}`,
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  });

  profile.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await profile.save();
  res.status(200).json({ success: true, data: profile.profilePhoto });
};

/**
 * @desc    Remove Profile Photo
 * @route   DELETE /api/guides/:id/profile/photo
 * @access  Private
 */
export const removeProfilePhoto = async (req, res) => {
  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  if (profile.profilePhoto?.publicId) {
    try {
      await cloudinary.uploader.destroy(profile.profilePhoto.publicId);
    } catch (err) {
      console.error('Failed to delete image from Cloudinary:', err);
    }
  }

  profile.profilePhoto = { url: '', publicId: '' };
  await profile.save();

  res.status(200).json({ success: true, message: 'Profile photo removed' });
};

/**
 * @desc    Upload Identity Proof Document
 * @route   POST /api/guides/:id/profile/documents/identity
 * @access  Private
 */
export const uploadIdentityProof = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a document file' });
  }

  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  // Delete old Cloudinary identity proof if present
  if (profile.identityProof?.publicId) {
    try {
      await cloudinary.uploader.destroy(profile.identityProof.publicId, { resource_type: 'auto' });
    } catch (err) {
      console.error('Failed to delete previous identity proof from Cloudinary:', err);
    }
  }

  const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';

  const result = await uploadToCloudinary(req.file.buffer, {
    folder: 'smart_tourist/guides/documents',
    public_id: `${req.params.id}-identity-${Date.now()}`,
    resource_type: resourceType,
  });

  profile.identityProof = {
    url: result.secure_url,
    publicId: result.public_id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    uploadedAt: new Date(),
    verificationStatus: 'pending',
  };

  await profile.save();
  res.status(200).json({ success: true, data: profile.identityProof });
};

/**
 * @desc    Upload Certification Files
 * @route   POST /api/guides/:id/profile/documents/certifications
 * @access  Private
 */
export const uploadCertifications = async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please upload at least one certification file' });
  }

  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  const uploadedCerts = await Promise.all(
    files.map(async (file) => {
      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
      const result = await uploadToCloudinary(file.buffer, {
        folder: 'smart_tourist/guides/certifications',
        public_id: `${req.params.id}-cert-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        resource_type: resourceType,
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

  profile.certifications.push(...uploadedCerts);
  await profile.save();

  res.status(200).json({ success: true, data: profile.certifications });
};

/**
 * @desc    Remove Certification File by ID
 * @route   DELETE /api/guides/:id/profile/documents/certifications/:fileId
 * @access  Private
 */
export const removeCertification = async (req, res) => {
  const { fileId } = req.params;
  const profile = await resolveProfile(req.params.id, req.user);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  const cert = profile.certifications.find((c) => c._id.toString() === fileId);
  if (cert?.publicId) {
    try {
      const resourceType = cert.mimeType === 'application/pdf' ? 'raw' : 'image';
      await cloudinary.uploader.destroy(cert.publicId, { resource_type: resourceType });
    } catch (err) {
      console.error('Failed to delete certification from Cloudinary:', err);
    }
  }

  profile.certifications = profile.certifications.filter(
    (c) => c._id.toString() !== fileId
  );

  await profile.save();
  res.status(200).json({ success: true, data: profile.certifications });
};
