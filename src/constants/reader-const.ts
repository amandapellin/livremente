import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ViewDayIcon from '@mui/icons-material/ViewDay'
import type {
	ReaderAlign,
	ReaderFont,
	ReaderIconOption,
	ReaderOption,
	ReaderPageType,
	ReaderSurface,
	ReaderTheme,
} from "@/types/reader-types"

export const readerThemeColors: Record<ReaderTheme, ReaderSurface> = {
    light: { background: '#fafafb', text: '#171a22', border: 'rgba(23, 26, 34, 0.12)' },
    sepia: { background: '#f4ecd8', text: '#5b4636', border: 'rgba(91, 70, 54, 0.18)' },
    dark: { background: '#14161c', text: '#e4e6ec', border: 'rgba(228, 230, 236, 0.16)' },
}

export const FONT_FAMILIES: Record<ReaderFont, string> = {
    editor: 'Georgia, "Times New Roman", serif',
    sans: '"Lexend", system-ui, -apple-system, sans-serif',
    dyslexic: '"OpenDyslexic", "Comic Sans MS", sans-serif',
}

export const FONT_SIZE = { min: 80, max: 180, step: 10, default: 100 }
export const LINE_SPACING = { min: 1.2, max: 2.4, step: 0.1, default: 1.6 }

export const PAGE_COLORS: ReaderOption<ReaderTheme>[] = [
	{ value: 'light', label: 'Clara' },
	{ value: 'sepia', label: 'Sépia' },
	{ value: 'dark', label: 'Escura' },
]

export const FONT_OPTIONS: ReaderOption<ReaderFont>[] = [
	{ value: 'editor', label: 'Fonte do editor' },
	{ value: 'sans', label: 'Fonte sem serifa' },
	{ value: 'dyslexic', label: 'Fonte para Dislexia' },
]

export const ALIGN_OPTIONS: ReaderIconOption<ReaderAlign>[] = [
	{ value: 'justify', label: 'Justificado', Icon: FormatAlignJustifyIcon },
	{ value: 'left', label: 'À esquerda', Icon: FormatAlignLeftIcon },
	{ value: 'center', label: 'Centralizado', Icon: FormatAlignCenterIcon },
	{ value: 'right', label: 'À direita', Icon: FormatAlignRightIcon },
]

export const PAGE_TYPES: ReaderIconOption<ReaderPageType>[] = [
	{ value: 'double', label: 'Página dupla', Icon: AutoStoriesIcon },
	{ value: 'single', label: 'Página única', Icon: MenuBookIcon },
	{ value: 'scroll', label: 'Rolagem', Icon: ViewDayIcon },
]
