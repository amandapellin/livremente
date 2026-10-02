import { useState } from 'react'
import { getApiUsersMe, getApiUsersMeGenres, getApiUsersMePreferences } from '@/api/generated/endpoints'

/**
 * Exportação de dados (LGPD, portabilidade). Compõe um JSON com o perfil,
 * preferências e gêneros do usuário — a partir dos endpoints **já existentes** —
 * e baixa o arquivo no navegador. (Pode virar `GET /api/users/me/export` quando
 * o backend consolidar a exportação, incluindo estante/progresso.)
 */
export function useDataExport() {
	const [isExporting, setIsExporting] = useState(false)

	const exportData = async (): Promise<boolean> => {
		setIsExporting(true)
		try {
			const [me, preferences, genres] = await Promise.all([
				getApiUsersMe(),
				getApiUsersMePreferences(),
				getApiUsersMeGenres(),
			])
			const payload = {
				exportedAt: new Date().toISOString(),
				profile: me.data,
				preferences: preferences.data,
				genres: genres.data,
			}
			const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = 'livremente-meus-dados.json'
			document.body.appendChild(link)
			link.click()
			link.remove()
			URL.revokeObjectURL(url)
			return true
		} catch {
			return false
		} finally {
			setIsExporting(false)
		}
	}

	return { exportData, isExporting }
}
