import supertest from 'supertest';
import app from '../app.js';

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the API!' });
  });
});
