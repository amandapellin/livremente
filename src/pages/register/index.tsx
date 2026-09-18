import { useState } from 'react'
import { NavLink } from 'react-router'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import Stepper from '@/components/stepper'
import DadosStep from '@/components/register/personal-data-step'
import PreferenciasStep from '@/components/register/preferences-step'
import LgpdStep from '@/components/register/lgpd-step'
import {
	cadastroSchema,
	initialCadastroForm,
	stepFields,
	type CadastroForm,
} from '@/schemas/register-schemas'
import { usePostApiAuthRegister } from '@/api/generated/endpoints'
import type { Gender, MaterialType, ReadingLanguage, RegisterRequest } from '@/api/generated/model'
import { HttpError } from '@/api/fetcher'

const STEPS = ['Dados Cadastrais', 'Preferências', 'LGPD'] as const

function buildPayload(form: CadastroForm): RegisterRequest {
	return {
		name: form.name.trim(),
		email: form.email.trim(),
		password: form.password,
		birthDate: form.birthDate,
		gender: form.gender as Gender,
		preferences: {
			languages: form.languages as ReadingLanguage[],
			materials: form.materials as MaterialType[],
			// A API recebe categorias e áreas num único array de slugs.
			categories: [...form.bookCategories, ...form.articleAreas],
			literaryGenres: form.literaryGenres,
		},
		lgpdConsent: form.lgpdConsent,
		marketingConsent: form.marketingConsent,
	}
}

export default function CadastroPage() {
	const [activeStep, setActiveStep] = useState(0)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [createdEmail, setCreatedEmail] = useState<string | null>(null)

	const register = usePostApiAuthRegister()

	const methods = useForm<CadastroForm>({
		resolver: zodResolver(cadastroSchema),
		defaultValues: initialCadastroForm,
	})

	const submit = (values: CadastroForm) => {
		register.mutate(
			{ data: buildPayload(values) },
			{
				onSuccess: (response) => {
					if (response.status !== 201) return
					setCreatedEmail(values.email.trim())
				},
				onError: (error) => {
					if (error instanceof HttpError && error.status === 409) {
						const message =
							(error.data as { message?: string } | undefined)?.message ??
							'Este e-mail já está cadastrado.'
						methods.setError('email', { message })
						setSubmitError(message)
						setActiveStep(0)
						return
					}
					setSubmitError('Não foi possível criar sua conta. Tente novamente.')
				},
			},
		)
	}

	const handleNext = async () => {
		setSubmitError(null)
		const valid = await methods.trigger([...stepFields[activeStep]])
		if (!valid) return
		if (activeStep === STEPS.length - 1) {
			submit(methods.getValues())
			return
		}
		setActiveStep((s) => s + 1)
	}

	const handleBack = () => {
		setSubmitError(null)
		setActiveStep((s) => Math.max(0, s - 1))
	}

	if (createdEmail) {
		return (
			<Box sx={{ px: 2, py: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'center' }}>
				<Paper elevation={3} sx={{ maxWidth: 560, width: '100%', p: { xs: 3, sm: 5 }, borderRadius: '12px' }}>
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
					<Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: '12px' }}>
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
					<Button variant="contained" onClick={handleNext} disabled={register.isPending}>
						{activeStep === STEPS.length - 1
							? register.isPending
								? 'Criando…'
								: 'Criar conta'
							: 'Continuar'}
					</Button>
				</Stack>
			</Stack>
		</Box>
	)
}
