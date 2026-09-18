import { Controller, useFormContext } from 'react-hook-form'
import { MenuItem, Stack, TextField, Typography } from '@mui/material'
import { generoOptions } from '@/schemas/category-schemas'
import type { CadastroForm } from '@/schemas/register-schemas'

/**
 * Etapa 1 do cadastro — dados cadastrais exigidos pelo RF01: nome, data de
 * nascimento, gênero, e-mail e senha (com confirmação).
 */
export default function DadosStep() {
	const { control } = useFormContext<CadastroForm>()

	return (
		<Stack sx={{ gap: 4, width: '100%' }}>
			<Stack sx={{ gap: 1 }}>
				<Typography variant="h4" component="h1">
					Dados cadastrais
				</Typography>
				<Typography variant="body1" sx={{ color: 'text.secondary' }}>
					Você receberá um link de confirmação por e-mail.
				</Typography>
			</Stack>

			<Stack sx={{ gap: 3 }}>
				<Controller
					name="name"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Nome Completo"
							required
							fullWidth
							error={Boolean(fieldState.error)}
							helperText={fieldState.error?.message}
						/>
					)}
				/>

				<Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3 }}>
					<Controller
						name="birthDate"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Data de Nascimento"
								type="date"
								required
								fullWidth
								error={Boolean(fieldState.error)}
								helperText={fieldState.error?.message}
								slotProps={{ inputLabel: { shrink: true } }}
							/>
						)}
					/>
					<Controller
						name="gender"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Gênero"
								select
								required
								error={Boolean(fieldState.error)}
								helperText={fieldState.error?.message}
								sx={{ width: { xs: '100%', sm: 220 } }}
							>
								{generoOptions.map((opt) => (
									<MenuItem key={opt.value} value={opt.value}>
										{opt.label}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
				</Stack>

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
							error={Boolean(fieldState.error)}
							helperText={fieldState.error?.message}
						/>
					)}
				/>

				<Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3 }}>
					<Controller
						name="password"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Senha"
								type="password"
								required
								fullWidth
								error={Boolean(fieldState.error)}
								helperText={fieldState.error?.message ?? 'Mínimo 8 caracteres'}
							/>
						)}
					/>
					<Controller
						name="confirmPassword"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Confirmar senha"
								type="password"
								required
								fullWidth
								error={Boolean(fieldState.error)}
								helperText={fieldState.error?.message}
							/>
						)}
					/>
				</Stack>
			</Stack>
		</Stack>
	)
}
