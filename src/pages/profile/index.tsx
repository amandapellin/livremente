import { NavLink } from 'react-router'
import { Alert, Box, Button, CircularProgress, Link, Paper, Snackbar, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useProfileForm } from '@/hooks/useProfileForm'
import IdentitySection from '@/components/profile/identity-section'
import PasswordSection from '@/components/profile/password-section'
import PrivacySection from '@/components/profile/privacy-section'
import ReaderSection from '@/components/profile/reader-section'
import ReadingPreferencesSection from '@/components/profile/reading-preferences-section'

export default function PerfilPage() {
	const {
		control,
		errors,
		isDirty,
		profile,
		isLoading,
		isLoadError,
		isSaving,
		success,
		submitError,
		dismissSuccess,
		onSubmit,
	} = useProfileForm()

	return (
		<Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
			<Stack sx={{ gap: 2 }}>
				<Link
					component={NavLink}
					to="/estante"
					underline="hover"
					sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'info.main', fontSize: 12 }}
				>
					<ChevronLeftIcon sx={{ fontSize: 16 }} />
					Voltar para Minha Estante
				</Link>

				<Stack sx={{ gap: 1 }}>
					<Typography variant="overline" sx={{ color: 'text.primary' }}>
						Conta
					</Typography>
					<Typography variant="h4" component="h1">
						Editar perfil
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						As alterações valem para todos os dispositivos em que você estiver conectada.
					</Typography>
				</Stack>
			</Stack>

			{isLoading ? (
				<Stack sx={{ alignItems: 'center', py: 8 }}>
					<CircularProgress />
				</Stack>
			) : isLoadError ? (
				<Alert severity="error" sx={{ mt: 3 }}>
					Não foi possível carregar seu perfil. Tente novamente.
				</Alert>
			) : (
				<Box
					sx={{
						mt: 3,
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1.2fr)' },
						gap: 3,
						alignItems: 'start',
					}}
				>
					<Paper variant="outlined" sx={{ p: 3, borderRadius: '6px' }}>
						<Stack component="form" onSubmit={onSubmit} noValidate sx={{ gap: 2 }}>
							<IdentitySection
								control={control}
								errors={errors}
								email={profile?.email ?? ''}
								displayName={profile?.name ?? ''}
							/>
							<PasswordSection />
							{/* Botão de salvar logo abaixo do bloco de senha. */}
							<Stack sx={{ gap: 1.5 }}>
								{submitError && <Alert severity="error">{submitError}</Alert>}
								<Box>
									<Button type="submit" variant="contained" disabled={isSaving || !isDirty}>
										{isSaving ? 'Salvando…' : 'Salvar alterações'}
									</Button>
								</Box>
							</Stack>
							<PrivacySection />
						</Stack>
					</Paper>

					<Stack sx={{ gap: 3 }}>
						<ReaderSection />
						<ReadingPreferencesSection />
					</Stack>
				</Box>
			)}

			<Snackbar
				open={success}
				autoHideDuration={6000}
				onClose={dismissSuccess}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert severity="success" variant="filled" onClose={dismissSuccess} sx={{ width: '100%' }}>
					Perfil atualizado com sucesso.
				</Alert>
			</Snackbar>
		</Box>
	)
}
