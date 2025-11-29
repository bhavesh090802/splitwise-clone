const asyncHandler = require('express-async-handler');
const Expense = require('../models/expense');
const Group = require('../models/group');
const User = require('../models/user');

/**
 * Add an expense
 * body: { description, amount, paidBy, group, split: [{user, share}, ...] }
 */
const addExpense = asyncHandler(async (req, res) => {
  const { description, amount, paidBy, group, split } = req.body;

  if (!description || !amount || !paidBy || !group || !Array.isArray(split) || split.length === 0) {
    return res.status(400).json({ message: 'Invalid expense payload' });
  }

  // Validate group exists
  const grp = await Group.findById(group);
  if (!grp) return res.status(400).json({ message: 'Group not found' });

  // Validate that each split user is a member of the group
  const groupMemberIds = grp.members.map(m => m.toString());
  for (const s of split) {
    if (!groupMemberIds.includes(String(s.user))) {
      return res.status(400).json({ message: `User ${s.user} not in group` });
    }
  }

  const expense = await Expense.create({ description, amount, paidBy, group, split });
  res.status(201).json(expense);
});

/**
 * Get expenses by group
 * params: groupId
 */
const getExpensesByGroup = asyncHandler(async (req, res) => {
  const groupId = req.params.groupId;
  const expenses = await Expense.find({ group: groupId }).populate('paidBy', 'name email').populate('split.user', 'name email');
  res.json(expenses);
});

/**
 * Compute settlement for group:
 * returns user balances and suggested transfers using greedy algorithm
 */
const getSettlement = asyncHandler(async (req, res) => {
  const groupId = req.params.groupId;

  // load expenses and group members
  const expenses = await Expense.find({ group: groupId }).lean();
  const grp = await Group.findById(groupId).populate('members', 'name email').lean();
  if (!grp) return res.status(404).json({ message: 'Group not found' });

  // initialize balances map (userId -> net amount paid - owed)
  const balances = {};
  grp.members.forEach(m => { balances[m._id.toString()] = 0; });

  // For each expense: payer's balance += amount; for each split user: balance -= share
  expenses.forEach(exp => {
    const amt = Number(exp.amount) || 0;
    const payer = String(exp.paidBy);
    balances[payer] = (balances[payer] || 0) + amt;
    exp.split.forEach(s => {
      balances[String(s.user)] = (balances[String(s.user)] || 0) - Number(s.share);
    });
  });

  // Build creditors and debtors arrays
  const creditors = [];
  const debtors = [];
  for (const [userId, bal] of Object.entries(balances)) {
    const rounded = Math.round((bal + Number.EPSILON) * 100) / 100;
    if (rounded > 0) creditors.push({ userId, amount: rounded });
    else if (rounded < 0) debtors.push({ userId, amount: -rounded }); // store positive debt
  }

  // Greedy settlement: match largest creditor with largest debtor
  creditors.sort((a,b) => b.amount - a.amount);
  debtors.sort((a,b) => b.amount - a.amount);

  const transfers = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i];
    const debt = debtors[j];
    const transferAmt = Math.min(credit.amount, debt.amount);

    transfers.push({
      from: debt.userId,
      to: credit.userId,
      amount: Math.round((transferAmt + Number.EPSILON) * 100) / 100
    });

    credit.amount -= transferAmt;
    debt.amount -= transferAmt;

    if (Math.abs(credit.amount) < 0.01) i++;
    if (Math.abs(debt.amount) < 0.01) j++;
  }

  // convert balances to readable array with user details
  const balancesArray = Object.keys(balances).map(userId => {
    const member = grp.members.find(m => String(m._id) === String(userId));
    return { userId, name: member?.name || 'Unknown', balance: Math.round((balances[userId] + Number.EPSILON) * 100) / 100 };
  });

  res.json({ balances: balancesArray, transfers });
});

module.exports = {
  addExpense,
  getExpensesByGroup,
  getSettlement
};
