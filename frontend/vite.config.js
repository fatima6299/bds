
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Les pages admin statiques (admin-products.html, etc., dans public/) ne
// passent pas par le pipeline de modules de Vite et n'ont donc pas accès à
// import.meta.env. On leur génère un config.js séparé avec la même valeur
// de VITE_API_BASE_URL que l'app React, pour que js/api-client.js puisse le lire.
function adminConfigPlugin(mode) {
  return {
    name: 'admin-config',
    apply: 'build',
    closeBundle() {
      const env = loadEnv(mode, process.cwd(), 'VITE_');
      const outDir = resolve(__dirname, 'dist', 'js');
      mkdirSync(outDir, { recursive: true });
      writeFileSync(
        resolve(outDir, 'config.js'),
        `window.__API_BASE_URL__ = ${JSON.stringify(env.VITE_API_BASE_URL || '')};\n`
      );
    }
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), adminConfigPlugin(mode)],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}));
