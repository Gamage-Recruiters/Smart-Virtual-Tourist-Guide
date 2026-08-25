import Package from '../../models/travelPackage/Package.js';

const getPromotionExpiryTime = (value) => {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return NaN

  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ) - (5 * 60 + 30) * 60 * 1000
}

const hasActivePromotion = (package_) => {
  const basicInformation = package_?.BasicInformation
  const promotionPrice = Number(basicInformation?.promotionPrice)
  const expiryTime = getPromotionExpiryTime(basicInformation?.promotionExpiryDate)

  return Number.isFinite(promotionPrice) && promotionPrice >= 0
    && Number.isFinite(expiryTime) && expiryTime > Date.now()
}

const createPackage = async (req, res) => {
  try {
    const publicBaseUrl = `${req.protocol}://${req.get('host')}`
    const BasicInformation = JSON.parse(req.body.BasicInformation)
    const LocationAndHighlights = JSON.parse(req.body.LocationAndHighlights)
    const DayByDayItinerary = JSON.parse(req.body.DayByDayItinerary)
    const AgencyContactInformation = JSON.parse(req.body.AgencyContactInformation)
    const status = (req.body.status || 'draft').trim().toLowerCase()

    const images = req.files ? req.files.map(file => `${publicBaseUrl}/uploads/${file.filename}`) : []

    // Handle promotion fields based on status - only promotionPrice and promotionExpiryDate
    const promotionFields = {
      promotionPrice: null,
      promotionExpiryDate: null,
    }

    const payload = {
      BasicInformation: {
        ...BasicInformation,
        // If status is draft, ensure promotion fields are empty/null
        ...(status === 'draft' ? promotionFields : {}),
      },
      LocationAndHighlights: {
        ...LocationAndHighlights,
        highlights: Array.isArray(LocationAndHighlights.highlights)
          ? LocationAndHighlights.highlights
          : LocationAndHighlights.highlights?.split('\n').filter(Boolean) ?? [],
        images,
      },
      DayByDayItinerary,
      AgencyContactInformation,
      status,
    }

    const package_ = new Package(payload)
    await package_.save()
    console.log(`[Package] created: ${package_._id} (${status})`)
    res.status(201).json({ message: `Package ${status === 'publish' ? 'published' : 'saved as draft'} successfully`, data: package_ })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getPackage = async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id)
    if (!package_) return res.status(404).json({ error: 'Package not found' })
    
    // Check if promotion has expired and clear it
    if (package_.BasicInformation?.promotionExpiryDate) {
      const now = new Date()
      if (!hasActivePromotion(package_) && package_.BasicInformation?.promotionPrice !== null) {
        package_.BasicInformation.promotionPrice = null
        package_.BasicInformation.promotionExpiryDate = null
        await package_.save()
      }
    }
    
    res.json({ data: package_ })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 })
    
    // Check and clear expired promotions
    const now = new Date()
    const updates = []
    
    for (const package_ of packages) {
      if (package_.BasicInformation?.promotionExpiryDate) {
        if (!hasActivePromotion(package_) && package_.BasicInformation?.promotionPrice !== null) {
          package_.BasicInformation.promotionPrice = null
          package_.BasicInformation.promotionExpiryDate = null
          updates.push(package_.save())
        }
      }
    }
    
    if (updates.length > 0) {
      await Promise.all(updates)
    }
    
    res.json({ data: packages })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getPackagesCount = async (req, res) => {
  try {
    const count = await Package.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const searchPackages = async (req, res) => {
  try {
    const title = (req.query.title || '').trim()

    if (!title) {
      return res.json({ data: [] })
    }

    const packages = await Package.find({
      'BasicInformation.title': { $regex: `^${title}`, $options: 'i' },
    })
      .sort({ createdAt: -1 })
      .limit(8)

    // Check and clear expired promotions
    const now = new Date()
    const updates = []
    
    for (const package_ of packages) {
      if (package_.BasicInformation?.promotionExpiryDate) {
        if (!hasActivePromotion(package_) && package_.BasicInformation?.promotionPrice !== null) {
          package_.BasicInformation.promotionPrice = null
          package_.BasicInformation.promotionExpiryDate = null
          updates.push(package_.save())
        }
      }
    }
    
    if (updates.length > 0) {
      await Promise.all(updates)
    }

    res.json({
      data: packages.map(package_ => ({
        _id: package_._id,
        title: package_?.BasicInformation?.title || '',
        duration: package_?.BasicInformation?.duration || '',
        price: package_?.BasicInformation?.price ?? '',
        groupSize: package_?.BasicInformation?.groupSize || '',
        image: package_?.LocationAndHighlights?.images?.[0] || '',
        status: package_.status || 'draft',
        createdAt: package_.createdAt,
      })),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deletePackage = async (req, res) => {
  try {
    const package_ = await Package.findByIdAndDelete(req.params.id)
    if (!package_) return res.status(404).json({ error: 'Package not found' })
    res.json({ message: 'Package deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updatePackage = async (req, res) => {
  try {
    const publicBaseUrl = `${req.protocol}://${req.get('host')}`
    const currentPackage = await Package.findById(req.params.id)
    if (!currentPackage) return res.status(404).json({ error: 'Package not found' })

    const BasicInformation = JSON.parse(req.body.BasicInformation)
    const LocationAndHighlights = JSON.parse(req.body.LocationAndHighlights)
    const DayByDayItinerary = JSON.parse(req.body.DayByDayItinerary)
    const AgencyContactInformation = JSON.parse(req.body.AgencyContactInformation)
    const status = (req.body.status || 'draft').trim().toLowerCase()

    const currentPromotionPrice = currentPackage.BasicInformation?.promotionPrice
    const currentPromotionExpiry = currentPackage.BasicInformation?.promotionExpiryDate
    const keepPromotion = hasActivePromotion(currentPackage)

    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : []
    const newImages = req.files ? req.files.map(file => `${publicBaseUrl}/uploads/${file.filename}`) : []
    const images = [...existingImages, ...newImages]

    // Handle promotion fields based on status - only promotionPrice and promotionExpiryDate
    const promotionFields = {
      promotionPrice: null,
      promotionExpiryDate: null,
    }

    const payload = {
      BasicInformation: {
        ...BasicInformation,
        ...(keepPromotion
          ? {
              promotionPrice: currentPromotionPrice,
              promotionExpiryDate: currentPromotionExpiry,
            }
          : promotionFields),
      },
      LocationAndHighlights: {
        ...LocationAndHighlights,
        highlights: Array.isArray(LocationAndHighlights.highlights)
          ? LocationAndHighlights.highlights
          : LocationAndHighlights.highlights?.split('\n').filter(Boolean) ?? [],
        images,
      },
      DayByDayItinerary,
      AgencyContactInformation,
      status,
    }

    const package_ = await Package.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true })
    console.log(`[Package] updated: ${package_._id} (${status})`)
    res.json({ message: `Package ${status === 'publish' ? 'published' : 'saved as draft'} successfully`, data: package_ })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export { createPackage, getPackage, getAllPackages, getPackagesCount, updatePackage, searchPackages, deletePackage };
