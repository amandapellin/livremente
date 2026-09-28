import type { PublicationDetails, ReadingStatus } from "@/api/generated/model";
import PublicationCover from "@/components/catalog/publication-card/publication-cover";
import { MuseumOutlined } from "@mui/icons-material";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import DetailActions from "../detail-actions";
import ReadingProgressCard from "../reading-progress-card";

// Estados em que faz sentido exibir o progresso de leitura (não "quero ler").
const PROGRESS_STATUSES: ReadingStatus[] = ['read', 'reading', 'abandoned']

interface Props {
	publication: PublicationDetails
	onSelectStatus?: (status: ReadingStatus) => void
}

export default function PublicationHeader({ publication, onSelectStatus }: Props) {
	return (
		<Paper
			variant="section"
			sx={{
				p: 3,
				display: 'flex',
				gap: 4,
				flexWrap: {
					xs: 'wrap',
					sm: 'nowrap'
				}
			}}
		>
			<Box sx={{ width: 180, flexShrink: 0 }}>
				<PublicationCover title={publication.title} coverUrl={publication.coverUrl} variant="full"/>
			</Box>
			<Stack sx={{ gap: 2, flex: 1, minWidth: 0 }}>
				<Stack sx={{ gap: 0.5 }}>
					<Typography variant="h3" component="h1">{publication.title}</Typography>
					<Typography variant="h6" component="p" sx={{ color: 'text.secondary'}}>{publication.author}</Typography>
				</Stack>
				<Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap', color: 'text.secondary'}}>
					{ publication.year && (
						<Stack direction="row" sx={{ gap: 0.5, alignItems: 'center'}}>
							<Typography variant="body2" component="span">{publication.year}</Typography>
						</Stack>
					)}
					{publication.source && (
						<Stack direction="row" sx={{ gap: 0.5, alignItems: 'center'}}>
							<MuseumOutlined sx={{ fontSize: 16 }}/>
							<Typography variant="caption">{publication.source}</Typography>
						</Stack>
					)}
					{
						publication.publicDomain && (
							<Chip size="small" 
								label="Domínio público" 
								sx={{ 
									bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.12)', 
									color: 'primary.main',
									fontWeight: 600,
									letterSpacing: '1px'
								 }} 
							/>
						)
					}
				</Stack>
				<DetailActions
					id={publication.id}
					downloadUrl={publication.downloadUrl}
					readingStatus={publication.readingStatus}
					onSelectStatus={onSelectStatus}
				/>
				{publication.readingProgress &&
					publication.readingStatus &&
					PROGRESS_STATUSES.includes(publication.readingStatus) && (
						<ReadingProgressCard progress={publication.readingProgress} />
					)}
			</Stack>
		</Paper>
	)
}