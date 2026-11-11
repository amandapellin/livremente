// Converte "Sobrenome, Nome" -> "Nome Sobrenome" (o acervo guarda a autoria no
// formato invertido). Sem vírgula, devolve como está (ex.: autores corporativos).
export const formatPersonName = (name?: string | null): string => {
	if (!name) return ''
	const value = name.trim()
	const i = value.indexOf(',')
	if (i === -1) return value
	const last = value.slice(0, i).trim()
	const first = value.slice(i + 1).trim()
	return first ? `${first} ${last}` : last
}
