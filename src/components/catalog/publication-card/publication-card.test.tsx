import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/render'
import { makePublication } from '@/test/fixtures'
import PublicationCard from './index'

describe('PublicationCard (lista)', () => {
	it('mostra título, selo de tipo, fonte e a meta (autor · ano · idioma · gênero)', () => {
		renderWithProviders(<PublicationCard publication={makePublication()} />)
		expect(screen.getByRole('heading', { name: 'Moby Dick; Or, The Whale' })).toBeInTheDocument()
		expect(screen.getByText('Livro · EPUB')).toBeInTheDocument()
		expect(screen.getByText('Project Gutenberg')).toBeInTheDocument()
		// meta montada: "Herman Melville · 1851 · Inglês · Clássicos"
		const meta = screen.getByText(/Herman Melville/)
		expect(meta).toHaveTextContent('1851')
		expect(meta).toHaveTextContent('Inglês')
		expect(meta).toHaveTextContent('Clássicos')
	})

	it('"Detalhes" aponta para a obra', () => {
		renderWithProviders(<PublicationCard publication={makePublication({ id: '7' })} />)
		expect(screen.getByRole('link', { name: 'Detalhes' })).toHaveAttribute('href', '/obra/7')
	})

	it('aciona onAddToShelf ao clicar em "Estante"', async () => {
		const onAdd = vi.fn()
		renderWithProviders(<PublicationCard publication={makePublication()} onAddToShelf={onAdd} />)
		await userEvent.click(screen.getByRole('button', { name: /Estante/ }))
		expect(onAdd).toHaveBeenCalledTimes(1)
	})
})
