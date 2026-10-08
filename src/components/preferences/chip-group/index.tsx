import { Chip, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { Opcao } from '@/schemas/category-schemas'
import { colors } from '@/theme/tokens'

export interface ChipGroupProps {
	options: readonly Opcao[]
	value: readonly string[]
	onChange: (next: string[]) => void
	label: string
}

const SelectionChip = styled(Chip, {
	shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
	'&&': {
		borderRadius: 100,
		fontSize: 12,
		letterSpacing: '0.4px',
		...(selected
			? {
					backgroundColor: colors.acao[50],
					borderColor: (theme.vars ?? theme).palette.acao.light,
					color: (theme.vars ?? theme).palette.acao.main,
					boxShadow:
						'0px 1px 3px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.2)',
					'&:hover': { backgroundColor: colors.acao[50] },
					'&:focus-visible': { backgroundColor: colors.acao[50] },
				}
			: {
					backgroundColor: 'transparent',
					borderColor: colors.papel[300],
					color: (theme.vars ?? theme).palette.text.secondary,
				}),
	},
}))

export default function ChipGroup({ options, value, onChange, label }: ChipGroupProps) {
	const toggle = (v: string) => {
		onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
	}

	return (
		<Stack direction="row" role="group" aria-label={label} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
			{options.map((opt) => {
				const selected = value.includes(opt.value)
				return (
					<SelectionChip
						key={opt.value}
						selected={selected}
						label={opt.label}
						size="small"
						variant="outlined"
						clickable
						aria-pressed={selected}
						onClick={() => toggle(opt.value)}
					/>
				)
			})}
		</Stack>
	)
}
