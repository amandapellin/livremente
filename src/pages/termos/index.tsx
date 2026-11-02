import InfoPage from '@/components/layout/info-page'

export default function TermosPage() {
	return (
		<InfoPage
			title="Termos de Uso"
			intro="Ao utilizar o LivreMente, você concorda com os termos descritos abaixo."
			sections={[
				{
					heading: 'Aceitação',
					paragraphs: [
						'O uso da plataforma implica a aceitação destes termos. Caso não concorde, não utilize o serviço.',
					],
				},
				{
					heading: 'Acervo e licenças',
					paragraphs: [
						'As obras disponibilizadas provêm de fontes abertas — livros de domínio público (Project Gutenberg) e artigos de acesso aberto (arXiv) — e permanecem sujeitas às licenças de suas fontes originais.',
					],
				},
				{
					heading: 'Conta e responsabilidades',
					paragraphs: [
						'Você é responsável por manter a confidencialidade das suas credenciais e pelas atividades realizadas na sua conta. Informe dados verdadeiros no cadastro.',
					],
				},
				{
					heading: 'Uso aceitável',
					paragraphs: [
						'É vedado utilizar a plataforma para fins ilícitos, redistribuir conteúdo em desacordo com as licenças das fontes ou comprometer a segurança e a disponibilidade do serviço.',
					],
				},
				{
					heading: 'Isenção de garantias',
					paragraphs: [
						'O LivreMente é um projeto acadêmico, oferecido "no estado em que se encontra", sem garantias de disponibilidade contínua ou de ausência de erros.',
					],
				},
			]}
		/>
	)
}
