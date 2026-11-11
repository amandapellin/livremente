import { Box, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'
import SettingsSection from '../settings-section'
import type { ReaderTheme } from '@/types/reader-types';
import { PAGE_COLORS, readerThemeColors } from '@/constants/reader-const';

interface Props {
	value: ReaderTheme
	onChange: (value: ReaderTheme) => void
}

export default function PageColorField({ value, onChange }: Props) {
	return (
		<SettingsSection title="Cor de página">
			<Stack direction="row" sx={{ gap: 1.5 }}>
				{PAGE_COLORS.map((o) => {
					const c = readerThemeColors[o.value]
					const selected = value === o.value
					return (
						<Stack key={o.value} sx={{ alignItems: 'center', gap: 0.5 }}>
							<Box
								component="button"
								type="button"
								aria-label={o.label}
								aria-pressed={selected}
								title={o.label}
								onClick={() => onChange(o.value)}
								sx={{
									width: 44,
									height: 44,
									borderRadius: '50%',
									cursor: 'pointer',
									bgcolor: c.background,
									border: selected ? `2px solid ${colors.gold[700]}` : `1px solid ${c.border}`,
									outline: selected ? `2px solid ${colors.gold[700]}` : 'none',
									outlineOffset: 2,
									p: 0,
								}}
							/>
							<Typography variant="caption">{o.label}</Typography>
						</Stack>
					)
				})}
			</Stack>
		</SettingsSection>
	)
}
