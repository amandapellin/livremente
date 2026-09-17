import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Stack,
	Typography,
} from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import type { StepProps } from '@/types/stepper-types'
import { colors } from '@/theme/tokens'

const consentParagraphs = [
	'Coletamos nome, e-mail e preferências de leitura para autenticar seu acesso, manter sua estante e gerar recomendações. O progresso de leitura, grifos e anotações ficam vinculados à sua conta.',
	'Sua senha é armazenada de forma criptografada. Não compartilhamos dados com terceiros e não usamos seus dados para publicidade.',
	'Você pode solicitar a exportação ou a exclusão dos seus dados a qualquer momento pelo perfil.',
]

/**
 * Etapa 3 do cadastro — texto de consentimento (LGPD), aceite obrigatório do
 * tratamento de dados (RN03) e aceite opcional de avisos, além do aviso de
 * confirmação por e-mail.
 */
export default function LgpdStep({ form, errors, onField }: StepProps) {
	return (
		<Stack sx={{ gap: 4, width: '100%' }}>
			<Stack sx={{ gap: 1 }}>
				<Typography variant="h4" component="h1">
					Consentimento e confirmação
				</Typography>
				<Typography variant="body1" sx={{ color: 'text.secondary' }}>
					Tratamento de dados pessoais conforme a LGPD.
				</Typography>
			</Stack>

			<Box
				sx={{
					bgcolor: colors.papel[50],
					border: 1,
					borderColor: 'divider',
					borderRadius: '12px',
					p: 3,
				}}
			>
				<Stack sx={{ gap: 1 }}>
					{consentParagraphs.map((text) => (
						<Typography key={text} variant="body2" sx={{ color: 'text.secondary', lineHeight: '22px' }}>
							{text}
						</Typography>
					))}
				</Stack>
			</Box>

			<FormControl error={Boolean(errors.lgpdConsent)} component="fieldset" variant="standard">
				<FormControlLabel
					control={
						<Checkbox
							checked={form.lgpdConsent}
							onChange={(e) => onField({ lgpdConsent: e.target.checked })}
						/>
					}
					label="Concordo com o tratamento dos meus dados pessoais conforme descrito acima."
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={form.marketingConsent}
							onChange={(e) => onField({ marketingConsent: e.target.checked })}
						/>
					}
					label="Quero receber avisos sobre novas obras nas minhas áreas de interesse."
				/>
				{errors.lgpdConsent && <FormHelperText>{errors.lgpdConsent}</FormHelperText>}
			</FormControl>

			<Stack
				direction="row"
				sx={{
					alignItems: 'center',
					gap: 1.5,
					bgcolor: colors.primary[50],
					border: 1,
					borderColor: colors.primary[300],
					borderRadius: '12px',
					p: 2,
				}}
			>
				<MailOutlineIcon sx={{ fontSize: 20, color: 'primary.main' }} />
				<Typography variant="caption" sx={{ color: 'text.primary' }}>
					Ao concluir, enviamos um link de confirmação para{' '}
					<Box component="span" sx={{ fontWeight: 500 }}>
						{form.email || 'seu e-mail'}
					</Box>
					. A conta é ativada após a confirmação.
				</Typography>
			</Stack>
		</Stack>
	)
}
