import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/render'
import TypeBadge from './index'

describe('TypeBadge', () => {
	it('mostra "Livro · EPUB" quando há formato', () => {
		renderWithProviders(<TypeBadge type="book" format="EPUB" />)
		expect(screen.getByText('Livro · EPUB')).toBeInTheDocument()
	})

	it('mostra "Artigo" sem formato', () => {
		renderWithProviders(<TypeBadge type="scientific_article" />)
		expect(screen.getByText('Artigo')).toBeInTheDocument()
	})

	it('omite o separador quando o formato é nulo', () => {
		renderWithProviders(<TypeBadge type="book" format={null} />)
		expect(screen.getByText('Livro')).toBeInTheDocument()
		expect(screen.queryByText(/·/)).not.toBeInTheDocument()
	})
})
