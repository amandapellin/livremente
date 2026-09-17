import { createTheme } from '@mui/material/styles'
import { colors as c, fontFamilies } from './tokens'

declare module '@mui/material/styles' {
	interface Palette { contrast: Palette['primary']; brand: Palette['primary'] }
	interface PaletteOptions { contrast?: PaletteOptions['primary']; brand?: PaletteOptions['primary'] }
}
declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides { contrast: true; brand: true }
}

export const theme = createTheme({
	cssVariables: { colorSchemeSelector: 'class' },
	colorSchemes: {
		light: {
			palette: {
				primary: { 
					main: c.primary[800], 
					light: c.primary[200], 
					dark: c.primary[900], 
					contrastText: c.white 
				},
				secondary: { 
					main: c.gold[500], 
					dark: c.gold[700], 
					contrastText: c.goldContrast 
				},
				info: { 
					main: c.info, 
					contrastText: c.white 
				},
				error: { 
					main: c.error 
				},
				text: { 
					primary: c.papel[900], 
					secondary: c.papel[700] 
				},
				background: { 
					default: c.papel[50], 
					paper: c.white 
				},
				divider: c.divider,
				contrast: { 
					main: c.papel[100], 
					contrastText: c.papel[700] 
				}, // busca/notif/toggle
				brand: { 
					main: c.primary[800], 
					contrastText: c.white 
				}, 
			},
		},
		dark: {
			palette: {
				primary: { 
					main: c.primary[200], 
					light: c.primary[50], 
					dark: c.primary[800], 
					contrastText: c.primary[900] 
				},
				secondary: { 
					main: c.gold[500], 
					dark: c.gold[700], 
					contrastText: c.goldContrast 
				},
				info: { 
					main: c.acao[200], 
					contrastText: c.papel[900] 
				},
				error: { 
					main: '#f44336' 
				},
				text: { 
					primary: c.papel[100], 
					secondary: c.papel[400] 
				},
				background: { 
					default: c.leitura.surfaceEscuro, 
					paper: c.papel[800] 
				},
				divider: 'rgba(255, 255, 255, 0.12)',
				contrast: { 
					main: 'rgba(255, 255, 255, 0.08)', 
					contrastText: c.papel[300] 
				},
				brand: { 
					main: c.primary[200], 
					contrastText: c.primary[900] 
				},
			},
		},
	},
	shape: { borderRadius: 4 },
	spacing: 8,
	typography: {
		fontFamily: fontFamilies.body,
		h1: { 
			fontFamily: fontFamilies.heading, 
			fontWeight: 700, 
			fontSize: '3.75rem', 
			lineHeight: 1.1, 
			letterSpacing: '-0.5px' 
		},
		h2: { 
			fontFamily: fontFamilies.heading, 
			fontWeight: 600, 
			fontSize: '3rem', 
			lineHeight: 1.15, 
			letterSpacing: '-0.25px' 
		},
		h3: { 
			fontFamily: fontFamilies.heading, 
			fontWeight: 600, 
			fontSize: '2.5rem', 
			lineHeight: 1.2 
		},
		h4: { 
			fontFamily: fontFamilies.heading, 
			fontWeight: 600, 
			fontSize: '2.125rem', 
			lineHeight: '2.625rem', 
			letterSpacing: '0.25px' 
		},
		h5: { 
			fontFamily: fontFamilies.heading, 
			fontWeight: 600, 
			fontSize: '1.5rem', 
			lineHeight: '2rem' 
		},
		h6: { 
			fontFamily: fontFamilies.heading, 
			fontWeight: 500, 
			fontSize: '1.25rem', 
			lineHeight: '1.75rem', 
			letterSpacing: '0.15px' 
		},
		subtitle1: { 
			fontWeight: 400, 
			fontSize: '1rem', 
			lineHeight: '1.5rem', 
			letterSpacing: '0.15px' 
		},
		subtitle2: { 
			fontWeight: 500, 
			fontSize: '0.875rem', 
			lineHeight: '1.25rem', 
			letterSpacing: '0.1px' 
		},
		body1: { 
			fontWeight: 400, 
			fontSize: '1rem', 
			lineHeight: '1.5rem', 
			letterSpacing: '0.5px' 
		},
		body2: { 
			fontWeight: 400, 
			fontSize: '0.875rem', 
			lineHeight: '1.25rem', 
			letterSpacing: '0.25px' 
		},
		button: { 
			fontFamily: fontFamilies.body, 
			fontWeight: 700, 
			fontSize: '0.875rem', 
			lineHeight: '1.5rem', 
			letterSpacing: '0.8px' 
		},
		caption: { 
			fontWeight: 400, 
			fontSize: '0.75rem', 
			lineHeight: '1rem', 
			letterSpacing: '0.4px' 
		},
		overline: { 
			fontWeight: 600, 
			fontSize: '0.625rem', 
			lineHeight: '1rem', 
			letterSpacing: '1.5px' 
		},
	},
	components: {
		MuiIconButton: {
			variants: [
				{
					props: { color: 'contrast' },
					style: ({ theme }) => ({
						backgroundColor: theme.palette.contrast.main,
						color: theme.palette.contrast.contrastText,
						'&:hover': { 
							backgroundColor: theme.palette.contrast.main, 
							filter: 'brightness(0.97)' 
						},
					}),
				},
				{
					props: { color: 'brand' },
					style: ({ theme }) => ({
						backgroundColor: theme.palette.brand.main,
						color: theme.palette.brand.contrastText,
						'&:hover': { 
							backgroundColor: theme.palette.brand.main, 
							filter: 'brightness(0.92)' 
						},
					}),
				},
			],
		},
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: {
				root: {
					borderRadius: 999,
					textTransform: 'none',
					paddingInline: '24px',
					paddingBlock: '10px',
				},
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				// Ativo/concluído em azul de ação; etapas futuras em cinza.
				root: ({ theme }) => ({
					color: c.papel[500],
					'&.Mui-active, &.Mui-completed': {
						color: theme.palette.info.main,
					},
				}),
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: ({ theme }) => ({
					marginTop: 8,
					fontWeight: 500,
					fontSize: 14,
					letterSpacing: '0.1px',
					color: theme.palette.text.primary,
					'&.Mui-active, &.Mui-completed': {
						fontWeight: 500,
					},
				}),
			},
		},
	},
})