import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
        server: {
            deps: {
                inline: [/@exodus\/bytes/, /html-encoding-sniffer/],
                fallbackCJS: true,
            },
        },
        alias: {
            '@': path.resolve(process.cwd(), './'),
        },
    },
});
