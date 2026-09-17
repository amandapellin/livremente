export interface Opcao { value: string; label: string }

export const generoOptions: readonly Opcao[] = [
	{ value: 'female', label: 'Feminino' }, { value: 'male', label: 'Masculino' },
	{ value: 'non_binary', label: 'Não-binário' }, { value: 'other', label: 'Outro' },
	{ value: 'prefer_not_to_say', label: 'Prefiro não informar' },
]

export const idiomaOptions: readonly Opcao[] = [
	{ value: 'pt', label: 'Português' }, { value: 'en', label: 'Inglês' },
	{ value: 'es', label: 'Espanhol' }, { value: 'fr', label: 'Francês' }, { value: 'ru', label: 'Russo' },
]

export const materialOptions: readonly Opcao[] = [
	{ value: 'books', label: 'Livros' }, { value: 'scientific_articles', label: 'Artigos' },
]

export const categoriasLivros: readonly Opcao[] = [
	{ value: 'literature', label: 'Literatura' },
	{ value: 'science_technology', label: 'Ciência e Tecnologia' },
	{ value: 'history', label: 'História' },
	{ value: 'social_sciences', label: 'Ciências Sociais e Sociedade' },
	{ value: 'art_culture', label: 'Arte e Cultura' },
	{ value: 'religion_philosophy', label: 'Religião e Filosofia' },
	{ value: 'hobbies', label: 'Hobbies' },
	{ value: 'health_medicine', label: 'Saúde e Medicina' },
	{ value: 'education', label: 'Educação' },
]

export const generosLiterarios: readonly Opcao[] = [
	{ value: 'adventure', label: 'Aventura' },
	{ value: 'classics', label: 'Clássicos' },
	{ value: 'biographies', label: 'Biografias' },
	{ value: 'poetry', label: 'Poesia' },
	{ value: 'romance', label: 'Romance' },
	{ value: 'science_fiction_fantasy', label: 'Ficção Científica e Fantasia' },
	{ value: 'crime_thriller_mystery', label: 'Policial, Thriller e Mistério' },
	{ value: 'mythology', label: 'Mitologia' },
	{ value: 'drama', label: 'Teatro' },
	{ value: 'novels', label: 'Novelas' },
	{ value: 'short_stories', label: 'Contos' },
	{ value: 'children_young_adult', label: 'Infantil e Jovem Adulto' },
	{ value: 'humor', label: 'Humor' },
	{ value: 'other', label: 'Outros' },
]

export const areasArtigos: readonly Opcao[] = [
	{ value: 'physics', label: 'Física' },
	{ value: 'mathematics', label: 'Matemática' },
	{ value: 'computer_science', label: 'Ciência da Computação' },
	{ value: 'quantitative_biology', label: 'Biologia Quantitativa' },
	{ value: 'statistics', label: 'Estatística' },
	{ value: 'quantitative_finance', label: 'Finanças Quantitativas' },
	{ value: 'economics', label: 'Economia' },
	{ value: 'electrical_engineering', label: 'Engenharia Elétrica' },
]