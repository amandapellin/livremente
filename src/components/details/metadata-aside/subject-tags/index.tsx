import { Box, Chip } from '@mui/material'
import MetaSection from '@/components/details/metadata-aside/meta-section'
import { colors } from '@/theme/tokens'

export default function SubjectTags({ subjects }: { subjects?: string[] }) {
	if (!subjects?.length) return null
	const visible = subjects.slice(0, 4)
	const extra = subjects.length - visible.length
	const chipSx = { bgcolor: colors.gold[100], borderColor: colors.gold[700], color: colors.gold[900], border: 1 }
	return (
		<MetaSection label="Gêneros e assuntos">
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
				{visible.map((t) => <Chip key={t} size="small" label={t} sx={chipSx} />)}
				{extra > 0 && <Chip size="small" label={`+${extra} assuntos`} sx={{ ...chipSx, borderStyle: 'dashed', bgcolor: 'transparent' }} />}
			</Box>
		</MetaSection>
	)
}