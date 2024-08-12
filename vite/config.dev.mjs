// @ts-check
import { defineConfig } from 'vite';
import { resolve } from 'path'

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            "#": resolve(process.cwd())
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080
    }
});
