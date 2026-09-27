import { colors } from "@/theme/tokens"
import { Box, Stack, Typography } from "@mui/material"

interface Props {
    title: string
    coverUrl?: string | null
}

export default function PublicationCover({ title, coverUrl }: Props) {
    if (coverUrl) {
        return (
            <Box
                component="img"
                src={coverUrl}
                alt=""
                loading="lazy"
                sx={{
                    width: 86,
                    height: 128,
                    objectFit: 'cover',
                    borderRadius: 0.5,
                    display: 'block',
                    flexShrink: 0,
                }}
            ></Box>
        )
    }
    return (
        <Stack sx={{ 
            width: 86, 
            height: 128, 
            flexShrink: 0,
            p: 1, 
            borderRadius: 0.5, 
            justifyContent: 'space-between', 
            bgcolor: colors.papel[800],
            color: colors.papel[200], 
            borderLeft: `4px solid ${colors.leitura.surfaceEscuro}`, 
            }}
        >
            <Typography sx={{ fontSize: 11, lineHeight: 1.2}}>{title}</Typography>
            <Typography sx={{ fontSize: 8, opacity: 0.7}}>capa · placeholder</Typography>
        </Stack>
    )
}