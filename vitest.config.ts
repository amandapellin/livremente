import { defineConfig } from 'vitest/config'
import path from 'node:path'

const srcDir = path.resolve(import.meta.dirname, './src')

// Config de teste (Vitest) separada do build. jsdom p/ testar componentes React;
// alias @/ igual ao do app; setup carrega os matchers do jest-dom.
export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/test/setup.ts',
		css: false,
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
	},
	resolve: {
		alias: { '@': srcDir },
	},
})
