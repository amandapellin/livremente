import { Box, Tab, Tabs } from '@mui/material'
import type { ReadingStatus } from '@/api/generated/model'
import { readingStatusMap } from '@/schemas/reading-status-schemas'
import { colors } from '@/theme/tokens'

interface Props {
	value: ReadingStatus
	onChange: (status: ReadingStatus) => void
	counts: Record<ReadingStatus, number>
}

// Ordem das abas conforme o Figma (Lendo primeiro), independente da ordem do
// schema compartilhado (usado pelo menu de status).
const TAB_ORDER: readonly ReadingStatus[] = ['reading', 'read', 'want_to_read', 'abandoned']

/**
 * Abas por estado de leitura com contagem (#27, RF05): Lendo · Lido · Quero ler ·
 * Abandonei, com o sublinhado dourado no ativo. As contagens vêm do conjunto do
 * tipo atual (Livros/Artigos).
 */
export default function ShelfStatusTabs({ value, onChange, counts }: Props) {
	return (
		<Tabs
			value={value}
			onChange={(_, v: ReadingStatus) => onChange(v)}
			variant="scrollable"
			scrollButtons="auto"
			sx={{
				borderBottom: `1px solid ${colors.papel[300]}`,
				'& .MuiTabs-indicator': { backgroundColor: colors.gold[500], height: 3 },
				'& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
				'& .Mui-selected': { color: 'text.primary' },
			}}
		>
			{TAB_ORDER.map((status) => {
				const o = readingStatusMap.get(status)!
				return (
				<Tab
					key={o.value}
					value={o.value}
					iconPosition="end"
					icon={
						<Box
							component="span"
							sx={{
								ml: 0.75,
								px: 1,
								py: 0.25,
								borderRadius: 999,
								fontSize: 11,
								fontWeight: 700,
								minWidth: 22,
								textAlign: 'center',
								bgcolor: value === o.value ? colors.gold[500] : colors.papel[200],
								color: value === o.value ? colors.goldContrast : 'text.secondary',
							}}
						>
							{counts[o.value] ?? 0}
						</Box>
					}
					label={o.label}
				/>
				)
			})}
		</Tabs>
	)
}
