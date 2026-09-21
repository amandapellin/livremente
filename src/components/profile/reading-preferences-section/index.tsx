import { Chip, Paper, Stack, Typography } from '@mui/material'
import type { Opcao } from '@/schemas/category-schemas'
import {
	categoriasLivros,
	generosLiterarios,
	idiomaOptions,
	publicationOptions,
} from '@/schemas/category-schemas'
import { colors } from '@/theme/tokens'

// Seleção ilustrativa — este bloco é apenas visual (as preferências serão
// editáveis no RF04). Os slugs abaixo espelham o design.
const preselected = new Set([
	'pt',
	'book',
	'literature',
	'science_technology',
	'art_culture',
	'hobbies',
	'classics',
	'romance',
	'science_fiction_fantasy',
	'crime_thriller_mystery',
	'mythology',
])

function StaticChips({ label, options }: { label: string; options: readonly Opcao[] }) {
	return (
		<Stack sx={{ gap: 1.5 }}>
			<Typography variant="overline" sx={{ color: 'text.secondary' }}>
				{label}
			</Typography>
			<Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
				{options.map((opt) => {
					const selected = preselected.has(opt.value)
					return (
						<Chip
							key={opt.value}
							label={opt.label}
							size="small"
							variant="outlined"
							sx={{
								borderRadius: '100px',
								fontSize: 12,
								letterSpacing: '0.4px',
								...(selected
									? { bgcolor: colors.acao[50], borderColor: colors.acao[200], color: colors.acao[600] }
									: { borderColor: colors.papel[300], color: 'text.secondary' }),
							}}
						/>
					)
				})}
			</Stack>
		</Stack>
	)
}

/**
 * Bloco "Preferências de leitura" — apenas visual (placeholder). A edição das
 * preferências é escopo do RF04.
 */
export default function ReadingPreferencesSection() {
	return (
		<Paper variant="outlined" sx={{ p: 3, borderRadius: '6px' }}>
			<Stack sx={{ gap: 3 }}>
				<Stack sx={{ gap: 1 }}>
					<Typography variant="h6" component="h2">
						Preferências de leitura
					</Typography>
					<Typography variant="caption" sx={{ color: 'text.secondary' }}>
						Alimentam suas recomendações. Selecione quantas quiser.
					</Typography>
				</Stack>
				<StaticChips label="Idioma" options={idiomaOptions} />
				<StaticChips label="Material" options={publicationOptions} />
				<StaticChips label="Categorias" options={categoriasLivros} />
				<StaticChips label="Gênero literário" options={generosLiterarios} />
			</Stack>
		</Paper>
	)
}
