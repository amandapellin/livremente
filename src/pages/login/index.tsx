import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	Link,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import LoginHero from '@/components/login/login-hero'
import { initialLoginForm, loginSchema, type LoginForm } from '@/schemas/login-schemas'
import { usePostApiAuthLogin } from '@/api/generated/endpoints'
import { saveAuthToken } from '@/api/auth-storage'
import { HttpError } from '@/api/fetcher'
import { colors } from '@/theme/tokens'

/** Área logada para onde o usuário é levado após autenticar. */
const LOGGED_HOME = '/estante'

export default function LoginPage() {
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
					saveAuthToken(response.data.token, values.rememberMe)
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

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				// Preenche a altura útil entre o header (72) e o footer (81) no desktop.
				minHeight: { md: 'calc(100vh - 153px)' },
			}}
		>
			<LoginHero />

			<Box
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: { xs: 3, sm: 6 },
					py: { xs: 6, md: 4 },
				}}
			>
				<Stack
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					sx={{ width: '100%', maxWidth: 400, gap: 4 }}
				>
					<Stack sx={{ gap: 1 }}>
						<Typography variant="h3" component="h1">
							Entrar na conta
						</Typography>
						<Typography variant="body1" sx={{ color: 'text.secondary' }}>
							Acesse para retomar suas leituras.
						</Typography>
					</Stack>

					{submitError && <Alert severity="error">{submitError}</Alert>}

					<Stack sx={{ gap: 3 }}>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="E-mail"
									type="email"
									required
									fullWidth
									autoComplete="email"
									error={Boolean(errors.email)}
									helperText={errors.email?.message}
								/>
							)}
						/>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Senha"
									type="password"
									required
									fullWidth
									autoComplete="current-password"
									error={Boolean(errors.password)}
									helperText={errors.password?.message}
								/>
							)}
						/>
						<Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
							<Controller
								name="rememberMe"
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={
											<Checkbox
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
										}
										label="Manter conectado"
									/>
								)}
							/>
							{/* TODO: fluxo de recuperação de senha (fora do escopo do RF02). */}
							<Link
								component="button"
								type="button"
								underline="always"
								sx={{ color: colors.acao[700], fontSize: 14, whiteSpace: 'nowrap' }}
							>
								Esqueci a senha
							</Link>
						</Stack>
					</Stack>

					<Stack sx={{ gap: 4 }}>
						<Button type="submit" variant="contained" size="large" fullWidth disabled={login.isPending}>
							{login.isPending ? 'Entrando…' : 'Entrar'}
						</Button>
						<Divider>ou</Divider>
						<Button
							component={NavLink}
							to="/cadastro"
							variant="outlined"
							color="inherit"
							size="large"
							fullWidth
						>
							Criar uma conta
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Box>
	)
}
