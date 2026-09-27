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
    
    const handleType = (type: CatalogQuery['type']) =>
		onChange({ type, genres: [], languages: type === 'book' ? query.languages : [] })

    return (
        <Paper variant="section" sx={{ p: 2, alignSelf: 'start'}}>
            <Stack sx={{ gap: 2 }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Filtros</Typography>
                    <Link component="button" type="button" onClick={onClear} sx={{ color: 'acao.dark', fontSize: 14 }}>Limpar</Link>
                </Stack>
                <TypeFilter value={query.type} counts={counts} onChange={handleType} />
                {
                    query.type === 'book' && (
                        <LanguageFilter value={query.languages} onChange={(languages) => onChange({ languages })} />
                    )
                }
                {/* Gênero (livro) ou área (artigo): aparece só quando há um tipo escolhido. */}
                {
                    query.type !== '' && (
                        <GenreFilter type={query.type} value={query.genres} onChange={(genres) => onChange({ genres })} />
                    )
                }
            </Stack>
        </Paper>
    )
}