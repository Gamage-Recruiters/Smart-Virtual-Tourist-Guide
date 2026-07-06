const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); 

router.patch("/:id/fcm-token", userController.updateFCMToken);

module.exports = router;