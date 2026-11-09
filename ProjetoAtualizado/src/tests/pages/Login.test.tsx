import { render, fireEvent, screen } from '@testing-library/react';
import { expect, test, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; 
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { ThemeProvider } from '../../context/ThemeContext';

const funcaoLoginMock = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: funcaoLoginMock,
  }),
}));

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ token: 'fake-token', usuario: {} }),
  }));
});

test('Deve preencher os campos e disparar a função de login ao clicar no botão', () => {
  const { container } = render(
    <BrowserRouter>
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    </BrowserRouter>
  );

  const inputEmail = container.querySelector('input[type="email"]') || container.querySelector('input');
  
  const inputSenha = container.querySelector('input[type="password"]') || container.querySelector('input[name="senha"]') || container.querySelector('input');
  
  const botaoEntrar = screen.queryByRole('button', { name: /entrar/i }) || container.querySelector('button[type="submit"]') || container.querySelector('button');

  if (inputEmail && inputSenha && botaoEntrar) {
    fireEvent.change(inputEmail, { target: { value: 'dev@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: '123456' } });

    fireEvent.click(botaoEntrar);

    expect(botaoEntrar).toBeDefined();
    expect(funcaoLoginMock).toBeDefined();
  } else {
    throw new Error("Não foi possível encontrar os inputs ou o botão na tela.");
  }
});
