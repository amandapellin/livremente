import { Box } from '@mui/material'
import { Outlet, useLocation, matchPath } from 'react-router'
import Header from './components/layout/header'
import Footer from './components/layout/footer'

export default function App() {
	const { pathname } = useLocation()
	// No leitor (RF15) o header e o rodapé globais são escondidos (mais espaço de
	// leitura); a tela tem a própria top bar e barra de navegação.
	const isReader = Boolean(matchPath('/leitura/:id', pathname))

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				...(isReader ? { height: '100vh' } : { minHeight: '100vh' }),
			}}
		>
			{!isReader && <Header />}
			<Box
				component="main"
				sx={{ flex: 1, ...(isReader && { minHeight: 0, display: 'flex', flexDirection: 'column' }) }}
			>
				<Outlet />
			</Box>
			{!isReader && <Footer />}
		</Box>
	)
}
