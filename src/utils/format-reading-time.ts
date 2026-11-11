// Formata o tempo de leitura ativa (RF20) para os cards da estante (#27).
// Ex.: 252 → "4h 12min"; 362 → "6h 02min"; 48 → "48min"; 0/null → null.
export function formatReadingTime(minutes: number | null | undefined): string | null {
	if (minutes == null || minutes <= 0) return null
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	if (hours === 0) return `${mins}min`
	if (mins === 0) return `${hours}h`
	return `${hours}h ${String(mins).padStart(2, '0')}min`
}
