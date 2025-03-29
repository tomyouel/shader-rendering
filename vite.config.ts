import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        glsl({
            include: ['**/*.glsl'],
            exclude: undefined,
            warnDuplicatedImports: true,
            removeDuplicatedImports: false,
            defaultExtension: 'glsl',
            compress: false,
            watch: true,
            root: '/',
        }),
    ],
});
