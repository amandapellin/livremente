import { createContext, useContext } from 'react'
import type { AlertColor } from '@mui/material'

export type ShowToast = (message: string, severity?: AlertColor) => void

export const ToastContext = createContext<ShowToast | null>(null)

// Dispara o toast global (confirmação de ações, RF06/#28) de qualquer tela.
export function useToast(): ShowToast {
	const ctx = useContext(ToastContext)
	if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
	return ctx
}
