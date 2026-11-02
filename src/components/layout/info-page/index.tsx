import type { ReactNode } from 'react'
import { Container, Divider, Stack, Typography } from '@mui/material'

export interface InfoSection {
	heading?: string
	paragraphs: string[]
}

interface Props {
	title: string
	intro?: string
	sections: InfoSection[]
	/** Conteúdo extra após as seções (ex.: FAQ em accordion). */
	children?: ReactNode
	/** Conteúdo extra ao final (ex.: botão de contato). */
	footer?: ReactNode
}

/**
 * Página de conteúdo estático (rodapé institucional: Institucional, Privacidade,
 * Termos, Suporte — issue #83). Título + intro + seções, usando os tokens
 * semânticos do tema (adapta a claro/escuro).
 */
export default function InfoPage({ title, intro, sections, children, footer }: Props) {
	return (
		<Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
			<Stack sx={{ gap: 1, mb: 3 }}>
				<Typography variant="h4" component="h1">
					{title}
				</Typography>
				{intro && (
					<Typography variant="body1" sx={{ color: 'text.secondary' }}>
						{intro}
					</Typography>
				)}
			</Stack>

			<Divider sx={{ mb: 3 }} />

			<Stack sx={{ gap: 3 }}>
				{sections.map((s, i) => (
					<Stack key={s.heading ?? i} sx={{ gap: 1 }}>
						{s.heading && (
							<Typography variant="h6" component="h2">
								{s.heading}
							</Typography>
						)}
						{s.paragraphs.map((p, j) => (
							<Typography key={j} variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
								{p}
							</Typography>
						))}
					</Stack>
				))}
			</Stack>

			{children && <Stack sx={{ mt: 4 }}>{children}</Stack>}

			{footer && <Stack sx={{ mt: 4 }}>{footer}</Stack>}
		</Container>
	)
}
