import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Box, Container, Heading, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";

const carMakes = [
	{ name: "Alfa Romeo", slug: "alfa-romeo" },
	{ name: "Audi", slug: "audi" },
	{ name: "BMW", slug: "bmw" },
	{ name: "Citroen", slug: "citroen" },
	{ name: "Fiat", slug: "fiat" },
	{ name: "Ford", slug: "ford" },
	{ name: "Honda", slug: "honda" },
	{ name: "Hyundai", slug: "hyundai" },
	{ name: "Isuzu", slug: "isuzu" },
	{ name: "Iveco", slug: "iveco" },
	{ name: "Jaguar", slug: "jaguar" },
	{ name: "Kia", slug: "kia" },
	{ name: "Land Rover", slug: "land-rover" },
	{ name: "Lexus", slug: "lexus" },
	{ name: "Mazda", slug: "mazda" },
	{ name: "Mercedes-Benz", slug: "mercedes-benz" },
	{ name: "MINI", slug: "mini" },
	{ name: "Mitsubishi", slug: "mitsubishi" },
	{ name: "Nissan", slug: "nissan" },
	{ name: "Peugeot", slug: "peugeot" },
	{ name: "Porsche", slug: "porsche" },
	{ name: "Range Rover", slug: "land-rover" },
	{ name: "Renault", slug: "renault" },
	{ name: "Seat", slug: "seat" },
	{ name: "Skoda", slug: "skoda" },
	{ name: "Subaru", slug: "subaru" },
	{ name: "Suzuki", slug: "suzuki" },
	{ name: "Toyota", slug: "toyota" },
	{ name: "Vauxhall", slug: "vauxhall" },
	{ name: "Volvo", slug: "volvo" },
	{ name: "Volkswagen", slug: "volkswagen" },
];

export default function CarMakeSelectorSection() {
	const navigate = useNavigate();
	const accentColor = "#D90404";

	const handleClick = (slug) => {
		navigate(`/brand/${slug}`);
	};

	return (
		<Box
			py={{ base: 14, md: 20 }}
			bg="linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)"
			position="relative"
			overflow="hidden"
		>
			<Box
				position="absolute"
				inset={0}
				pointerEvents="none"
				opacity={0.75}
				bgImage="radial-gradient(circle at 15% 20%, rgba(217, 4, 4, 0.08) 0, transparent 40%), radial-gradient(circle at 85% 85%, rgba(15, 23, 42, 0.08) 0, transparent 45%)"
			/>

			<Container maxW="container.xl" position="relative" zIndex={1}>
				<VStack spacing={{ base: 8, md: 12 }} align="stretch">
					<VStack spacing={4} textAlign="center" maxW="820px" mx="auto">
						<Badge
							bg="rgba(217, 4, 4, 0.1)"
							color={accentColor}
							border="1px solid"
							borderColor="rgba(217, 4, 4, 0.25)"
							px={4}
							py={1.5}
							borderRadius="full"
							textTransform="none"
							fontSize="12px"
							fontWeight="700"
							letterSpacing="0.2px"
						>
							Browse 30+ Trusted Car Brands
						</Badge>

						<Heading
							fontSize={{ base: "28px", md: "38px" }}
							fontWeight="800"
							color="#0F172A"
							lineHeight={{ base: 1.2, md: 1.15 }}
							letterSpacing="-0.4px"
						>
							Pick Your Car Make and
							<Text as="span" color={accentColor} ml={2}>
								Compare Engine Prices Fast
							</Text>
						</Heading>

						<Text maxW="680px" fontSize={{ base: "14px", md: "16px" }} color="gray.600">
							Tap any brand to explore matching engines, compare options, and get quick quotes from
							verified suppliers.
						</Text>
					</VStack>

					<SimpleGrid
						columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
						spacing={{ base: 3.5, md: 5 }}
						w="full"
					>
						{carMakes.map((make) => {
							const optimizedLogoUrl = `https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/${make.slug}.png`;
							const thumbLogoUrl = `https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/${make.slug}.png`;

							return (
								<Box
									key={make.name}
									onClick={() => handleClick(make.slug)}
									cursor="pointer"
									role="group"
									bg="white"
									border="1px solid"
									borderColor="gray.200"
									borderRadius="2xl"
									px={{ base: 3, md: 4 }}
									py={{ base: 4, md: 5 }}
									boxShadow="0 6px 20px rgba(15, 23, 42, 0.06)"
									textAlign="center"
									transition="all 0.25s ease"
									_hover={{
										transform: "translateY(-6px)",
										borderColor: "rgba(217, 4, 4, 0.45)",
										boxShadow: "0 14px 30px rgba(217, 4, 4, 0.16)",
									}}
								>
									<Box
										h={{ base: "82px", md: "96px" }}
										display="flex"
										alignItems="center"
										justifyContent="center"
										borderRadius="xl"
										bg="linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)"
										border="1px solid"
										borderColor="gray.100"
										mb={3.5}
										overflow="hidden"
									>
										<Image
											src={optimizedLogoUrl}
											fallbackSrc={thumbLogoUrl}
											alt={make.name}
											maxH={{ base: "66px", md: "78px" }}
											maxW="92%"
											objectFit="contain"
											transition="transform 0.25s ease"
											_groupHover={{ transform: "scale(1.05)" }}
											fallback={
												<Box
													w="42px"
													h="42px"
													borderRadius="full"
													bg="gray.200"
													color="gray.700"
													display="flex"
													alignItems="center"
													justifyContent="center"
													fontWeight="700"
													fontSize="12px"
												>
													{make.name.slice(0, 2).toUpperCase()}
												</Box>
											}
										/>
									</Box>

									<Text
										fontSize={{ base: "13px", md: "14px" }}
										fontWeight="700"
										color="gray.800"
										noOfLines={1}
									>
										{make.name}
									</Text>
								</Box>
							);
						})}
					</SimpleGrid>
				</VStack>
			</Container>
		</Box>
	);
}
