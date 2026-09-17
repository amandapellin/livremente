import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import App from '../App'
import LandingPage from '../pages/LandingPage'

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
	Component: (await load()).default,
})

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'login', lazy: page(() => import('../pages/LoginPage')) },
			{ path: 'cadastro', lazy: page(() => import('../pages/CadastroPage')) },
			{ path: 'perfil', lazy: page(() => import('../pages/PerfilPage')) },
			{ path: 'catalogo', lazy: page(() => import('../pages/CatalogoPage')) },
			{ path: 'obra/:id', lazy: page(() => import('../pages/DetalhesObraPage')) },
			{ path: 'leitura/:id', lazy: page(() => import('../pages/LeitorPage')) },
			{ path: 'estante', lazy: page(() => import('../pages/EstantePage')) },
			{ path: 'recomendacoes', lazy: page(() => import('../pages/RecomendacoesPage')) },
			{ path: '*', lazy: page(() => import('../pages/NotFoundPage')) },
		],
	},
])