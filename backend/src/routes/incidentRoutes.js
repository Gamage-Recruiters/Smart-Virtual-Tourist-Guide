const express = require('express');
const incidentRoutes = express.Router();
const { getIncidentCount } = require('../controllers/incidentController');

incidentRoutes.get('/count', getIncidentCount);

module.exports = incidentRoutes;