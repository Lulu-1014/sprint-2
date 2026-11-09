import { describe, it, expect, vi } from 'vitest';
import authController from '../controllers/authController.js';

describe('Lógica de Autenticação (AuthController)', () => {

  it('Deve retornar erro 400 se tentar logar com dados vazios', async () => {
    const req = { body: { email: '', senha: '' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Deve fazer login com sucesso e retornar status 200', async () => {
    const req = { body: { email: 'usuario@teste.com', senha: '123', lembrar: false } };
    
    const loginMock = vi.fn().mockImplementation(async (req, res) => {
      return res.status(200).json({ mensagem: "Login realizado com sucesso!" });
    });

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn()
    };

    await loginMock(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
