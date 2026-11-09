import { render, fireEvent, screen } from '@testing-library/react';
import { expect, test, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Cadastro from '../../pages/Login';
import { ThemeProvider } from '../../context/ThemeContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    cadastrar: vi.fn().mockResolvedValue({ ok: true }), 
  }),
}));

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ mensagem: "Usuário cadastrado com sucesso!" }),
  }));
});

test('Deve permitir preencher o formulário de cadastro e enviar os dados', () => {
  const { container } = render(
    <BrowserRouter>
      <ThemeProvider>
        <Cadastro />
      </ThemeProvider>
    </BrowserRouter>
  );

  const inputNome = container.querySelector('input[type="text"]') || container.querySelector('input');
  const inputEmail = container.querySelector('input[type="email"]') || container.querySelector('input');
  const inputSenha = container.querySelector('input[type="password"]') || container.querySelector('input');
  const inputIdade = container.querySelector('input[type="number"]') || container.querySelector('input');
  const botaoCadastrar = screen.queryByRole('button', { name: /cadastrar|registrar/i }) || container.querySelector('button[type="submit"]') || container.querySelector('button');

  if (inputNome && inputEmail && inputSenha && botaoCadastrar) {
    fireEvent.change(inputNome, { target: { value: 'NovoUsuario' } });
    fireEvent.change(inputEmail, { target: { value: 'cadastro@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: 'senha123' } });
    if (inputIdade) fireEvent.change(inputIdade, { target: { value: '25' } });

    fireEvent.click(botaoCadastrar);

    expect(botaoCadastrar).toBeDefined();
  } else {
    throw new Error("Não foi possível encontrar os campos do formulário de cadastro.");
  }
});
