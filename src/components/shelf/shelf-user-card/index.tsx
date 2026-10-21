import { Avatar, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useGetApiUsersMe } from '@/api/generated/endpoints'
import { generoOptions } from '@/schemas/category-schemas'
import { colors } from '@/theme/tokens'

const initialsOf = (name: string): string =>
	name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? '')
		.join('')

const genderLabels = new Map(generoOptions.map((o) => [o.value, o.label]))
const genderLabelOf = (gender?: string): string | null =>
	gender ? (genderLabels.get(gender) ?? null) : null

// Idade em anos a partir da data de nascimento (yyyy-MM-dd); null se inválida.
const ageFrom = (iso?: string): number | null => {
	if (!iso) return null
	const birth = new Date(iso)
	if (Number.isNaN(birth.getTime())) return null
	const now = new Date()
	let age = now.getFullYear() - birth.getFullYear()
	const beforeBirthday = now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
	if (beforeBirthday) age--
	return age >= 0 && age < 150 ? age : null
}

/**
 * Card do usuário na sidebar da estante (#27): avatar (imagem ou iniciais), nome e,
 * no lugar da bio do Figma (evitando coluna nova no banco), gênero · idade + e-mail —
 * campos que já existem em `users` e agora vêm no `/api/users/me`.
 */
export default function ShelfUserCard() {
	const profileQuery = useGetApiUsersMe()
	const profile = profileQuery.data?.status === 200 ? profileQuery.data.data : undefined

	const genderAge = [genderLabelOf(profile?.gender), ageFrom(profile?.birthDate) !== null ? `${ageFrom(profile?.birthDate)} anos` : null]
		.filter(Boolean)
		.join(' · ')

	return (
		<Paper variant="section" sx={{ p: 3 }}>
			<Stack sx={{ alignItems: 'center', gap: 1 }}>
				{profileQuery.isLoading ? (
					<>
						<Skeleton variant="circular" width={80} height={80} />
						<Skeleton variant="text" width={120} />
						<Skeleton variant="text" width={160} />
					</>
				) : (
					<>
						<Avatar
							src={profile?.avatarUrl ?? undefined}
							sx={{ width: 80, height: 80, bgcolor: colors.gold[500], color: colors.goldContrast, fontSize: 28, fontWeight: 600 }}
						>
							{initialsOf(profile?.name ?? '')}
						</Avatar>
						<Typography variant="h6" component="p" sx={{ color: 'primary.main' }}>
							{profile?.name ?? 'Minha conta'}
						</Typography>
						<Stack sx={{ alignItems: 'center', gap: 0.25 }}>
							{genderAge ? (
								<Typography variant="caption" sx={{ color: 'text.secondary' }}>
									{genderAge}
								</Typography>
							) : null}
							{profile?.email ? (
								<Typography
									variant="caption"
									sx={{ color: 'text.secondary', textAlign: 'center', wordBreak: 'break-word' }}
								>
									{profile.email}
								</Typography>
							) : null}
						</Stack>
					</>
				)}
			</Stack>
		</Paper>
	)
}
