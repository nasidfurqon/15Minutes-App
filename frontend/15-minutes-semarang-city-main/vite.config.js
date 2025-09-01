import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Muat variabel environment berdasarkan mode saat ini (misal: 'development')
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            basicSsl()
        ],
        server: {
            https: true,
            host: true,
            port: 5173,
            strictPort: true,
            proxy: {
                '/api': {
                    // Gunakan variabel dari .env sebagai target
                    target: env.VITE_API_URL, 
                    changeOrigin: true,
                }
            }
        },
    }
});