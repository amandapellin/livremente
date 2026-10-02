import { Stack } from '@mui/material'
import SettingsSection from '../settings-section'
import SettingsOptionCard from '../settings-option-card'
import type { ReaderAlign } from '@/types/reader-types'
import { ALIGN_OPTIONS } from '@/constants/reader-const'

interface Props {
	value: ReaderAlign
	onChange: (value: ReaderAlign) => void
}

export default function AlignField({ value, onChange }: Props) {
	return (
		<SettingsSection title="Alinhamento">
			<Stack direction="row" sx={{ gap: 1 }}>
				{ALIGN_OPTIONS.map((o) => (
					<SettingsOptionCard
						key={o.value}
						selected={value === o.value}
						onClick={() => onChange(o.value)}
						aria-label={o.label}
						title={o.label}
						sx={{ flex: '1 1 0', py: 1.25 }}
					>
						<o.Icon />
					</SettingsOptionCard>
				))}
			</Stack>
		</SettingsSection>
	)
}
