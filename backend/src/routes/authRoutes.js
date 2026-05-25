const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAllUsers, toggleUserStatus} = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes for authentication
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Route to fetch all users for the management table
router.get('/users', getAllUsers); 

router.put('/users/:id/status', toggleUserStatus);
// Example of a protected route (Only logged-in admins can access this)
router.get('/profile', protectAdmin, (req, res) => {
  res.json({
    message: 'You have accessed a protected route!',
    adminInfo: req.admin
  });
});

module.exports = router;