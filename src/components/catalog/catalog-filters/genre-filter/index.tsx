import { genreLabel, genreLabelFor, genreOptionsFor, type CatalogQuery } from "@/schemas/catalog-schemas";
import FilterSection from "../filter-section";
import { Checkbox, ListItemText, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";

interface Props {
    type: CatalogQuery['type']
    value: string[]
    onChange: (genres: string[]) => void
}

export default function GenreFilter({ type, value, onChange }: Props) {
    const options = genreOptionsFor(type)
    const helper = type === 'scientific_article' 
        ? 'Filtra artigos pela  área de conhecimento.'
        : 'Aplicado a livros. Selecione "Artigos científicos" para filtrar por área.'

    return (
        <FilterSection label={genreLabelFor(type)} helper={helper}>
            <Select
                multiple 
                size="small" 
                displayEmpty 
                value={value}
                onChange={(e) => onChange(e.target.value as string[])}
                input={<OutlinedInput />}
                renderValue={(sel) => 
                    sel.length === 0 
                    ? <Typography sx={{color: 'text.secondary'}}>Selecionar</Typography> 
                    :sel.map(genreLabel).join(', ')
                }
            >
                {options.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                        <Checkbox size="small" checked={value.includes(o.value)} />
                        <ListItemText primary={o.label} />
                    </MenuItem>
                ))}
            </Select>
        </FilterSection>
    )
}