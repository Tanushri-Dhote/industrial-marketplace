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
} from "@chakra-ui/react";
import { FaPowerOff, FaTachometerAlt, FaFileAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import Clock from "../common/Clock";

export default function AdminHeader({ user, onLogout }) {
	const accentColor = "#D90404";

	const headerBg = useColorModeValue("white", "gray.800");
	const headerBorder = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.900", "white");
	const navHover = useColorModeValue("gray.100", "gray.700");
	const userPillBg = useColorModeValue("orange.50", "gray.700");
	const userPillText = useColorModeValue("orange.900", "orange.200");

	return (
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
					<Flex align="center" justify="space-between" gap={6}>
						{/* Left: Logo & Name */}
						<Link to="/">
							<HStack spacing={3} _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
								<Box h="36px">
									<img
										src="/logo_engine.PNG"
										alt="All Engine 4 You Logo"
										style={{
											height: "100%",
											objectFit: "contain",
										}}
									/>
								</Box>
								<VStack align="flex-start" spacing={0}>
									<Text
										fontSize="16px"
										fontWeight="900"
										color={textColor}
										lineHeight="1.2"
										letterSpacing="-0.5px"
									>
										All Engine <span style={{ color: accentColor }}>4 You</span>
									</Text>
									<Text
										fontSize="11px"
										color="gray.500"
										fontWeight="700"
										textTransform="uppercase"
										letterSpacing="0.5px"
									>
										Dashboard
									</Text>
								</VStack>
							</HStack>
						</Link>

						{/* Center: Clock */}
						<HStack spacing={2} display={{ base: "none", lg: "flex" }} ml="auto" mr="auto">
							<Clock />
						</HStack>

						{/* Right: User Info & Actions */}
						<HStack spacing={4} ml="auto">
							{/* User Pill */}
							<HStack
								bg={userPillBg}
								px={4}
								py={2}
								borderRadius="full"
								border="1px solid"
								borderColor={useColorModeValue("orange.200", "gray.600")}
								display={{ base: "none", md: "flex" }}
								spacing={2}
							>
								<Icon as={FaUser} color={userPillText} boxSize={3} />
								<VStack spacing={0} align="flex-start">
									<Text fontSize="12px" fontWeight="700" color={userPillText}>
										{user?.name || "Admin User"}
									</Text>
									<Text fontSize="10px" color={useColorModeValue("orange.600", "orange.300")}>
										{user?.role || "Administrator"}
									</Text>
								</VStack>
								<Divider
									orientation="vertical"
									h={6}
									borderColor={useColorModeValue("orange.300", "gray.500")}
								/>
								<IconButton
									icon={<FaPowerOff />}
									aria-label="Logout"
									size="sm"
									variant="ghost"
									color="red.500"
									onClick={onLogout}
									_hover={{ bg: "red.50", color: "red.700" }}
									borderRadius="full"
									fontSize="14px"
									transition="all 0.2s"
								/>
							</HStack>

							{/* Nav Links with Icons */}
							<HStack spacing={1} ml={2}>
								<NavLink
									icon={FaTachometerAlt}
									label="Admin"
									to="/admin"
									isMobile={false}
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
	);
}

function NavLink({ icon, label, to, isHighlight, accentColor, navHover }) {
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
				px={3}
				py={2}
				leftIcon={<Icon as={icon} boxSize={4} />}
				_hover={{
					bg: isHighlight ? "#c90303" : navHover,
					transform: "translateY(-1px)",
				}}
				transition="all 0.2s"
				textTransform="capitalize"
			>
				{label}
			</Button>
		</Link>
	);
}
