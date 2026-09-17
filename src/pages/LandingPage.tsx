import { Box } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DevicesIcon from '@mui/icons-material/Devices'
import Hero from '../components/landing/hero'
import FeatureCard, { type FeatureCardProps } from '../components/landing/feature-card'

const features: FeatureCardProps[] = [
	{ icon: MenuBookIcon, title: 'Acervo Rico', text: 'Milhares de títulos de domínio público e publicações acadêmicas à sua disposição.' },
	{ icon: EditNoteIcon, title: 'Leitura Ativa', text: 'Ferramentas de anotação, marcação e dicionário integrado para aprofundar seus estudos.' },
	{ icon: DevicesIcon, title: 'Sincronização', text: 'Seu progresso salvo e acessível em qualquer dispositivo, do celular ao desktop.' },
]

export default function LandingPage() {
	return (
		<Box sx={{ pb: 3}}>
			<Hero />
			<Box
				sx={{
					maxWidth: 1100, mx: 'auto', px: 2, mt: { xs: -8, md: -12 }, position: 'relative',
					display: 'grid', gap: 4.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
				}}
			>
				{features.map((f) => (
					<FeatureCard key={f.title} {...f} />
				))}
			</Box>
		</Box>
	)
}