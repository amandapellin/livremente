import { useEffect, useState } from 'react'
import { CollectionsBookmarkOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Paper, Stack, TablePagination, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'
import { fetchWordHistory, type WordHistoryItem } from '@/utils/reader-dictionary'

/**
 * Card do Histórico do Dicionário na estante (#27, RF08) no modelo do Figma
 * (nó 147:8576): grade de 2 colunas, cada palavra num cartão com a palavra, um
 * selo da obra de origem e a definição consultada (quando houver — consultas
 * anteriores à migração não têm definição). Lê `GET /api/dictionary/history`
 * (mais recentes primeiro) e pagina no cliente, como a tabela de artigos.
 */
export default function ShelfDictionaryHistory() {
	const [items, setItems] = useState<WordHistoryItem[] | null>(null)
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(6)

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
		<Paper variant="section" sx={{ p: 2.5 }}>
			<Stack sx={{ gap: 2 }}>
				{/* Cabeçalho com ícone + título */}
				<Stack
					direction="row"
					sx={{
						alignItems: 'center',
						gap: 1,
						borderBottom: `1px solid ${colors.papel[300]}`,
						pb: 1.5,
					}}
				>
					<CollectionsBookmarkOutlined sx={{ color: 'primary.main', fontSize: 26 }} />
					<Typography variant="h6" component="h2" sx={{ color: 'primary.main' }}>
						Histórico do Dicionário
					</Typography>
				</Stack>

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
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
								gap: 1.5,
							}}
						>
							{pageItems.map((it, i) => (
								<Stack
									key={`${it.word}-${it.consultedAt}-${i}`}
									sx={{
										gap: 0.5,
										p: 1.5,
										borderRadius: 2,
										bgcolor: colors.papel[50],
										border: `1px solid ${colors.papel[300]}`,
									}}
								>
									<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
										<Typography sx={{ fontWeight: 500, color: 'primary.main', fontSize: 14 }}>{it.word}</Typography>
										<Box
											sx={{
												flexShrink: 0,
												maxWidth: '55%',
												px: 1,
												py: 0.5,
												borderRadius: 999,
												bgcolor: colors.primary[100],
												color: colors.primary[700],
												fontSize: 10,
												fontWeight: 600,
												letterSpacing: '1.5px',
												textTransform: 'uppercase',
												lineHeight: 1.4,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
											title={it.publicationTitle}
										>
											{it.publicationTitle}
										</Box>
									</Stack>
									{it.definition ? (
										<Typography variant="body2" sx={{ color: 'text.secondary' }}>
											{it.definition}
										</Typography>
									) : null}
								</Stack>
							))}
						</Box>

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
							rowsPerPageOptions={[6, 12, 24]}
							labelRowsPerPage="Itens por página"
							labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
						/>
					</>
				)}
			</Stack>
		</Paper>
	)
}
