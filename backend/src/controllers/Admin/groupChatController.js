const GroupChat = require('../../models/GroupChat');
const GroupMessage = require('../../models/GroupMessage');
const User = require('../../models/User');

// Create a new group chat
exports.createGroup = async (req, res) => {
  try {
    const { groupName, initialMemberIds } = req.body;
    const adminId = req.user?.id || req.body.adminId;

    if (!groupName) {
      return res.status(400).json({ success: false, message: 'Group name is required' });
    }

    const members = [];
    if (adminId) {
      members.push({ user: adminId, role: 'Admin' });
    }

    if (Array.isArray(initialMemberIds)) {
      initialMemberIds.forEach((memId) => {
        if (memId !== adminId) {
          members.push({ user: memId, role: 'Member' });
        }
      });
    }

    const newGroup = await GroupChat.create({
      groupName,
      admin: adminId,
      members,
    });

    const populatedGroup = await GroupChat.findById(newGroup._id)
      .populate('admin', 'fullName email role username')
      .populate('members.user', 'fullName email role username avatar');

    return res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: populatedGroup,
    });
  } catch (error) {
    console.error('Error in createGroup:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await GroupChat.find()
      .populate('admin', 'fullName email role username')
      .populate('members.user', 'fullName email role username avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error('Error in getGroups:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add a member to group
exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await GroupChat.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const alreadyMember = group.members.some((m) => m.user.toString() === userId.toString());
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User is already a member of this group' });
    }

    group.members.push({ user: userId, role: 'Member' });
    await group.save();

    const updatedGroup = await GroupChat.findById(groupId)
      .populate('admin', 'fullName email role username')
      .populate('members.user', 'fullName email role username avatar');

    return res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: updatedGroup,
    });
  } catch (error) {
    console.error('Error in addMember:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a member from group
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await GroupChat.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.members = group.members.filter((m) => m.user.toString() !== userId.toString());
    await group.save();

    const updatedGroup = await GroupChat.findById(groupId)
      .populate('admin', 'fullName email role username')
      .populate('members.user', 'fullName email role username avatar');

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: updatedGroup,
    });
  } catch (error) {
    console.error('Error in removeMember:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    await GroupChat.findByIdAndDelete(groupId);
    await GroupMessage.deleteMany({ groupId });

    return res.status(200).json({
      success: true,
      message: 'Group and all associated messages deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteGroup:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a group
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.find({ groupId })
      .populate('sender', 'fullName email role username avatar')
      .populate('mentions', 'fullName username')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error in getGroupMessages:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send message to a group
exports.sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, imageUrl, mentions, senderId } = req.body;
    const actualSenderId = req.user?.id || senderId;

    if (!text && !imageUrl) {
      return res.status(400).json({ success: false, message: 'Message must contain text or image' });
    }

    const newMessage = await GroupMessage.create({
      groupId,
      sender: actualSenderId,
      text: text || '',
      imageUrl: imageUrl || null,
      mentions: Array.isArray(mentions) ? mentions : [],
    });

    const populatedMsg = await GroupMessage.findById(newMessage._id)
      .populate('sender', 'fullName email role username avatar')
      .populate('mentions', 'fullName username');

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMsg,
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
