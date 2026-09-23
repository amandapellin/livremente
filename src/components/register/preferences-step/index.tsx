import { Stack, Typography } from '@mui/material'
import PreferencesFields from '@/components/preferences/preferences-fields'

/**
 * Etapa 2 do cadastro — preferências de leitura (RF04). O conteúdo é o
 * componente compartilhado `PreferencesFields`, também usado na tela de perfil;
 * roda dentro do `FormProvider` do cadastro.
 */
export default function PreferenciasStep() {
	return (
		<Stack sx={{ gap: 4, width: '100%' }}>
			<Stack sx={{ gap: 1 }}>
				<Typography variant="h4" component="h1">
					Preferências de leitura
				</Typography>
				<Typography variant="body1" sx={{ color: 'text.secondary' }}>
					Usamos essas escolhas para montar suas recomendações.
				</Typography>
			</Stack>

			<PreferencesFields />
		</Stack>
	)
}
