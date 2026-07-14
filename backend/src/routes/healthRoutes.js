const express = require('express');
const router = express.Router();

const { getVaccinations, getIncidentCount } = require('../controllers/healthController'); 

router.get('/vaccinations/:touristId', getVaccinations);
router.get('/incidents/count/:touristId', getIncidentCount);

module.exports = router;