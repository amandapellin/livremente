import { useState } from 'react'
import {
	Alert,
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Stack,
	Typography,
} from '@mui/material'
import { useConsent } from '@/hooks/useConsent'
import { LGPD_CONSENT_PARAGRAPHS } from '@/constants/lgpd'
import { colors, radii } from '@/theme/tokens'

interface Props {
	open: boolean
	onClose: () => void
	onSaved: () => void
}

export default function ConsentDialog({ open, onClose, onSaved }: Props) {
	const { consent, isLoading, isError, update } = useConsent()
	const [marketing, setMarketing] = useState<boolean | null>(null)
	const checked = marketing ?? consent?.marketingConsent ?? false

	const handleSave = () => {
		update.mutate(checked, {
			onSuccess: () => {
				setMarketing(null)
				onSaved()
				onClose()
			},
		})
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Rever consentimento</DialogTitle>
			<DialogContent dividers>
				{isLoading ? (
					<Stack sx={{ alignItems: 'center', py: 4 }}>
						<CircularProgress />
					</Stack>
				) : isError ? (
					<Alert severity="error">Não foi possível carregar seu consentimento.</Alert>
				) : (
					<Stack sx={{ gap: 2 }}>
						<Stack sx={{ gap: 1, bgcolor: colors.papel[50], border: 1, borderColor: 'divider', borderRadius: radii.card, p: 2 }}>
							{LGPD_CONSENT_PARAGRAPHS.map((t) => (
								<Typography key={t} variant="body2" sx={{ color: 'text.secondary', lineHeight: '22px' }}>
									{t}
								</Typography>
							))}
						</Stack>
						<FormControlLabel
							control={<Checkbox checked disabled />}
							label="Tratamento dos meus dados pessoais (obrigatório enquanto a conta existe)."
						/>
						<FormControlLabel
							control={<Checkbox checked={checked} onChange={(e) => setMarketing(e.target.checked)} />}
							label="Quero receber avisos sobre novas obras nas minhas áreas de interesse."
						/>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Para retirar o consentimento obrigatório, é necessário excluir a conta.
						</Typography>
						{update.isError && <Alert severity="error">Não foi possível salvar. Tente novamente.</Alert>}
					</Stack>
				)}
			</DialogContent>
			<DialogActions>
				<Button color="inherit" onClick={onClose}>Fechar</Button>
				<Button variant="contained" onClick={handleSave} disabled={isLoading || isError || update.isPending}>
					{update.isPending ? 'Salvando…' : 'Salvar'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
