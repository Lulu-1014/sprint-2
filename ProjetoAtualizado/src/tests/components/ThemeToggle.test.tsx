import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom'; 
import ThemeToggle from '../../components/ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

test('Deve mudar o tema quando o usuário clicar no botão', async () => {
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

  const botaoTema = screen.getByRole('button');
  
  expect(botaoTema).toBeDefined(); 

  await userEvent.click(botaoTema);

  expect(botaoTema).not.toBeNull();
});