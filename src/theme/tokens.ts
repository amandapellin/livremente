export const colors = {
	primary:
		{ 
			50: '#EEF2FB', 
			100: '#D3DDF3', 
			200: '#B5C5EA', 
			300: '#96ACE1', 
			400: '#7C97D9', 
			500: '#6383D2', 
			600: '#4A6ABB', 
			700: '#35529E', 
			800: '#1E3A8A', 
			900: '#14265C' 
		},
	acao: 
		{ 
			50: '#EAF1FC', 
			100: '#C9DCF6', 
			200: '#9DBFEE', 
			300: '#6E9FE4', 
			400: '#4A86DC', 
			500: '#2A6DD1', 
			600: '#1351B4', 
			700: '#0F4494', 
			800: '#0B3576', 
			900: '#07234E' 
		},
	gold: 
		{ 
			50: '#FFFBEA', 
			100: '#FFF3BF', 
			200: '#FFEA94', 
			300: '#FFE169', 
			400: '#FFDA48', 
			500: '#FFD500', 
			600: '#E6BF00', 
			700: '#BFA000',
			800: '#A88E00', 
			900: '#6B5A00' 
		},
	goldContrast: '#171A22',
	papel: 
		{ 
			50: '#FAFAFB', 
			100: '#F2F3F6', 
			200: '#E4E6EC', 
			300: '#CFD2DB', 
			400: '#A7ABB8', 
			500: '#8A8FA0', 
			600: '#5B6072', 
			700: '#434757', 
			800: '#2E323E', 
			900: '#171A22' 
		},
	white: '#FFFFFF',
	divider: '#0000001f',
	leitura: 
		{ 
			surfaceEscuro: '#14161C' 
		},
	error: '#D32F2F',
	info: '#1351B4',
} as const

export const fontFamilies = {
	heading: '"Lora", Georgia, serif',
	body: '"Lexend", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const

export const radii = {
	section: '6px',
	card: '12px',
} as const

export const heroBackground = `linear-gradient(rgba(20,38,92,0.78), rgba(20,38,92,0.78)), url('/hero-landing.jpg')`