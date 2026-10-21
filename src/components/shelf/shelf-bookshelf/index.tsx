import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Add } from '@mui/icons-material'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import type { ShelfItem } from '@/utils/shelf'

interface Props {
	items: ShelfItem[]
	statusLabel: string
}

type SpineColor = { bg: string; fg: string }

const baseURL = import.meta.env.VITE_API_URL ?? ''

// Amostra a cor dominante (média) da capa proxiada (mesma origem → canvas não é
// "tainted"), escurecida para dar cara de lombada; a cor do texto vem da luminância.
const sampleCoverColor = (publicationId: string): Promise<SpineColor | null> =>
	new Promise((resolve) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => {
			try {
				const w = 12
				const h = 18
				const canvas = document.createElement('canvas')
				canvas.width = w
				canvas.height = h
				const ctx = canvas.getContext('2d')
				if (!ctx) return resolve(null)
				ctx.drawImage(img, 0, 0, w, h)
				const data = ctx.getImageData(0, 0, w, h).data
				let r = 0
				let g = 0
				let b = 0
				let n = 0
				for (let i = 0; i < data.length; i += 4) {
					if (data[i + 3] < 128) continue // ignora pixels transparentes
					r += data[i]
					g += data[i + 1]
					b += data[i + 2]
					n++
				}
				if (n === 0) return resolve(null)
				r = Math.round(r / n)
				g = Math.round(g / n)
				b = Math.round(b / n)
				const dark = (v: number) => Math.round(v * 0.82)
				const luminance = 0.299 * r + 0.587 * g + 0.114 * b
				resolve({ bg: `rgb(${dark(r)}, ${dark(g)}, ${dark(b)})`, fg: luminance > 150 ? '#1c2026' : '#fbf8f2' })
			} catch {
				resolve(null) // canvas "tainted"/falha → cai na paleta
			}
		}
		img.onerror = () => resolve(null)
		img.src = `${baseURL}/api/publications/${publicationId}/cover`
	})

// Paleta determinística de lombadas (tons profundos do acervo). Texto claro em todas.
const SPINES: readonly { bg: string; fg: string; edge: string }[] = [
	{ bg: '#1f2f33', fg: '#fbf8f2', edge: '#0c1213' },
	{ bg: '#3b2a20', fg: '#fbf8f2', edge: '#140e0b' },
	{ bg: '#27372c', fg: '#fbf8f2', edge: '#0d120e' },
	{ bg: '#1b2e4b', fg: '#fbf8f2', edge: '#080e16' },
	{ bg: '#4a2b3a', fg: '#fbf8f2', edge: '#160a10' },
	{ bg: '#2e323e', fg: '#fbf8f2', edge: '#111319' },
]

// Hash estável do título → índice de cor + pequena variação de largura/altura,
// para a prateleira parecer orgânica sem depender de dado de cor por obra.
const hashOf = (s: string): number => {
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return h
}

/**
 * Visão Prateleira da estante (#27, RF05): lombadas dos livros sobre uma placa de
 * madeira, com título girado e % de leitura na base. Cada lombada abre os detalhes
 * da obra; o "+" leva ao catálogo.
 */
