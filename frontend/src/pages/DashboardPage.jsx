import React, { useState, useEffect, useCallback } from "react";
import {
	Box,
	Flex,
	HStack,
	VStack,
	Text,
	Heading,
	Icon,
	Badge,
	Button,
	Avatar,
	Tooltip,
	Divider,
	useColorModeValue,
	Spinner,
	SimpleGrid,
	useBreakpointValue,
	IconButton,
	Drawer,
	Center,
	DrawerBody,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import {
	Users,
	LayoutGrid,
	Server,
	Package,
	BookOpen,
	MessageSquare,
	DollarSign,
	Menu,
	RefreshCcw,
	LogOut,
	Activity,
	TrendingUp,
	TrendingDown,
	ChevronRight,
	Home,
	Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "sonner";
import API from "../services/api";

// Modules
import UsersModule from "../components/dashboard/UsersModule";
import WebsitesModule from "../components/dashboard/WebsitesModule";
import EnginesModule from "../components/dashboard/EnginesModule";
import BlogsModule from "../components/dashboard/BlogsModule";
import LeadsModule from "../components/dashboard/LeadsModule";
import QuotesModule from "../components/dashboard/QuotesModule";

// ─── Constants ─────────────────────────────────────────────────────────────
const ACCENT = "#D90404";
const SIDEBAR_BG = "#0F172A";
const SIDEBAR_W = "260px";

const mapRoleToUI = (role) =>
	({
		super_admin: "Super Admin",
		admin: "Admin",
		website_manager: "Website Admin",
		sales_manager: "Sales Manager",
		viewer: "Viewer",
	})[role] || role;

const roleColor = (role) =>
	({
		"Super Admin": "red",
		Admin: "orange",
		"Website Admin": "purple",
		"Sales Manager": "blue",
		Viewer: "gray",
	})[role] || "teal";

const getGreeting = () => {
	const h = new Date().getHours();
	if (h < 12) return "Good Morning";
	if (h < 18) return "Good Afternoon";
	return "Good Evening";
};

// ─── All Module Definitions ─────────────────────────────────────────────────
const ALL_MODULES = [
	{
		id: "admins",
		name: "Admins & Staff",
		icon: Users,
		roles: ["super_admin", "admin"],
		component: UsersModule,
	},
	{
		id: "users",
		name: "Customers & Users",
		icon: Users,
		roles: ["super_admin", "admin"],
		component: UsersModule,
	},
	{
		id: "websites",
		name: "Sites & Tenants",
		icon: Server,
		roles: ["super_admin", "admin"],
		component: WebsitesModule,
	},
	{
		id: "engines",
		name: "Products",
		icon: Package,
		roles: ["super_admin", "admin", "website_manager", "viewer"],
		component: EnginesModule,
	},
	{
		id: "blogs",
		name: "Blogs",
		icon: BookOpen,
		roles: ["super_admin", "admin", "website_manager"],
		component: BlogsModule,
	},
	{
		id: "leads",
		name: "Leads",
		icon: MessageSquare,
		roles: ["super_admin", "admin", "website_manager", "sales_manager", "viewer"],
		component: LeadsModule,
	},
	{
		id: "quotes",
		name: "Quotes",
		icon: DollarSign,
		roles: ["super_admin", "admin", "website_manager", "sales_manager", "viewer"],
		component: QuotesModule,
	},
];

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, change, color, onClick, icon }) {
	const cardBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.900", "white");

	return (
		<Box
			bg={cardBg}
			p={6}
			borderRadius="3xl"
			boxShadow="0 10px 40px -10px rgba(0,0,0,0.05)"
			border="1px solid"
			borderColor={useColorModeValue("gray.50", "gray.700")}
			cursor={onClick ? "pointer" : "default"}
			onClick={onClick}
			transition="all 0.3s cubic-bezier(.4,0,.2,1)"
			_hover={
				onClick
					? {
							transform: "translateY(-5px)",
							boxShadow: "0 20px 60px -15px rgba(0,0,0,0.1)",
							borderColor: color,
						}
					: {}
			}
			position="relative"
			overflow="hidden"
		>
			<HStack justify="space-between" align="flex-start" mb={4}>
				<VStack align="flex-start" spacing={0}>
					<Text fontSize="13px" fontWeight="700" color="gray.400" letterSpacing="0.5px">
						{label}
					</Text>
					<Text fontSize="32px" fontWeight="900" color={textColor} letterSpacing="-1px">
						{value}
					</Text>
				</VStack>

				{icon && (
					<Center bg={`${color}15`} p={3} borderRadius="2xl" color={color}>
						<Icon as={icon} size={24} />
					</Center>
				)}
			</HStack>

			<HStack spacing={2}>
				{change && (
					<Badge
						bg={`${color}10`}
						color={color}
						px={3}
						py={1}
						borderRadius="full"
						fontSize="11px"
						fontWeight="800"
						display="flex"
						alignItems="center"
					>
						<Activity size={12} style={{ marginRight: "4px" }} />
						{change}
					</Badge>
				)}
				{!change && (
					<Text fontSize="11px" color="gray.400" fontWeight="600">
						Current dynamic status
					</Text>
				)}
			</HStack>

			{/* Subtle bottom progress line */}
			<Box position="absolute" bottom={0} left={0} h="4px" bg={`${color}20`} w="full">
				<Box h="full" bg={color} w="40%" borderRadius="full" />
			</Box>
		</Box>
	);
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
function NavItem({ module, isActive, onClick }) {
	return (
		<Button
			w="full"
			justifyContent="flex-start"
			leftIcon={<Icon as={module.icon} size={18} />}
			variant="ghost"
			onClick={onClick}
			bg={isActive ? "rgba(217,4,4,0.15)" : "transparent"}
			color={isActive ? ACCENT : "gray.400"}
			borderLeft={isActive ? `3px solid ${ACCENT}` : "3px solid transparent"}
			borderRadius="lg"
			h="44px"
			px={4}
			fontSize="14px"
			fontWeight={isActive ? "700" : "500"}
			_hover={{ bg: "rgba(255,255,255,0.06)", color: "white" }}
			transition="all 0.15s"
		>
			{module.name}
		</Button>
	);
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ modules, activeModule, onSelect, user, userRole, onLogout }) {
	const navigate = useNavigate();
	return (
		<Flex
			direction="column"
			bg={SIDEBAR_BG}
			w={SIDEBAR_W}
			h="100vh"
			position="fixed"
			top={0}
			left={0}
			zIndex={100}
			py={6}
			px={4}
			overflowY="auto"
		>
			{/* Logo */}
			<HStack
				spacing={3}
				mb={8}
				px={2}
				cursor="pointer"
				onClick={() => onSelect(modules[0]?.id || "leads")}
			>
				<Box bg={ACCENT} p="6px" borderRadius="lg">
					<Package color="white" size={20} />
				</Box>
				<VStack align="flex-start" spacing={0}>
					<Text fontSize="15px" fontWeight="900" color="white" lineHeight="1">
						All Engine
					</Text>
					<Text fontSize="11px" color={ACCENT} fontWeight="700" letterSpacing="2px">
						4 YOU
					</Text>
				</VStack>
			</HStack>

			{/* User Info */}
			<Box
				bg="rgba(255,255,255,0.05)"
				borderRadius="xl"
				p={3}
				mb={6}
				border="1px solid rgba(255,255,255,0.08)"
			>
				<HStack spacing={3}>
					<Avatar size="sm" name={user?.name} bg={ACCENT} color="white" />
					<VStack align="flex-start" spacing={0} flex={1} minW={0}>
						<Text fontSize="13px" fontWeight="700" color="white" noOfLines={1}>
							{user?.name || "User"}
						</Text>
						<Badge colorScheme={roleColor(userRole)} fontSize="10px" px={2} borderRadius="full">
							{userRole}
						</Badge>
					</VStack>
				</HStack>
			</Box>

			{/* Nav */}
			<Text fontSize="10px" fontWeight="800" color="gray.600" letterSpacing="2px" mb={3} px={2}>
				ADMINISTRATION
			</Text>
			<VStack align="stretch" spacing={1} flex={1}>
				{modules.map((m) => (
					<NavItem
						key={m.id}
						module={m}
						isActive={activeModule === m.id}
						onClick={() => onSelect(m.id)}
					/>
				))}
			</VStack>

			<Divider borderColor="whiteAlpha.100" mb={4} />

			{/* Bottom Actions */}
			<VStack align="stretch" spacing={1}>
				<Button
					w="full"
					justifyContent="flex-start"
					leftIcon={<Home size={18} />}
					variant="ghost"
					color="gray.400"
					onClick={() => navigate("/")}
					h="40px"
					px={4}
					fontSize="13px"
					_hover={{ bg: "rgba(255,255,255,0.06)", color: "white" }}
				>
					View Website
				</Button>
				<Button
					w="full"
					justifyContent="flex-start"
					leftIcon={<LogOut size={18} />}
					variant="ghost"
					color="gray.400"
					onClick={onLogout}
					h="40px"
					px={4}
					fontSize="13px"
					_hover={{ bg: "rgba(255,255,255,0.06)", color: ACCENT }}
				>
					Logout
				</Button>
			</VStack>
		</Flex>
	);
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage({ defaultModule }) {
	const { user, setUser } = useUser();
	const navigate = useNavigate();
	const [activeModule, setActiveModule] = useState(defaultModule || "users");
	const [stats, setStats] = useState(null);
	const [statsLoading, setStatsLoading] = useState(true);
	const { isOpen: isMobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();
	const isMobile = useBreakpointValue({ base: true, lg: false });

	const bgColor = useColorModeValue("#F8FAFC", "#0A0F1E");

	// Derive role
	const rawRole = user?.role || JSON.parse(localStorage.getItem("user") || "{}")?.role || "viewer";
	const userRole = mapRoleToUI(rawRole);
	const currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");

	// Filter modules by role
	const filteredModules = ALL_MODULES.filter((m) => m.roles.includes(rawRole));

	// Fetch stats
	const fetchStats = useCallback(async () => {
		setStatsLoading(true);
		try {
			const res = await API.get("/stats");
			setStats(res.data?.data || res.data || {});
		} catch (e) {
			console.error("Stats fetch error:", e);
			toast.error(e.response?.data?.message || "Failed to load dashboard stats");
		} finally {
			setStatsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	// Keep active module valid for current role; do not force defaultModule after initial load.
	useEffect(() => {
		if (filteredModules.length && !filteredModules.find((m) => m.id === activeModule)) {
			setActiveModule(filteredModules[0].id);
		}
	}, [activeModule, filteredModules]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		toast.success("Logged out successfully");
		navigate("/login");
	};

	const ActiveModuleObj = filteredModules.find((m) => m.id === activeModule) || filteredModules[0];
	const ActiveComponent = ActiveModuleObj?.component;

	const sidebarProps = {
		modules: filteredModules,
		activeModule,
		onSelect: (id) => {
			setActiveModule(id);
			onMobileClose();
		},
		user: currentUser,
		userRole,
		onLogout: handleLogout,
	};

	const statsData = [
		{
			label: "Employees",
			value: statsLoading ? "..." : (stats?.employees ?? "0"),
			change: statsLoading ? null : "Tenant scoped",
			color: "#6366F1",
			module: "admins",
			icon: Users,
		},
		{
			label: "Leads",
			value: statsLoading ? "..." : (stats?.leads ?? "0"),
			change: statsLoading
				? null
				: `${stats?.statusCounts?.new ?? 0} New / ${stats?.statusCounts?.contacted ?? 0} Contacted`,
			color: "#D90404",
			module: "leads",
			icon: Activity,
		},
		{
			label: "Websites",
			value: statsLoading ? "..." : (stats?.websites ?? "0"),
			change: statsLoading ? null : "Managed tenants",
			color: "#10B981",
			module: "websites",
			icon: Server,
		},
		{
			label: "Products",
			value: statsLoading ? "..." : (stats?.products ?? "0"),
			change: statsLoading ? null : "Catalog inventory",
			color: "#0EA5E9",
			module: "engines",
			icon: Package,
		},
		{
			label: "Blogs",
			value: statsLoading ? "..." : (stats?.blogs ?? "0"),
			change: statsLoading ? null : "Articles published",
			color: "#F59E0B",
			module: "blogs",
			icon: BookOpen,
		},
	];

	return (
		<Box bg={bgColor} minH="100vh">
			{/* Desktop Sidebar */}
			{!isMobile && <Sidebar {...sidebarProps} />}

			{/* Mobile Drawer */}
			{isMobile && (
				<Drawer isOpen={isMobileOpen} placement="left" onClose={onMobileClose} size="xs">
					<DrawerOverlay />
					<DrawerContent bg={SIDEBAR_BG} p={0}>
						<DrawerCloseButton color="white" />
						<DrawerBody p={0} pt={10}>
							<Sidebar {...sidebarProps} />
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			)}

			{/* Main Content */}
			<Box ml={isMobile ? 0 : SIDEBAR_W} minH="100vh" transition="margin 0.2s">
				{/* Top Bar */}
				<Box
					bg={useColorModeValue("white", "gray.900")}
					borderBottom="1px solid"
					borderColor={useColorModeValue("gray.100", "gray.800")}
					px={6}
					py={4}
					position="sticky"
					top={0}
					zIndex={10}
				>
					<Flex align="center" justify="space-between">
						<HStack spacing={4}>
							{isMobile && (
								<IconButton
									icon={<Menu />}
									variant="ghost"
									onClick={onMobileOpen}
									aria-label="Open menu"
								/>
							)}
							<VStack align="flex-start" spacing={0}>
								<Heading
									fontSize={{ base: "18px", md: "22px" }}
									fontWeight="800"
									color={useColorModeValue("gray.900", "white")}
									letterSpacing="-0.5px"
								>
									{getGreeting()}, {currentUser?.name?.split(" ")[0] || "User"} 👋
								</Heading>
								<Text fontSize="12px" color="gray.400" fontWeight="500">
									{ActiveModuleObj?.name} ·{" "}
									{new Date().toLocaleDateString("en-GB", {
										weekday: "long",
										day: "numeric",
										month: "long",
									})}
								</Text>
							</VStack>
						</HStack>

						<HStack spacing={3}>
							<Tooltip label="Refresh stats">
								<IconButton
									icon={<RefreshCcw size={14} />}
									variant="ghost"
									size="sm"
									onClick={fetchStats}
									isLoading={statsLoading}
									aria-label="Refresh"
								/>
							</Tooltip>
							<Box w="1px" h="20px" bg="gray.200" mx={2} />
							<Button
								leftIcon={<Settings size={14} />}
								variant="ghost"
								size="sm"
								fontSize="13px"
								display={{ base: "none", md: "flex" }}
							>
								Settings
							</Button>
						</HStack>
					</Flex>
				</Box>

				{/* Page Content */}
				<Box p={{ base: 4, md: 8 }} maxW="1600px">
					{/* Stats Grid */}
					<SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 5 }} spacing={6} mb={10}>
						{statsData.map((s) =>
							filteredModules.find((m) => m.id === s.module) ? (
								<StatCard key={s.label} {...s} onClick={() => setActiveModule(s.module)} />
							) : null,
						)}
					</SimpleGrid>

					{/* Active Module Content */}
					{ActiveComponent ? (
						<ActiveComponent user={currentUser} role={rawRole} moduleId={activeModule} />
					) : (
						<Flex justify="center" align="center" h="400px">
							<VStack spacing={4} color="gray.400">
								<LayoutGrid size={48} />
								<Text fontSize="18px" fontWeight="600">
									No module selected
								</Text>
							</VStack>
						</Flex>
					)}
				</Box>
			</Box>
		</Box>
	);
}
