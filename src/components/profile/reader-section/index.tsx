import { Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'

const readingModes = ['Claro', 'Sépia', 'Escuro'] as const

const toggles = [
	{
		title: 'Retomar automaticamente na última página',
		subtitle: 'Ao abrir uma obra, o leitor volta para onde você parou.',
	},
	{
		title: 'Salvar palavras consultadas no dicionário',
		subtitle: 'Mantém o histórico visível em Minha biblioteca.',
	},
]

/**
 * Bloco "Leitor e interface" — apenas visual (placeholder). As configurações de
 * leitura serão implementadas em issue futura.
 */
export default function ReaderSection() {
	return (
		<Paper variant="outlined" sx={{ p: 3, borderRadius: '6px' }}>
			<Stack sx={{ gap: 3 }}>
				<Typography variant="h6" component="h2">
					Leitor e interface
				</Typography>

				<Stack sx={{ gap: 1 }}>
					<Typography variant="overline" sx={{ color: 'text.secondary' }}>
						Modo de leitura padrão
					</Typography>
					<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
						{readingModes.map((mode, i) => (
							<Button
								key={mode}
								size="small"
								variant="outlined"
								color="inherit"
								disabled
								sx={
									i === 0
										? {
												bgcolor: colors.gold[100],
												borderColor: colors.gold[700],
												color: colors.gold[800],
												'&.Mui-disabled': {
													bgcolor: colors.gold[100],
													borderColor: colors.gold[700],
													color: colors.gold[800],
												},
											}
										: undefined
								}
							>
								{mode}
							</Button>
						))}
					</Stack>
				</Stack>

				<Stack sx={{ gap: 1 }}>
					{toggles.map((t) => (
						<FormControlLabel
							key={t.title}
							disabled
							control={<Checkbox checked />}
							sx={{ alignItems: 'flex-start', m: 0, gap: 1 }}
							label={
								<Stack sx={{ gap: 0.25, pt: 0.5 }}>
									<Typography variant="body2" sx={{ color: 'text.primary' }}>
										{t.title}
									</Typography>
									<Typography variant="caption" sx={{ color: 'text.secondary' }}>
										{t.subtitle}
									</Typography>
								</Stack>
							}
						/>
					))}
				</Stack>
			</Stack>
		</Paper>
	)
}
