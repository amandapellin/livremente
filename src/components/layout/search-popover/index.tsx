import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, IconButton, InputBase, Paper, Popover, Tooltip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function SearchPopover() {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [term, setTerm] = useState('')
	const navigate = useNavigate()
	const open = Boolean(anchorEl)

	const submit = (e: React.FormEvent) => {
		e.preventDefault()
		const q = term.trim()
		setAnchorEl(null)
		setTerm('')
		navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo')
	}

	return (
		<>
			<Tooltip title="Buscar">
				<IconButton
					aria-label="Buscar"
					color="contrast"
					onClick={(e) => setAnchorEl(e.currentTarget)}
					sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
				>
					<SearchIcon />
				</IconButton>
			</Tooltip>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Paper component="form" onSubmit={submit} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, width: 340, maxWidth: 'calc(100vw - 24px)' }}>
					<SearchIcon fontSize="small" sx={{ color: 'text.secondary', ml: 0.5 }} />
					<InputBase
						autoFocus
						fullWidth
						placeholder="Buscar por título ou autor…"
						value={term}
						onChange={(e) => setTerm(e.target.value)}
						inputProps={{ 'aria-label': 'Buscar no acervo' }}
					/>
					<Button type="submit" size="small" variant="contained">
						Buscar
					</Button>
				</Paper>
			</Popover>
		</>
	)
}
