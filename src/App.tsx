import { Box } from '@mui/material'
import { Outlet } from 'react-router'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

export default function App() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header />
			<Box component="main" sx={{ flex: 1, p: 3 }}>
				<Outlet />
			</Box>
			<Footer />
		</Box>
	)
}
