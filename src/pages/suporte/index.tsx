import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoPage from '@/components/layout/info-page'
import SupportContactForm from '@/components/support/contact-form'

// Perguntas frequentes (#83): respostas alinhadas às funcionalidades da plataforma.
const FAQ: { q: string; a: string }[] = [
	{
		q: 'Preciso ter uma conta para usar o LivreMente?',
		a: 'Não para explorar o catálogo. Você pode buscar títulos, filtrar materiais e visualizar a sinopse e detalhes das publicações livremente. Contudo, para ler as obras, salvar na estante pessoal, utilizar grifos e anotações, salvar o histórico e receber recomendações algorítmicas, é necessário criar uma conta gratuita.',
	},
	{
		q: 'O acervo é realmente 100% gratuito?',
		a: 'Sim. Todas as publicações são integradas de repositórios abertos mundiais: livros livres de direitos patrimoniais (Project Gutenberg via Gutendex) e pré-prints e artigos científicos de acesso aberto (arXiv).',
	},
	{
		q: 'Posso baixar qualquer material para ler offline?',
		a: 'Livros digitais em formato EPUB podem ser baixados livremente. Já os artigos científicos do repositório arXiv não podem ser armazenados diretamente em nossos servidores nem baixados pela plataforma por restrição de licença; nesses casos, o LivreMente redireciona você para o arquivo original mantido pelo arXiv.',
	},
	{
		q: 'Por que os grifos e anotações funcionam apenas em livros (EPUB)?',
		a: 'A tecnologia de marcação e notas ativas exige manipulação da estrutura semântica do documento em fluxo contínuo (reflow), viabilizada pela biblioteca do leitor EPUB. Documentos em PDF contam com visualização direta no navegador, sem o recurso de grifo integrado nesta versão do sistema.',
	},
	{
		q: 'Por que é obrigatório confirmar meu e-mail no cadastro?',
		a: 'A confirmação protege seu perfil contra cadastros indevidos e garante um endereço válido caso você precise redefinir sua senha. O link de ativação expira após um determinado período de segurança.',
	},
	{
		q: 'Esqueci minha senha. Como recupero o acesso?',
		a: 'Na tela de login, clique em "Esqueci minha senha". Você receberá um e-mail com instruções e um link seguro para cadastrar uma nova credencial.',
	},
	{
		q: 'Como a plataforma calcula as recomendações na página inicial?',
		a: 'Nosso motor de recomendação combina as preferências que você declarou (idiomas, gêneros e áreas do conhecimento) com os títulos que você adiciona e lê na sua estante. Se você for um usuário novo, a plataforma destacará inicialmente as obras de maior relevância e popularidade no acervo.',
	},
	{
		q: 'Como exporto ou excluo meus dados do sistema?',
		a: 'Basta acessar o seu Perfil e rolar até a seção Dados e privacidade. Lá você encontra as opções para baixar o arquivo completo com seus registros de leitura ou solicitar a exclusão imediata e definitiva da sua conta.',
	},
]

export default function SuportePage() {
	return (
		<InfoPage
			title="Suporte e Ajuda"
			intro="Precisa de ajuda? Veja as perguntas frequentes abaixo ou fale com a gente."
			sections={[]}
			footer={<SupportContactForm />}
		>
			<Stack sx={{ gap: 1 }}>
				<Typography variant="h6" component="h2">
					Perguntas frequentes
				</Typography>
				{FAQ.map((item, i) => (
					<Accordion key={item.q} disableGutters defaultExpanded={i === 0} variant="outlined">
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
								{item.a}
							</Typography>
						</AccordionDetails>
					</Accordion>
				))}
			</Stack>
		</InfoPage>
	)
}
