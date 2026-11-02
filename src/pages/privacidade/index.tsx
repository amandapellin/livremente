import InfoPage from '@/components/layout/info-page'
import { LGPD_CONSENT_PARAGRAPHS } from '@/constants/lgpd'

// Reaproveita o texto de consentimento mostrado no cadastro (fonte única).
const [coleta, seguranca, direitos] = LGPD_CONSENT_PARAGRAPHS

export default function PrivacidadePage() {
	return (
		<InfoPage
			title="Política de Privacidade"
			intro="Tratamos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD). Esta página resume o que coletamos, como protegemos e quais são seus direitos."
			sections={[
				{ heading: 'Dados que tratamos', paragraphs: [coleta] },
				{ heading: 'Segurança e compartilhamento', paragraphs: [seguranca] },
				{ heading: 'Seus direitos', paragraphs: [direitos] },
				{
					heading: 'Consentimento',
					paragraphs: [
						'O tratamento de dados é consentido no momento do cadastro. O consentimento para avisos (opcional) pode ser revogado a qualquer momento na tela de perfil.',
					],
				},
			]}
		/>
	)
}
