const express = require("express");
const menuItemController = require("../controllers/menuItem.controller");

const router = express.Router();

router.post("/", menuItemController.createMenuItem);
router.get("/restaurant/:restaurantId", menuItemController.getMenuItemsByRestaurant);
router.get("/search", menuItemController.searchMenuItems);
router.get("/:id", menuItemController.getMenuItemById);
router.put("/:id", menuItemController.updateMenuItem);
router.delete("/:id", menuItemController.deleteMenuItem);
router.patch("/:id/availability", menuItemController.toggleAvailability);

module.exports = router;
