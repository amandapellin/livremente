import type { SvgIconComponent } from '@mui/icons-material'

export type ReaderTheme = 'light' | 'sepia' | 'dark'
export type ReaderFont = 'editor' | 'sans' | 'dyslexic'
export type ReaderAlign = 'justify' | 'left' | 'center' | 'right'
export type ReaderPageType = 'single' | 'double' | 'scroll'

export interface ReaderSurface {
	background: string
	text: string
	border: string
}

export interface ReaderOption<T> {
	value: T
	label: string
}

export interface ReaderIconOption<T> extends ReaderOption<T> {
	Icon: SvgIconComponent
}

export interface Bookmark {
	id: string
	label: string
	cfi: string
	createdAt: number
}

export interface Highlight {
	id: string
	cfiRange: string
	text: string
	chapter: string
	createdAt: number
}