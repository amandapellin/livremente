import { describe, it, expect } from 'vitest'
import { formatPersonName } from './format-name'

describe('formatPersonName', () => {
	it('inverte "Sobrenome, Nome" para "Nome Sobrenome"', () => {
		expect(formatPersonName('Melville, Herman')).toBe('Herman Melville')
		expect(formatPersonName('Austen, Jane')).toBe('Jane Austen')
	})

	it('mantém o valor quando não há vírgula (autor corporativo)', () => {
		expect(formatPersonName('Project Gutenberg')).toBe('Project Gutenberg')
	})

	it('aceita só o sobrenome quando não há nome após a vírgula', () => {
		expect(formatPersonName('Homer,')).toBe('Homer')
	})

	it('devolve string vazia para null/undefined/vazio', () => {
		expect(formatPersonName(null)).toBe('')
		expect(formatPersonName(undefined)).toBe('')
		expect(formatPersonName('   ')).toBe('')
	})
})
