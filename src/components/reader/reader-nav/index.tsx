import { Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { ReaderButton } from '@/components/reader/buttons'
import type { ReaderSurface } from '@/types/reader-types'

interface Props {
	surface: ReaderSurface
	onPrev: () => void
	onNext: () => void
}

const navButtonSx = { px: 2, py: 1 }


export default function ReaderNav({ surface, onPrev, onNext }: Props) {
	return (
		<Stack
			direction="row"
			sx={{
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: 2,
				px: 3,
				py: 1.5,
				flexShrink: 0,
				borderTop: `1px solid ${surface.border}`,
				bgcolor: surface.background,
				color: surface.text,
			}}
		>
			<ReaderButton borderColor={surface.border} startIcon={<ChevronLeftIcon />} onClick={onPrev} sx={navButtonSx}>
				Anterior
			</ReaderButton>

			<ReaderButton tone="gold" startIcon={<BookmarkBorderIcon />} title="Em breve" sx={navButtonSx}>
				Marcar Página
			</ReaderButton>

			<ReaderButton borderColor={surface.border} endIcon={<ChevronRightIcon />} onClick={onNext} sx={navButtonSx}>
				Próxima
			</ReaderButton>
		</Stack>
	)
}
