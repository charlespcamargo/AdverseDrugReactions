import request from 'supertest';
import sinon from 'sinon';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import app from '../../app';
import dotenv from 'dotenv';

dotenv.config();   

describe('Drug Controller Tests', () => {

    describe('GET /api/drugs/reactions', () => {
        let jwtToken: string = "";
        let axiosGetStub: sinon.SinonStub; 

        beforeEach(() => {
            axiosGetStub = sinon.stub(axios, 'get'); 

            jwtToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || "", { expiresIn: '1h' });
        });

        afterEach(() => {
            axiosGetStub.restore();   
        });

        it('should return a list of adverse reactions for a valid drug', async () => {
            const mockFDAResponse = {
                data: {
                    results: [
                        { term: 'headache', count: 10 },
                        { term: 'nausea', count: 5 }
                    ]
                }
            };

            axiosGetStub.resolves(mockFDAResponse);   

            const res = await request(app)   
                .get('/api/drugs/reactions')
                .set('Authorization', `Bearer ${jwtToken}`)
                .query({ drugName: 'Vimizim' });

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.drugName).toBe('Vimizim');
            expect(res.body.reactions).toBeInstanceOf(Array);

            expect(res.body.reactions[0].reactionName).toBe('headache');
        });

        it('should return 400 if drugName is missing', async () => {
            const res = await request(app)
                .get('/api/drugs/reactions')
                .set('Authorization', `Bearer ${jwtToken}`)
                .query({ drugName: '' });   
        
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toBeInstanceOf(Array);
            expect(res.body.errors).toHaveLength(1); 
        
            const error = res.body.errors[0];  
            expect(error).toHaveProperty('msg', 'Drug name is required');
        });
        

        it('should return 500 if there is an error from FDA API', async () => {
            axiosGetStub.rejects(new Error('FDA API error'));  

            const res = await request(app)
                .get('/api/drugs/reactions')
                .set('Authorization', `Bearer ${jwtToken}`)
                .query({ drugName: 'Vimizim' });

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'An unexpected error occurred.');
        });

        it('should return 404 if the drug is not found', async () => {
            axiosGetStub.rejects({
                response: { 
                    status: 404,
                    data: {
                        message: 'Drug not found in FDA database.',
                        error: 'Not Found',
                    }
                }
            }); 

            const res = await request(app)   
                .get('/api/drugs/reactions')
                .set('Authorization', `Bearer ${jwtToken}`)
                .query({ drugName: 'VimizimNotExists' });
        
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Drug not found in FDA database.');
        });
        
    });
});
