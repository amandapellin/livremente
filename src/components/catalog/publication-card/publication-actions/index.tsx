import { BookmarkAddOutlined } from "@mui/icons-material"
import { Button, Stack } from "@mui/material"
import { NavLink } from "react-router"

interface Props {
    to: string
    onAddToShelf?: () => void
}

export default function PublicationActions({ to, onAddToShelf }: Props) {
    return (
        <Stack 
            sx={{
                gap: 1.5,
                justifyContent: 'center',
                flexShrink: 0,
                width: 124
            }}
        >
            <Button component={NavLink} to={to} variant="contained" color="secondary" fullWidth>
                Detalhes
            </Button>
            <Button 
                variant="outlined" 
                color="inherit" 
                fullWidth 
                startIcon={<BookmarkAddOutlined />}
                onClick={onAddToShelf}
            >
                Estante
            </Button>
        </Stack>
    )
}