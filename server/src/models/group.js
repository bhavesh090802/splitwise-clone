const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    // members: array of user ObjectIds
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('group', groupSchema);
