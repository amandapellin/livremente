import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'
import { fetchWordHistory, type WordHistoryItem } from '@/utils/reader-dictionary'

const ORDERS = [
	{ value: 'recent', label: 'Mais recentes' },
	{ value: 'oldest', label: 'Mais antigas' },
] as const

const formatDate = (iso: string): string => {
	const d = new Date(iso)
	return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// RF08 (#31): histórico de palavras consultadas no dicionário, com a obra de origem.
export default function DictionaryHistorySection() {
	const [order, setOrder] = useState<'recent' | 'oldest'>('recent')
	const [items, setItems] = useState<WordHistoryItem[] | null>(null)

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

	// Troca de ordenação: recarrega a partir do handler (fora do efeito).
	const changeOrder = (next: 'recent' | 'oldest') => {
		if (next === order) return
		setOrder(next)
		setItems(null)
		fetchWordHistory(next).then(setItems)
	}

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 2 }}>
				<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
					<Typography variant="h6" component="h2">
						Histórico do dicionário
					</Typography>
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
					<Stack divider={<Divider flexItem />}>
						{items.map((it, i) => (
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
				)}
			</Stack>
		</Paper>
	)
}
