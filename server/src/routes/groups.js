const express = require('express');
const asyncHandler = require('express-async-handler');
const { createGroup, getGroupsForUser, getGroupById } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Manage groups
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, members]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authMiddleware, asyncHandler(createGroup));

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get groups of authenticated user
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of groups
 */
router.get('/', authMiddleware, asyncHandler(getGroupsForUser));

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group by id
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Group object
 */
router.get('/:id', authMiddleware, asyncHandler(getGroupById));

module.exports = router;
