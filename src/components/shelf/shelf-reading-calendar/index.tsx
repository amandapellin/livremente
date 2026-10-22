import { useEffect, useMemo, useState } from 'react'
import { CalendarMonthOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { fetchReadingCalendar, type ReadingCalendar } from '@/utils/reading-calendar'
import { colors } from '@/theme/tokens'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const
const pad = (n: number) => String(n).padStart(2, '0')
const dateKey = (year: number, month0: number, day: number) => `${year}-${pad(month0 + 1)}-${pad(day)}`

// Intensidade do heatmap: 0 (sem leitura) + 4 faixas por minutos de tela ativa.
const LEVEL_COLORS = [colors.papel[200], colors.gold[100], colors.gold[200], colors.gold[300], colors.gold[500]]
const levelOf = (minutes: number): number =>
	minutes <= 0 ? 0 : minutes < 10 ? 1 : minutes < 30 ? 2 : minutes < 60 ? 3 : 4

/**
 * Calendário de frequência de leitura (RF09, front #30): visão de mês destacando
 * os dias com leitura registrada, com navegação para meses anteriores. Consome
 * `GET /api/reading/calendar` (back #35) para o intervalo do mês exibido.
 */
export default function ShelfReadingCalendar() {
	const now = new Date()
	const [year, setYear] = useState(now.getFullYear())
	const [month, setMonth] = useState(now.getMonth()) // 0–11
	const [data, setData] = useState<ReadingCalendar | null>(null)
	const [loading, setLoading] = useState(true)

	// Busca o mês exibido; o setState ocorre só no retorno assíncrono (evita setState
	// síncrono no corpo do efeito). O loading é ligado nos handlers de navegação.
	useEffect(() => {
		let cancelled = false
		const lastDay = new Date(year, month + 1, 0).getDate()
		fetchReadingCalendar(dateKey(year, month, 1), dateKey(year, month, lastDay)).then((res) => {
			if (!cancelled) {
				setData(res)
				setLoading(false)
			}
		})
		return () => {
			cancelled = true
		}
	}, [year, month])

	// Não navega para além do mês atual (meses futuros estariam sempre vazios).
	const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()
	const goPrev = () => {
		setLoading(true)
		if (month === 0) {
			setYear(year - 1)
			setMonth(11)
		} else setMonth(month - 1)
	}
	const goNext = () => {
		if (isCurrentMonth) return
		setLoading(true)
		if (month === 11) {
			setYear(year + 1)
			setMonth(0)
		} else setMonth(month + 1)
	}

	const minutesByDate = useMemo(() => new Map((data?.days ?? []).map((d) => [d.date, d.activeMinutes])), [data])

	const rawMonthLabel = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
	const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1) // só a 1ª letra
	const leadingBlanks = new Date(year, month, 1).getDay() // 0=domingo
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate())

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ gap: 1.5 }}>
				<Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
					<Stack direction="row" sx={{ alignItems: 'center', gap: 1, minWidth: 0 }}>
						<CalendarMonthOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
						<Typography variant="overline" sx={{ color: 'text.secondary' }} noWrap>
							Calendário de leitura
						</Typography>
					</Stack>
				</Stack>

				<Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
					<IconButton size="small" onClick={goPrev} aria-label="Mês anterior">
						<ChevronLeft fontSize="small" />
					</IconButton>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{monthLabel}
					</Typography>
					<IconButton size="small" onClick={goNext} disabled={isCurrentMonth} aria-label="Próximo mês">
						<ChevronRight fontSize="small" />
					</IconButton>
				</Stack>

				{/* Cabeçalho dos dias da semana (domingo primeiro) */}
				<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
					{WEEKDAYS.map((w, i) => (
						<Typography key={i} variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
							{w}
						</Typography>
					))}
				</Box>

				{loading ? (
					<Stack sx={{ alignItems: 'center', py: 3 }}>
						<CircularProgress size={22} />
					</Stack>
				) : (
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
						{Array.from({ length: leadingBlanks }).map((_, i) => (
							<Box key={`blank-${i}`} />
						))}
						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1
							const key = dateKey(year, month, day)
							const minutes = minutesByDate.get(key) ?? 0
							const isToday = key === todayKey
							return (
								<Tooltip
									key={key}
									arrow
									title={minutes > 0 ? `${day}: ${minutes} min de leitura` : `${day}: sem leitura`}
								>
									<Box
										sx={{
											aspectRatio: '1 / 1',
											borderRadius: '2px',
											bgcolor: LEVEL_COLORS[levelOf(minutes)],
											outline: isToday ? `2px solid ${colors.primary[800]}` : 'none',
											outlineOffset: '-1px',
										}}
									/>
								</Tooltip>
							)
						})}
					</Box>
				)}

				{/* Legenda Menos → Mais */}
				<Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
					<Typography variant="caption" sx={{ color: colors.papel[600] }}>
						Menos
					</Typography>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[colors.gold[100], colors.gold[200], colors.gold[300], colors.gold[500]].map((c) => (
							<Box key={c} sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: c }} />
						))}
					</Stack>
					<Typography variant="caption" sx={{ color: colors.papel[600] }}>
						Mais
					</Typography>
				</Stack>
			</Stack>
		</Paper>
	)
}
