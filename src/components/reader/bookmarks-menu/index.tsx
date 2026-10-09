import { useState } from 'react'
import { IconButton, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Bookmark } from '@/types/reader-types'

interface Props {
    bookmarks: Bookmark[]
    onSelect: (bookmark: Bookmark) => void
    onRemove: (id: string) => void
    color?: string
}

export default function BookmarksMenu({ bookmarks, onSelect, onRemove, color }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const close = () => setAnchorEl(null)

    return (
        <>
            <Tooltip title="Páginas marcadas">
                <IconButton
                    aria-label={`Páginas marcadas (${bookmarks.length})`}
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ color: color ?? 'inherit' }}
                >
                    <BookmarksIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={close} slotProps={{ paper: { sx: { minWidth: 220 } } }}>
                {bookmarks.length === 0 ? (
                    <MenuItem disabled>
                        <Typography variant="body2">Nenhuma página marcada</Typography>
                    </MenuItem>
                ) : (
                    bookmarks.map((b) => (
                        <MenuItem
                            key={b.id}
                            onClick={() => {
                                onSelect(b)
                                close()
                            }}
                            sx={{ gap: 2, justifyContent: 'space-between' }}
                        >
                            <ListItemText primary={b.label} />
                            <DeleteIcon
                                fontSize="small"
                                role="button"
                                aria-label={`Remover ${b.label}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemove(b.id)
                                }}
                                sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                            />
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    )
}