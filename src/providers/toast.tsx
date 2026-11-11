import { useState, type ReactNode } from 'react'
import { Alert, type AlertColor, Snackbar } from '@mui/material'
import { ToastContext } from './toast-context'

interface ToastState {
	message: string
	severity: AlertColor
	key: number
}

/**
 * Toast global (confirmação visual de ações, RF06/#28): um único Snackbar no topo
 * da árvore. `useToast()` (em ./toast-context) dispara de qualquer tela — usado, por
 * ex., pelas ações de estante (mudar estado / remover) na estante e nos detalhes.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<ToastState | null>(null)

	const showToast = (message: string, severity: AlertColor = 'success') => {
		setToast({ message, severity, key: Date.now() })
	}

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			<Snackbar
				key={toast?.key}
				open={Boolean(toast)}
				autoHideDuration={3500}
				onClose={() => setToast(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
		</ToastContext.Provider>
	)
}
