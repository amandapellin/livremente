import InfoPage from '@/components/layout/info-page'

export default function InstitucionalPage() {
	return (
		<InfoPage
			title="Institucional"
			intro="O LivreMente é uma plataforma de leitura que reúne, em um único acervo, livros de domínio público e artigos científicos de acesso aberto."
			sections={[
				{
					heading: 'O que é',
					paragraphs: [
						'O LivreMente reúne obras de domínio público do Project Gutenberg e artigos científicos de acesso aberto do repositório arXiv, permitindo descobrir, ler e organizar leituras em um só lugar.',
					],
				},
				{
					heading: 'Nossa proposta',
					paragraphs: [
						'Democratizar o acesso ao conhecimento com uma experiência de leitura on-line (EPUB e PDF), recomendações personalizadas, estante pessoal, grifos, anotações e um dicionário integrado.',
					],
				},
				{
					heading: 'Projeto acadêmico',
					paragraphs: [
						'O LivreMente foi desenvolvido como trabalho de conclusão de curso, com fins educacionais e sem finalidade comercial. O acervo provém de fontes abertas, respeitando suas licenças de uso.',
					],
				},
			]}
		/>
	)
}
