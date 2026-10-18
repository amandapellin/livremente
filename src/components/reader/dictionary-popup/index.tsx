import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Button, CircularProgress, ClickAwayListener, IconButton, Paper, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined'
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff'
import { lookupWord, type DictionaryEntry } from '@/utils/reader-dictionary'
import { getSaveDictionary } from '@/utils/reader-preferences'

interface Props {
	word: string
	bookId: string
	top: number
	left: number
	onHighlight: () => void
	onClose: () => void
}

type State = { loading: boolean; entry?: DictionaryEntry; error?: 'not-found' | 'error' }

export default function DictionaryPopup({ word, bookId, top, left, onHighlight, onClose }: Props) {
	const [state, setState] = useState<State>({ loading: true })
	const saved = getSaveDictionary()

	// RF07: consulta ao abrir (o POST também registra no histórico, se permitido).
	// O popup é remontado por palavra (key no pai), então o estado inicial já é "loading".
	useEffect(() => {
		let cancelled = false
		lookupWord(bookId, word).then((r) => {
			if (cancelled) return
			if (r.status === 'ok') setState({ loading: false, entry: r.entry })
			else if (r.status === 'not-found') setState({ loading: false, error: 'not-found' })
			else setState({ loading: false, error: 'error' })
		})
		return () => {
			cancelled = true
		}
	}, [bookId, word])

	const entry = state.entry
	const meta = entry
		? [entry.meanings[0]?.partOfSpeech, entry.phonetic, 'dicionário integrado'].filter(Boolean).join(' · ')
		: 'dicionário integrado'
	const definitions = entry ? entry.meanings.flatMap((m) => m.definitions).slice(0, 4) : []

	// Posiciona medindo o tamanho real: abaixo da seleção; se não couber, vira para
	// cima; e prende às margens da viewport para nunca ficar cortado (useLayoutEffect
	// roda antes da pintura, então não há "pulo"). Recalcula quando o conteúdo muda de
	// tamanho (loading -> carregado).
	const paperRef = useRef<HTMLDivElement>(null)
	const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

	useLayoutEffect(() => {
		const el = paperRef.current
		if (!el) return
		const margin = 12
		const gap = 16
		const h = el.offsetHeight
		const w = el.offsetWidth
		const vw = window.innerWidth
		const vh = window.innerHeight

		let nextTop = top + gap
		if (nextTop + h > vh - margin) {
			const above = top - gap - h
			nextTop = above >= margin ? above : Math.max(margin, vh - margin - h)
		}
		const nextLeft = Math.min(Math.max(margin + w / 2, left), vw - margin - w / 2)
		setPos({ top: nextTop, left: nextLeft })
	}, [top, left, state.loading, state.entry, state.error])

	return (
		<ClickAwayListener onClickAway={onClose}>
			<Paper
				ref={paperRef}
				elevation={8}
				sx={{
					position: 'fixed',
					top: pos?.top ?? Math.max(12, top + 16),
					left: pos?.left ?? left,
					transform: 'translateX(-50%)',
					visibility: pos ? 'visible' : 'hidden',
					zIndex: (t) => t.zIndex.modal,
					width: 340,
					maxWidth: 'calc(100vw - 24px)',
					borderRadius: 3,
					p: 2,
				}}
			>
				<Stack sx={{ gap: 1 }}>
					<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
						<Box sx={{ minWidth: 0 }}>
							<Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.15, wordBreak: 'break-word' }}>
								{entry?.word ?? word}
							</Typography>
							<Typography variant="caption" sx={{ color: 'text.secondary' }}>
								{meta}
							</Typography>
						</Box>
						<IconButton size="small" aria-label="Fechar dicionário" onClick={onClose} sx={{ mt: -0.5, mr: -0.5 }}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Stack>

					{state.loading ? (
						<Stack direction="row" sx={{ alignItems: 'center', gap: 1, py: 1 }}>
							<CircularProgress size={16} />
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								Buscando significado…
							</Typography>
						</Stack>
					) : state.error ? (
						<Typography variant="body2" sx={{ color: 'text.secondary', py: 0.5 }}>
							{state.error === 'not-found'
								? 'Sem definição encontrada para esta palavra.'
								: 'Não foi possível consultar o dicionário agora.'}
						</Typography>
					) : (
						<Stack component="ol" sx={{ pl: 2.5, m: 0, gap: 0.5, maxHeight: 200, overflowY: 'auto' }}>
							{definitions.map((d, i) => (
								<Typography key={i} component="li" variant="body2">
									{d.definition}
									{d.example ? (
										<Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
											{' '}
											— {d.example}
										</Box>
									) : null}
								</Typography>
							))}
						</Stack>
					)}

					<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 0.5 }}>
						{entry ? (
							<Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
								{saved ? <BookmarkAddedOutlinedIcon fontSize="small" /> : <HistoryToggleOffIcon fontSize="small" />}
								<Typography variant="caption">{saved ? 'Salvo no histórico' : 'Histórico desativado'}</Typography>
							</Stack>
						) : (
							<Box />
						)}
						<Button
							size="small"
							variant="outlined"
							color="inherit"
							startIcon={<BorderColorIcon />}
							onClick={onHighlight}
							sx={{ borderRadius: 5, flexShrink: 0 }}
						>
							Grifar palavra
						</Button>
					</Stack>
				</Stack>
			</Paper>
		</ClickAwayListener>
	)
}
