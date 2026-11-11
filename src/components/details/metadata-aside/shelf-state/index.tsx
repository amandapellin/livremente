import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReadingStatus } from '@/api/generated/model'
import { readingStatusMap } from '@/schemas/reading-status-schemas'

export default function ShelfState({ status }: { status?: ReadingStatus | null }) {
	if (!status) return null
	const s = readingStatusMap.get(status)
	if (!s) return null
	return (
		<Paper variant="outlined" sx={{ p: 1.75, borderRadius: 1.5 }}>
			<Stack sx={{ gap: 0.5 }}>
				<Typography variant="body2" sx={{ fontWeight: 500 }}>Estado na estante</Typography>
				<Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
					<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
				</Stack>
			</Stack>
		</Paper>
	)
}
