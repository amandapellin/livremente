import { createTheme } from '@mui/material/styles'
import { colors as c, fontFamilies } from './tokens'

// Tema MUI a partir do design system do Figma.
// CLARO: valores exatos do DS. ESCURO: DERIVADO dos neutros do DS — a validar
// com a designer (o DS só define tokens de leitura escura).
export const theme = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: c.primary800, light: c.primary200, dark: c.primary900, contrastText: c.white },
                secondary: { main: c.gold500, dark: c.gold700, contrastText: c.goldContrast },
                info: { main: c.infoMain, contrastText: c.white }, // azul de ação / links
                error: { main: c.errorMain },
                text: { primary: c.papel900, secondary: c.papel700 },
                background: { default: c.papel50, paper: c.white },
                divider: c.divider,
            },
        },
        dark: {
            // DERIVADO — a validar com a designer
            palette: {
                primary: { main: c.primary200, light: c.primary50, dark: c.primary800, contrastText: c.primary900 },
                secondary: { main: c.gold500, dark: c.gold700, contrastText: c.goldContrast },
                info: { main: c.acao200, contrastText: c.papel900 },
                error: { main: '#f44336' }, // TODO confirmar
                text: { primary: c.papel100, secondary: c.papel400 },
                background: { default: c.leituraSurfaceEscuro, paper: c.papel800 },
                divider: 'rgba(255, 255, 255, 0.12)',
            },
        },
    },
    shape: { borderRadius: 4 },
    spacing: 8,
    typography: {
        fontFamily: fontFamilies.body,
        // h1–h3 não existem no DS → derivados em Lora (escala acima de h4)
        h1: { fontFamily: fontFamilies.heading, fontWeight: 600, fontSize: '3.75rem', lineHeight: 1.1, letterSpacing: '-0.5px' },
        h2: { fontFamily: fontFamilies.heading, fontWeight: 600, fontSize: '3rem', lineHeight: 1.15, letterSpacing: '-0.25px' },
        h3: { fontFamily: fontFamilies.heading, fontWeight: 600, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: 0 },
        // h4–h6 e demais: exatos do Figma (Material UI/*)
        h4: { fontFamily: fontFamilies.heading, fontWeight: 600, fontSize: '2.125rem', lineHeight: '2.625rem', letterSpacing: '0.25px' },
        h5: { fontFamily: fontFamilies.heading, fontWeight: 600, fontSize: '1.5rem', lineHeight: '2rem', letterSpacing: 0 },
        h6: { fontFamily: fontFamilies.heading, fontWeight: 500, fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: '0.15px' },
        subtitle1: { fontWeight: 400, fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0.15px' },
        subtitle2: { fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.1px' },
        body1: { fontWeight: 400, fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0.5px' },
        body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.25px' },
        button: { fontFamily: fontFamilies.body, fontWeight: 700, fontSize: '0.875rem', lineHeight: '1.5rem', letterSpacing: '0.8px' },
        caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: '1rem', letterSpacing: '0.4px' },
        overline: { fontWeight: 600, fontSize: '0.625rem', lineHeight: '1rem', letterSpacing: '1.5px' },
    },
})