import { Chip, Stack } from '@mui/material'
import type { Opcao } from '@/schemas/category-schemas'
import { colors } from '@/theme/tokens'

export interface ChipGroupProps {
	options: readonly Opcao[]
	value: readonly string[]
	onChange: (next: string[]) => void
	label: string
}

const selectedSx = {
	bgcolor: colors.acao[50],
	borderColor: colors.acao[200],
	color: colors.acao[600],
	boxShadow: '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.2)',
	'&:hover': { bgcolor: colors.acao[50] },
	'&:focus-visible': { bgcolor: colors.acao[50] },
} as const

const unselectedSx = {
	bgcolor: 'transparent',
	borderColor: colors.papel[300],
	color: 'text.secondary',
} as const

/**
 * Grupo de chips de múltipla seleção. Cada chip alterna sua presença na lista
 * `value`; o estado selecionado usa o azul de ação do design system.
 */
export default function ChipGroup({ options, value, onChange, label }: ChipGroupProps) {
	const toggle = (v: string) => {
		onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
	}

	return (
		<Stack
			direction="row"
			role="group"
			aria-label={label}
			sx={{ flexWrap: 'wrap', gap: 1.5 }}
		>
			{options.map((opt) => {
				const selected = value.includes(opt.value)
				return (
					<Chip
						key={opt.value}
						label={opt.label}
						size="small"
						variant="outlined"
						clickable
						aria-pressed={selected}
						onClick={() => toggle(opt.value)}
						sx={{
							borderRadius: '100px',
							fontSize: 12,
							letterSpacing: '0.4px',
							...(selected ? selectedSx : unselectedSx),
						}}
					/>
				)
			})}
		</Stack>
	)
}
