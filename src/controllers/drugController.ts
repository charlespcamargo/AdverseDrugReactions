import { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import drugService from '../services/drugService';
import { Drug } from '../models/Drug';

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
 *       - name: currentPage
 *         in: query
 *         description: The current page number (default is 1 - The OpenFDA limit is 1000 - page 100)
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
 *                 drugName:
 *                   type: string
 *                   example: "Vimizim"
 *                 reactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reactionName:
 *                         type: string
 *                         example: "headache"
 *                       total:
 *                         type: integer
 *                         example: 1
 *       400:
 *         description: Bad Request - Missing drug name
 *       500:
 *         description: Internal Server Error
 */
const getFirstThousandAdverseReactionsByNumberOfOccurrences = [
    query('drugName')
        .trim()
        .notEmpty().withMessage('Drug name is required')
        .isString().withMessage('Drug name must be a string'),

    query('currentPage')
        .optional()
        .trim()        
        .isInt({ gt: 0 }).withMessage('Current page must be a positive integer'),

    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const { drugName, currentPage, pageSize = 10 } = req.query;
            const drugResult: Drug = await drugService.getFirstThousandAdverseReactionsByNumberOfOccurrences((drugName as string), Number(currentPage) || 1, Number(pageSize));

            res.status(200).json(drugResult);

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

            if (error.response) {
                console.log("\nresponse", `${error.response.status} - ${error.response.statusText}`);

                if (error.response.data && error.response.data.error.message)
                    console.log("data", `${error.response.data.error.message}`);
            }
        }
    }
];

export default {
    getFirstThousandAdverseReactionsByNumberOfOccurrences,
};