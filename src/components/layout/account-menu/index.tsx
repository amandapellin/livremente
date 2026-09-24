import { useState } from 'react'
import { NavLink } from 'react-router'
import {
	Avatar,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import { useGetApiUsersMe } from '@/api/generated/endpoints'
import { useLogout } from '@/hooks/useLogout'

function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return '?'
	const first = parts[0][0]
	const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
	return (first + last).toUpperCase()
}

/**
 * Botão de conta do header (usuário autenticado) com um popover contendo a
 * identidade (avatar, nome e e-mail) e as ações "Editar perfil" e "Sair" (RF29).
 * O perfil é buscado só quando este componente é montado (ou seja, autenticado).
 */
export default function AccountMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const close = () => setAnchorEl(null)

	const { logout } = useLogout()
	const profileQuery = useGetApiUsersMe()
	const profile = profileQuery.data?.status === 200 ? profileQuery.data.data : undefined
	const name = profile?.name ?? ''

	return (
		<>
			<IconButton
				aria-label="Conta"
				color="brand"
				aria-haspopup="true"
				aria-controls={open ? 'account-menu' : undefined}
				aria-expanded={open || undefined}
				onClick={(e) => setAnchorEl(e.currentTarget)}
			>
				<AccountCircleIcon />
			</IconButton>

			<Menu
				id="account-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={close}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				slotProps={{ paper: { sx: { minWidth: 260, mt: 0.5 } } }}
			>
				<Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
					<Avatar src={profile?.avatarUrl ?? undefined} sx={{ width: 40, height: 40, fontSize: 16 }}>
						{initialsFromName(name)}
					</Avatar>
					<Box sx={{ minWidth: 0 }}>
						<Typography variant="subtitle2" noWrap>
							{name || 'Minha conta'}
						</Typography>
						<Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
							{profile?.email ?? ''}
						</Typography>
					</Box>
				</Box>

				<Divider />

				<MenuItem component={NavLink} to="/perfil" onClick={close} sx={{ color: 'primary.main' }}>
					<ListItemIcon sx={{ color: 'primary.main' }}>
						<EditIcon fontSize="small" />
					</ListItemIcon>
					Editar perfil
				</MenuItem>
				<MenuItem
					onClick={() => {
						close()
						logout()
					}}
					sx={{ color: 'primary.main' }}
				>
					<ListItemIcon sx={{ color: 'primary.main' }}>
						<LogoutIcon fontSize="small" />
					</ListItemIcon>
					Sair
				</MenuItem>
			</Menu>
		</>
	)
}
