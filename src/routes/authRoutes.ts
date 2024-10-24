import { Router, RequestHandler } from 'express';
import authController from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */
const loginHandler: RequestHandler = (req, res) => {
    authController.login(req, res);
};

router.post('/login', loginHandler);

export default router;
