import { useEffect, useState } from 'react'
import { Box, CircularProgress, Divider, Paper, Stack, TablePagination, Typography } from '@mui/material'
import { fetchWordHistory, type WordHistoryItem } from '@/utils/reader-dictionary'

const formatDate = (iso: string): string => {
	const d = new Date(iso)
	return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// RF08 (#31): histórico de palavras consultadas no dicionário, com a obra de origem.
// Mais recentes primeiro, paginado no cliente (como a tabela de artigos).
export default function DictionaryHistorySection() {
	const [items, setItems] = useState<WordHistoryItem[] | null>(null)
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)

	// Carga inicial (setState só no retorno assíncrono — evita setState síncrono no efeito).
	useEffect(() => {
		let cancelled = false
		fetchWordHistory('recent').then((rows) => {
			if (!cancelled) setItems(rows)
		})
		return () => {
			cancelled = true
		}
	}, [])

	const pageItems = (items ?? []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 2 }}>
				<Typography variant="h6" component="h2">
					Histórico do dicionário
				</Typography>

				{items === null ? (
					<Stack sx={{ alignItems: 'center', py: 3 }}>
						<CircularProgress size={24} />
					</Stack>
				) : items.length === 0 ? (
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Você ainda não consultou palavras no dicionário. As consultas feitas durante a leitura aparecem aqui.
					</Typography>
				) : (
					<>
						<Stack divider={<Divider flexItem />}>
							{pageItems.map((it, i) => (
								<Stack
									key={`${it.word}-${it.consultedAt}-${i}`}
									direction="row"
									sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 2, py: 1 }}
								>
									<Box sx={{ minWidth: 0 }}>
										<Typography variant="body1" sx={{ fontWeight: 600 }}>
											{it.word}
										</Typography>
										<Typography
											variant="caption"
											sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
										>
											{it.publicationTitle}
										</Typography>
									</Box>
									<Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
										{formatDate(it.consultedAt)}
									</Typography>
								</Stack>
							))}
						</Stack>

						<TablePagination
							component="div"
							count={items.length}
							page={page}
							onPageChange={(_, p) => setPage(p)}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={(e) => {
								setRowsPerPage(parseInt(e.target.value, 10))
								setPage(0)
							}}
							rowsPerPageOptions={[10, 25, 50]}
							labelRowsPerPage="Itens por página"
							labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
						/>
					</>
				)}
			</Stack>
		</Paper>
	)
}
