import type { CadastroForm } from '@/schemas/register-schemas'

export interface StepProps {
	form: CadastroForm
	errors: Record<string, string>
	onField: (patch: Partial<CadastroForm>) => void
}
