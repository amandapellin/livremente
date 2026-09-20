import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { initialLoginForm, loginSchema, type LoginForm } from '@/schemas/login-schemas'
import { usePostApiAuthLogin } from '@/api/generated/endpoints'
import { saveAuthTokens } from '@/api/auth-storage'
import { HttpError } from '@/api/fetcher'

const LOGGED_HOME = '/estante'

export function useLoginForm() {
	const navigate = useNavigate()
	const [submitError, setSubmitError] = useState<string | null>(null)
	const login = usePostApiAuthLogin()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: initialLoginForm,
	})

	const onSubmit = (values: LoginForm) => {
		setSubmitError(null)
		login.mutate(
			{ data: { email: values.email.trim(), password: values.password, rememberMe: values.rememberMe } },
			{
				onSuccess: (response) => {
					// customFetch só resolve em respostas ok; o 200 carrega o LoginResponse.
					if (response.status !== 200) return
					saveAuthTokens(response.data.token, response.data.refreshToken, values.rememberMe)
					navigate(LOGGED_HOME)
				},
				onError: (error) => {
					setSubmitError(
						error instanceof HttpError && error.status === 401
							? 'E-mail ou senha inválidos.'
							: 'Não foi possível entrar. Tente novamente.',
					)
				},
			},
		)
	}

	return {
		control,
		handleSubmit,
		errors,
		submitError,
		loginIsPending: login.isPending,
		onSubmit,
	}
}

