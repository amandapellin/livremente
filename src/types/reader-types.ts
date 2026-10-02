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

/** Opção de seleção (valor + rótulo) de um campo do leitor. */
export interface ReaderOption<T> {
	value: T
	label: string
}

/** Opção de seleção com ícone (alinhamento, tipo de página). */
export interface ReaderIconOption<T> extends ReaderOption<T> {
	Icon: SvgIconComponent
}
