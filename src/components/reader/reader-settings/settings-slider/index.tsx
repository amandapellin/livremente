import { Slider, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'

interface Props {
	value: number
	min: number
	max: number
	step: number
	display: string
	onChange: (value: number) => void
}

export default function SettingsSlider({ value, min, max, step, display, onChange }: Props) {
	return (
		<Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
			<Slider
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={(_, v) => onChange(Array.isArray(v) ? v[0] : v)}
				sx={{ color: colors.gold[700] }}
			/>
			<Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>{display}</Typography>
		</Stack>
	)
}
