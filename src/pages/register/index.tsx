import { NavLink } from 'react-router'
import { FormProvider } from 'react-hook-form'
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import Stepper from '@/components/stepper'
import DadosStep from '@/components/register/personal-data-step'
import PreferenciasStep from '@/components/register/preferences-step'
import LgpdStep from '@/components/register/lgpd-step'
import { useRegisterForm } from '@/hooks/useRegisterForm'
import { radii } from '@/theme/tokens'

export default function CadastroPage() {
	const {
		activeStep,
		submitError,
		createdEmail,
		methods,
		registerIsPending,
		handleNext,
		handleBack,
		STEPS,
	} = useRegisterForm()

	if (createdEmail) {
		return (
			<Box sx={{ px: 2, py: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'center' }}>
				<Paper elevation={3} sx={{ maxWidth: 560, width: '100%', p: { xs: 3, sm: 5 }, borderRadius: radii.card }}>
					<Stack sx={{ gap: 2, alignItems: 'center', textAlign: 'center' }}>
						<CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'info.main' }} />
						<Typography variant="h4" component="h1">
							Conta criada!
						</Typography>
						<Typography variant="body1" sx={{ color: 'text.secondary' }}>
							Enviamos um link de confirmação para <strong>{createdEmail}</strong>. Sua conta é ativada após a
							confirmação.
						</Typography>
						<Button component={NavLink} to="/login" variant="contained" size="large" sx={{ mt: 1 }}>
							Ir para o login
						</Button>
					</Stack>
				</Paper>
			</Box>
		)
	}

	return (
		<Box sx={{ px: 2, py: { xs: 4, md: 6 }, display: 'flex', justifyContent: 'center' }}>
			<Stack sx={{ width: '100%', maxWidth: 704, gap: 3 }}>
				<Stepper steps={STEPS} activeStep={activeStep} />

				{submitError && <Alert severity="error">{submitError}</Alert>}

				<FormProvider {...methods}>
					<Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: radii.card }}>
						{activeStep === 0 && <DadosStep />}
						{activeStep === 1 && <PreferenciasStep />}
						{activeStep === 2 && <LgpdStep />}
					</Paper>
				</FormProvider>

				<Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 2 }}>
					{activeStep === 0 ? (
						<Button component={NavLink} to="/login" variant="outlined" color="inherit">
							Já tenho conta
						</Button>
					) : (
						<Button variant="outlined" color="inherit" onClick={handleBack}>
							Voltar
						</Button>
					)}
					<Button variant="contained" onClick={handleNext} disabled={registerIsPending}>
						{activeStep === STEPS.length - 1
							? registerIsPending
								? 'Criando…'
								: 'Criar conta'
							: 'Continuar'}
					</Button>
				</Stack>
			</Stack>
		</Box>
	)
}
