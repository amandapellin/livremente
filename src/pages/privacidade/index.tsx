import InfoPage from '@/components/layout/info-page'

export default function PrivacidadePage() {
	return (
		<InfoPage
			title="Política de Privacidade"
			intro="Em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018), esta página informa com transparência como tratamos, armazenamos e protegemos suas informações pessoais."
			sections={[
				{
					heading: '1. Dados que coletamos',
					paragraphs: [
						'Para prestar nossos serviços e fornecer a experiência personalizada da plataforma, tratamos os seguintes dados:',
					],
					bullets: [
						{
							label: 'Dados cadastrais',
							text: 'Nome completo, endereço de e-mail, data de nascimento, gênero (autodeclarado) e credencial de acesso criptografada.',
						},
						{
							label: 'Dados de personalização e navegação',
							text: 'Preferências explícitas de leitura (idiomas, gêneros literários e áreas do conhecimento), avatar de perfil (opcional) e tema de interface selecionado.',
						},
						{
							label: 'Dados de estudo e progresso',
							text: 'Obras adicionadas à estante, percentual lido, tempo de sessão ativa, grifos, anotações e, quando autorizado pelo usuário, histórico de palavras consultadas no dicionário integrado.',
						},
					],
				},
				{
					heading: '2. Finalidade do tratamento',
					paragraphs: ['Seus dados são utilizados exclusivamente para:'],
					bullets: [
						{ text: 'Autenticar seu acesso com segurança e permitir a recuperação de conta;' },
						{ text: 'Sincronizar seu progresso, estantes, notas e configurações entre diferentes dispositivos;' },
						{ text: 'Alimentar o modelo de recomendação de leitura com base nas suas preferências e histórico;' },
						{ text: 'Gerar métricas pessoais de tempo e frequência de leitura.' },
					],
				},
				{
					heading: '3. Segurança das informações e compartilhamento',
					bullets: [
						{
							label: 'Criptografia',
							text: 'Senhas e tokens de autenticação ou confirmação são armazenados na forma de hashes criptográficos unidirecionais.',
						},
						{
							label: 'Não compartilhamento',
							text: 'O LivreMente não comercializa, não compartilha dados cadastrais com parceiros comerciais e não utiliza seus dados para publicidade ou rastreamento direcionado de terceiros.',
						},
						{
							label: 'Fontes externas',
							text: 'As consultas a dicionários e acervos externos transferem apenas os parâmetros estritamente técnicos necessários para a entrega dos conteúdos, sem associar sua identidade civil às plataformas terceiras.',
						},
					],
				},
				{
					heading: '4. Bases legais e consentimento',
					paragraphs: [
						'O tratamento dos dados cadastrais e de navegação é fundamentado no consentimento expresso manifestado no momento do registro na plataforma. Comunicações adicionais ou avisos informativos (opcionais) dependem de consentimento específico e podem ser desmarcados a qualquer momento na aba de perfil.',
					],
				},
				{
					heading: '5. Direitos do titular',
					paragraphs: [
						'Você detém total controle sobre seus dados. Diretamente pelo seu painel de perfil, você pode a qualquer momento:',
					],
					bullets: [
						{ text: 'Consultar, corrigir e atualizar seus dados cadastrais e preferências;' },
						{ text: 'Exportar uma cópia dos seus dados e histórico de leitura;' },
						{ text: 'Revogar consentimentos secundários concedidos;' },
						{ text: 'Excluir definitivamente sua conta e todos os dados a ela vinculados.' },
					],
				},
			]}
		/>
	)
}
