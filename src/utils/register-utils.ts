import type { CadastroForm } from '@/schemas/register-schemas'
import type { Gender, PublicationType, ReadingLanguage, RegisterRequest } from '@/api/generated/model'

export function buildPayload(form: CadastroForm): RegisterRequest {
	return {
		name: form.name.trim(),
		email: form.email.trim(),
		password: form.password,
		birthDate: form.birthDate,
		gender: form.gender as Gender,
		preferences: {
			languages: form.languages as ReadingLanguage[],
			publications: form.publications as PublicationType[],
			// A API recebe categorias e áreas num único array de slugs.
			categories: [...form.bookCategories, ...form.articleAreas],
			literaryGenres: form.literaryGenres,
		},
		lgpdConsent: form.lgpdConsent,
		marketingConsent: form.marketingConsent,
	}
}

