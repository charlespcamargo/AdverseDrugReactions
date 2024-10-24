import NodeCache from 'node-cache';
import { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import drugService from '../services/drugService';
import { Drug } from '../models/drugModel';

// Cache with a TTL (Time to Live) of 60 minutes (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

/**
 * @swagger
 * /api/drugs/reactions:
 *   get:
 *     summary: Get adverse reactions for a specific drug
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Drugs
 *     parameters:
 *       - name: drugName
 *         in: query
 *         description: The brand or generic name of the drug. (Vimizim or elosulfase alfa)
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Limit the number of results (default is 200)
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of adverse reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drug:
 *                   type: string
 *                   example: "Vimizim"
 *                 reactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reaction:
 *                         type: string
 *                         example: "headache"
 *                       count:
 *                         type: integer
 *                         example: 10
 *       400:
 *         description: Bad Request - Missing drug name
 *       500:
 *         description: Internal Server Error
 */
const getAdverseReactions = [
    query('drugName')
        .trim()
        .notEmpty().withMessage('Drug name is required')
        .isString().withMessage('Drug name must be a string'),

    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const { drugName, limit } = req.query;
            const cacheKey = `drug_${drugName}`;

            const cachedResult = cache.get(cacheKey);
            if (cachedResult) {
                res.status(200).json(cachedResult);
                console.log("From cache...");
                return;
            }

            const drugResult: Drug = await drugService.getAdverseReactions((drugName as string), Number(limit) || 200);

            const result = {
                drug: drugResult.name,
                reactions: drugResult.reactions,
            };

            cache.set(cacheKey, result);
            
            console.log("From external api...");

            res.status(200).json(result);

        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                res.status(404).json({
                    message: 'Drug not found in FDA database.',
                    error: 'Not Found',
                });
            } else {
                res.status(500).json({
                    message: 'An unexpected error occurred.',
                    error: error.message || 'Unknown error',
                });
            }
        }
    }
];

export default {
    getAdverseReactions,
};