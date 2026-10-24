import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { AutoStoriesOutlined, InsightsOutlined, ScheduleOutlined } from '@mui/icons-material'
import { Box, Button, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { fetchReadingStats, type ReadingStats } from '@/utils/reading-stats'
import { fetchShelf, type ShelfItem } from '@/utils/shelf'
import { fetchReadingCalendar, type ReadingCalendar } from '@/utils/reading-calendar'
import { formatReadingTime } from '@/utils/format-reading-time'
import { formatPersonName } from '@/utils/format-name'
import { colors } from '@/theme/tokens'

const fmt = (minutes: number): string => formatReadingTime(minutes) ?? '0min'
const pad = (n: number) => String(n).padStart(2, '0')
const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Faixas de intensidade do mini-heatmap (iguais ao calendário da estante).
const LEVEL_COLORS = [colors.papel[200], colors.gold[100], colors.gold[200], colors.gold[300], colors.gold[500]]
const levelOf = (m: number): number => (m <= 0 ? 0 : m < 10 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4)

const STRIP_DAYS = 10

/**
 * Cards de estatística da tela de recomendações (RF27, #37): tempo de leitura,
 * frequência/sequência (com mini-heatmap dos últimos dias) e "lendo agora".
 * Consome `/api/reading/stats` + reaproveita a estante (read/reading) e o
 * calendário de leitura (#35).
 */
export default function ReadingStatsCards() {
	const [stats, setStats] = useState<ReadingStats | null>(null)
	const [reading, setReading] = useState<ShelfItem[]>([])
	const [calendar, setCalendar] = useState<ReadingCalendar | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false
		const to = new Date()
		const from = new Date()
		from.setDate(to.getDate() - (STRIP_DAYS - 1))
		// fetchShelf lança em erro (os demais retornam null) — degrada para []
		// para um 502 na estante não travar os cards.
		Promise.all([
			fetchReadingStats(),
			fetchShelf('reading').catch(() => [] as ShelfItem[]),
			fetchReadingCalendar(dateKey(from), dateKey(to)),
		]).then(([s, r, c]) => {
			if (!cancelled) {
				setStats(s)
				setReading(r)
				setCalendar(c)
				setLoading(false)
			}
		})
		return () => {
			cancelled = true
		}
	}, [])

	if (loading) {
		return (
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} variant="rounded" height={190} />
				))}
			</Box>
		)
	}

	// Mini-heatmap: últimos STRIP_DAYS dias, minutos ativos por dia do calendário.
	const minutesByDate = new Map((calendar?.days ?? []).map((d) => [d.date, d.activeMinutes]))
	const strip = Array.from({ length: STRIP_DAYS }).map((_, i) => {
		const d = new Date()
		d.setDate(d.getDate() - (STRIP_DAYS - 1 - i))
		return minutesByDate.get(dateKey(d)) ?? 0
	})

	const nowReading = reading.slice(0, 3)

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
			{/* 1. Tempo de leitura */}
			<Paper variant="section" sx={{ p: 2.5 }}>
				<Stack sx={{ gap: 2, height: '100%' }}>
					<Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
						<ScheduleOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />
						<Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
							Tempo de leitura
						</Typography>
					</Stack>
					<Stack direction="row" sx={{ gap: 3, flexWrap: 'wrap' }}>
						{[
							{ label: 'Hoje', value: fmt(stats?.todayMinutes ?? 0) },
							{ label: 'Média diária', value: fmt(stats?.dailyAverageMinutes ?? 0) },
							{ label: 'Total', value: fmt(stats?.totalMinutes ?? 0) },
						].map((it) => (
							<Stack key={it.label} sx={{ gap: 0.25 }}>
								<Typography variant="caption" sx={{ color: 'text.secondary' }}>
									{it.label}
								</Typography>
								<Typography variant="h6" component="p">
									{it.value}
								</Typography>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Paper>

			{/* 2. Frequência de leitura */}
			<Paper variant="section" sx={{ p: 2.5 }}>
				<Stack sx={{ gap: 1.5 }}>
					<Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
						<InsightsOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />
						<Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
							Frequência de leitura
						</Typography>
					</Stack>
					<Box>
						<Typography variant="h4" component="p" sx={{ lineHeight: 1 }}>
							{stats?.currentStreakDays ?? 0}
						</Typography>
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							{(stats?.currentStreakDays ?? 0) === 1 ? 'dia seguido' : 'dias seguidos'}
						</Typography>
					</Box>
					<Typography variant="caption" sx={{ color: 'text.secondary' }}>
						Melhor sequência: {stats?.longestStreakDays ?? 0}{' '}
						{(stats?.longestStreakDays ?? 0) === 1 ? 'dia' : 'dias'} · {stats?.daysThisMonth ?? 0}{' '}
						{(stats?.daysThisMonth ?? 0) === 1 ? 'dia' : 'dias'} de leitura neste mês
					</Typography>
					<Box>
						<Stack direction="row" sx={{ gap: 0.5 }}>
							{strip.map((m, i) => (
								<Box
									key={i}
									title={m > 0 ? `${m} min` : 'sem leitura'}
									sx={{ width: 24, height: 24, borderRadius: '3px', bgcolor: LEVEL_COLORS[levelOf(m)] }}
								/>
							))}
						</Stack>
						<Typography variant="caption" sx={{ color: colors.papel[600], display: 'block', mt: 0.5 }}>
							Últimos {STRIP_DAYS} dias
						</Typography>
					</Box>
				</Stack>
			</Paper>

			{/* 3. Lendo agora */}
			<Paper variant="section" sx={{ p: 2.5 }}>
				<Stack sx={{ gap: 1.5, height: '100%' }}>
					<Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
						<AutoStoriesOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />
						<Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
							Lendo agora
						</Typography>
					</Stack>

					{nowReading.length === 0 ? (
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							Você não está lendo nenhuma obra no momento.
						</Typography>
					) : (
						<Stack sx={{ gap: 1.5 }}>
							{nowReading.map((it) => {
								const percent = it.readPercentage ?? 0
								return (
									<Box
										key={it.publication.id}
										component={NavLink}
										to={`/leitura/${it.publication.id}`}
										sx={{ textDecoration: 'none', color: 'inherit' }}
									>
										<Typography variant="subtitle2" noWrap>
											{it.publication.title}
										</Typography>
										<Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
											{it.publication.authors.map(formatPersonName).join(', ')}
										</Typography>
										<Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 0.5 }}>
											<LinearProgress
												variant="determinate"
												value={Math.min(100, Math.max(0, percent))}
												sx={{
													flex: 1,
													height: 4,
													borderRadius: 999,
													bgcolor: colors.papel[200],
													'& .MuiLinearProgress-bar': { bgcolor: colors.gold[500], borderRadius: 999 },
												}}
											/>
											<Typography variant="caption" sx={{ color: 'text.secondary' }}>
												{percent}%
											</Typography>
										</Stack>
									</Box>
								)
							})}
						</Stack>
					)}

					<Button
						component={NavLink}
						to="/estante"
						variant="outlined"
						color="inherit"
						size="small"
						sx={{ alignSelf: 'flex-start', mt: 'auto' }}
					>
						Ver estante
					</Button>
				</Stack>
			</Paper>
		</Box>
	)
}
