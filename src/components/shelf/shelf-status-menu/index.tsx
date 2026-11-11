import { useState } from 'react'
import { ArrowDropDown, BookmarkAddOutlined, BookmarkRemoveOutlined, Check } from '@mui/icons-material'
import { Button, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material'
import type { ReadingStatus } from '@/api/generated/model'
import { readingStatusOptions } from '@/schemas/reading-status-schemas'

interface Props {
	status: ReadingStatus
	onSelect: (status: ReadingStatus) => void
	onRemove?: () => void
	size?: 'small' | 'medium'
	disabled?: boolean
}

/**
 * Dropdown de estado de leitura (RF06) compartilhado pela estante (#27): cards da
 * visão Lista, prateleira e tabela de artigos. Mesmo padrão de `detail-actions`
 * (readingStatusOptions + Menu + opção "Remover da estante").
 */
export default function ShelfStatusMenu({ status, onSelect, onRemove, size = 'small', disabled }: Props) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const close = () => setAnchorEl(null)
	const current = readingStatusOptions.find((o) => o.value === status)

	const select = (next: ReadingStatus) => {
		close()
		if (next !== status) onSelect(next)
	}

	return (
		<>
			<Button
				variant="outlined"
				color="primary"
				size={size}
				disabled={disabled}
				startIcon={<BookmarkAddOutlined />}
				endIcon={<ArrowDropDown />}
				onClick={(e) => setAnchorEl(e.currentTarget)}
				aria-haspopup="true"
				aria-expanded={open || undefined}
			>
				{current?.label ?? 'Estante'}
			</Button>

			<Menu anchorEl={anchorEl} open={open} onClose={close}>
				{readingStatusOptions.map((o) => (
					<MenuItem key={o.value} selected={o.value === status} onClick={() => select(o.value)}>
						<ListItemIcon>{o.value === status ? <Check fontSize="small" /> : null}</ListItemIcon>
						{o.label}
					</MenuItem>
				))}
				{onRemove ? <Divider /> : null}
				{onRemove ? (
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
