import { useState } from 'react'
import { Alert, Button, Snackbar, Stack, Typography } from '@mui/material'
import { useConsent } from '@/hooks/useConsent'
import { useDataExport } from '@/hooks/useDataExport'
import ConsentDialog from './consent-dialog'
import DeleteAccountDialog from './delete-account-dialog'

interface Props {
	email: string
}

function formatDate(iso?: string) {
	if (!iso) return '—'
	const d = new Date(iso)
	return Number.isNaN(d.getTime())
		? '—'
		: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Toast = { message: string; severity: 'success' | 'error' }

export default function PrivacySection({ email }: Props) {
	const { consent } = useConsent()
	const { exportData, isExporting } = useDataExport()
	const [consentOpen, setConsentOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [toast, setToast] = useState<Toast | null>(null)

	const handleExport = async () => {
		const ok = await exportData()
		setToast(
			ok
				? { message: 'Seus dados foram exportados.', severity: 'success' }
				: { message: 'Não foi possível exportar seus dados.', severity: 'error' },
		)
	}

	return (
		<Stack sx={{ gap: 1, borderTop: 1, borderColor: 'divider', pt: 2 }}>
			<Typography variant="h6" component="h2">
				Dados e privacidade
			</Typography>
			<Typography variant="caption" sx={{ color: 'text.secondary' }}>
				Consentimento LGPD registrado em {formatDate(consent?.consentedAt)}.
			</Typography>
			<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', pt: 1 }}>
				<Button variant="outlined" color="inherit" size="small" onClick={handleExport} disabled={isExporting}>
					{isExporting ? 'Exportando…' : 'Exportar meus dados'}
				</Button>
				<Button variant="outlined" color="inherit" size="small" onClick={() => setConsentOpen(true)}>
					Rever consentimento
				</Button>
				<Button variant="outlined" color="error" size="small" onClick={() => setDeleteOpen(true)}>
					Excluir conta e dados
				</Button>
			</Stack>

			<ConsentDialog
				open={consentOpen}
				onClose={() => setConsentOpen(false)}
				onSaved={() => setToast({ message: 'Preferências de consentimento atualizadas.', severity: 'success' })}
			/>
			<DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} email={email} />

			<Snackbar
				open={Boolean(toast)}
				autoHideDuration={6000}
				onClose={() => setToast(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert
					severity={toast?.severity ?? 'info'}
					variant="filled"
					onClose={() => setToast(null)}
					sx={{ width: '100%' }}
				>
					{toast?.message}
				</Alert>
			</Snackbar>
		</Stack>
	)
}
