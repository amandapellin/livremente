import { Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'
import type { ReaderTheme } from '@/types/reader-types'
import { useReaderPreferences } from '@/hooks/useReaderPreferences'

const READING_MODES: { value: ReaderTheme; label: string }[] = [
	{ value: 'light', label: 'Claro' },
	{ value: 'sepia', label: 'Sépia' },
	{ value: 'dark', label: 'Escuro' },
]

export default function ReaderSection() {
	const { theme, resumeAuto, saveDictionary, setTheme, setResumeAuto, setSaveDictionary } = useReaderPreferences()

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 3 }}>
				<Typography variant="h6" component="h2">
					Leitor e interface
				</Typography>

				<Stack sx={{ gap: 1 }}>
					<Typography variant="overline" sx={{ color: 'text.secondary' }}>
						Modo de leitura padrão
					</Typography>
					<Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
						{READING_MODES.map((mode) => {
							const selected = theme === mode.value
							return (
								<Button
									key={mode.value}
									size="small"
									variant="outlined"
									color="inherit"
									aria-pressed={selected}
									onClick={() => setTheme(mode.value)}
									sx={
										selected
											? {
													bgcolor: colors.gold[100],
													borderColor: colors.gold[700],
													color: colors.gold[800],
													'&:hover': { bgcolor: colors.gold[100], borderColor: colors.gold[700] },
												}
											: undefined
									}
								>
									{mode.label}
								</Button>
							)
						})}
					</Stack>
				</Stack>

				<Stack sx={{ gap: 1 }}>
					<ToggleRow
						checked={resumeAuto}
						onChange={setResumeAuto}
						title="Retomar automaticamente na última página"
						subtitle="Ao abrir uma obra, o leitor volta para onde você parou."
					/>
					<ToggleRow
						checked={saveDictionary}
						onChange={setSaveDictionary}
						title="Salvar palavras consultadas no dicionário"
						subtitle="Mantém o histórico visível em Minha biblioteca."
					/>
				</Stack>
			</Stack>
		</Paper>
	)
}

function ToggleRow({
	checked,
	onChange,
	title,
	subtitle,
}: {
	checked: boolean
	onChange: (value: boolean) => void
	title: string
	subtitle: string
}) {
	return (
		<FormControlLabel
			control={<Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />}
			sx={{ alignItems: 'flex-start', m: 0, gap: 1 }}
			label={
				<Stack sx={{ gap: 0.25, pt: 0.5 }}>
					<Typography variant="body2" sx={{ color: 'text.primary' }}>
						{title}
					</Typography>
					<Typography variant="caption" sx={{ color: 'text.secondary' }}>
						{subtitle}
					</Typography>
				</Stack>
			}
		/>
	)
}
