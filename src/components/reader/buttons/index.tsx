import { Button, type ButtonProps } from '@mui/material'
import { colors } from '@/theme/tokens'

export type ReaderButtonTone = 'surface' | 'gold'

interface ReaderButtonProps extends Omit<ButtonProps, 'color' | 'variant'> {
	tone?: ReaderButtonTone
	borderColor?: string
}

const BASE_SX = { px: 1.25, py: 0.5, minWidth: 0, fontSize: 12, lineHeight: '18px', whiteSpace: 'nowrap' }

export function ReaderButton({ tone = 'surface', borderColor, sx, ...props }: ReaderButtonProps) {
	const toneSx =
		tone === 'gold'
			? { bgcolor: colors.gold[100], color: colors.gold[900], border: `1px solid ${colors.gold[700]}` }
			: { borderColor }

	return (
		<Button
			size="small"
			variant={tone === 'gold' ? 'contained' : 'outlined'}
			color="inherit"
			sx={{ ...BASE_SX, ...toneSx, ...sx }}
			{...props}
		/>
	)
}
