import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js'; 

describe('Rotas de Autenticação (AuthRoutes)', () => {
  it('Deve receber uma resposta do servidor ao tentar fazer um cadastro vazio', async () => {
    const response = await request(app)
      .post('/cadastro') 
      .send({ nome_usuario: '', email: '', senha: '' });

    expect(response.status).toBeDefined(); 
  });
});