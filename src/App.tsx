import { Box } from '@mui/material'
import { Outlet } from 'react-router'
import Header from './components/layout/header'
import Footer from './components/layout/footer'


export default function App() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<Header />
			<Box component="main" sx={{ flex: 1 }}>
          		<Outlet />
			</Box>
			<Footer />
		</Box>
	)
}
