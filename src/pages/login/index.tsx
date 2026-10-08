import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Alert, Box, Snackbar } from '@mui/material'
import LoginHero from '@/components/login/login-hero'
import LoginFormComponent from '@/components/login/login-form'
import { useLoginForm } from '@/hooks/useLoginForm'

type Feedback = { severity: 'success' | 'error'; message: string }

const confirmedFeedback: Record<string, Feedback> = {
	'1': { severity: 'success', message: 'E-mail confirmado! Faça login para continuar.' },
	invalid: { severity: 'error', message: 'Link de confirmação inválido ou expirado.' },
}

export default function LoginPage() {
	const { control, handleSubmit, errors, submitError, loginIsPending, onSubmit } = useLoginForm()
	const [searchParams, setSearchParams] = useSearchParams()
	const [feedback, setFeedback] = useState<Feedback | null>(() => {
		const confirmed = searchParams.get('confirmed')
		return (confirmed && confirmedFeedback[confirmed]) || null
	})

	useEffect(() => {
		if (searchParams.get('confirmed')) {
			searchParams.delete('confirmed')
			setSearchParams(searchParams, { replace: true })
		}
	}, [searchParams, setSearchParams])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				minHeight: { md: 'calc(100vh - 153px)' },
			}}
		>
			<LoginHero />
			<LoginFormComponent
				control={control}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				errors={errors}
				submitError={submitError}
				login={{ isPending: loginIsPending }}
			/>
			<Snackbar
				open={feedback !== null}
				autoHideDuration={6000}
				onClose={() => setFeedback(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				{feedback ? (
					<Alert
						severity={feedback.severity}
						variant="filled"
						onClose={() => setFeedback(null)}
						sx={{ width: '100%' }}
					>
						{feedback.message}
					</Alert>
				) : undefined}
			</Snackbar>
		</Box>
	)
}
