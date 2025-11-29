const express = require('express');
const asyncHandler = require('express-async-handler');
const { addExpense, getExpensesByGroup, getSettlement } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Manage expenses
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description, amount, paidBy, group, split]
 *             properties:
 *               description: { type: string }
 *               amount: { type: number }
 *               paidBy: { type: string }
 *               group: { type: string }
 *               split:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user: { type: string }
 *                     share: { type: number }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authMiddleware, asyncHandler(addExpense));

/**
 * @swagger
 * /api/expenses/group/{groupId}:
 *   get:
 *     summary: Get expenses for a group
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of expenses
 */
router.get('/group/:groupId', authMiddleware, asyncHandler(getExpensesByGroup));

/**
 * @swagger
 * /api/expenses/settlement/{groupId}:
 *   get:
 *     summary: Get suggested settlement transfers for a group
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: balances and transfers
 */
router.get('/settlement/:groupId', authMiddleware, asyncHandler(getSettlement));

module.exports = router;
