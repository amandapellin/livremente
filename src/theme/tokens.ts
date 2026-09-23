// Tokens do design system (Figma) em escalas tonais.
export const colors = {
	// Azul institucional (marca)
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
	// Azul de ação 
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
	// Accent dourado
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
	goldContrast: '#171A22', // palette/accent/contrastText
	// Neutros "papel"
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
	divider: '#0000001f', // palette/divider
	// Superfície de leitura escura (único token escuro do DS)
	leitura: 
		{ 
			surfaceEscuro: '#14161C' 
		},
	// Semânticos — valor não exposto nas telas; confirmar no Figma
	error: '#D32F2F',
	info: '#1351B4', // usa o azul de ação
} as const

export const fontFamilies = {
	heading: '"Lora", Georgia, serif',
	body: '"Lexend", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const

// Raios de canto recorrentes que não seguem a escala base (`shape.borderRadius`).
export const radii = {
	section: '6px', // cards de seção "outlined" (perfil)
	card: '12px', // cards maiores e caixas de destaque (cadastro, landing, LGPD)
} as const

// Fundo do painel de marca: overlay azul institucional (primary[900] a 78%) sobre
// a imagem do hero. Reutilizado na landing e no login.
export const heroBackground = `linear-gradient(rgba(20,38,92,0.78), rgba(20,38,92,0.78)), url('/hero-landing.jpg')`