import React from "react";
import { Box, Container, Heading, Text, VStack, SimpleGrid, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";

const serviceAreas = [
	{ name: "England", icon: FaMapMarkerAlt },
	{ name: "Northern Ireland", icon: FaMapMarkerAlt },
	{ name: "Scotland", icon: FaMapMarkerAlt },
	{ name: "Wales", icon: FaMapMarkerAlt },
];

export default function ServiceAreasSection() {
	const accentColor = "#D90404";

	return (
		<Box bg="white" py={8}>
			<Container maxW="container.xl">
				<VStack spacing={8} align="center">
					{/* Header */}
					<VStack spacing={3} textAlign="center" maxW="680px">
						<Text
							fontSize="14px"
							fontWeight="700"
							color={accentColor}
							letterSpacing="1.5px"
							textTransform="uppercase"
						>
							OUR COVERAGE
						</Text>

						<Heading fontSize="28px" fontWeight="700" color="gray.800" lineHeight="1.2">
							We Serve in Following Major Areas
						</Heading>

						<Text fontSize="16px" color="gray.600" maxW="520px">
							We provide reliable engine delivery and fitting services across the United Kingdom
						</Text>
					</VStack>

					{/* Service Areas Grid - Reduced Card Size */}
					<Box w="full" maxW="780px" px={2.5}>
						<SimpleGrid
							columns={{ base: 2, sm: 2, md: 4 }}
							spacing={5} // Reduced spacing
							w="full"
						>
							{serviceAreas.map((area, index) => (
								<Box
									key={index}
									bg="#F8FAFC"
									border="1px solid"
									borderColor="gray.200"
									borderRadius="xl"
									p={6} // Reduced padding (was 8)
									textAlign="center"
									height="140px" // Fixed height for uniform cards
									display="flex"
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									transition="all 0.3s ease"
									_hover={{
										borderColor: accentColor,
										transform: "translateY(-3px)",
										boxShadow: "0 8px 15px rgba(255, 107, 0, 0.08)",
									}}
								>
									<Icon as={area.icon} w={8} h={8} color={accentColor} mb={3} />
									<Text
										fontSize="18px" // Slightly smaller font
										fontWeight="600"
										color="gray.800"
									>
										{area.name}
									</Text>
								</Box>
							))}
						</SimpleGrid>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
}
