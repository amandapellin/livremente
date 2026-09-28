import { Divider, Stack, Typography } from '@mui/material'
import type { Contributor } from '@/api/generated/model'
import MetaSection from '@/components/details/metadata-aside/meta-section'

const roleLabels: Record<string, string> = {
	author: 'Autoria', translator: 'Tradução', editor: 'Edição', illustrator: 'Ilustração',
}

export default function ContributorList({ contributors }: { contributors?: Contributor[] }) {
	if (!contributors?.length) return null
	const authors = contributors.filter((c) => c.role === 'author').length
	return (
		<MetaSection label={`Responsáveis · ${authors} ${authors === 1 ? 'autor' : 'autores'}`}>
			<Stack divider={<Divider />}>
				{contributors.map((c, i) => (
					<Stack key={`${c.name}-${i}`} sx={{ py: 1, gap: 0.25 }}>
						<Typography variant="overline" sx={{ color: 'text.secondary' }}>{roleLabels[c.role] ?? c.role}</Typography>
						<Typography variant="body2">{c.name}</Typography>
						{c.lifespan && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.lifespan}</Typography>}
					</Stack>
				))}
			</Stack>
		</MetaSection>
	)
}