import { Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { ReaderButton } from '@/components/reader/buttons'
import BookmarksMenu from '@/components/reader/bookmarks-menu'
import type { Bookmark, ReaderSurface } from '@/types/reader-types'

interface Props {
	surface: ReaderSurface
	onPrev: () => void
	onNext: () => void
	marked: boolean
	onToggleMark: () => void
	bookmarks: Bookmark[]
	onSelectBookmark: (bookmark: Bookmark) => void
	onRemoveBookmark: (id: string) => void
}

const navButtonSx = { px: 2, py: 1 }


export default function ReaderNav({
	surface,
	onPrev,
	onNext,
	marked,
	onToggleMark,
	bookmarks,
	onSelectBookmark,
	onRemoveBookmark,
}: Props) {
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

			<Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
				<ReaderButton
					tone="gold"
					startIcon={marked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
					onClick={onToggleMark}
					aria-pressed={marked}
					sx={navButtonSx}
				>
					{marked ? 'Página marcada' : 'Marcar Página'}
				</ReaderButton>
				<BookmarksMenu
					bookmarks={bookmarks}
					onSelect={onSelectBookmark}
					onRemove={onRemoveBookmark}
					color={surface.text}
				/>
			</Stack>

			<ReaderButton borderColor={surface.border} endIcon={<ChevronRightIcon />} onClick={onNext} sx={navButtonSx}>
				Próxima
			</ReaderButton>
		</Stack>
	)
}
