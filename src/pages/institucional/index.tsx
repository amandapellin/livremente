import InfoPage from '@/components/layout/info-page'

export default function InstitucionalPage() {
	return (
		<InfoPage
			title="Institucional"
			intro="O LivreMente é uma plataforma web desenvolvida para democratizar o acesso à literatura e à ciência aberta, oferecendo um ambiente digital responsivo e pensado para o conforto e a concentração do leitor."
			sections={[
				{
					heading: 'O que é',
					paragraphs: [
						'O LivreMente é uma plataforma web que unifica, em um catálogo integrado, milhares de livros em domínio público (via API Gutendex / Project Gutenberg) e artigos científicos de acesso aberto (via API do arXiv). O sistema viabiliza a descoberta, a leitura e a organização do estudo em um único ambiente digital.',
					],
				},
				{
					heading: 'Nossa proposta',
					paragraphs: ['O sistema combina usabilidade digital a ferramentas ativas de estudo:'],
					bullets: [
						{
							label: 'Leitura no navegador',
							text: 'Suporte à execução de arquivos nos formatos EPUB e PDF sem exigência de instalação de softwares externos.',
						},
						{
							label: 'Personalização visual (EPUB)',
							text: 'Seleção de temas (claro, sépia e escuro), opções tipográficas adaptadas (incluindo fonte voltada a leitores com dislexia), ajuste de entrelinha e modos de exibição (página simples, página dupla ou rolagem contínua).',
						},
						{
							label: 'Ferramentas de apoio',
							text: 'Salvamento automático da posição de leitura, marcação manual de páginas, grifos coloridos, notas de texto vinculadas aos trechos e dicionário integrado com registro opcional de consultas.',
						},
						{
							label: 'Estante pessoal e acompanhamento',
							text: 'Registro de tempo ativo de leitura, calendário de frequência e organização das obras pelos estados Lendo, Lido, Quero ler e Abandonei.',
						},
						{
							label: 'Recomendações personalizadas',
							text: 'Sistema baseado em filtragem de conteúdo por aprendizado de máquina que sugere títulos com base nas preferências declaradas e no histórico de leitura do usuário.',
						},
					],
				},
				{
					heading: 'Projeto acadêmico',
					paragraphs: [
						'O LivreMente foi desenvolvido no âmbito do componente curricular de Projeto Integrador do Instituto Federal do Paraná (IFPR). O sistema constitui uma aplicação funcional com fins estritamente educacionais e científicos, sem finalidade comercial. O catálogo disponibilizado utiliza metadados e arquivos de repositórios abertos, respeitando integralmente as licenças originais de distribuição.',
					],
				},
			]}
		/>
	)
}
