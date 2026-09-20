import type { ReactNode } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Stack, Typography } from '@mui/material'
import ChipGroup from '../chip-group'
import type { CadastroForm } from '@/schemas/register-schemas'
import {
	areasArtigos,
	categoriasLivros,
	generosLiterarios,
	idiomaOptions,
	publicationOptions,
} from '@/schemas/category-schemas'

function Section({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Stack sx={{ gap: 2 }}>
			<Typography variant="overline" sx={{ color: 'text.secondary' }}>
				{label}
			</Typography>
			{children}
		</Stack>
	)
}

/**
 * Etapa 2 do cadastro — preferências de leitura. As seções de categorias e
 * gênero literário aparecem conforme a publicação escolhida (livros e/ou
 * artigos), espelhando o comportamento do design.
 */
export default function PreferenciasStep() {
	const { control } = useFormContext<CadastroForm>()
	const publications = useWatch({ control, name: 'publications' })
	const showBooks = publications.includes('book')
	const showArticles = publications.includes('scientific_article')

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

			<Stack sx={{ gap: 3 }}>
				<Section label="Idioma">
					<Controller
						name="languages"
						control={control}
						render={({ field }) => (
							<ChipGroup
								label="Idioma"
								options={idiomaOptions}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</Section>

				<Section label="Publicações">
					<Controller
						name="publications"
						control={control}
						render={({ field }) => (
							<ChipGroup
								label="Publicações"
								options={publicationOptions}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</Section>

				{showBooks && (
					<Section label="Categorias">
						<Controller
							name="bookCategories"
							control={control}
							render={({ field }) => (
								<ChipGroup
									label="Categorias de livros"
									options={categoriasLivros}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					</Section>
				)}

				{showBooks && (
					<Section label="Gênero literário">
						<Controller
							name="literaryGenres"
							control={control}
							render={({ field }) => (
								<ChipGroup
									label="Gênero literário"
									options={generosLiterarios}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					</Section>
				)}

				{showArticles && (
					<Section label={showBooks ? 'Áreas de artigos' : 'Categorias'}>
						<Controller
							name="articleAreas"
							control={control}
							render={({ field }) => (
								<ChipGroup
									label="Áreas de artigos"
									options={areasArtigos}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					</Section>
				)}
			</Stack>
		</Stack>
	)
}
