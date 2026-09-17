import { Box, Link, Stack, Typography } from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { colors } from '@/theme/tokens'

const footerLinks = [
    { label: 'Institucional', href: '#' },
    { label: 'Privacidade', href: '#' },
    { label: 'Termos', href: '#' },
    { label: 'Suporte', href: '#' },
]

export default function Footer() {
    const linkSx = {
        color: colors.primary[50],
        fontSize: 12,
        lineHeight: '16px',
        letterSpacing: '0.4px',
    }
    return (
        <Box
            component="footer"
            sx={{ bgcolor: colors.papel[900], borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 3, py: 2, minHeight: 81 }}
            >
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <AutoStoriesIcon sx={{ fontSize: 24, color: colors.gold[500] }} />
                    <Typography variant="h5" component="span" sx={{ whiteSpace: 'nowrap' }}>
                        <Box component="span" sx={{ color: colors.gold[500] }}>
                            Livre
                        </Box>
                        <Box component="span" sx={{ color: 'common.white' }}>
                            Mente
                        </Box>
                    </Typography>
                </Stack>

                <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {footerLinks.map((l) => (
                        <Link key={l.label} href={l.href} underline="hover" sx={linkSx}>
                            {l.label}
                        </Link>
                    ))}
                </Stack>

                <Typography sx={{ ...linkSx, textAlign: 'center' }}>
                    LivreMente - Acesso Aberto ao Conhecimento
                </Typography>
            </Stack>
        </Box>
    )
}