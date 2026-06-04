const express = require("express");
const offerController = require("../controllers/offer.controller");

const router = express.Router();

router.post("/", offerController.createOffer);
router.get("/", offerController.getAllOffers);
router.get("/active", offerController.getActiveOffers);
router.get("/restaurant/:restaurantId", offerController.getOffersByRestaurant);
router.get("/:id", offerController.getOfferById);
router.put("/:id", offerController.updateOffer);
router.delete("/:id", offerController.deleteOffer);
router.patch("/:id/status", offerController.toggleOfferStatus);

module.exports = router;
