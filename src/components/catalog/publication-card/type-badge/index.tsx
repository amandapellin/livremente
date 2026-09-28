import type { PublicationType } from "@/api/generated/model";
import { colors } from "@/theme/tokens";
import { Chip } from "@mui/material";

interface Props {
    type: PublicationType
    format?: string | null
}

export default function TypeBadge({ type, format }: Props) {
    const label = `${type === 'book' ? 'Livro' : 'Artigo'}${format ? ` · ${format}` : ''}`
    return (
        <Chip 
            size="small"
            label={label}
            sx={{
                bgColor: colors.gold[50],
                borderColor: colors.gold[700],
                color: colors.gold[900],
                border: 1,
                height: 22,
                fontWeight: 600,
                letterSpacing: '0.8px'
            }}
        />

    )
}