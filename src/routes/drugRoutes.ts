import { Router } from 'express';
import drugController from '../controllers/drugController';
import authenticateToken from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/drugs/top-reactions:
 *   get:
 *     summary: Retrieve the first thousand adverse reactions by number of occurrences
 *     tags: [Drugs]
 *     responses:
 *       200:
 *         description: List of Adverse Reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/top-reactions', authenticateToken, drugController.getFirstThousandAdverseReactionsByNumberOfOccurrences);


/**
 * @swagger
 * /api/drugs/reactions:
 *   get:
 *     summary: Retrieve a list of Adverse Reactions
 *     tags: [Drugs]
 *     responses:
 *       200:
 *         description: List of Adverse Reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/reactions', authenticateToken, drugController.getAllAdverseReactions);

export default router;
