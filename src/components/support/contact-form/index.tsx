import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import { contactSchema, initialContactForm, MESSAGE_MAX, type ContactForm } from '@/schemas/support-schemas'
import { sendContactMessage } from '@/utils/support'

// E-mail alternativo exibido como fallback ao formulário.
const SUPPORT_EMAIL = 'suportelivrementeapp@gmail.com'

/**
 * Formulário de contato do Suporte (#84 — follow-up do front). Faz
 * `POST /api/support/contact` (público) e trata 202/400/429. Inclui o campo
 * honeypot `website` (oculto); humano o deixa vazio, bot tende a preenchê-lo.
 */
export default function SupportContactForm() {
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [sent, setSent] = useState(false)

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { isSubmitting },
	} = useForm<ContactForm>({
		resolver: zodResolver(contactSchema),
		defaultValues: initialContactForm,
	})

	const messageLength = watch('message')?.length ?? 0

	const onSubmit = async (values: ContactForm) => {
		setSubmitError(null)
		setSent(false)
		const result = await sendContactMessage(values)
		if (result.ok) {
			setSent(true)
			reset(initialContactForm)
			return
		}
		setSubmitError(result.message)
	}

	return (
		<Stack
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			sx={{ gap: 3, alignItems: 'stretch', maxWidth: 560 }}
		>
			<Stack sx={{ gap: 1 }}>
				<Typography variant="h6" component="h2">
					Ainda precisa de ajuda?
				</Typography>
				<Typography variant="body1" sx={{ color: 'text.secondary' }}>
					Envie uma mensagem para a equipe de suporte. Também respondemos em {SUPPORT_EMAIL}.
				</Typography>
			</Stack>

			{sent && (
				<Alert severity="success" role="status" onClose={() => setSent(false)}>
					Mensagem enviada! Responderemos no e-mail informado.
				</Alert>
			)}
			{submitError && (
				<Alert severity="error" onClose={() => setSubmitError(null)}>
					{submitError}
				</Alert>
			)}

			<Controller
				name="name"
				control={control}
				render={({ field, fieldState }) => (
					<TextField
						{...field}
						label="Nome"
						required
						fullWidth
						autoComplete="name"
						error={Boolean(fieldState.error)}
						helperText={fieldState.error?.message}
					/>
				)}
			/>
			<Controller
				name="email"
				control={control}
				render={({ field, fieldState }) => (
					<TextField
						{...field}
						label="E-mail"
						type="email"
						required
						fullWidth
						autoComplete="email"
						error={Boolean(fieldState.error)}
						helperText={fieldState.error?.message}
					/>
				)}
			/>
			<Controller
				name="subject"
				control={control}
				render={({ field, fieldState }) => (
					<TextField
						{...field}
						label="Assunto"
						required
						fullWidth
						error={Boolean(fieldState.error)}
						helperText={fieldState.error?.message}
					/>
				)}
			/>
			<Controller
				name="message"
				control={control}
				render={({ field, fieldState }) => (
					<TextField
						{...field}
						label="Mensagem"
						required
						fullWidth
						multiline
						minRows={4}
						error={Boolean(fieldState.error)}
						helperText={fieldState.error?.message ?? `${messageLength}/${MESSAGE_MAX}`}
						slotProps={{ htmlInput: { maxLength: MESSAGE_MAX } }}
					/>
				)}
			/>

			{/* Honeypot: oculto para humanos (fora da tela e sem foco por tab). */}
			<Controller
				name="website"
				control={control}
				render={({ field }) => (
					<Box
						component="input"
						{...field}
						type="text"
						tabIndex={-1}
						autoComplete="off"
						aria-hidden="true"
						sx={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
					/>
				)}
			/>

			<Button
				type="submit"
				variant="contained"
				size="large"
				startIcon={<MailOutlineIcon />}
				disabled={isSubmitting}
				sx={{ alignSelf: 'flex-start' }}
			>
				{isSubmitting ? 'Enviando…' : 'Enviar mensagem'}
			</Button>
		</Stack>
	)
}
