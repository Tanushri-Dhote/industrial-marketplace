import {
	Box,
	Flex,
	HStack,
	Text,
	Button,
	IconButton,
	Container,
	Icon,
	VStack,
	useColorModeValue,
	Divider,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	DrawerCloseButton,
	useDisclosure,
} from "@chakra-ui/react";

import {
	FaPowerOff,
	FaTachometerAlt,
	FaFileAlt,
	FaUser,
	FaBars,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import Clock from "../common/Clock";

export default function AdminHeader({ user, onLogout }) {
	const accentColor = "#D90404";

	const {
		isOpen: isMenuOpen,
		onOpen: onMenuOpen,
		onClose: onMenuClose,
	} = useDisclosure();

	const headerBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.900", "white");
	const navHover = useColorModeValue("gray.100", "gray.700");

	const userPillBg = useColorModeValue("orange.50", "gray.700");
	const userPillText = useColorModeValue("orange.900", "orange.200");

	return (
		<>
			<Box as="nav" width="100%">
				{/* ==================== ADMIN HEADER ==================== */}
				<Box
					bg={headerBg}
					borderBottom="2px solid"
					borderColor={useColorModeValue("#D90404", "gray.700")}
					py={3}
					px={4}
					boxShadow="sm"
				>
					<Container maxW="container.xl" mx="auto" px={0}>
						<Flex align="center" justify="space-between" gap={4}>
							{/* ==================== LEFT LOGO ==================== */}
							<Link to="/">
								<HStack
									spacing={3}
									_hover={{ opacity: 0.8 }}
									transition="opacity 0.2s"
								>
									<Box
										h={{ base: "45px", md: "70px" }}
										w={{ base: "120px", md: "180px" }}
										borderRadius={{ base: "xl", md: "2xl" }}
										display="flex"
										alignItems="center"
										justifyContent="center"
									>
										<img
											src="/logo.png"
											alt="Re-Conditioned Engine Logo"
											style={{
												width: "90%",
												height: "90%",
												objectFit: "contain",
												display: "block",
											}}
										/>
									</Box>
								</HStack>
							</Link>

							{/* ==================== CLOCK ==================== */}
							<HStack
								spacing={2}
								display={{ base: "none", lg: "flex" }}
								ml="auto"
								mr="auto"
							>
								<Clock />
							</HStack>

							{/* ==================== MOBILE MENU BUTTON ==================== */}
							<IconButton
								display={{ base: "flex", lg: "none" }}
								icon={<FaBars />}
								aria-label="Menu"
								onClick={onMenuOpen}
								variant="ghost"
								fontSize="20px"
							/>

							{/* ==================== DESKTOP RIGHT SECTION ==================== */}
							<HStack
								spacing={4}
								ml="auto"
								display={{ base: "none", lg: "flex" }}
							>
								{/* USER PILL */}
								<HStack
									bg={userPillBg}
									px={4}
									py={2}
									borderRadius="full"
									border="1px solid"
									borderColor={useColorModeValue(
										"orange.200",
										"gray.600"
									)}
									spacing={2}
								>
									<Icon as={FaUser} color={userPillText} boxSize={3} />

									<VStack spacing={0} align="flex-start">
										<Text
											fontSize="12px"
											fontWeight="700"
											color={userPillText}
										>
											{user?.name || "Admin User"}
										</Text>

										<Text
											fontSize="10px"
											color={useColorModeValue(
												"orange.600",
												"orange.300"
											)}
										>
											{user?.role || "Administrator"}
										</Text>
									</VStack>

									<Divider
										orientation="vertical"
										h={6}
										borderColor={useColorModeValue(
											"orange.300",
											"gray.500"
										)}
									/>

									<IconButton
										icon={<FaPowerOff />}
										aria-label="Logout"
										size="sm"
										variant="ghost"
										color="red.500"
										onClick={onLogout}
										_hover={{
											bg: "red.50",
											color: "red.700",
										}}
										borderRadius="full"
										fontSize="14px"
										transition="all 0.2s"
									/>
								</HStack>

								{/* NAVIGATION */}
								<HStack spacing={{ base: 1, sm: 2 }}>
									<NavLink
										icon={FaTachometerAlt}
										label="Admin"
										to="/admin"
										accentColor={accentColor}
										navHover={navHover}
									/>

									<NavLink
										icon={FaFileAlt}
										label="Quote"
										to="/create-quote"
										isHighlight
										accentColor={accentColor}
										navHover={navHover}
									/>

									<NavLink
										icon={FaUser}
										label="Account"
										to="/account"
										accentColor={accentColor}
										navHover={navHover}
									/>
								</HStack>
							</HStack>
						</Flex>
					</Container>
				</Box>
			</Box>

			{/* ==================== MOBILE DRAWER ==================== */}
			<Drawer
				isOpen={isMenuOpen}
				placement="right"
				onClose={onMenuClose}
			>
				<DrawerOverlay />

				<DrawerContent maxW="280px">
					<DrawerCloseButton />

					<DrawerBody pt={16}>
						<VStack spacing={4} align="stretch">
							{/* USER INFO */}
							<Box
								bg="gray.50"
								p={4}
								borderRadius="xl"
								border="1px solid"
								borderColor="gray.200"
							>
								<Text fontWeight="700">
									{user?.name || "Admin User"}
								</Text>

								<Text fontSize="sm" color="gray.500">
									{user?.role || "Administrator"}
								</Text>
							</Box>

							{/* MOBILE NAV */}
							<NavLink
								icon={FaTachometerAlt}
								label="Admin"
								to="/admin"
								accentColor={accentColor}
								navHover={navHover}
							/>

							<NavLink
								icon={FaFileAlt}
								label="Quote"
								to="/create-quote"
								isHighlight
								accentColor={accentColor}
								navHover={navHover}
							/>

							<NavLink
								icon={FaUser}
								label="Account"
								to="/account"
								accentColor={accentColor}
								navHover={navHover}
							/>

							{/* LOGOUT */}
							<Button
								leftIcon={<FaPowerOff />}
								colorScheme="red"
								variant="outline"
								onClick={onLogout}
							>
								Logout
							</Button>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}

function NavLink({
	icon,
	label,
	to,
	isHighlight,
	accentColor,
	navHover,
}) {
	return (
		<Link to={to}>
			<Button
				variant={isHighlight ? "solid" : "ghost"}
				bg={isHighlight ? accentColor : "transparent"}
				color={isHighlight ? "white" : "inherit"}
				size="sm"
				fontSize="13px"
				fontWeight="700"
				display="flex"
				gap={2}
				alignItems="center"
				borderRadius="lg"
				px={4}
				py={2}
				leftIcon={<Icon as={icon} boxSize={4} />}
				_hover={{
					bg: isHighlight ? "#c90303" : navHover,
					transform: "translateY(-1px)",
				}}
				transition="all 0.2s"
				textTransform="capitalize"
				w="100%"
				justifyContent="flex-start"
			>
				{label}
			</Button>
		</Link>
	);
}