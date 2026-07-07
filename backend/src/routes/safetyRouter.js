const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const weatherController = require('../controllers/weatherController');
const securityAlertController = require('../controllers/securityAlertController');
const incidentController = require('../controllers/incidentController');
const locationController = require('../controllers/locationController');
const emergencyLocationController = require('../controllers/emergencyLocationController');

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
router.get('/emergency-locations/police', emergencyLocationController.getPoliceStations);
router.get('/emergency-locations/local-police', emergencyLocationController.getNearbyPoliceStations);
router.get('/emergency-locations/hospitals', emergencyLocationController.getNearbyHospitals);

router.route('/emergency-locations')
  .get(emergencyLocationController.getAllLocations)
  .post(emergencyLocationController.createLocation);

router.route('/emergency-locations/:id')
  .put(emergencyLocationController.updateLocation)
  .delete(emergencyLocationController.deleteLocation);

// --- Emergency Contacts (Static) ---
router.get('/emergency-contacts', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { service: 'Police', number: '119', icon: '🚔', color: '#1565C0' },
      { service: 'Ambulance', number: '110', icon: '🚑', color: '#E53935' },
      { service: 'Fire & Rescue', number: '111', icon: '🚒', color: '#EF6C00' },
      { service: 'Tourist Police', number: '1912', icon: '🛡️', color: '#00897B' },
      { service: 'Accident Service', number: '011-2691111', icon: '🏥', color: '#7B1FA2' },
      { service: 'Government Info', number: '1919', icon: 'ℹ️', color: '#0277BD' },
    ],
  });
});

// --- Tourist Profile (Integrated with User Model) ---
const User = require('../models/User');

router.get('/tourists/profile/:id', async (req, res, next) => {
  try {

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

module.exports = router;
