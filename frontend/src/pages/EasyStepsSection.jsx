import React from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	SimpleGrid,
	Icon,
	Circle,
	Image,
	HStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch, FaHandshake, FaTruck } from "react-icons/fa";

const steps = [
	{
		number: "01",
		icon: FaSearch,
		title: "Enter Your Vehicle Details",
		description:
			"Provide your registration number or engine details so we can identify the right engine for your vehicle.",
		image:
			"https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1200&q=80",
	},
	{
		number: "02",
		icon: FaHandshake,
		title: "We Review Your Request",
		description:
			"Our team carefully reviews your enquiry and helps match you with the most suitable engine solution.",
		image:
			"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
	},
	{
		number: "03",
		icon: FaTruck,
		title: "Confirm & Get Delivery",
		description:
			"Once everything is confirmed, your engine is prepared for fast delivery or local fitting support.",
		image:
			"https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1200&q=80",
	},
];

export default function EasyStepsSection() {
	const accentColor = "#D90404";
	const cardBg = useColorModeValue("white", "gray.900");
	const lineColor = useColorModeValue("gray.200", "gray.700");
	const sectionBg = useColorModeValue(
		"linear-gradient(180deg, #fff8f6 0%, #ffffff 70%)",
		"linear-gradient(180deg, #171717 0%, #111111 70%)",
	);
	const headingColor = useColorModeValue("gray.900", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const cardBorder = useColorModeValue("gray.100", "whiteAlpha.200");
	const stepNumberMuted = useColorModeValue("gray.100", "whiteAlpha.300");

	return (
		<Box bgGradient={sectionBg} py={{ base: 14, md: 20 }}>
			<Container maxW="container.xl">
				<VStack spacing={{ base: 10, md: 14 }}>
					{/* Header */}
					<VStack spacing={4} textAlign="center" maxW="800px" mx="auto">
						<Text
							fontSize="14px"
							fontWeight="700"
							color={accentColor}
							letterSpacing="2px"
							textTransform="uppercase"
						>
							SUPER SIMPLE PROCESS
						</Text>

						<Heading
							fontSize={{ base: "26px", md: "42px" }}
							fontWeight="700"
							lineHeight="1.2"
							color={headingColor}
						>
							Get Your Perfect Engine in Just{" "}
							<Text as="span" color={accentColor}>
								3 Easy Steps
							</Text>
						</Heading>

						<Text fontSize={{ base: "14px", md: "18px" }} color={bodyColor} maxW="680px">
							From searching to delivery — we’ve made buying the right engine faster, transparent,
							and hassle-free.
						</Text>
					</VStack>

					{/* Steps Grid */}
					<Box w="full" maxW="1100px" mx="auto" position="relative">
						<SimpleGrid
							columns={{ base: 1, md: 3 }}
							spacing={{ base: 12, md: 10 }}
							position="relative"
						>
							{steps.map((step, index) => (
								<Box
									key={index}
									role="group"
									position="relative"
									zIndex={2}
									bg={cardBg}
									borderRadius="2xl"
									overflow="hidden"
									border="1px solid"
									borderColor={cardBorder}
									boxShadow="0 12px 40px rgba(0, 0, 0, 0.08)"
									transition="all 0.35s ease"
									_hover={{
										transform: "translateY(-8px)",
										boxShadow: "0 20px 48px rgba(0, 0, 0, 0.14)",
										borderColor: "rgba(217, 4, 4, 0.35)",
									}}
								>
									<Box position="relative" h="180px" overflow="hidden">
										<Image
											src={step.image}
											alt={step.title}
											w="full"
											h="full"
											objectFit="cover"
											transition="transform 0.45s ease"
											_groupHover={{ transform: "scale(1.05)" }}
										/>
										<Box
											position="absolute"
											inset={0}
											bgGradient="linear(to-t, blackAlpha.700, transparent)"
										/>

										<HStack position="absolute" top={4} left={4} spacing={3}>
											<Circle
												size="46px"
												bg={accentColor}
												color="white"
												fontSize="20px"
												fontWeight="700"
												boxShadow="0 10px 22px rgba(217, 4, 4, 0.45)"
											>
												{step.number}
											</Circle>

											<Circle size="38px" bg="white" color={accentColor} boxShadow="md">
												<Icon as={step.icon} boxSize={4} />
											</Circle>
										</HStack>

										<Text
											position="absolute"
											bottom={4}
											left={4}
											fontSize="12px"
											fontWeight="800"
											letterSpacing="0.12em"
											textTransform="uppercase"
											color="white"
										>
											Step {step.number}
										</Text>
									</Box>

									<VStack spacing={3} align="start" p={6} minH="200px">
										<Heading
											fontSize="28px"
											lineHeight="1"
											fontWeight="900"
											color={stepNumberMuted}
										>
											{step.number}
										</Heading>

										<Heading
											fontSize={{ base: "20px", md: "24px" }}
											fontWeight="700"
											color={headingColor}
											lineHeight="1.25"
										>
											{step.title}
										</Heading>

										<Text fontSize={{ base: "14px", md: "15px" }} color={bodyColor} lineHeight="1.7">
											{step.description}
										</Text>
									</VStack>

									<Box h="5px" bgGradient="linear(to-r, #D90404, #ff7b00)" />
								</Box>
							))}

							{/* Connecting Line */}
							<Box
								display={{ base: "none", md: "block" }}
								position="absolute"
								top="23px"
								left="16%"
								right="16%"
								h="4px"
								bg={lineColor}
								zIndex={1}
								borderRadius="full"
								opacity={0.8}
							/>
						</SimpleGrid>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
}
