const express = require('express');
const router = express.Router();
const groupChatController = require('../../controllers/Admin/groupChatController');

// Optional auth middleware
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/', groupChatController.createGroup);
router.get('/', groupChatController.getGroups);
router.post('/:groupId/members', groupChatController.addMember);
router.delete('/:groupId/members/:userId', groupChatController.removeMember);
router.delete('/:groupId', groupChatController.deleteGroup);

router.get('/:groupId/messages', groupChatController.getGroupMessages);
router.post('/:groupId/messages', groupChatController.sendMessage);

module.exports = router;
