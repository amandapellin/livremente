import InfoPage from '@/components/layout/info-page'

export default function TermosPage() {
	return (
		<InfoPage
			title="Termos de Uso"
			sections={[
				{
					heading: '1. Aceitação dos termos',
					paragraphs: [
						'O acesso e a utilização do LivreMente implicam a aceitação plena e irrevogável das condições aqui dispostas. Caso discorde de qualquer cláusula, solicitamos que suspenda o uso da plataforma.',
					],
				},
				{
					heading: '2. Natureza e finalidade do serviço',
					paragraphs: [
						'O LivreMente é um projeto de caráter acadêmico e experimental desenvolvido para fins educacionais e de pesquisa. Não possui fins lucrativos e é disponibilizado gratuitamente à comunidade.',
					],
				},
				{
					heading: '3. Direitos autorais e licenças do acervo',
					bullets: [
						{
							label: 'Origem dos materiais',
							text: 'Todo o acervo catalogado provém de fontes de acesso aberto parceiras — livros em domínio público do Project Gutenberg e artigos científicos do arXiv.',
						},
						{
							label: 'Livros (EPUB)',
							text: 'Livros em domínio público são distribuídos conforme suas respectivas licenças livres. A plataforma disponibiliza leitura direta e opção de download local.',
						},
						{
							label: 'Artigos Científicos (PDF)',
							text: 'Em estrito cumprimento aos termos de distribuição do arXiv, o LivreMente não hospeda nem disponibiliza download local direto de textos completos de artigos. O acesso ao documento integral é feito por redirecionamento ao repositório original.',
						},
						{
							label: 'Propriedade intelectual de terceiros',
							text: 'Cada documento permanece regido pelos termos de licença de seus respectivos autores e curadores originais.',
						},
					],
				},
				{
					heading: '4. Contas de usuário e responsabilidades',
					bullets: [
						{ text: 'O cadastro exige a prestação de informações verídicas e atualizadas.' },
						{
							text: 'A confidencialidade de sua senha de acesso e de seu e-mail é de sua exclusiva responsabilidade. Qualquer atividade efetuada por meio de sua conta será atribuída a você.',
						},
						{
							label: 'É expressamente vedado',
							text: 'violar mecanismos de segurança da plataforma, realizar requisições automáticas maliciosas (scrapers abusivos), tentar burlar as APIs ou utilizar a ferramenta para disseminação de conteúdos ilícitos.',
						},
					],
				},
				{
					heading: '5. Isenção e limitação de garantias',
					paragraphs: [
						'A plataforma é disponibilizada "no estado em que se encontra" (as is), sem garantias expressas ou implícitas de disponibilidade ininterrupta, ausência de falhas técnicas ou preservação perpétua de dados. Por se tratar de um protótipo acadêmico hospedado sob infraestrutura de pesquisa, períodos de manutenção, instabilidade ou redefinição de serviços podem ocorrer sem aviso prévio.',
					],
				},
			]}
		/>
	)
}
