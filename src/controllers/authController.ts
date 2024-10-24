import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Hardcoded credentials for demonstration
const validUser = {
    email: 'charlespcamargo@gmail.com',
    password: '123'
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to get a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string 
 *                 example: "charlespcamargo@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;

    if (email === validUser.email && password === validUser.password) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
        return;
    }

    res.status(401).json({ message: 'Invalid credentials' });
};

export default { login };