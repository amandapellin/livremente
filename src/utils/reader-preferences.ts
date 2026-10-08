import type { ReaderTheme } from '@/types/reader-types'

const THEME_KEY = 'reader:theme'
const RESUME_KEY = 'reader:resume-auto'
const DICTIONARY_KEY = 'reader:save-dictionary'
const POSITION_PREFIX = 'reader:position:'
const PERCENT_PREFIX = 'reader:percent:'

export const getStoredTheme = (): ReaderTheme => {
	try {
		const v = localStorage.getItem(THEME_KEY)
		if (v === 'light' || v === 'sepia' || v === 'dark') return v
	} catch {
		/* storage indisponível (aba anônima etc.) */
	}
	return 'light'
}

export const setStoredTheme = (value: ReaderTheme) => {
	try {
		localStorage.setItem(THEME_KEY, value)
	} catch {
		/* ignora falha de storage */
	}
}

const getStoredBool = (key: string, fallback: boolean): boolean => {
	try {
		const v = localStorage.getItem(key)
		if (v === 'true') return true
		if (v === 'false') return false
	} catch {
		/* ignora */
	}
	return fallback
}

const setStoredBool = (key: string, value: boolean) => {
	try {
		localStorage.setItem(key, String(value))
	} catch {
		/* ignora */
	}
}


export const getResumeAuto = () => getStoredBool(RESUME_KEY, true)
export const setResumeAuto = (value: boolean) => setStoredBool(RESUME_KEY, value)
export const getSaveDictionary = () => getStoredBool(DICTIONARY_KEY, true)
export const setSaveDictionary = (value: boolean) => setStoredBool(DICTIONARY_KEY, value)

export const getStoredPosition = (bookId: string): string | undefined => {
	try {
		return localStorage.getItem(POSITION_PREFIX + bookId) ?? undefined
	} catch {
		return undefined
	}
}

export const setStoredPosition = (bookId: string, cfi: string) => {
	try {
		localStorage.setItem(POSITION_PREFIX + bookId, cfi)
	} catch {
		/* storage indisponível — ignora */
	}
}

export const getStoredPercentage = (bookId: string): number | undefined => {
	try {
		const v = localStorage.getItem(PERCENT_PREFIX + bookId)
		if (v == null) return undefined
		const n = Number(v)
		return Number.isFinite(n) ? n : undefined
	} catch {
		return undefined
	}
}

export const setStoredPercentage = (bookId: string, percent: number) => {
	try {
		localStorage.setItem(PERCENT_PREFIX + bookId, String(percent))
	} catch {
		/* storage indisponível — ignora */
	}
}
