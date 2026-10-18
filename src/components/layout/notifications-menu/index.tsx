import { useState } from 'react'
import {
	Badge,
	Box,
	Button,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Popover,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationsMenu() {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const { notifications, clear } = useNotifications()
	const open = Boolean(anchorEl)

	return (
		<>
			<Tooltip title="Notificações">
				<IconButton
					aria-label="Notificações"
					color="contrast"
					onClick={(e) => setAnchorEl(e.currentTarget)}
					sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
				>
					<Badge badgeContent={notifications.length} color="error">
						<NotificationsNoneIcon />
					</Badge>
				</IconButton>
			</Tooltip>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				slotProps={{ paper: { sx: { width: 340, maxWidth: 'calc(100vw - 24px)' } } }}
			>
				<Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
						Notificações
					</Typography>
					<Button size="small" color="inherit" onClick={clear} disabled={notifications.length === 0}>
						Limpar
					</Button>
				</Stack>
				<Divider />
				{notifications.length === 0 ? (
					<Box sx={{ px: 2, py: 4 }}>
						<Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
							Você não tem notificações.
						</Typography>
					</Box>
				) : (
					<List sx={{ maxHeight: 360, overflowY: 'auto', py: 0 }}>
						{notifications.map((n) => (
							<ListItem key={n.id} divider alignItems="flex-start">
								<ListItemText
									primary={n.title}
									secondary={n.body}
									slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 600 } }, secondary: { variant: 'caption' } }}
								/>
							</ListItem>
						))}
					</List>
				)}
			</Popover>
		</>
	)
}
