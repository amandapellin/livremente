import { useMemo, useState } from "react";
import { GridView, Search, SearchOff, ViewList } from "@mui/icons-material";
import { Alert, Box, Button, Container, InputAdornment, MenuItem, Pagination, Paper, Select, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CatalogFilters from "@/components/catalog/catalog-filters";
import PublicationCard from "@/components/catalog/publication-card";
import PublicationGridCard from "@/components/catalog/publication-grid-card";
import { useCatalogSearch } from "@/hooks/useCatalogSearch";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { emptyCatalogQuery, sortOptions, type CatalogQuery, type CatalogSort } from "@/schemas/catalog-schemas";

type ViewMode = 'list' | 'grid'
const VIEW_STORAGE_KEY = 'livremente.catalog.view'
const GRID_SX = { display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' } as const

function readStoredView(): ViewMode {
	try {
		return localStorage.getItem(VIEW_STORAGE_KEY) === 'grid' ? 'grid' : 'list'
	} catch {
		return 'list'
	}
}

export default function CatalogoPage() {
	const [filters, setFilters] = useState<CatalogQuery>(emptyCatalogQuery)
	const [view, setView] = useState<ViewMode>(readStoredView)
	const debouncedQ = useDebouncedValue(filters.q, 350)
	const query = useMemo<CatalogQuery>(() => ({ ...filters, q: debouncedQ }), [filters, debouncedQ])
	const { data, isLoading, isError, isPlaceholderData } = useCatalogSearch(query)

	const patch = (p: Partial<CatalogQuery>) =>
		setFilters((f) => ({ ...f, ...p, page: 'page' in p ? (p.page as number) : 1 }))
	const clearFilters = () => setFilters(emptyCatalogQuery)

	const changeView = (_: React.MouseEvent, next: ViewMode | null) => {
		if (!next) return
		setView(next)
		try { localStorage.setItem(VIEW_STORAGE_KEY, next) } catch { /* storage indisponível */ }
	}

	const items = data?.items ?? []
	const totalPages = data?.totalPages ?? 1

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
			<Stack sx={{ gap: 1, mb: 3 }}>
				<Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>Descoberta e Busca</Typography>
				<Typography sx={{ color: 'text.secondary', fontSize: 18, lineHeight: '28px' }}>Explore vastos conhecimentos, desde clássicos literários até artigos científicos contemporâneos.</Typography>
			</Stack>

			<Stack component="form" onSubmit={(e) => e.preventDefault()} sx={{ gap: 0.5, mb: 3 }}>
				<Stack direction="row" sx={{ gap: 2 }}>
					<TextField
						fullWidth
						label="Buscar por título ou autor"
						variant="outlined"
						value={filters.q}
						onChange={(e) => patch({ q: e.target.value })}
						slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
					/>
					<Button type="submit" variant="contained">Buscar</Button>
				</Stack>
				<Typography variant="caption" sx={{ color: 'text.secondary' }}>Catálogo unificado: Project Gutenberg (livros) e arXiv (artigos científicos).</Typography>
			</Stack>

			<Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '305px 1fr' }, alignItems: 'start' }}>
				<CatalogFilters query={filters} counts={data?.counts} onChange={patch} onClear={clearFilters} />
				<Stack sx={{ gap: 2 }}>
					<Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
						<ToggleButtonGroup size="small" exclusive value={view} onChange={changeView} aria-label="Modo de visualização">
							<ToggleButton value="list" aria-label="Lista"><ViewList fontSize="small" /></ToggleButton>
							<ToggleButton value="grid" aria-label="Grade"><GridView fontSize="small" /></ToggleButton>
						</ToggleButtonGroup>
						<Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
							<Typography variant="caption" sx={{ color: 'text.secondary' }}>Ordenar</Typography>
							<Select size="small" value={filters.sort} onChange={(e) => patch({ sort: e.target.value as CatalogSort })} sx={{ minWidth: 160 }}>
								{sortOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
							</Select>
						</Stack>
					</Stack>

					{isError ? (
						<Alert severity="error">Não foi possível carregar o catálogo. Tente novamente.</Alert>
					) : isLoading ? (
						view === 'grid' ? (
							<Box sx={GRID_SX}>
								{Array.from({ length: 8 }).map((_, i) => (
									<Stack key={i} sx={{ gap: 0.75 }}>
										<Skeleton variant="rounded" sx={{ width: '100%', aspectRatio: '2 / 3' }} />
										<Skeleton width="60%" /><Skeleton width="80%" />
									</Stack>
								))}
							</Box>
						) : (
							<Stack sx={{ gap: 2 }}>
								{Array.from({ length: 4 }).map((_, i) => (
									<Paper key={i} variant="section" sx={{ p: 2, display: 'flex', gap: 2 }}>
										<Skeleton variant="rounded" width={86} height={129} />
										<Stack sx={{ flex: 1, gap: 1 }}>
											<Skeleton width={120} height={22} /><Skeleton width="50%" /><Skeleton width="80%" /><Skeleton width="90%" />
										</Stack>
									</Paper>
								))}
							</Stack>
						)
					) : items.length === 0 ? (
						<Stack sx={{ alignItems: 'center', textAlign: 'center', py: 8, gap: 1.5, color: 'text.secondary' }}>
							<SearchOff sx={{ fontSize: 48 }} />
							<Typography variant="h6" component="p">Nenhum resultado encontrado</Typography>
							<Typography variant="body2">Tente ajustar a busca ou remover alguns filtros.</Typography>
						</Stack>
					) : (
						<>
							{view === 'grid' ? (
								<Box sx={{ ...GRID_SX, opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity .15s' }}>
									{items.map((it) => <PublicationGridCard key={it.id} publication={it} />)}
								</Box>
							) : (
								<Stack sx={{ gap: 2, opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity .15s' }}>
									{items.map((it) => <PublicationCard key={it.id} publication={it} />)}
								</Stack>
							)}
							{totalPages > 1 && (
								<Stack sx={{ alignItems: 'center', mt: 2 }}>
									<Pagination count={totalPages} page={filters.page} onChange={(_, p) => patch({ page: p })} color="primary" />
								</Stack>
							)}
						</>
					)}
				</Stack>
			</Box>
		</Container>
	)
}
