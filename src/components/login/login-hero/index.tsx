import { Box, Stack, Typography } from '@mui/material'
import { colors, heroBackground } from '@/theme/tokens'

interface Stat {
	value: string
	label: string
}

const stats: readonly Stat[] = [
	{ value: '70 mil+', label: 'obras do Project Gutenberg' },
	{ value: '2,3 mi', label: 'artigos do arXiv' },
]

/**
 * Painel de marca exibido ao lado do formulário de login (apenas em telas
 * médias ou maiores). Reusa a imagem de fundo da landing com o overlay azul do
 * design.
 */
export default function LoginHero() {
	return (
		<Box
			sx={{
				display: { xs: 'none', md: 'flex' },
				flex: 1,
				alignItems: 'center',
				px: { md: 6, lg: 9 },
				backgroundImage: heroBackground,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<Stack sx={{ gap: 3, maxWidth: 550 }}>
				<Typography variant="overline" sx={{ color: colors.primary[50], letterSpacing: '1.5px' }}>
					Biblioteca aberta
				</Typography>
				<Typography
					variant="h1"
					sx={{ color: colors.primary[200], fontSize: { md: '3rem', lg: '3.75rem' } }}
				>
					Acesso aberto para toda{' '}
					<Box component="span" sx={{ color: colors.gold[500] }}>
						mente curiosa
					</Box>
				</Typography>
				<Typography variant="body1" sx={{ color: colors.papel[50] }}>
					Livros do domínio público e artigos científicos reunidos em um catálogo único, com leitor, grifos e
					dicionário integrado.
				</Typography>
				<Stack direction="row" sx={{ gap: 5, pt: 4 }}>
					{stats.map((stat) => (
						<Stack key={stat.label} sx={{ gap: 1, maxWidth: 195 }}>
							<Typography variant="h5" sx={{ color: colors.papel[50] }}>
								{stat.value}
							</Typography>
							<Typography variant="body2" sx={{ color: colors.primary[100] }}>
								{stat.label}
							</Typography>
						</Stack>
					))}
				</Stack>
			</Stack>
		</Box>
	)
}
