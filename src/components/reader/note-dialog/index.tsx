import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

interface Props {
	open: boolean
	initialValue: string
	onSave: (note: string) => void
	onClose: () => void
}

export default function NoteDialog({ open, initialValue, onSave, onClose }: Props) {
	const [value, setValue] = useState(initialValue)

	const save = () => {
		onSave(value.trim())
		onClose()
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Anotação</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					fullWidth
					multiline
					minRows={4}
					placeholder="Escreva sua anotação sobre o trecho…"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					sx={{ mt: 1 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button color="inherit" onClick={onClose}>
					Cancelar
				</Button>
				<Button variant="contained" onClick={save}>
					Salvar
				</Button>
			</DialogActions>
		</Dialog>
	)
}
