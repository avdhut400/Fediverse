const request = require('supertest');
const app = require('../app');

describe('Health Check Endpoint', () => {
  it('GET /health should return 200 OK with status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('API Auth Routes', () => {
  it('GET /api/auth/me without token should return 401', async () => {
    const response = await request(app).get('/api/auth/me');
    
    // Should fail without authentication
    expect(response.status).toBe(401);
  });
});
