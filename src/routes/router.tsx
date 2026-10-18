import type { ComponentType } from 'react'
import { createBrowserRouter, redirect } from 'react-router'
import App from '../App'
import LandingPage from '@/pages/landing'
import { isAuthenticated } from '@/api/auth-storage'

// Guard de leitura: consultar o acervo é público, mas LER exige login (RF). Sem
// token, redireciona ao /login (o arquivo em si também é protegido no back-end).
const requireAuth = () => (isAuthenticated() ? null : redirect('/login'))

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
	Component: (await load()).default,
})

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'login', lazy: page(() => import('../pages/login')) },
			{ path: 'cadastro', lazy: page(() => import('../pages/register')) },
			{ path: 'perfil', lazy: page(() => import('../pages/profile')) },
			{ path: 'catalogo', lazy: page(() => import('../pages/catalog')) },
			{ path: 'obra/:id', lazy: page(() => import('../pages/details')) },
			{ path: 'leitura/:id', loader: requireAuth, lazy: page(() => import('../pages/reader')) },
			{ path: 'estante', lazy: page(() => import('../pages/shelf')) },
			{ path: 'recomendacoes', lazy: page(() => import('../pages/recomendations')) },
			{ path: '*', lazy: page(() => import('../pages/not-found')) },
		],
	},
])