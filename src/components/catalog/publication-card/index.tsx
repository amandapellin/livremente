import type { Publication } from "@/api/generated/model";
import { genreLabel, languageLabel } from "@/schemas/catalog-schemas";
import { Paper, Stack, Typography } from "@mui/material";
import PublicationCover from "./publication-cover";
import TypeBadge from "./type-badge";
import PublicationActions from "./publication-actions";

interface Props {
    publication: Publication;
    onAddToShelf?: (publication: Publication) => void;
}

export default function PublicationCard({ publication, onAddToShelf }: Props) {
    const meta = [
        publication.author, 
        publication.year, 
        languageLabel(publication.language),
        publication.genre && genreLabel(publication.genre)
    ].filter(Boolean).join(' · ');

    return (
        <Paper variant="section" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'stretch'}}>
            <PublicationCover title={publication.title} coverUrl={publication.coverUrl} />
            <Stack sx={{ gap: 0.5, flex: 1, minWidth: 0 }}>
                <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TypeBadge type={publication.type} format={publication.format}/>
                    { publication.source && 
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {publication.source}
                        </Typography>
                    }
                </Stack>
                <Typography variant="h6" component="h3" noWrap>{publication.title}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} noWrap>{meta}</Typography>
                {publication.description && (
                    <Typography variant="body2" 
                        sx={{ 
                            color: 'text.secondary', 
                            display: '-webkit-flex',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }} 
                    noWrap>
                        {publication.description}
                    </Typography>
                )}
            </Stack>
            <PublicationActions 
                to={`/obra/${publication.id}`}
                onAddToShelf={onAddToShelf ? () => onAddToShelf(publication) : undefined} 
            />
        </Paper>
    )
}