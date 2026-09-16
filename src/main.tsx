import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { RouterProvider } from 'react-router'
import './theme/fonts.ts'
import './index.css'
import { theme } from './theme/theme'
import { queryClient } from './api/queryClient'
import { router } from './routes/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <InitColorSchemeScript attribute="class"/>
      <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme} defaultMode="system">
              <CssBaseline enableColorScheme/>
              <RouterProvider router={router} />
          </ThemeProvider>
      </QueryClientProvider>
  </StrictMode>,
)
