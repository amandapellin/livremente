import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, ClickAwayListener, IconButton, InputBase, Tooltip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

// Busca da barra de navegação: ícone que expande o input inline na própria
// header (padrão "expanding search" do Material). Fechado = só o ícone; ao
// acionar, o campo desliza aberto e recebe foco. Fecha ao clicar fora, no X ou
// com Esc. Busca com Enter ou pelo ícone (já aberto) → catálogo com ?q=.
//
// O ícone é SEMPRE `type="button"` — nunca submete o form por conta própria (um
// clique no ícone fechado só expande, jamais navega). A busca vazia apenas
// recolhe, então nada "pula" para o catálogo sem termo.
export default function HeaderSearch() {
	const [open, setOpen] = useState(false)
	const [term, setTerm] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const navigate = useNavigate()

	const expand = () => {
		setOpen(true)
		// foca o input assim que ele passa a ser focável (após o render do estado).
		requestAnimationFrame(() => inputRef.current?.focus())
	}
	const collapse = () => {
		setOpen(false)
		setTerm('')
	}
	const runSearch = () => {
		const q = term.trim()
		collapse()
		if (q) navigate(`/catalogo?q=${encodeURIComponent(q)}`)
	}
	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		runSearch()
	}

	return (
		<ClickAwayListener onClickAway={() => open && collapse()}>
			<Box
				component="form"
				onSubmit={onSubmit}
				role="search"
				sx={{
					display: { xs: 'none', sm: 'flex' },
					alignItems: 'center',
					borderRadius: 999,
					border: 1,
					borderColor: open ? 'divider' : 'transparent',
					bgcolor: open ? 'action.hover' : 'transparent',
					pl: open ? 0.5 : 0,
					transition: 'background-color .2s, border-color .2s',
				}}
			>
				<Tooltip title="Buscar" disableHoverListener={open}>
					<IconButton
						type="button"
						aria-label="Buscar"
						color="contrast"
						onClick={() => (open ? runSearch() : expand())}
					>
						<SearchIcon />
					</IconButton>
				</Tooltip>

				<Box
					sx={{
						width: open ? { sm: 200, md: 260 } : 0,
						overflow: 'hidden',
						transition: 'width .22s ease',
					}}
				>
					<InputBase
						inputRef={inputRef}
						fullWidth
						placeholder="Buscar por título ou autor…"
						value={term}
						onChange={(e) => setTerm(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Escape') collapse()
						}}
						inputProps={{ 'aria-label': 'Buscar no acervo', tabIndex: open ? 0 : -1 }}
						sx={{ fontSize: 14, color: 'text.primary' }}
					/>
				</Box>

				{open && (
					<Tooltip title="Fechar busca">
						<IconButton type="button" aria-label="Fechar busca" size="small" onClick={collapse} sx={{ mr: 0.5 }}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}
			</Box>
		</ClickAwayListener>
	)
}
