import type { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router'
import { render, type RenderOptions } from '@testing-library/react'
import { theme } from '@/theme/theme'

// Envolve o componente nos providers que o app usa: tema do MUI (cores/tipografia,
// theme.applyStyles) e um router em memória (para NavLink/links funcionarem).
function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<MemoryRouter>{children}</MemoryRouter>
		</ThemeProvider>
	)
}

// Use no lugar do render() do Testing Library nos testes de componente.
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
	return render(ui, { wrapper: Providers, ...options })
}

export * from '@testing-library/react'
