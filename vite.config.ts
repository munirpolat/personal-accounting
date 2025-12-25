
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process to ensure correct Node.js types are available
import process from 'process';

export default defineConfig(({ mode }) => {
  // .env dosyasını yükle
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // process.env.API_KEY kullanımını env.API_KEY ile eşleştir
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
