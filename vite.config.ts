import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': '/src',
		},
	},
	plugins: [react()],
	server: {
		// Encaminha as chamadas /api para o backend em dev. Com isso o front usa
		// caminhos relativos (baseURL vazia) e o browser vê tudo na mesma origem,
		// dispensando VITE_API_URL e CORS. Ajuste o target se a porta do backend mudar.
		proxy: {
			'/api': {
				target: 'http://localhost:5091',
				changeOrigin: true,
			},
		},
	},
})
