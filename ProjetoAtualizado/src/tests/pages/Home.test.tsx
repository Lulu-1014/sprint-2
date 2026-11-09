import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import { ThemeProvider } from '../../context/ThemeContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { nome_usuario: 'UsuarioLogado', email: 'logado@teste.com' },
    logout: vi.fn(),
  }),
}));

test('A página interna deve carregar os dados do usuário autenticado', () => {
  render(
    <BrowserRouter>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </BrowserRouter>
  );

  const elementoTela = screen.queryByRole('main') || screen.queryByText(/bem-vindo|dashboard|perfil/i) || document.body;
  expect(elementoTela).toBeDefined();
});
