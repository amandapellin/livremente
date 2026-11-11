import { useState } from "react"
import { NavLink } from "react-router"
import { ArrowDropDown, AutoStories, BookmarkAddOutlined, BookmarkRemoveOutlined, Check, FileDownloadOutlined, OpenInNew } from "@mui/icons-material"
import { Button, Divider, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material"
import type { PublicationType, ReadingStatus } from "@/api/generated/model"
import { readingStatusOptions } from "@/schemas/reading-status-schemas"

interface Props {
	id: string
	type: PublicationType
	source?: string | null
	downloadUrl?: string | null
	readingStatus?: ReadingStatus | null
	onSelectStatus?: (status: ReadingStatus) => void
	onReadNow?: () => void
	onRemove?: () => void
}

export default function DetailActions({ id, type, source, downloadUrl, readingStatus, onSelectStatus, onReadNow, onRemove }: Props) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const close = () => setAnchorEl(null)
	const current = readingStatusOptions.find((o) => o.value === readingStatus)
	// RF25: livro (EPUB/Gutendex) baixa o arquivo pelo epub_file_url do material
	// (= downloadUrl); artigo do arXiv é redirecionado à fonte, sem baixar localmente
	// pelo sistema (RN06) — abre a fonte em nova aba, sem o atributo download.
	const isArticle = type === "scientific_article"
	const sourceLabel = source === "arxiv" ? "arXiv" : (source ?? "fonte")

	const select = (status: ReadingStatus) => {
		close()
		onSelectStatus?.(status)
	}

	return (
		<>
			<Stack
				direction="row"
				sx={{ gap: 2, rowGap: 2, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}
			>
				<Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", alignItems: "center" }}>
					<Button
						component={NavLink}
						to={`/leitura/${id}`}
						onClick={onReadNow}
						variant="contained"
						color="secondary"
						startIcon={<AutoStories />}
						size="small"
					>
						Ler agora
					</Button>
					{isArticle ? (
						<Button
							component="a"
							href={downloadUrl ?? undefined}
							target="_blank"
							rel="noopener noreferrer"
							variant="outlined"
							color="inherit"
							startIcon={<OpenInNew />}
							disabled={!downloadUrl}
							size="small"
						>
							Baixar no {sourceLabel}
						</Button>
					) : (
						<Button
							component="a"
							href={downloadUrl ?? undefined}
							download
							variant="outlined"
							color="inherit"
							startIcon={<FileDownloadOutlined />}
							disabled={!downloadUrl}
							size="small"
						>
							Baixar EPUB
						</Button>
					)}
				</Stack>

				<Button
					variant="outlined"
					color="primary"
					startIcon={<BookmarkAddOutlined />}
					endIcon={<ArrowDropDown />}
					onClick={(e) => setAnchorEl(e.currentTarget)}
					aria-haspopup="true"
					aria-controls={open ? "reading-status-menu" : undefined}
					aria-expanded={open || undefined}
					size="small"
				>
					{current ? `Na estante · ${current.label}` : "Adicionar à estante"}
				</Button>
			</Stack>

			<Menu
				id="reading-status-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={close}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				{readingStatusOptions.map((o) => (
					<MenuItem key={o.value} selected={o.value === readingStatus} onClick={() => select(o.value)}>
						<ListItemIcon>{o.value === readingStatus ? <Check fontSize="small" /> : null}</ListItemIcon>
						{o.label}
					</MenuItem>
				))}
				{readingStatus && onRemove ? <Divider /> : null}
				{readingStatus && onRemove ? (
					<MenuItem
						onClick={() => {
							close()
							onRemove()
						}}
						sx={{ color: 'error.main' }}
					>
						<ListItemIcon>
							<BookmarkRemoveOutlined fontSize="small" color="error" />
						</ListItemIcon>
						Remover da estante
					</MenuItem>
				) : null}
			</Menu>
		</>
	)
}
