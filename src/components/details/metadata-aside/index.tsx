import { Paper, Stack } from '@mui/material'
import type { PublicationDetails } from '@/api/generated/model'
import ContributorList from '@/components/details/metadata-aside/contributor-list'
import SubjectTags from '@/components/details/metadata-aside/subject-tags'
import PublicationFacts from '@/components/details/metadata-aside/publication-facts'
import ShelfState from '@/components/details/metadata-aside/shelf-state'

export default function MetadataAside({ publication }: { publication: PublicationDetails }) {
	return (
		<Paper variant="section" sx={{ p: 2.5 }}>
			<Stack sx={{ gap: 2 }}>
				<ContributorList contributors={publication.contributors} />
				<SubjectTags subjects={publication.subjects} />
				<PublicationFacts publication={publication} />
				<ShelfState status={publication.readingStatus} />
			</Stack>
		</Paper>
	)
}