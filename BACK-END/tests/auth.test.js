import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js'; 

describe('Testando o Back-end', () => {
  it('Deve tentar acessar a rota raiz ou de login', async () => {
    const response = await request(app).get('/'); 
    
    expect(response.status).toBeDefined();
  });
});