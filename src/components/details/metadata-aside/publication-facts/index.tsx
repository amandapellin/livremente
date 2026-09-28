import { Divider, Stack, Typography } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import MetaSection from '@/components/details/metadata-aside/meta-section'
import { languageLabel } from '@/schemas/catalog-schemas'

export default function PublicationFacts({ publication }: { publication: PublicationDetails }) {
	const format = [publication.format, publication.pages && `${publication.pages} páginas`].filter(Boolean).join(' · ')
	const facts: [string, string | number | null | undefined][] = [
		['Ano', publication.year],
		['Idioma', languageLabel(publication.language)],
		['Formato', format || null],
		['Fonte', publication.source],
		['Direitos', publication.rights],
	]
	const rows = facts.filter(([, v]) => v != null && v !== '')
	if (!rows.length) return null
	return (
		<MetaSection label="Publicação">
			<Stack divider={<Divider />}>
				{rows.map(([k, v]) => (
					<Stack key={k} direction="row" sx={{ justifyContent: 'space-between', gap: 2, py: 1 }}>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>{k}</Typography>
						<Typography variant="caption" sx={{ textAlign: 'right' }}>{v}</Typography>
					</Stack>
				))}
			</Stack>
		</MetaSection>
	)
}