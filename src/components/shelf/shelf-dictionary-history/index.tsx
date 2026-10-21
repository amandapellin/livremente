import { useEffect, useState } from 'react'
import { CollectionsBookmarkOutlined } from '@mui/icons-material'
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'
import { fetchWordHistory, type WordHistoryItem } from '@/utils/reader-dictionary'

const ORDERS = [
	{ value: 'recent', label: 'Mais recentes' },
	{ value: 'oldest', label: 'Mais antigas' },
] as const

/**
 * Card do Histórico do Dicionário na estante (#27, RF08) no modelo do Figma
 * (nó 147:8576): grade de 2 colunas, cada palavra num cartão com a palavra, um
 * selo da obra de origem e a definição consultada (quando houver — consultas
 * anteriores à migração não têm definição). Lê `GET /api/dictionary/history`.
 */
export default function ShelfDictionaryHistory() {
	const [order, setOrder] = useState<'recent' | 'oldest'>('recent')
	const [items, setItems] = useState<WordHistoryItem[] | null>(null)

	useEffect(() => {
		let cancelled = false
		fetchWordHistory('recent').then((rows) => {
			if (!cancelled) setItems(rows)
		})
		return () => {
			cancelled = true
		}
	}, [])

	const changeOrder = (next: 'recent' | 'oldest') => {
		if (next === order) return
		setOrder(next)
		setItems(null)
		fetchWordHistory(next).then(setItems)
	}

	return (
		<Paper variant="section" sx={{ p: 2.5 }}>
			<Stack sx={{ gap: 2 }}>
				{/* Cabeçalho com ícone + título e as ordenações */}
				<Stack
					direction="row"
					sx={{
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: 1,
						flexWrap: 'wrap',
						borderBottom: `1px solid ${colors.papel[300]}`,
						pb: 1.5,
					}}
				>
					<Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
						<CollectionsBookmarkOutlined sx={{ color: 'primary.main', fontSize: 26 }} />
						<Typography variant="h6" component="h2" sx={{ color: 'primary.main' }}>
							Histórico do Dicionário
						</Typography>
					</Stack>
					<Stack direction="row" sx={{ gap: 1 }}>
						{ORDERS.map((o) => {
							const selected = order === o.value
							return (
								<Button
									key={o.value}
									size="small"
									variant="outlined"
									color="inherit"
									aria-pressed={selected}
									onClick={() => changeOrder(o.value)}
									sx={
										selected
											? {
													bgcolor: colors.gold[100],
													borderColor: colors.gold[700],
													color: colors.gold[800],
													'&:hover': { bgcolor: colors.gold[100], borderColor: colors.gold[700] },
												}
											: undefined
									}
								>
									{o.label}
								</Button>
							)
						})}
					</Stack>
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
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
							gap: 1.5,
						}}
					>
						{items.map((it, i) => (
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
				)}
			</Stack>
		</Paper>
	)
}
