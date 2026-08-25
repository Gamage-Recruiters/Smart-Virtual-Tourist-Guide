import Advertisement from '../../models/travelPackage/Advertisement.js';
import Package from '../../models/travelPackage/Package.js';

const createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      budget,
      startDate,
      endDate,
      packageId
    } = req.body;

    // Validate required fields
    if (!title || !description || !budget || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle image upload if provided
    const publicBaseUrl = `${req.protocol}://${req.get('host')}`;
    const image = (req.files || []).map(file => `${publicBaseUrl}/uploads/${file.filename}`);

    // Step 1: Create the advertisement
    const advertisement = new Advertisement({
      title,
      description,
      type,
      budget: Number(budget),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image,
      clicks: 0,
      impressions: 0,
      CTR: 0,
      packageId: packageId || null
    });

    await advertisement.save();
    console.log(`[Advertisement] created: ${advertisement._id}`);

    // Step 2: Update the package with promotionPrice and promotionExpiryDate (only if packageId is provided)
    let updatedPackage = null;
    if (packageId) {
      updatedPackage = await Package.findByIdAndUpdate(
        packageId,
        {
          $set: {
            'BasicInformation.promotionPrice': Number(budget),
            'BasicInformation.promotionExpiryDate': new Date(endDate)
          }
        },
        { new: true }
      );

      if (!updatedPackage) {
        return res.status(404).json({ error: 'Package not found' });
      }
      
      console.log(`[Advertisement] package updated: ${updatedPackage._id}`);
    }

    res.status(201).json({ 
      message: packageId 
        ? 'Advertisement created and package updated successfully'
        : 'Advertisement created successfully',
      data: {
        advertisement,
        ...(updatedPackage && { updatedPackage })
      }
    });
  } catch (err) {
    console.error('Error creating advertisement:', err);
    res.status(500).json({ error: err.message });
  }
};

const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find().populate('packageId');
    res.status(200).json({ 
      count: advertisements.length,
      data: advertisements 
    });
  } catch (err) {
    console.error('Error fetching advertisements:', err);
    res.status(500).json({ error: err.message });
  }
};

export { createAdvertisement, getAllAdvertisements };