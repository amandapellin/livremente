import type { ReactNode } from 'react'
import { Stack, Typography } from '@mui/material'
import type { StepProps } from '@/types/stepper-types'
import ChipGroup from '../chip-group'
import {
	areasArtigos,
	categoriasLivros,
	generosLiterarios,
	idiomaOptions,
	materialOptions,
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
 * gênero literário aparecem conforme o material escolhido (livros e/ou artigos),
 * espelhando o comportamento do design.
 */
export default function PreferenciasStep({ form, onField }: StepProps) {
	const showBooks = form.materials.includes('books')
	const showArticles = form.materials.includes('scientific_articles')

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
					<ChipGroup
						label="Idioma"
						options={idiomaOptions}
						value={form.languages}
						onChange={(languages) => onField({ languages })}
					/>
				</Section>

				<Section label="Material">
					<ChipGroup
						label="Material"
						options={materialOptions}
						value={form.materials}
						onChange={(materials) => onField({ materials })}
					/>
				</Section>

				{showBooks && (
					<Section label="Categorias">
						<ChipGroup
							label="Categorias de livros"
							options={categoriasLivros}
							value={form.categories}
							onChange={(categories) => onField({ categories })}
						/>
					</Section>
				)}

				{showBooks && (
					<Section label="Gênero literário">
						<ChipGroup
							label="Gênero literário"
							options={generosLiterarios}
							value={form.literaryGenres}
							onChange={(literaryGenres) => onField({ literaryGenres })}
						/>
					</Section>
				)}

				{showArticles && (
					<Section label={showBooks ? 'Áreas de artigos' : 'Categorias'}>
						<ChipGroup
							label="Áreas de artigos"
							options={areasArtigos}
							value={form.categories}
							onChange={(categories) => onField({ categories })}
						/>
					</Section>
				)}
			</Stack>
		</Stack>
	)
}
