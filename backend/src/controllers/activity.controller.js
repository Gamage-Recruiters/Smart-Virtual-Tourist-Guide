import Activity from '../models/activity.model.js';

const normalizeImages = (images = []) =>
  [...new Set(
    images
      .filter((image) => typeof image === 'string')
      .map((image) => image.trim())
      .filter((image) => image && image !== '/uploads/undefined')
  )].slice(0, 8);

// GET /api/activities
// Query params: category, status, search, page, limit
export const getActivities = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 12 } = req.query;

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [activities, total] = await Promise.all([
      Activity.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Activity.countDocuments(query),
    ]);

    const data = activities.map((activity) => {
      const item = activity.toObject();
      item.images = normalizeImages(item.images);
      return item;
    });

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/activities/:id
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    const data = activity.toObject();
    data.images = normalizeImages(data.images);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const {
      title, category, description, location, duration,
      maxParticipants, pricePerPerson, requiredEquipment, safetyNotes, status,
    } = req.body;

    const images = normalizeImages(
      (req.cloudinaryImages || []).map((i) => i.url)
    );

    let equipment = requiredEquipment;
    if (typeof requiredEquipment === 'string') {
      try { equipment = JSON.parse(requiredEquipment); } catch { equipment = []; }
    }

    const activity = await Activity.create({
      title,
      category,
      description,
      location,
      duration,
      maxParticipants: parseInt(maxParticipants, 10),
      pricePerPerson: parseFloat(pricePerPerson),
      requiredEquipment: equipment || [],
      safetyNotes: safetyNotes || '',
      images,
      status: status || 'draft',
    });

    res.status(201).json({ success: true, data: activity, message: 'Activity created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/activities/:id
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    const {
      title, category, description, location, duration,
      maxParticipants, pricePerPerson, requiredEquipment, safetyNotes, status, existingImages,
    } = req.body;

    const newImages = normalizeImages(
      (req.cloudinaryImages || []).map((i) => i.url)
    );

    let kept = existingImages || [];
    if (typeof kept === 'string') {
      try { kept = JSON.parse(kept); } catch { kept = []; }
    }
    kept = normalizeImages(Array.isArray(kept) ? kept : []);

    let equipment = requiredEquipment;
    if (typeof requiredEquipment === 'string') {
      try { equipment = JSON.parse(requiredEquipment); } catch { equipment = activity.requiredEquipment; }
    }

    const updated = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        title: title || activity.title,
        category: category || activity.category,
        description: description || activity.description,
        location: location || activity.location,
        duration: duration || activity.duration,
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : activity.maxParticipants,
        pricePerPerson: pricePerPerson ? parseFloat(pricePerPerson) : activity.pricePerPerson,
        requiredEquipment: equipment || activity.requiredEquipment,
        safetyNotes: safetyNotes !== undefined ? safetyNotes : activity.safetyNotes,
        images: normalizeImages([...kept, ...newImages]),
        status: status || activity.status,
      },
      { returnDocument: 'after', runValidators: true }
    );

    const data = updated.toObject();
    data.images = normalizeImages(data.images);

    res.json({ success: true, data, message: 'Activity updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/activities/:id/publish
export const publishActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { returnDocument: 'after' }
    );
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity, message: 'Activity published successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  publishActivity,
};