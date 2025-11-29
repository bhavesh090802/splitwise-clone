const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  share: { type: Number, required: true }
}, { _id: false });

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
    split: { type: [splitSchema], required: true } // array of {user, share}
  },
  { timestamps: true }
);

module.exports = mongoose.model('expense', expenseSchema);
