import { BookmarkAddedOutlined, BookmarkAddOutlined } from "@mui/icons-material"
import { Button, Stack } from "@mui/material"
import { NavLink } from "react-router"

interface Props {
    to: string
    onAddToShelf?: () => void
    /** A obra já está na estante → o botão vira confirmação ("Na estante"). */
    inShelf?: boolean
}

export default function PublicationActions({ to, onAddToShelf, inShelf }: Props) {
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
                variant={inShelf ? "contained" : "outlined"}
                color={inShelf ? "primary" : "inherit"}
                fullWidth
                startIcon={inShelf ? <BookmarkAddedOutlined /> : <BookmarkAddOutlined />}
                onClick={onAddToShelf}
                disabled={inShelf}
            >
                {inShelf ? "Na estante" : "Estante"}
            </Button>
        </Stack>
    )
}