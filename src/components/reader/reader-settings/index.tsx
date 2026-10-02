import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import { ReaderButton } from '@/components/reader/buttons'
import SettingsSection from './settings-section'
import SettingsSlider from './settings-slider'
import FontField from './font-field'
import AlignField from './align-field'
import PageColorField from './page-color-field'
import PageTypeField from './page-type-field'
import { FONT_SIZE, LINE_SPACING } from '@/constants/reader-const'
import type { ReaderFont, ReaderAlign, ReaderTheme, ReaderPageType } from '@/types/reader-types'

interface Props {
	borderColor: string
	fontScale: number
	lineHeight: number
	fontFamily: ReaderFont
	textAlign: ReaderAlign
	theme: ReaderTheme
	pageType: ReaderPageType
	onFontScaleChange: (value: number) => void
	onLineHeightChange: (value: number) => void
	onFontFamilyChange: (value: ReaderFont) => void
	onTextAlignChange: (value: ReaderAlign) => void
	onThemeChange: (value: ReaderTheme) => void
	onPageTypeChange: (value: ReaderPageType) => void
}

export default function ReaderSettings({
	borderColor,
	fontScale,
	lineHeight,
	fontFamily,
	textAlign,
	theme,
	pageType,
	onFontScaleChange,
	onLineHeightChange,
	onFontFamilyChange,
	onTextAlignChange,
	onThemeChange,
	onPageTypeChange,
}: Props) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<ReaderButton borderColor={borderColor} startIcon={<TuneIcon />} onClick={() => setOpen(true)}>
				Configurações
			</ReaderButton>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				fullWidth
				slotProps={{ paper: { sx: { maxWidth: 760, py: 1.5 } } }}
			>
				<DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pr: 1.5 }}>
					<Typography variant="h5">Configurações</Typography>
					<IconButton aria-label="Fechar" onClick={() => setOpen(false)} size="small">
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ px: 3, py: 3 }}>
					<Stack direction="row" sx={{ gap: 4 }}>
						<Stack sx={{ gap: 3 }}>
							<FontField value={fontFamily} onChange={onFontFamilyChange} />
							<SettingsSection title="Tamanho do texto">
								<SettingsSlider
									value={fontScale}
									min={FONT_SIZE.min}
									max={FONT_SIZE.max}
									step={FONT_SIZE.step}
									display={`${fontScale}%`}
									onChange={onFontScaleChange}
								/>
							</SettingsSection>
							<SettingsSection title="Entrelinha">
								<SettingsSlider
									value={lineHeight}
									min={LINE_SPACING.min}
									max={LINE_SPACING.max}
									step={LINE_SPACING.step}
									display={`${Math.round(lineHeight * 100)}%`}
									onChange={onLineHeightChange}
								/>
							</SettingsSection>
						</Stack>

						<Divider orientation="vertical" flexItem />

						<Stack sx={{ gap: 3 }}>
							<AlignField value={textAlign} onChange={onTextAlignChange} />
							<PageColorField value={theme} onChange={onThemeChange} />
							<PageTypeField value={pageType} onChange={onPageTypeChange} />
						</Stack>
					</Stack>
				</DialogContent>
			</Dialog>
		</>
	)
}
