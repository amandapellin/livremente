import { Stack, Typography } from '@mui/material'
import SettingsSection from '../settings-section'
import SettingsOptionCard from '../settings-option-card'
import type { ReaderPageType } from '@/types/reader-types'
import { PAGE_TYPES } from '@/constants/reader-const'

interface Props {
	value: ReaderPageType
	onChange: (value: ReaderPageType) => void
}

export default function PageTypeField({ value, onChange }: Props) {
	return (
		<SettingsSection title="Tipo de página">
			<Stack direction="row" sx={{ gap: 1.5, flexWrap: 'nowrap' }}>
				{PAGE_TYPES.map((o) => (
					<SettingsOptionCard
						key={o.value}
						selected={value === o.value}
						onClick={() => onChange(o.value)}
						sx={{ flex: '1 1 0', minWidth: 96 }}
					>
						<o.Icon />
						<Typography variant="caption" sx={{ textAlign: 'center' }}>{o.label}</Typography>
					</SettingsOptionCard>
				))}
			</Stack>
		</SettingsSection>
	)
}
