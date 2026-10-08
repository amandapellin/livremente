import type { ReaderTheme } from '@/types/reader-types'

// Preferências do leitor persistidas no dispositivo (localStorage). O tema é
// compartilhado entre o leitor de EPUB e a seção "Leitor e interface" do perfil.
const THEME_KEY = 'reader:theme'
const RESUME_KEY = 'reader:resume-auto'
const DICTIONARY_KEY = 'reader:save-dictionary'

/** Tema do leitor salvo (RF26); valida o valor e cai em 'light'. */
export function getStoredTheme(): ReaderTheme {
	try {
		const v = localStorage.getItem(THEME_KEY)
		if (v === 'light' || v === 'sepia' || v === 'dark') return v
	} catch {
		/* storage indisponível (aba anônima etc.) */
	}
	return 'light'
}

export function setStoredTheme(value: ReaderTheme) {
	try {
		localStorage.setItem(THEME_KEY, value)
	} catch {
		/* ignora falha de storage */
	}
}

function getStoredBool(key: string, fallback: boolean): boolean {
	try {
		const v = localStorage.getItem(key)
		if (v === 'true') return true
		if (v === 'false') return false
	} catch {
		/* ignora */
	}
	return fallback
}

function setStoredBool(key: string, value: boolean) {
	try {
		localStorage.setItem(key, String(value))
	} catch {
		/* ignora */
	}
}

// Preferências booleanas (padrão: ligadas). Serão lidas pelos épicos
// correspondentes quando existirem (retomar progresso; histórico do dicionário).
export const getResumeAuto = () => getStoredBool(RESUME_KEY, true)
export const setResumeAuto = (value: boolean) => setStoredBool(RESUME_KEY, value)
export const getSaveDictionary = () => getStoredBool(DICTIONARY_KEY, true)
export const setSaveDictionary = (value: boolean) => setStoredBool(DICTIONARY_KEY, value)
