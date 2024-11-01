import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import drugRoutes from './routes/drugRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import drugService from './services/drugService';


const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/drugs', drugRoutes);
app.use('/api/auth', authRoutes);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'FDA Drug Adverse Reaction API',
            version: '1.0.0',
            description: 'API for querying drug adverse reactions'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: `http://localhost:${port}`,
            }
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Server running at port=${port}. You can see the swagger in http://localhost:${port}/docs`);
});



drugService.updateAdserveReactionsCacheBackground();

export default app;