import express from 'express';
const router = express.Router();
import upload from '../../middleware/Safety/uploadMiddleware.js';
// Auth middleware
let protect;
try {
  const authModule = await import('../middleware/authMiddleware.js');
  protect = authModule.protect;
} catch {
  protect = (req, res, next) => next();
}

import * as weatherController from '../../controllers/Safety/weatherController.js';
import * as securityAlertController from '../../controllers/Safety/securityAlertController.js';
import * as incidentController from '../../controllers/Safety/incidentController.js';
import * as locationController from '../../controllers/Safety/locationController.js';
import * as emergencyLocationController from '../../controllers/Safety/emergencyLocationController.js';

// --- Weather Routes ---
router.get('/weather/alerts', weatherController.getWeatherAlerts);
router.get('/weather', weatherController.getWeather);

// --- Security Alert Routes ---
router.route('/security-alerts')
  .get(securityAlertController.getAlerts)
  .post(protect, securityAlertController.createAlert);

router.route('/security-alerts/:id')
  .get(securityAlertController.getAlertById)
  .put(protect, securityAlertController.updateAlert)
  .delete(protect, securityAlertController.deleteAlert);

// --- Incident Routes ---
// Public incidents route MUST come before /:id to avoid "public" being treated as an id
router.get('/incidents/public', incidentController.getPublicIncidents);
router.get('/incidents/count', incidentController.getIncidentCount);

router.get('/incidents', incidentController.getIncidents);
router.post('/incidents', protect, upload.array('images', 5), incidentController.createIncident);

router.route('/incidents/:id')
  .get(incidentController.getIncidentById)
  .put(protect, incidentController.updateIncident)
  .delete(protect, incidentController.deleteIncident);

// --- Location Sharing Routes ---
router.post('/location/share', protect, locationController.shareLocation);
router.route('/location/:shareCode')
  .get(locationController.getSharedLocation)
  .put(locationController.updateSharedLocation)
  .delete(locationController.stopSharingLocation);

// --- Emergency Location Routes ---
router.get('/emergency-locations/tourist_police', emergencyLocationController.getPoliceStations);
router.get('/emergency-locations/local-police', emergencyLocationController.getNearbyPoliceStations);
router.get('/emergency-locations/hospitals', emergencyLocationController.getNearbyHospitals);

router.route('/emergency-locations')
  .get(emergencyLocationController.getAllLocations)
  .post(emergencyLocationController.createLocation);

router.route('/emergency-locations/:id')
  .put(emergencyLocationController.updateLocation)
  .delete(emergencyLocationController.deleteLocation);

// --- Emergency Contacts (Dynamic) ---
import EmergencyContact from '../../models/Safety/EmergencyContact.js';
router.get('/emergency-contacts', async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({ isActive: true }).sort({ priority: 1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    next(error);
  }
});

// --- Tourist Profile (Integrated with User Model) ---
// User model 
let User;
try {
  const userModule = await import('../models/User.js');
  User = userModule.default || userModule.User;
} catch {
  User = null;
}

router.get('/tourists/profile/:id', async (req, res, next) => {
  try {

    if (!User) {
      return res.status(503).json({ success: false, message: 'User module not available yet' });
    }
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Tourist not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        touristId: user._id,
        name: user.fullName,
        email: user.email,
        country: user.country,
        bloodType: user.healthInfo?.bloodType,
        medicalCondition: user.healthInfo?.medicalCondition,
        emergencyContact: user.emergencyContact,
        travelType: user.travelType,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
