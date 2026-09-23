import type { ReactNode } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Stack, Typography } from '@mui/material'
import ChipGroup from '../chip-group'
import {
	areasArtigos,
	categoriasLivros,
	generosLiterarios,
	idiomaOptions,
	publicationOptions,
} from '@/schemas/category-schemas'

/**
 * Campos de preferência que o formulário hospedeiro precisa ter. Tanto o
 * cadastro (`CadastroForm`) quanto o perfil (`PreferencesValue`) satisfazem
 * este formato, permitindo reusar o componente via contexto do RHF.
 */
export interface PreferencesFormShape {
	languages: string[]
	publications: string[]
	bookCategories: string[]
	articleAreas: string[]
	literaryGenres: string[]
}

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
 * Campos de preferências de leitura (RF04), compartilhados entre o cadastro e o
 * perfil. Lê/grava via React Hook Form (`useFormContext`); as seções de
 * categorias e gênero literário aparecem conforme a publicação escolhida.
 * Deve ser usado dentro de um `FormProvider` cujo form tenha os campos de
 * `PreferencesFormShape`.
 */
export default function PreferencesFields() {
	const { control } = useFormContext<PreferencesFormShape>()
	const publications = useWatch({ control, name: 'publications' })
	const showBooks = publications.includes('book')
	const showArticles = publications.includes('scientific_article')

	return (
		<Stack sx={{ gap: 3 }}>
			<Section label="Idioma">
				<Controller
					name="languages"
					control={control}
					render={({ field }) => (
						<ChipGroup label="Idioma" options={idiomaOptions} value={field.value} onChange={field.onChange} />
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
	)
}
