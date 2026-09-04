import Incident from '../models/Incident.js';

const getPublicIncidents = async (req, res) => {
  try {
    const { incidentCategory, status, district } = req.query;

    const filter = {};
    if (incidentCategory) filter.incidentCategory = { $regex: incidentCategory, $options: 'i' };
    if (status) filter.status = { $regex: status, $options: 'i' };
    if (district) filter.district = { $regex: district, $options: 'i' };

    const incidents = await Incident.find(filter).sort({ createdAt: -1, _id: -1 });
    res.status(200).json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch incidents', error: error.message });
  }
};

export { getPublicIncidents };