export default function ShelfBookshelf({ items, statusLabel }: Props) {
	const navigate = useNavigate()
	const [coverColors, setCoverColors] = useState<Record<string, SpineColor>>({})

	// Para cada obra com capa, amostra a cor e guarda por id (uma vez; o navegador
	// cacheia a imagem e o setState dedup por chave). Sem capa → fallback na paleta.
	useEffect(() => {
		let cancelled = false
		for (const it of items) {
			if (!it.publication.coverUrl) continue
			const id = it.publication.id
			sampleCoverColor(id).then((color) => {
				if (!cancelled && color) setCoverColors((prev) => (prev[id] ? prev : { ...prev, [id]: color }))
			})
		}
		return () => {
			cancelled = true
		}
	}, [items])

	return (
		<Box
			sx={{
				borderRadius: 2,
				p: 3,
				backgroundImage:
					'linear-gradient(rgba(121,74,46,0.82), rgba(121,74,46,0.82)), repeating-linear-gradient(90deg, #6b4530 0 18px, #5e3c28 18px 36px)',
				boxShadow: '0 1px 1.5px rgba(0,0,0,0.3)',
			}}
		>
			<Stack
				direction="row"
				sx={{ gap: 1.25, alignItems: 'flex-end', minHeight: 300, overflowX: 'auto', pb: 1 }}
			>
				{items.map((it) => {
					const h = hashOf(it.publication.title)
					const palette = SPINES[h % SPINES.length]
					// Cor da capa do Gutendex quando disponível; senão, a paleta determinística.
					const sampled = coverColors[it.publication.id]
					const spine = sampled
						? { bg: sampled.bg, fg: sampled.fg, edge: 'rgba(0,0,0,0.45)' }
						: palette
					const width = 48 + (h % 5) * 7 // 48–76px
					const height = 240 + (h % 7) * 9 // 240–294px
					const percent = it.readPercentage ?? 0
					return (
						<Tooltip key={it.publication.id} title={it.publication.title} arrow>
							<Box
								role="button"
								tabIndex={0}
								onClick={() => navigate(`/obra/${it.publication.id}`)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') navigate(`/obra/${it.publication.id}`)
								}}
								sx={{
									position: 'relative',
									flexShrink: 0,
									width,
									height,
									bgcolor: spine.bg,
									color: spine.fg,
									borderRadius: '2px 2px 1px 1px',
									borderLeft: `4px solid ${spine.edge}`,
									boxShadow: '3px 4px 10px rgba(0,0,0,0.45)',
									cursor: 'pointer',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'space-between',
									py: 1.5,
									'&:focus-visible': { outline: '2px solid #fbf8f2', outlineOffset: 2 },
								}}
							>
								<Typography
									sx={{
										writingMode: 'vertical-rl',
										textOrientation: 'mixed',
										fontSize: 12,
										fontWeight: 500,
										maxHeight: height - 70,
										overflow: 'hidden',
										textAlign: 'center',
									}}
								>
									{it.publication.title}
								</Typography>
								<Stack sx={{ alignItems: 'center', gap: 0.5 }}>
									<Box sx={{ width: 12, height: '1px', bgcolor: 'currentColor', opacity: 0.35 }} />
									<Typography sx={{ fontSize: 10, fontWeight: 500 }}>{percent}%</Typography>
								</Stack>
							</Box>
						</Tooltip>
					)
				})}

				<Tooltip title="Adicionar obras" arrow>
					<Box
						role="button"
						tabIndex={0}
						onClick={() => navigate('/catalogo')}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') navigate('/catalogo')
						}}
						sx={{
							flexShrink: 0,
							width: 44,
							height: 150,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#fdf8f2',
							border: '1px dashed rgba(255,240,228,0.6)',
							borderRadius: '2px',
							bgcolor: 'rgba(31,17,10,0.45)',
							cursor: 'pointer',
							'&:focus-visible': { outline: '2px solid #fbf8f2', outlineOffset: 2 },
						}}
					>
						<Add />
					</Box>
				</Tooltip>
			</Stack>

			{/* Placa da prateleira */}
			<Box sx={{ height: 12, borderRadius: '2px', bgcolor: '#6b4530', boxShadow: '0 3px 8px rgba(30,16,9,0.46)' }} />

			<Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1.25 }}>
				<Typography sx={{ color: '#fdf8f2', fontSize: 11 }}>Prateleira · {statusLabel}</Typography>
				<Typography sx={{ color: '#fdf8f2', fontSize: 11 }}>
					{items.length} {items.length === 1 ? 'obra' : 'obras'}
				</Typography>
			</Stack>
		</Box>
	)
}
