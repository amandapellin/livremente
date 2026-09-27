import type { CatalogCounts } from "@/api/generated/model";
import { typeChips, type CatalogQuery } from "@/schemas/catalog-schemas";
import FilterSection from "../filter-section";
import { Box, Typography } from "@mui/material";

interface Props {
    value: CatalogQuery['type']
    counts?: CatalogCounts
    onChange: (type: CatalogQuery['type']) => void
}

export default function TypeFilter({ value, counts, onChange }: Props) {
    const countFor = (v: CatalogQuery['type']) =>
        v === '' ? counts?.all : v === 'book' ? counts?.book : counts?.scientific_article

    return (
        <FilterSection label="Tipo de Publicação">
            {typeChips.map((opt) => {
                const selected = value === opt.value
                return (
                    <Box
                        key={opt.value}
                        role="button"
                        tabIndex={0}
                        onClick = {() => onChange(opt.value)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(opt.value)}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                            px: 1,
                            py: 0.75,
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: 1,
                            borderColor: selected ? 'acao.light' : 'divider',
                            backgroundColor: selected ? 'rgba(var(--mui-palette-acao-mainChannel) / 0.12)' : 'transparent',
                            color: selected ? 'acao.dark' : 'text.primary',
                        }}
                    >
                        <Typography variant="caption">{opt.label}</Typography>
                        <Typography variant="overline" sx={{color: 'text.secondary'}}>{countFor(opt.value) ?? '-'}</Typography>
                    </Box>
                )
            })}
        </FilterSection>
    )
}