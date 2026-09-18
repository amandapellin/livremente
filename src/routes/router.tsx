import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import App from '../App'
import LandingPage from '@/pages/landing'

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
			{ path: 'leitura/:id', lazy: page(() => import('../pages/reader')) },
			{ path: 'estante', lazy: page(() => import('../pages/shelf')) },
			{ path: 'recomendacoes', lazy: page(() => import('../pages/recomendations')) },
			{ path: '*', lazy: page(() => import('../pages/not-found')) },
		],
	},
])