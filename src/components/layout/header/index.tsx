import { useState } from "react";
import { NavLink } from "react-router";
import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
	Toolbar,
	Tooltip,
	Typography,
	useColorScheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { colors, fontFamilies } from "@/theme/tokens";

const navItems = [
	{ label: "Início", to: "/" },
	{ label: "Busca", to: "/catalogo" },
	{ label: "Minha Estante", to: "/estante" },
	{ label: "Recomendações", to: "/recomendacoes" },
];

function ColorModeToggle() {
	const { mode, systemMode, setMode } = useColorScheme();
	const isDark = (mode === "system" ? systemMode : mode) === "dark";
	return (
		<Tooltip title={isDark ? "Modo claro" : "Modo escuro"}>
			<IconButton
				aria-label="Alternar tema claro/escuro"
				color="contrast"
				onClick={() => setMode(isDark ? "light" : "dark")}
			>
				{isDark ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>
		</Tooltip>
	);
}

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	const navLinkSx = {
		display: "flex",
		alignItems: "center",
		textDecoration: "none",
		fontFamily: fontFamilies.heading,
		fontWeight: 700,
		fontSize: 14,
		lineHeight: "20px",
		letterSpacing: "0.1px",
		color: "text.secondary",
		borderBottom: "2px solid transparent",
		pb: "6px",
		transition: "color .15s",
		"&:hover": { color: "text.primary" },
		"&.active": { color: "info.main", borderBottomColor: "info.main" },
	} as const;

	return (
		<>
			<AppBar
				position="sticky"
				elevation={0}
				sx={{
					bgcolor: "background.paper",
					color: "text.primary",
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Toolbar
					sx={{
						justifyContent: "space-between",
						gap: 3,
						minHeight: { xs: 64, md: 72 },
						px: { xs: 2, md: 3 },
					}}
				>
					{/* Esquerda: menu mobile + logo + navegação */}
					<Stack
						direction="row"
						sx={{ alignItems: "center", gap: { xs: 1, md: 3 }, minWidth: 0 }}
					>
						<IconButton
							aria-label="Abrir menu"
							onClick={() => setMenuOpen(true)}
							sx={{
								display: { xs: "inline-flex", md: "none" },
								color: "text.primary",
							}}
						>
							<MenuIcon />
						</IconButton>

						<Box
							component={NavLink}
							to="/"
							aria-label="LivreMente — início"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								textDecoration: "none",
							}}
						>
							<AutoStoriesIcon sx={{ fontSize: 32, color: "primary.main" }} />
							<Typography
								variant="h5"
								component="span"
								sx={{ whiteSpace: "nowrap" }}
							>
								<Box component="span" sx={{ color: colors.gold[600] }}>
									Livre
								</Box>
								<Box component="span" sx={{ color: "primary.main" }}>
									Mente
								</Box>
							</Typography>
						</Box>

						<Stack
							component="nav"
							direction="row"
							sx={{
								display: { xs: "none", md: "flex" },
								alignItems: "stretch",
								gap: 2,
							}}
						>
							{navItems.map((item) => (
								<Box
									key={item.to}
									component={NavLink}
									to={item.to}
									end={item.to === "/"}
									sx={navLinkSx}
								>
									{item.label}
								</Box>
							))}
						</Stack>
					</Stack>

					{/* Direita: ações */}
					<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
						<IconButton
							aria-label="Buscar"
							color="contrast"
							sx={{
								display: { xs: "none", sm: "inline-flex" },
							}}
						>
							<SearchIcon />
						</IconButton>
						<IconButton
							aria-label="Notificações"
							color="contrast"
							sx={{
								display: { xs: "none", sm: "inline-flex" },
							}}
						>
							<NotificationsNoneIcon />
						</IconButton>
						<ColorModeToggle />
						<IconButton
							aria-label="Conta"
							color="brand"
						>
							<AccountCircleIcon />
						</IconButton>
					</Stack>
				</Toolbar>
			</AppBar>

			{/* Menu mobile */}
			<Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
				<Box
					sx={{ width: 260 }}
					role="presentation"
					onClick={() => setMenuOpen(false)}
				>
					<List>
						{navItems.map((item) => (
							<ListItem key={item.to} disablePadding>
								<ListItemButton
									component={NavLink}
									to={item.to}
									end={item.to === "/"}
									sx={{
										"&.active .MuiListItemText-primary": {
											color: "info.main",
											fontWeight: 700,
										},
									}}
								>
									<ListItemText primary={item.label} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</>
	);
}
