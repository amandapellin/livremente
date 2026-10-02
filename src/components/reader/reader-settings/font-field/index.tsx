import { Stack, Typography } from '@mui/material'
import SettingsSection from '../settings-section'
import SettingsOptionCard from '../settings-option-card'
import type { ReaderFont } from '@/types/reader-types'
import { FONT_FAMILIES, FONT_OPTIONS } from '@/constants/reader-const'


interface Props {
	value: ReaderFont
	onChange: (value: ReaderFont) => void
}

export default function FontField({ value, onChange }: Props) {
	return (
		<SettingsSection title="Fonte">
			<Stack direction="row" sx={{ gap: 1.5, flexWrap: 'nowrap' }}>
				{FONT_OPTIONS.map((o) => (
					<SettingsOptionCard
						key={o.value}
						selected={value === o.value}
						onClick={() => onChange(o.value)}
						sx={{ flex: '1 1 0', maxWidth: 96 }}
					>
						<Typography sx={{ fontFamily: FONT_FAMILIES[o.value], fontSize: 28, lineHeight: 1 }}>Aa</Typography>
						<Typography variant="caption" sx={{ textAlign: 'center' }}>{o.label}</Typography>
					</SettingsOptionCard>
				))}
			</Stack>
		</SettingsSection>
	)
}
