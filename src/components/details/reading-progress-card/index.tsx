import { LinearProgress, Paper, Stack, Typography } from "@mui/material"
import type { ReadingProgress } from "@/api/generated/model"
import { colors, fontFamilies } from "@/theme/tokens"

interface Props {
	progress: ReadingProgress
}

function formatMinutes(min?: number | null): string | null {
	if (min == null) return null
	const h = Math.floor(min / 60)
	const m = min % 60
	return h > 0 ? `${h}h ${m}min` : `${m}min`
}

export default function ReadingProgressCard({ progress }: Props) {
	const pageInfo = [
		progress.currentPage != null && progress.totalPages != null
			? `Página ${progress.currentPage} de ${progress.totalPages}`
			: null,
		progress.lastSession ? `última sessão ${progress.lastSession}` : null,
	]
		.filter(Boolean)
		.join(' · ')

	const stats: { label: string; value: string | number }[] = [
		{ label: 'Tempo de leitura', value: formatMinutes(progress.readingTimeMinutes) ?? '' },
		{ label: 'Grifos', value: progress.highlights ?? '' },
		{ label: 'Anotações', value: progress.notes ?? '' },
		{ label: 'Páginas marcadas', value: progress.bookmarks ?? '' },
	].filter((s) => s.value !== '' && s.value != null)

	return (
		<Paper variant="outlined" sx={{ p: 2, borderRadius: 2, width: '100%' }}>
			<Stack sx={{ gap: 2 }}>
				<Stack
					direction="row"
					sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}
				>
					<Typography variant="caption" sx={{ color: 'text.primary' }}>{progress.percent}% lido</Typography>
					{pageInfo && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{pageInfo}</Typography>}
				</Stack>

				<LinearProgress
					variant="determinate"
					value={Math.min(100, Math.max(0, progress.percent))}
					sx={{
						height: 6,
						borderRadius: 999,
						backgroundColor: 'divider',
						'& .MuiLinearProgress-bar': { backgroundColor: colors.gold[600], borderRadius: 999 },
					}}
				/>

				{stats.length > 0 && (
					<Stack direction="row" sx={{ gap: 4, flexWrap: 'wrap', pt: 2, borderTop: 1, borderColor: 'divider' }}>
						{stats.map((s) => (
							<Stack key={s.label} sx={{ gap: 0.25 }}>
								<Typography sx={{ fontSize: 10, lineHeight: '16px', color: 'text.secondary' }}>{s.label}</Typography>
								<Typography sx={{ fontFamily: fontFamilies.heading, fontWeight: 500, fontSize: 20, lineHeight: '28px' }}>
									{s.value}
								</Typography>
							</Stack>
						))}
					</Stack>
				)}
			</Stack>
		</Paper>
	)
}
