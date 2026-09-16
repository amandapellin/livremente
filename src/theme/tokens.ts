// Tokens extraídos das variáveis do Figma (coleção "livremente").
// Comentário ao lado = nome da variável no Figma.

export const colors = {
    // Azul institucional (marca)
    primary900: '#14265C',
    primary800: '#1E3A8A', // primary/800 == palette/primary/main
    primary700: '#35529E',
    primary600: '#4A6ABB',
    primary500: '#6383D2',
    primary400: '#7C97D9',
    primary300: '#96ACE1',
    primary200: '#B5C5EA',
    primary100: '#D3DDF3',
    primary50: '#EEF2FB',
    // Azul ação
    acao900: '#07234E',
    acao800: '#0B3576',
    acao700: '#0F4494',
    acao600: '#1351B4', //   acao/600 == palette/action/main, palette/text/link
    acao500: '#2A6DD1',
    acao400: '#4A86DC',
    acao300: '#6E9FE4',
    acao200: '#9DBFEE',
    acao100: '#C9DCF6',
    acao50: '#EAF1FC',
    // Accent dourado
    gold900: '#6B5A00',
    gold800: '#A88E00',
    gold700: '#BFA000',
    gold600: '#E6BF00',
    gold500: '#FFD500', //   gold/500 == palette/accent/main
    gold400: '#FFDA48',
    gold300: '#FFE169',
    gold200: '#FFEA94',
    gold100: '#FFF3BF',
    gold50: '#FFFBEA', //    gold/50
    goldContrast: '#171a22', // palette/accent/contrastText
    // Neutros "papel"
    papel900: '#171A22', //  papel/900 == palette/text/primary
    papel800: '#2E323E', //  papel/800
    papel700: '#434757', //  papel/700 == palette/text/secondary
    papel600: '#5B6072',
    papel500: '#8A8FA0',
    papel400: '#A7ABB8', //  papel/400
    papel300: '#CFD2DB', //  papel/300
    papel200: '#E4E6EC', //  papel/200
    papel100: '#F2F3F6', //  papel/100
    papel50: '#FAFAFB', //   papel/50
    white: '#ffffff', //     palette/background/paper, palette/primary/contrastText
    divider: '#0000001f', // palette/divider
    // Superfície de leitura escura (único token escuro do DS)
    leituraSurfaceEscuro: '#14161c', // leitura/surface-escuro
    // Semânticos — valor não exposto nas telas; confirmar no Figma
    errorMain: '#d32f2f', // palette/error/main (TODO confirmar)
    infoMain: '#1351b4', //  palette/info/main (usa o azul de ação)
} as const

export const fontFamilies = {
    heading: '"Lora", Georgia, serif',
    body: '"Lexend", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const