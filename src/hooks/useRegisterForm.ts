import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	cadastroSchema,
	initialCadastroForm,
	stepFields,
	type CadastroForm,
} from '@/schemas/register-schemas'
import { usePostApiAuthRegister } from '@/api/generated/endpoints'
import { HttpError } from '@/api/fetcher'
import { buildPayload } from '@/utils/register-utils'

const STEPS = ['Dados Cadastrais', 'Preferências', 'LGPD'] as const

export function useRegisterForm() {
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

	return {
		activeStep,
		submitError,
		createdEmail,
		methods,
		registerIsPending: register.isPending,
		handleNext,
		handleBack,
		STEPS,
	}
}

