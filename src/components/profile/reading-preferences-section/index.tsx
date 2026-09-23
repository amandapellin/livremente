import { FormProvider } from 'react-hook-form'
import { Alert, Box, Button, CircularProgress, Paper, Snackbar, Stack, Typography } from '@mui/material'
import PreferencesFields from '@/components/preferences/preferences-fields'
import { useProfilePreferences } from '@/hooks/useProfilePreferences'

/**
 * Bloco "Preferências de leitura" do perfil (RF04) — funcional. Carrega as
 * preferências atuais, permite editá-las (mesmo componente do cadastro) e
 * salvá-las com o próprio botão.
 */
export default function ReadingPreferencesSection() {
	const {
		methods,
		onSubmit,
		isDirty,
		isLoading,
		isLoadError,
		isSaving,
		success,
		submitError,
		dismissSuccess,
	} = useProfilePreferences()

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 3 }}>
				<Stack sx={{ gap: 1 }}>
					<Typography variant="h6" component="h2">
						Preferências de leitura
					</Typography>
					<Typography variant="caption" sx={{ color: 'text.secondary' }}>
						Alimentam suas recomendações. Selecione quantas quiser.
					</Typography>
				</Stack>

				{isLoading ? (
					<Stack sx={{ alignItems: 'center', py: 4 }}>
						<CircularProgress />
					</Stack>
				) : isLoadError ? (
					<Alert severity="error">Não foi possível carregar suas preferências.</Alert>
				) : (
					<FormProvider {...methods}>
						<Stack component="form" onSubmit={onSubmit} noValidate sx={{ gap: 3 }}>
							<PreferencesFields />
							{submitError && <Alert severity="error">{submitError}</Alert>}
							<Box>
								<Button type="submit" variant="contained" disabled={isSaving || !isDirty}>
									{isSaving ? 'Salvando…' : 'Salvar preferências'}
								</Button>
							</Box>
						</Stack>
					</FormProvider>
				)}
			</Stack>

			<Snackbar
				open={success}
				autoHideDuration={6000}
				onClose={dismissSuccess}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert severity="success" variant="filled" onClose={dismissSuccess} sx={{ width: '100%' }}>
					Preferências atualizadas com sucesso.
				</Alert>
			</Snackbar>
		</Paper>
	)
}
