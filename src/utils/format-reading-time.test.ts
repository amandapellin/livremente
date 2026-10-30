import { describe, it, expect } from 'vitest'
import { formatReadingTime } from './format-reading-time'

describe('formatReadingTime', () => {
	it('formata horas e minutos (minutos com dois dígitos)', () => {
		expect(formatReadingTime(252)).toBe('4h 12min')
		expect(formatReadingTime(362)).toBe('6h 02min')
	})

	it('mostra só minutos quando é menos de uma hora', () => {
		expect(formatReadingTime(48)).toBe('48min')
	})

	it('mostra só horas quando não há minutos', () => {
		expect(formatReadingTime(120)).toBe('2h')
	})

	it('devolve null para 0, negativo, null e undefined', () => {
		expect(formatReadingTime(0)).toBeNull()
		expect(formatReadingTime(-5)).toBeNull()
		expect(formatReadingTime(null)).toBeNull()
		expect(formatReadingTime(undefined)).toBeNull()
	})
})
