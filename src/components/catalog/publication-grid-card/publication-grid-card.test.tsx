import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/render'
import { makePublication } from '@/test/fixtures'
import PublicationGridCard from './index'

describe('PublicationGridCard', () => {
	it('renderiza título, autor (formatado) e selo de tipo', () => {
		renderWithProviders(<PublicationGridCard publication={makePublication()} />)
		// O título aparece no card (e também no placeholder da capa quando não há capa).
		expect(screen.getAllByText('Moby Dick; Or, The Whale').length).toBeGreaterThan(0)
		expect(screen.getByText('Herman Melville')).toBeInTheDocument() // "Melville, Herman" invertido
		expect(screen.getByText('Livro · EPUB')).toBeInTheDocument()
	})

	it('aponta para a página de detalhes da obra', () => {
		renderWithProviders(<PublicationGridCard publication={makePublication({ id: '42' })} />)
		expect(screen.getByRole('link')).toHaveAttribute('href', '/obra/42')
	})

	// Regressão do #80: título com token longo sem espaço não deve quebrar a renderização.
	// (A quebra visual/alinhamento em si é coberta por teste de layout no navegador.)
	it('renderiza título longo sem espaços sem quebrar', () => {
		const titulo = 'Supercalifragilisticexpialidocious_HD130948BC_J0002plus6216'
		renderWithProviders(<PublicationGridCard publication={makePublication({ title: titulo })} />)
		expect(screen.getAllByText(titulo).length).toBeGreaterThan(0)
	})
})
