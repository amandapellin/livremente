import { Alert, Box, Button, Checkbox, Divider, FormControlLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { Controller, type Control, type UseFormHandleSubmit, type FieldErrors } from "react-hook-form";
import { NavLink } from "react-router";
import { colors } from '@/theme/tokens'
import { type LoginForm } from '@/schemas/login-schemas'

interface LoginFormProps {
    control: Control<LoginForm>;
    handleSubmit: UseFormHandleSubmit<LoginForm>;
    onSubmit: (values: LoginForm) => void;
    errors: FieldErrors<LoginForm>;
    submitError: string | null;
    login: {
        isPending: boolean;
    };
}

export default function LoginFormComponent({ control, handleSubmit, onSubmit, errors, submitError, login }: LoginFormProps) {
    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 3, sm: 6 },
                py: { xs: 6, md: 4 },
            }}
        >
            <Stack
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ width: '100%', maxWidth: 400, gap: 4 }}
            >
                <Stack sx={{ gap: 1 }}>
                    <Typography variant="h3" component="h1">
                        Entrar na conta
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Acesse para retomar suas leituras.
                    </Typography>
                </Stack>

                {submitError && <Alert severity="error">{submitError}</Alert>}

                <Stack sx={{ gap: 3 }}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="E-mail"
                                type="email"
                                required
                                fullWidth
                                autoComplete="email"
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Senha"
                                type="password"
                                required
                                fullWidth
                                autoComplete="current-password"
                                error={Boolean(errors.password)}
                                helperText={errors.password?.message}
                            />
                        )}
                    />
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                        <Controller
                            name="rememberMe"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                    label="Manter conectado"
                                />
                            )}
                        />
                        {/* TODO: fluxo de recuperação de senha (fora do escopo do RF02). */}
                        <Link
                            component="button"
                            type="button"
                            underline="always"
                            sx={{ color: colors.acao[700], fontSize: 14, whiteSpace: 'nowrap' }}
                        >
                            Esqueci a senha
                        </Link>
                    </Stack>
                </Stack>

                <Stack sx={{ gap: 4 }}>
                    <Button type="submit" variant="contained" size="large" fullWidth disabled={login.isPending}>
                        {login.isPending ? 'Entrando…' : 'Entrar'}
                    </Button>
                    <Divider>ou</Divider>
                    <Button
                        component={NavLink}
                        to="/cadastro"
                        variant="outlined"
                        color="inherit"
                        size="large"
                        fullWidth
                    >
                        Criar uma conta
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}