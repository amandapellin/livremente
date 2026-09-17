import { useState } from 'react'
import { NavLink } from 'react-router'
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import Stepper from '@/components/stepper'
import DadosStep from '@/components/register/personal-data-step'
import PreferenciasStep from '@/components/register/preferences-step'
import LgpdStep from '@/components/register/lgpd-step'
import {
	dadosSchema,
	fieldErrors,
	initialCadastroForm,
	lgpdSchema,
	type CadastroForm,
} from '@/schemas/register-schemas'
import { usePostApiAuthRegister } from '@/api/generated/endpoints'
import type {
	Gender,
	MaterialType,
	ReadingLanguage,
	RegisterRequest,
} from '@/api/generated/model'
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
			categories: form.categories,
			literaryGenres: form.literaryGenres,
		},
		lgpdConsent: form.lgpdConsent,
		marketingConsent: form.marketingConsent,
	}
}

export default function CadastroPage() {
	const [activeStep, setActiveStep] = useState(0)
	const [form, setForm] = useState<CadastroForm>(initialCadastroForm)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [createdEmail, setCreatedEmail] = useState<string | null>(null)

	const register = usePostApiAuthRegister()

	const onField = (patch: Partial<CadastroForm>) => {
		setForm((f) => ({ ...f, ...patch }))
		// Limpa os erros dos campos alterados e o erro de envio.
		setErrors((prev) => {
			const next = { ...prev }
			for (const key of Object.keys(patch)) delete next[key]
			return next
		})
		setSubmitError(null)
	}

	const validateStep = (step: number): boolean => {
		if (step === 0) {
			const result = dadosSchema.safeParse(form)
			setErrors(result.success ? {} : fieldErrors(result.error))
			return result.success
		}
		if (step === 2) {
			const result = lgpdSchema.safeParse({ lgpdConsent: form.lgpdConsent })
			setErrors(result.success ? {} : fieldErrors(result.error))
			return result.success
		}
		return true
	}

	const submit = () => {
		register.mutate(
			{ data: buildPayload(form) },
			{
				onSuccess: () => setCreatedEmail(form.email.trim()),
				onError: (error) => {
					if (error instanceof HttpError && error.status === 409) {
						const message =
							(error.data as { message?: string } | undefined)?.message ??
							'Este e-mail já está cadastrado.'
						setErrors({ email: message })
						setSubmitError(message)
						setActiveStep(0)
						return
					}
					setSubmitError('Não foi possível criar sua conta. Tente novamente.')
				},
			},
		)
	}

	const handleNext = () => {
		if (!validateStep(activeStep)) return
		if (activeStep === STEPS.length - 1) {
			submit()
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

				<Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: '12px' }}>
					{activeStep === 0 && <DadosStep form={form} errors={errors} onField={onField} />}
					{activeStep === 1 && <PreferenciasStep form={form} errors={errors} onField={onField} />}
					{activeStep === 2 && <LgpdStep form={form} errors={errors} onField={onField} />}
				</Paper>

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
