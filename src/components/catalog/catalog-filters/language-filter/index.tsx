import { idiomaOptions, type CatalogQuery } from "@/schemas/catalog-schemas";
import FilterSection from "../filter-section";
import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";

type Lang = CatalogQuery['languages'][number]

interface Props {
    value: Lang[]
    onChange: (languages: Lang[]) => void
}

export default function LanguageFilter({ value, onChange }: Props) {
    const toggle = (lang: Lang) => 
        onChange(value.includes(lang) ? value.filter(l => l !== lang) : [...value, lang])
    
    return (
        <FilterSection label="Idioma">
            <Stack sx={{ gap: 0.5}}>
                {idiomaOptions.map((o) => (
                    <FormControlLabel
                        key={o.value}
                        sx={{ m: 0}}
                        control={
                            <Checkbox size="small" checked={value.includes(o.value as Lang)} onChange={() => toggle(o.value as Lang)} />
                        }
                        label={<Typography variant="body2" sx={{ color: 'text.secondary'}}>{o.label}</Typography>}
                    />
                ))}
            </Stack>
        </FilterSection>
    )
}