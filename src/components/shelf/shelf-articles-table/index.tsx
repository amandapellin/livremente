import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowDropDown, AutoStories, Check } from '@mui/icons-material'
import {
	Box,
	Button,
	Chip,
	ListItemIcon,
	Menu,
	MenuItem,
	Checkbox,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import type { ReadingStatus } from '@/api/generated/model'
import type { ShelfItem } from '@/utils/shelf'
import { areasArtigos } from '@/schemas/category-schemas'
import { readingStatusOptions } from '@/schemas/reading-status-schemas'
import { formatPersonName } from '@/utils/format-name'

interface Props {
	items: ShelfItem[]
	onSelectStatus: (publicationId: string, status: ReadingStatus) => void
	onRemove: (publicationId: string) => void
}

const ALL = '__all__'
const areaLabels = new Map(areasArtigos.map((o) => [o.value, o.label]))
const categoryLabel = (slug?: string): string => (slug ? (areaLabels.get(slug) ?? slug) : '—')

/**
 * Visão da aba Artigos na estante (#27, RF05): tabela com busca, filtro de categoria,
 * seleção múltipla com ações em massa (Remover / Alterar status — N chamadas aos
 * endpoints de estado, sem endpoint novo), ações por linha (Ler / Status) e paginação.
 */
export default function ShelfArticlesTable({ items, onSelectStatus, onRemove }: Props) {
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState<string>(ALL)
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	// Menu de "Alterar status" (massa) e de status por linha (rowId do item ou 'bulk').
	const [statusMenu, setStatusMenu] = useState<{ anchor: HTMLElement; target: string } | null>(null)

	const categories = useMemo(() => {
		const slugs = new Set<string>()
		for (const it of items) if (it.publication.genres[0]) slugs.add(it.publication.genres[0])
		return [...slugs].sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)))
	}, [items])

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return items.filter((it) => {
			const matchesCategory = category === ALL || it.publication.genres[0] === category
			const matchesSearch =
				q === '' ||
				it.publication.title.toLowerCase().includes(q) ||
				it.publication.authors.some((a) => a.toLowerCase().includes(q))
			return matchesCategory && matchesSearch
		})
	}, [items, search, category])

	const pageItems = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
	const allOnPageSelected = pageItems.length > 0 && pageItems.every((it) => selected.has(it.publication.id))
	const someOnPageSelected = pageItems.some((it) => selected.has(it.publication.id))

	const toggleOne = (id: string) =>
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})

	const togglePage = () =>
		setSelected((prev) => {
			const next = new Set(prev)
			if (allOnPageSelected) pageItems.forEach((it) => next.delete(it.publication.id))
			else pageItems.forEach((it) => next.add(it.publication.id))
			return next
		})

	const applyBulkStatus = (status: ReadingStatus) => {
		selected.forEach((id) => onSelectStatus(id, status))
		setStatusMenu(null)
		setSelected(new Set())
	}

	const applyRowStatus = (id: string, status: ReadingStatus) => {
		onSelectStatus(id, status)
		setStatusMenu(null)
	}

	const removeSelected = () => {
		selected.forEach((id) => onRemove(id))
		setSelected(new Set())
	}

	return (
		<Paper variant="section" sx={{ p: 2 }}>
			{/* Barra de ferramentas: busca · categoria · ações em massa */}
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				sx={{ gap: 1.5, alignItems: { md: 'center' }, mb: 2 }}
			>
				<TextField
					size="small"
					label="Buscar"
					placeholder="Título, autoria…"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value)
						setPage(0)
					}}
					sx={{ flex: 1, minWidth: 220 }}
				/>
				<TextField
					size="small"
					select
					label="Categoria"
					value={category}
					onChange={(e) => {
						setCategory(e.target.value)
						setPage(0)
					}}
					sx={{ minWidth: 200 }}
				>
					<MenuItem value={ALL}>Todas</MenuItem>
					{categories.map((slug) => (
						<MenuItem key={slug} value={slug}>
							{categoryLabel(slug)}
						</MenuItem>
					))}
				</TextField>
				<Box sx={{ flex: { md: 1 } }} />
				<Button color="error" onClick={removeSelected} disabled={selected.size === 0}>
					Remover
				</Button>
				<Button
					variant="contained"
					endIcon={<ArrowDropDown />}
					disabled={selected.size === 0}
					onClick={(e) => setStatusMenu({ anchor: e.currentTarget, target: 'bulk' })}
				>
					Alterar status
				</Button>
			</Stack>

			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									checked={allOnPageSelected}
									indeterminate={someOnPageSelected && !allOnPageSelected}
									onChange={togglePage}
									slotProps={{ input: { 'aria-label': 'Selecionar todos' } }}
								/>
							</TableCell>
							<TableCell>TÍTULO</TableCell>
							<TableCell>AUTORIA</TableCell>
							<TableCell>CATEGORIA</TableCell>
							<TableCell>PUBLICAÇÃO</TableCell>
							<TableCell align="right">AÇÃO</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{pageItems.map((it) => {
							const pub = it.publication
							const checked = selected.has(pub.id)
							return (
								<TableRow key={pub.id} hover selected={checked}>
									<TableCell padding="checkbox">
										<Checkbox checked={checked} onChange={() => toggleOne(pub.id)} />
									</TableCell>
									<TableCell sx={{ maxWidth: 320 }}>
										<Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
											{pub.title}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" noWrap>
											{pub.authors.map(formatPersonName).join(', ') || '—'}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip size="small" variant="outlined" label={categoryLabel(pub.genres[0])} />
									</TableCell>
									<TableCell>{pub.year ?? '—'}</TableCell>
									<TableCell align="right">
										<Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
											<Button
												size="small"
												variant="contained"
												color="secondary"
												startIcon={<AutoStories />}
												onClick={() => navigate(`/leitura/${pub.id}`)}
											>
												Ler
											</Button>
											<Button
												size="small"
												variant="outlined"
												endIcon={<ArrowDropDown />}
												onClick={(e) => setStatusMenu({ anchor: e.currentTarget, target: pub.id })}
											>
												Status
											</Button>
										</Stack>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={filtered.length}
				page={page}
				onPageChange={(_, p) => setPage(p)}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={(e) => {
					setRowsPerPage(parseInt(e.target.value, 10))
					setPage(0)
				}}
				rowsPerPageOptions={[10, 25, 50]}
				labelRowsPerPage="Linhas por página"
				labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
			/>

			<Menu
				anchorEl={statusMenu?.anchor ?? null}
				open={Boolean(statusMenu)}
				onClose={() => setStatusMenu(null)}
			>
				{readingStatusOptions.map((o) => {
					const rowStatus =
						statusMenu && statusMenu.target !== 'bulk'
							? items.find((it) => it.publication.id === statusMenu.target)?.status
							: undefined
					return (
						<MenuItem
							key={o.value}
							selected={o.value === rowStatus}
							onClick={() =>
								statusMenu?.target === 'bulk'
									? applyBulkStatus(o.value)
									: statusMenu && applyRowStatus(statusMenu.target, o.value)
							}
						>
							<ListItemIcon>{o.value === rowStatus ? <Check fontSize="small" /> : null}</ListItemIcon>
							{o.label}
						</MenuItem>
					)
				})}
			</Menu>
		</Paper>
	)
}
