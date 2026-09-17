import { NavLink } from 'react-router'
import { Box, Button, Stack, Typography } from '@mui/material'
import { colors } from '@/theme/tokens'
export default function Hero(){
    return (
        <Box
            sx={{
                bgcolor: 'primary.dark',
                backgroundImage: `linear-gradient(rgba(20,38,92,0.78), rgba(20,38,92,0.78)), url('/hero-landing.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                px: 2,
                pt: { xs: 8, md: 12 },
                pb: { xs: 12, md: 20 },
                textAlign: 'center',   
            }}
        >
            <Stack sx={{ maxWidth: 1089, mx: 'auto', alignItems: 'center', gap: 3 }}>
                <Typography variant="h1" component="h1" sx={{ color: colors.primary[200], fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                    Acesso aberto para toda {' '}
                    <Box component="span" sx={{ color: colors.gold[500]}}>
                        mente curiosa
                    </Box>
                </Typography>
                <Typography variant="h6" component="p" sx={{ color: colors.papel[200], fontWeight:500, maxWidth: 680 }}>
                    Descubra um vasto acervo de obras clássicas, acadêmicas e ficcionais, cuidadosamente organizadas para uma leitura fluida e acessível.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, pt: 3, width: {xs: '100%', sm: 'auto'} }}>
                    <Button
                        component={NavLink}
                        to="/catalogo"
                        variant="contained"
                        color="secondary"
                        size="large"
                    >
                        Começar a Ler
                    </Button>
                    <Button
                        component={NavLink}
                        to="/login"
                        variant="outlined"
                        size="large"
                        sx={{ color: colors.primary[50], borderColor: colors.primary[50], '&:hover': { borderColor: colors.primary[50], bgcolor: 'rgba(255,255,255,0.08)' } }}
                    >
                        Acessar Conta
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}