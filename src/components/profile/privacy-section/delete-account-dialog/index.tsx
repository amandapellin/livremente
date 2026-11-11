import { useState } from 'react'
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
	TextField,
} from '@mui/material'
import { useDeleteAccount } from '@/hooks/useDeleteAccount'

interface Props {
	open: boolean
	onClose: () => void
	email: string
}

const REMOVED_ITEMS = [
	'Perfil e credenciais de acesso',
	'Preferências de leitura',
	'Estante, progresso, grifos e anotações',
]

export default function DeleteAccountDialog({ open, onClose, email }: Props) {
	const { deleteAccount, isDeleting, error } = useDeleteAccount()
	const [typed, setTyped] = useState('')
	const confirmed = email.length > 0 && typed.trim().toLowerCase() === email.trim().toLowerCase()

	return (
		<Dialog open={open} onClose={isDeleting ? undefined : onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Excluir conta e dados</DialogTitle>
			<DialogContent dividers>
				<Alert severity="warning" sx={{ mb: 2 }}>
					Esta ação é permanente e não pode ser desfeita.
				</Alert>
				<DialogContentText sx={{ mb: 0.5 }}>Serão removidos definitivamente:</DialogContentText>
				<List dense sx={{ listStyleType: 'disc', pl: 3, py: 0, mb: 2 }}>
					{REMOVED_ITEMS.map((t) => (
						<ListItem key={t} sx={{ display: 'list-item', px: 0, py: 0.25 }}>
							<ListItemText primary={t} />
						</ListItem>
					))}
				</List>
				<DialogContentText sx={{ mb: 1 }}>
					Para confirmar, digite seu e-mail (<Box component="span" sx={{ fontWeight: 600 }}>{email}</Box>):
				</DialogContentText>
				<TextField
					fullWidth
					size="small"
					value={typed}
					onChange={(e) => setTyped(e.target.value)}
					placeholder={email}
					autoComplete="off"
					disabled={isDeleting}
					slotProps={{ htmlInput: { 'aria-label': 'Confirme digitando seu e-mail' } }}
				/>
				{error && <Alert severity="error" sx={{ mt: 2 }}>Não foi possível excluir a conta. Tente novamente.</Alert>}
			</DialogContent>
			<DialogActions>
				<Button color="inherit" onClick={onClose} disabled={isDeleting}>Cancelar</Button>
				<Button color="error" variant="contained" onClick={() => deleteAccount()} disabled={!confirmed || isDeleting}>
					{isDeleting ? 'Excluindo…' : 'Excluir conta e dados'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
