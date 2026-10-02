import type { RefObject } from 'react'
import { Alert, Box, CircularProgress } from '@mui/material'

interface Props {
	containerRef: RefObject<HTMLDivElement | null>
	isLoading: boolean
	isError: boolean
}

export default function ReaderView({ containerRef, isLoading, isError }: Props) {
	return (
		<Box sx={{ position: 'relative', flex: 1, minHeight: 0, width: '100%' }}>
			<Box ref={containerRef} sx={{ height: '100%', width: '100%' }} />
			{isLoading && (
				<Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
					<CircularProgress />
				</Box>
			)}
			{isError && (
				<Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', p: 3 }}>
					<Alert severity="error">Não foi possível carregar o arquivo EPUB.</Alert>
				</Box>
			)}
		</Box>
	)
}
