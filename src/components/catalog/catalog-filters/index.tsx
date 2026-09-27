import type { CatalogCounts } from "@/api/generated/model";
import type { CatalogQuery } from "@/schemas/catalog-schemas";
import { Link, Paper, Stack, Typography } from "@mui/material";
import TypeFilter from "./type-filter";
import LanguageFilter from "./language-filter";
import GenreFilter from "./genre-filter";

interface Props {
    query: CatalogQuery
    counts?: CatalogCounts
    onChange: (patch: Partial<CatalogQuery>) => void
    onClear: () => void
}

export default function CatalogFilters({ query, counts, onChange, onClear }: Props) {
    return (
        <Paper variant="section" sx={{ p: 2, alignSelf: 'start'}}>
            <Stack sx={{ gap: 2 }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Filters</Typography>
                    <Link component="button" type="button" onClick={onClear} sx={{ color: 'acao.dark', fontSize: 14 }}>Limpar</Link>
                </Stack>
                <TypeFilter value={query.type} counts={counts} onChange={(type) => onChange({ type })} />
                <LanguageFilter value={query.languages} onChange={(languages) => onChange({ languages })} />
                <GenreFilter type={query.type} value={query.genres} onChange={(genres) => onChange({ genres })} />
            </Stack>
        </Paper>
    )
}