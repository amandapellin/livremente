import { MenuItem, Stack, TextField, Typography } from '@mui/material'
import type { StepProps } from '@/types/stepper-types'
import { generoOptions } from '@/schemas/category-schemas'

/**
 * Etapa 1 do cadastro — dados cadastrais exigidos pelo RF01: nome, data de
 * nascimento, gênero, e-mail e senha (com confirmação).
 */
export default function DadosStep({ form, errors, onField }: StepProps) {
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
				<TextField
					label="Nome Completo"
					required
					fullWidth
					value={form.name}
					onChange={(e) => onField({ name: e.target.value })}
					error={Boolean(errors.name)}
					helperText={errors.name}
				/>

				<Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3 }}>
					<TextField
						label="Data de Nascimento"
						type="date"
						required
						fullWidth
						value={form.birthDate}
						onChange={(e) => onField({ birthDate: e.target.value })}
						error={Boolean(errors.birthDate)}
						helperText={errors.birthDate}
						slotProps={{ inputLabel: { shrink: true } }}
					/>
					<TextField
						label="Gênero"
						select
						required
						value={form.gender}
						onChange={(e) => onField({ gender: e.target.value })}
						error={Boolean(errors.gender)}
						helperText={errors.gender}
						sx={{ width: { xs: '100%', sm: 220 } }}
					>
						{generoOptions.map((opt) => (
							<MenuItem key={opt.value} value={opt.value}>
								{opt.label}
							</MenuItem>
						))}
					</TextField>
				</Stack>

				<TextField
					label="E-mail"
					type="email"
					required
					fullWidth
					value={form.email}
					onChange={(e) => onField({ email: e.target.value })}
					error={Boolean(errors.email)}
					helperText={errors.email}
				/>

				<Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3 }}>
					<TextField
						label="Senha"
						type="password"
						required
						fullWidth
						value={form.password}
						onChange={(e) => onField({ password: e.target.value })}
						error={Boolean(errors.password)}
						helperText={errors.password ?? 'Mínimo 8 caracteres'}
					/>
					<TextField
						label="Confirmar senha"
						type="password"
						required
						fullWidth
						value={form.confirmPassword}
						onChange={(e) => onField({ confirmPassword: e.target.value })}
						error={Boolean(errors.confirmPassword)}
						helperText={errors.confirmPassword}
					/>
				</Stack>
			</Stack>
		</Stack>
	)
}
