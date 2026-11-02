import { Accordion, AccordionDetails, AccordionSummary, Button, Link, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import InfoPage from '@/components/layout/info-page'

// Ajuste para o e-mail de suporte real do projeto quando houver.
const SUPPORT_EMAIL = 'suporte@livremente.com.br'

// Perguntas frequentes (RF/#83): respostas alinhadas às funcionalidades da plataforma.
const FAQ: { q: string; a: string }[] = [
	{
		q: 'Preciso de uma conta para usar o LivreMente?',
		a: 'Você pode explorar e buscar o acervo sem conta. Para ler as obras, salvar na estante, grifar, anotar, acompanhar o progresso e receber recomendações, é necessário criar uma conta gratuita.',
	},
	{
		q: 'O acervo é gratuito?',
		a: 'Sim. Todas as obras provêm de fontes abertas: livros de domínio público do Project Gutenberg e artigos de acesso aberto do repositório arXiv.',
	},
	{
		q: 'Em quais formatos posso ler?',
		a: 'Livros em EPUB e artigos em PDF, lidos diretamente no navegador, sem precisar instalar nada.',
	},
	{
		q: 'Por que preciso confirmar o e-mail?',
		a: 'A confirmação ativa a sua conta e garante que o e-mail é válido para recuperação de acesso e avisos. Enviamos um link de confirmação logo após o cadastro.',
	},
	{
		q: 'Esqueci minha senha. O que faço?',
		a: 'Na tela de login, use a opção "Esqueci a senha" para redefini-la. Se precisar de ajuda, fale com o suporte.',
	},
	{
		q: 'Como funcionam as recomendações?',
		a: 'São geradas a partir das preferências informadas no cadastro e do seu histórico de leitura, destacando obras parecidas com o seu interesse.',
	},
	{
		q: 'Como exporto ou excluo meus dados?',
		a: 'Na tela de perfil você pode exportar seus dados ou excluir a conta a qualquer momento. Veja a Política de Privacidade para mais detalhes.',
	},
]

export default function SuportePage() {
	return (
		<InfoPage
			title="Suporte"
			intro="Precisa de ajuda? Veja as perguntas frequentes abaixo ou fale com a gente."
			sections={[
				{
					heading: 'Como obter ajuda',
					paragraphs: [
						'Antes de nos contatar, confira as perguntas frequentes. Se não resolver, descreva o ocorrido com o máximo de detalhes (tela, passos e, se possível, o horário) para agilizarmos o atendimento.',
					],
				},
			]}
			footer={
				<Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Não encontrou o que procurava? Envie sua mensagem para {SUPPORT_EMAIL}.
					</Typography>
					<Button
						component={Link}
						href={`mailto:${SUPPORT_EMAIL}`}
						variant="contained"
						startIcon={<MailOutlineIcon />}
					>
						Falar com o suporte
					</Button>
				</Stack>
			}
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
