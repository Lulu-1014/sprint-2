import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Avisa o robô para simular um navegador de internet
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});