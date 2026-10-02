import type { UserConsent } from '@/api/generated/model'

// TEMP: enquanto o backend não expõe consentimento/exclusão. Desligar ao integrar.
export const USE_PRIVACY_MOCK = true

// Estado em memória do consentimento (persiste durante a sessão de dev).
let consent: UserConsent = {
	lgpdConsent: true,
	marketingConsent: false,
	consentedAt: '2026-03-12T10:00:00Z',
}

export async function getConsentMock(): Promise<UserConsent> {
	await new Promise((r) => setTimeout(r, 200))
	return { ...consent }
}

export async function updateConsentMock(marketingConsent: boolean): Promise<UserConsent> {
	await new Promise((r) => setTimeout(r, 300))
	consent = { ...consent, marketingConsent }
	return { ...consent }
}

export async function deleteAccountMock(): Promise<void> {
	await new Promise((r) => setTimeout(r, 400))
}
