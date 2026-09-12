import { createBrowserRouter } from 'react-router'
import App from '../App'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import CadastroPage from '../pages/CadastroPage'
import PerfilPage from '../pages/PerfilPage'
import CatalogoPage from '../pages/CatalogoPage'
import DetalhesObraPage from '../pages/DetalhesObraPage'
import LeitorPage from '../pages/LeitorPage'
import EstantePage from '../pages/EstantePage'
import RecomendacoesPage from '../pages/RecomendacoesPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <CadastroPage /> },
      { path: 'perfil', element: <PerfilPage /> },
      { path: 'catalogo', element: <CatalogoPage /> },
      { path: 'obra/:id', element: <DetalhesObraPage /> },
      { path: 'leitura/:id', element: <LeitorPage /> },
      { path: 'estante', element: <EstantePage /> },
      { path: 'recomendacoes', element: <RecomendacoesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
