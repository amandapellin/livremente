import { NavLink } from 'react-router'
import { Box, IconButton, LinearProgress, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { colors } from '@/theme/tokens'

import ReaderSettings from '@/components/reader/reader-settings'
import SessionTimer from '@/components/reader/session-timer'
import { ReaderButton } from '@/components/reader/buttons'
import type { ReaderAlign, ReaderFont, ReaderPageType, ReaderSurface, ReaderTheme } from '@/types/reader-types'

interface Props {
	backTo: string
	title: string
	chapter: string
	progress: number
	sessionTime: string
	surface: ReaderSurface
	theme: ReaderTheme
	fontScale: number
	lineHeight: number
	fontFamily: ReaderFont
	textAlign: ReaderAlign
	pageType: ReaderPageType
	onThemeChange: (value: ReaderTheme) => void
	onFontScaleChange: (value: number) => void
	onLineHeightChange: (value: number) => void
	onFontFamilyChange: (value: ReaderFont) => void
	onTextAlignChange: (value: ReaderAlign) => void
	onPageTypeChange: (value: ReaderPageType) => void
}

export default function ReaderTopbar({
	backTo,
	title,
	chapter,
	progress,
	sessionTime,
	surface,
	theme,
	fontScale,
	lineHeight,
	fontFamily,
	textAlign,
	pageType,
	onThemeChange,
	onFontScaleChange,
	onLineHeightChange,
	onFontFamilyChange,
	onTextAlignChange,
	onPageTypeChange,
}: Props) {
	return (
		<Stack
			direction="row"
			sx={{
				gap: { xs: 1, md: 2 },
				alignItems: 'center',
				px: { xs: 1.5, md: 3 },
				minHeight: 64,
				flexShrink: 0,
				bgcolor: surface.background,
				color: surface.text,
				borderBottom: `1px solid ${surface.border}`,
			}}
		>
			<IconButton component={NavLink} to={backTo} aria-label="Voltar" sx={{ color: 'inherit' }}>
				<ArrowBackIcon />
			</IconButton>

			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography variant="h6" noWrap>{title}</Typography>
				{chapter && (
					<Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }} noWrap>
						{chapter}
					</Typography>
				)}
			</Box>

			<Stack
				direction="row"
				aria-label={`${progress}% lido`}
				sx={{ gap: 1, alignItems: 'center', px: { xs: 1, lg: 2 }, borderLeft: `1px solid ${surface.border}`, borderRight: `1px solid ${surface.border}` }}
			>
				<Typography variant="caption" sx={{ opacity: 0.7, whiteSpace: 'nowrap' }}>{progress}%</Typography>
				<LinearProgress
					variant="determinate"
					value={progress}
					sx={{ width: 120, height: 4, borderRadius: 999, backgroundColor: surface.border, display: { xs: 'none', md: 'block' }, '& .MuiLinearProgress-bar': { backgroundColor: colors.gold[500] } }}
				/>
			</Stack>

			<SessionTimer label={sessionTime} sx={{ display: { xs: 'none', md: 'flex' } }} />

			<ReaderSettings
				borderColor={surface.border}
				fontScale={fontScale}
				lineHeight={lineHeight}
				fontFamily={fontFamily}
				textAlign={textAlign}
				theme={theme}
				pageType={pageType}
				onFontScaleChange={onFontScaleChange}
				onLineHeightChange={onLineHeightChange}
				onFontFamilyChange={onFontFamilyChange}
				onTextAlignChange={onTextAlignChange}
				onThemeChange={onThemeChange}
				onPageTypeChange={onPageTypeChange}
			/>

			<ReaderButton
				borderColor={surface.border}
				startIcon={<EditNoteIcon />}
				title="Em breve"
				sx={{ display: { xs: 'none', md: 'inline-flex' } }}
			>
				Grifos e Anotações
			</ReaderButton>
		</Stack>
	)
}
