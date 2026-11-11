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
            sx={(theme) => ({
                bgcolor: colors.gold[100],
                borderColor: colors.gold[700],
                color: colors.gold[900],
                border: 1,
                height: 22,
                fontWeight: 600,
                letterSpacing: '0.8px',
                // No tema escuro: dourado claro legível sobre fundo translúcido.
                ...theme.applyStyles('dark', {
                    bgcolor: 'rgba(255, 213, 0, 0.14)',
                    borderColor: colors.gold[500],
                    color: colors.gold[300],
                }),
            })}
        />

    )
}