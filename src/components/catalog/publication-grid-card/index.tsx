import { NavLink } from "react-router"
import { Box, Card, CardActionArea, Typography } from "@mui/material"
import type { Publication } from "@/api/generated/model"
import PublicationCover from "@/components/catalog/publication-card/publication-cover"
import TypeBadge from "@/components/catalog/publication-card/type-badge"
import { radii } from "@/theme/tokens"

interface Props {
    publication: Publication
}

/**
 * Card compacto do catálogo em modo grade: capa (largura total), selo de tipo,
 * título e autor, empilhados. A lista horizontal usa `PublicationCard`.
 */
export default function PublicationGridCard({ publication }: Props) {
    return (
        <Card variant="outlined" sx={{ borderRadius: radii.card, overflow: 'hidden', height: '100%' }}>
            <CardActionArea
                component={NavLink}
                to={`/obra/${publication.id}`}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', p: 1.5, gap: 1 }}
            >
                <PublicationCover title={publication.title} coverUrl={publication.coverUrl} variant="full" />
                <Box sx={{ alignSelf: 'flex-start' }}>
                    <TypeBadge type={publication.type} format={publication.format} />
                </Box>
                <Typography
                    variant="subtitle2"
                    sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                    {publication.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>{publication.author}</Typography>
            </CardActionArea>
        </Card>
    )
}
