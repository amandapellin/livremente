import { useMemo, useState } from 'react'
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material'
import type { PublicationType, ReadingStatus } from '@/api/generated/model'
import { useShelf, useShelfActions } from '@/hooks/useShelf'
import { readingStatusMap, readingStatusOptions } from '@/schemas/reading-status-schemas'
import ShelfDictionaryHistory from '@/components/shelf/shelf-dictionary-history'
import ShelfUserCard from '@/components/shelf/shelf-user-card'
import ShelfPreferencesCard from '@/components/shelf/shelf-preferences-card'
import ShelfReadingCalendar from '@/components/shelf/shelf-reading-calendar'
import ShelfStatusTabs from '@/components/shelf/shelf-status-tabs'
import SegmentedToggle from '@/components/shelf/segmented-toggle'
import ShelfBookCard from '@/components/shelf/shelf-book-card'
import ShelfBookshelf from '@/components/shelf/shelf-bookshelf'
import ShelfArticlesTable from '@/components/shelf/shelf-articles-table'

type ShelfView = 'prateleira' | 'lista'
const VIEW_KEY = 'shelf:view'
const readView = (): ShelfView => {
	try {
		return localStorage.getItem(VIEW_KEY) === 'lista' ? 'lista' : 'prateleira'
	} catch {
		return 'prateleira'
	}
}

const CARD_GRID = { display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' } as const

export default function EstantePage() {
	const { data, isLoading, isError } = useShelf()
	const { setStatus, remove } = useShelfActions()

	const [type, setType] = useState<PublicationType>('book')
	const [status, setStatus_] = useState<ReadingStatus>('reading')
	const [view, setView] = useState<ShelfView>(readView)

	const all = useMemo(() => data ?? [], [data])
	const byType = useMemo(() => all.filter((it) => it.publication.type === type), [all, type])

	const counts = useMemo(() => {
		const base = Object.fromEntries(readingStatusOptions.map((o) => [o.value, 0])) as Record<ReadingStatus, number>
		for (const it of byType) base[it.status] += 1
		return base
	}, [byType])

	const items = useMemo(() => byType.filter((it) => it.status === status), [byType, status])

	const changeView = (next: ShelfView) => {
		setView(next)
		try {
			localStorage.setItem(VIEW_KEY, next)
		} catch {
			/* ignora storage indisponível */
		}
	}

	const onSelectStatus = (id: string, next: ReadingStatus) => setStatus.mutate({ id, status: next })
	const onRemove = (id: string) => remove.mutate(id)

	const statusLabel = readingStatusMap.get(status)?.label ?? status
	const typeLabel = type === 'book' ? 'livro' : 'artigo'

	const emptyMessage =
		all.length === 0
			? 'Sua estante está vazia'
			: byType.length === 0
				? `Nenhum ${typeLabel} na estante`
				: 'Nenhuma obra neste estado'

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '288px 1fr' }, gap: 3, alignItems: 'start' }}>
				{/* Sidebar */}
				<Stack sx={{ gap: 3 }}>
					<ShelfUserCard />
					<ShelfPreferencesCard />
					<ShelfReadingCalendar />
				</Stack>

				{/* Conteúdo */}
				<Stack sx={{ gap: 3, minWidth: 0 }}>
					<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
						<Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
							Minha estante
						</Typography>
						<SegmentedToggle
							value={type}
							onChange={setType}
							variant="primary"
							size="md"
							ariaLabel="Tipo de publicação"
							options={[
								{ value: 'book', label: 'Livros' },
								{ value: 'scientific_article', label: 'Artigos' },
							]}
						/>
					</Stack>

					<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
						<Box sx={{ minWidth: 0, flex: 1 }}>
							<ShelfStatusTabs value={status} onChange={setStatus_} counts={counts} />
						</Box>
						{type === 'book' ? (
							<Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
								<Typography variant="caption" sx={{ color: 'text.secondary' }}>
									Exibir
								</Typography>
								<SegmentedToggle
									value={view}
									onChange={changeView}
									variant="gold"
									size="sm"
									ariaLabel="Modo de exibição"
									options={[
										{ value: 'prateleira', label: 'Prateleira' },
										{ value: 'lista', label: 'Lista' },
									]}
								/>
							</Stack>
						) : null}
					</Stack>

					{isLoading ? (
						<Box sx={CARD_GRID}>
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} variant="rounded" height={320} />
							))}
						</Box>
					) : isError ? (
						<Alert severity="error">Não foi possível carregar sua estante. Tente novamente.</Alert>
					) : items.length === 0 ? (
						<Stack sx={{ alignItems: 'center', textAlign: 'center', py: 8, gap: 1 }}>
							<Typography variant="h6" component="p">
								{emptyMessage}
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								Adicione obras à estante pela página de detalhes ou toque em "Ler agora".
							</Typography>
						</Stack>
					) : type === 'scientific_article' ? (
						<ShelfArticlesTable items={items} onSelectStatus={onSelectStatus} onRemove={onRemove} />
					) : view === 'prateleira' ? (
						<ShelfBookshelf
							items={items}
							statusLabel={statusLabel}
							onSelectStatus={onSelectStatus}
							onRemove={onRemove}
						/>
					) : (
						<Box sx={CARD_GRID}>
							{items.map((it) => (
								<ShelfBookCard
									key={it.publication.id}
									item={it}
									onSelectStatus={(next) => onSelectStatus(it.publication.id, next)}
									onRemove={() => onRemove(it.publication.id)}
								/>
							))}
						</Box>
					)}

					<ShelfDictionaryHistory />
				</Stack>
			</Box>
		</Box>
	)
}
