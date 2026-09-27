import { Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"

interface Props {
    label: string
    helper?: string
    children: ReactNode
}

export default function FilterSection({ label, helper, children }: Props) {
    return (
        <Stack sx={{ gap: 1 }}>
            <Typography variant="overline" sx={{ color: "text.secondary" }}> {label}</Typography>
            {helper && (
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {helper}
                </Typography>
            )}
            {children}
        </Stack>
    )
}