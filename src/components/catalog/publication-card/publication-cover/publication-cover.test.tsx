import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/render'
import PublicationCover from './index'

describe('PublicationCover', () => {
	it('renderiza <img> com o src quando há capa', () => {
		const { container } = renderWithProviders(<PublicationCover title="Moby Dick" coverUrl="http://x/capa.jpg" />)
		const img = container.querySelector('img')
		expect(img).not.toBeNull()
		expect(img).toHaveAttribute('src', 'http://x/capa.jpg')
	})

	it('renderiza o placeholder com título quando não há capa', () => {
		const { container } = renderWithProviders(<PublicationCover title="Sem Capa" coverUrl={null} />)
		expect(container.querySelector('img')).toBeNull()
		expect(screen.getByText('Sem Capa')).toBeInTheDocument()
		expect(screen.getByText('capa · placeholder')).toBeInTheDocument()
	})
})
