const express = require("express");
const router = express.Router();
const { createProfile } = require("../controllers/touristController");

router.post("/", createProfile);

module.exports = router;
