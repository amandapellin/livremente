import { Box, ButtonBase } from '@mui/material'
import { colors } from '@/theme/tokens'

interface Option<T extends string> {
	value: T
	label: string
}

interface Props<T extends string> {
	value: T
	onChange: (value: T) => void
	options: readonly Option<T>[]
	/** `primary` = ativo azul (Livros/Artigos); `gold` = ativo dourado (Prateleira/Lista). */
	variant?: 'primary' | 'gold'
	/** `md` = 38px/14px (tipo); `sm` = 24px/10px (exibição). */
	size?: 'sm' | 'md'
	ariaLabel?: string
}

/**
 * Segmented control da estante (#27) no estilo do Figma: contêiner com borda
 * `papel/200`, fundo `papel/50` e sombra interna; segmento ativo preenchido
 * (azul `primary/800` ou dourado `gold/600`). Usado nos toggles Livros/Artigos
 * (nós 145:5201) e Prateleira/Lista (nó 207:4716).
 */
export default function SegmentedToggle<T extends string>({
	value,
	onChange,
	options,
	variant = 'primary',
	size = 'md',
	ariaLabel,
}: Props<T>) {
	const active =
		variant === 'gold'
			? { bgcolor: colors.gold[600], color: colors.goldContrast }
			: { bgcolor: colors.primary[800], color: colors.white }
	const dims = size === 'sm' ? { minHeight: 24, px: 1, fontSize: 10 } : { minHeight: 38, px: 2, fontSize: 14 }

	return (
		<Box
			role="group"
			aria-label={ariaLabel}
			sx={{
				display: 'inline-flex',
				gap: size === 'sm' ? 0 : 0.5,
				p: 0.5,
				borderRadius: '6px',
				border: `1px solid ${colors.papel[200]}`,
				bgcolor: colors.papel[50],
				boxShadow: 'inset 2px 4px 4px rgba(0,0,0,0.15)',
			}}
		>
			{options.map((o) => {
				const selected = o.value === value
				return (
					<ButtonBase
						key={o.value}
						onClick={() => onChange(o.value)}
						aria-pressed={selected}
						disableRipple
						sx={{
							borderRadius: '4px',
							px: dims.px,
							minHeight: dims.minHeight,
							fontFamily: '"Lexend", sans-serif',
							fontWeight: 700,
							fontSize: dims.fontSize,
							letterSpacing: '0.8px',
							whiteSpace: 'nowrap',
							color: selected ? active.color : colors.papel[700],
							bgcolor: selected ? active.bgcolor : 'transparent',
							transition: 'background-color 120ms, color 120ms',
							'&:hover': { bgcolor: selected ? active.bgcolor : colors.papel[100] },
						}}
					>
						{o.label}
					</ButtonBase>
				)
			})}
		</Box>
	)
}
