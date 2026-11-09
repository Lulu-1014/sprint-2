import { describe, it, expect } from 'vitest';
// Puxa o seu arquivo real de validação
import authValidator from '../validators/authValidator.js'; 

describe('Validador de Cadastro (validarCadastro)', () => {
  it('Deve dar erro se o e-mail não tiver o símbolo @', () => {
    const dadosInvalidos = { 
      nome_usuario: 'usuario123', 
      email: 'emailerrado.com', // Sem arroba
      senha: 'senhaSegura123', 
      confirmar_senha: 'senhaSegura123', 
      idade: 20 
    };
    
    const resultado = authValidator.validarCadastro(dadosInvalidos);
    
    // O seu código retorna a mensagem de texto "Digite um email válido."
    expect(resultado).toBe("Digite um email válido."); 
  });

  it('Deve retornar null se todos os dados estiverem perfeitos', () => {
    const dadosCorretos = { 
      nome_usuario: 'usuario123', 
      email: 'teste@email.com', 
      senha: 'senhaSegura123', 
      confirmar_senha: 'senhaSegura123', 
      idade: 25 
    };
    
    const resultado = authValidator.validarCadastro(dadosCorretos);
    
    // Quando está tudo certo, seu código retorna null
    expect(resultado).toBeNull(); 
  });
});

describe('Validador de Login (validarLogin)', () => {
  it('Deve dar erro se enviar e-mail ou senha em branco', () => {
    const dadosVazios = { email: '', senha: '' };
    
    const resultado = authValidator.validarLogin(dadosVazios);
    
    expect(resultado).toBe("Email e senha são obrigatórios.");
  });
});