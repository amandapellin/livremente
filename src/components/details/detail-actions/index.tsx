import { useState } from "react"
import { NavLink } from "react-router"
import { ArrowDropDown, AutoStories, BookmarkAddOutlined, Check, FileDownloadOutlined } from "@mui/icons-material"
import { Button, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material"
import type { ReadingStatus } from "@/api/generated/model"
import { readingStatusOptions } from "@/schemas/reading-status-schemas"

interface Props {
	id: string
	downloadUrl?: string | null
	readingStatus?: ReadingStatus | null
	onSelectStatus?: (status: ReadingStatus) => void
}

export default function DetailActions({ id, downloadUrl, readingStatus, onSelectStatus }: Props) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const close = () => setAnchorEl(null)
	const current = readingStatusOptions.find((o) => o.value === readingStatus)

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
						variant="contained"
						color="secondary"
						startIcon={<AutoStories />}
						size="small"
					>
						Ler agora
					</Button>
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
						Baixar epub
					</Button>
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
			</Menu>
		</>
	)
}
