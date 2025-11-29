const asyncHandler = require('express-async-handler');
const Group = require('../models/group');
const User = require('../models/user');

/**
 * Create a new group
 * body: { name, description, members: [userId1, userId2, ...] }
 */
const createGroup = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;
  if (!name || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ message: 'name and members array required' });
  }

  // Optional: validate member ids exist
  const users = await User.find({ _id: { $in: members } }).select('_id');
  if (users.length !== members.length) {
    return res.status(400).json({ message: 'Some members not found' });
  }

  const group = await Group.create({ name, description: description || '', members });
  res.status(201).json(group);
});

const getGroupsForUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const groups = await Group.find({ members: userId }).populate('members', 'name email');
  res.json(groups);
});

const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id).populate('members', 'name email');
  if (!group) return res.status(404).json({ message: 'Group not found' });
  res.json(group);
});

module.exports = {
  createGroup,
  getGroupsForUser,
  getGroupById
};
