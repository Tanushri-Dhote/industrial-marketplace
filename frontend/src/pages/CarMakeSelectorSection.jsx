import React, { useEffect, useState } from "react";
import {
	Badge,
	Box,
	Button,
	Center,
	Container,
	Flex,
	Heading,
	HStack,
	Image,
	SimpleGrid,
	Spinner,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const accentColor = "#D90404";
const surfaceColor = "#F3F5F8";

function EngineProductCard({ engine }) {
	return (
		<Box
			as={RouterLink}
			to={`/products/${engine._id}`}
			bg="white"
			borderRadius="14px"
			overflow="hidden"
			boxShadow="0 6px 16px rgba(10, 19, 36, 0.05)"
			transition="all 0.25s ease"
			_hover={{ transform: "translateY(-6px)", boxShadow: "0 12px 24px rgba(10, 19, 36, 0.08)" }}
			display="flex"
			flexDirection="column"
		>
			<Box position="relative" h={{ base: "134px", md: "148px" }} bg="gray.50">
				<Image
					src={engine.images?.[0] || engine.image}
					alt={engine.name}
					w="full"
					h="full"
					objectFit="cover"
				/>
				<Badge
					position="absolute"
					top={2}
					left={2}
					fontSize="8px"
					px={2}
					py={0.5}
					borderRadius="full"
					bg="rgba(10, 19, 36, 0.85)"
					color="white"
					textTransform="uppercase"
					letterSpacing="0.05em"
				>
					{engine.condition || "Used"}
				</Badge>
			</Box>

			<VStack
				align="start"
				spacing={1.5}
				px={{ base: 3, md: 3.5 }}
				py={{ base: 2.5, md: 3 }}
				w="full"
				flex="1"
			>
				<Text
					fontSize={{ base: "13px", md: "14px" }}
					fontWeight="800"
					color="gray.800"
					noOfLines={2}
					lineHeight="1.3"
					minH="36px"
				>
					{engine.name}
				</Text>

				<HStack spacing={1} fontSize="11px" color="gray.600" align="center" w="full" overflow="hidden">
					<Text fontWeight="700" flexShrink={0} whiteSpace="nowrap">Fits:</Text>
					<Text noOfLines={1} flexGrow={1}>{engine.model || "Universal Fit"}</Text>
					<Box w="3px" h="3px" borderRadius="full" bg="gray.400" flexShrink={0} />
					<Text color="green.700" fontWeight="600" noOfLines={1} flexShrink={0} whiteSpace="nowrap">
						Stock
					</Text>
				</HStack>

				<Box h="1px" w="full" bg="gray.100" />

				<Text
					fontSize={{ base: "26px", md: "28px" }}
					fontWeight="900"
					color="gray.900"
					lineHeight="1"
					mt={1}
				>
					£{Number(engine.price || 0).toLocaleString("en-GB")}
				</Text>

				<Flex w="full" justify="space-between" align="center" pt={1} overflow="hidden">
					<Text fontSize="10px" color="gray.500" fontWeight="500" flexShrink={1} noOfLines={1} overflow="hidden">
						Shipping available
					</Text>
					<HStack spacing={1} color={accentColor} flexShrink={0} whiteSpace="nowrap">
						<Text fontSize="12px" fontWeight="700">
							View
						</Text>
						<FaArrowRight size={10} />
					</HStack>
				</Flex>
			</VStack>
		</Box>
	);
}

export default function CarMakeSelectorSection() {
	const [searchParams, setSearchParams] = useSearchParams();
	const selectedSlug = searchParams.get("brand");
	const modelSlug = searchParams.get("model");

	// Fetch all brands
	const { data: brands = [], isLoading: loadingBrands } = useQuery({
		queryKey: ['brands'],
		queryFn: async () => {
			const res = await API.get("/brands");
			return res.data?.data || res.data || [];
		},
		staleTime: 1000 * 60 * 30,
	});

	// Find basic brand info from the list
	const fallbackBrand = brands.find((brand) => brand.slug === selectedSlug);

	// Fetch brand details if a slug is selected
	const { data: selectedBrandData, isLoading: loadingBrandDetail } = useQuery({
		queryKey: ['brands', selectedSlug],
		queryFn: async () => {
			const res = await API.get(`/brands/${selectedSlug}`);
			return res.data?.data || res.data;
		},
		enabled: !!selectedSlug,
		staleTime: 1000 * 60 * 10,
	});

	// Fetch products for the brand and optional model
	const { data: brandProducts = [], isLoading: loadingProducts } = useQuery({
		queryKey: ['products', { make: fallbackBrand?.productMake, model: modelSlug, limit: 12 }],
		queryFn: async () => {
			const params = { 
				make: fallbackBrand.productMake || fallbackBrand.name, 
				limit: 12 
			};
			if (modelSlug) {
				// We need the model name, but we only have the slug from URL.
				// For now let's use the slug or try to find it in featuredCars
				const modelObj = selectedBrandData?.featuredCars?.find(c => c.slug === modelSlug || c.name.toLowerCase().replace(/\s+/g, '-') === modelSlug);
				params.model = modelObj ? modelObj.name : modelSlug;
			}
			const res = await API.get("/products", { params });
			return res.data?.data || res.data || [];
		},
		enabled: !!fallbackBrand,
		staleTime: 1000 * 60 * 5,
	});

	const selectedBrand = selectedBrandData || fallbackBrand;
	const error = selectedSlug && !loadingBrands && !fallbackBrand ? "Brand not found." : "";

	const openBrand = (brandSlug) => {
		setSearchParams({ brand: brandSlug });
	};

	const openModel = (mSlug) => {
		setSearchParams({ brand: selectedSlug, model: mSlug });
	};

	const closeBrand = () => {
		setSearchParams({});
	};

	const clearModel = () => {
		setSearchParams({ brand: selectedSlug });
	};

	const showDetailLoader = loadingBrands || loadingBrandDetail || (selectedSlug && !selectedBrand && !error);
	const renderBrandGrid = () => {
		if (loadingBrands) {
			return (
				<Center py={20}>
					<Spinner color={accentColor} size="xl" />
				</Center>
			);
		}

		return (
			<SimpleGrid
				columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
				spacing={{ base: 3.5, md: 5 }}
				w="full"
			>
				{brands.map((brand) => (
					<Box
						key={brand.slug}
						onClick={() => openBrand(brand.slug)}
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
								src={brand.logoUrl}
								alt={brand.name}
								maxH={{ base: "66px", md: "78px" }}
								maxW="92%"
								objectFit="contain"
								transition="transform 0.25s ease"
								_groupHover={{ transform: "scale(1.05)" }}
							/>
						</Box>

						<Text
							fontSize={{ base: "13px", md: "14px" }}
							fontWeight="700"
							color="gray.800"
							noOfLines={1}
						>
							{brand.name}
						</Text>
					</Box>
				))}
			</SimpleGrid>
		);
	};

	if (selectedSlug) {
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
					{showDetailLoader ? (
						<Center py={24}>
							<Spinner color={accentColor} size="xl" />
						</Center>
					) : (
						<VStack spacing={8} align="stretch">
							<Flex justify="space-between" align="center" wrap="wrap" gap={4}>
								<HStack spacing={3}>
									<Button leftIcon={<FaArrowLeft />} variant="outline" onClick={closeBrand}>
										Back to all brands
									</Button>
									{modelSlug && (
										<Button size="sm" variant="ghost" onClick={clearModel} colorScheme="red">
											Clear Model Filter
										</Button>
									)}
								</HStack>

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
									{brandProducts.length} listings {modelSlug ? `for ${modelSlug}` : ""} loaded
								</Badge>
							</Flex>

							{error && (
								<Box bg="red.50" border="1px solid" borderColor="red.200" borderRadius="2xl" p={4}>
									<Text color="red.700" fontWeight="600">
										{error}
									</Text>
								</Box>
							)}

							<Box
								bg="white"
								border="1px solid"
								borderColor="gray.200"
								borderRadius="3xl"
								boxShadow="0 16px 34px rgba(15, 23, 42, 0.08)"
								overflow="hidden"
							>
								<Box
									h={{ base: "220px", md: "280px" }}
									bgImage={`linear-gradient(180deg, rgba(15,23,42,0.15), rgba(15,23,42,0.55)), url(${selectedBrand?.heroImage || selectedBrand?.logoUrl})`}
									bgSize="cover"
									bgPosition="center"
									position="relative"
								>
									<Box
										position="absolute"
										inset={0}
										bg="linear-gradient(180deg, transparent, rgba(15,23,42,0.6))"
									/>
									<Flex position="relative" zIndex={1} h="full" align="end" p={{ base: 5, md: 8 }}>
										<HStack spacing={4} align="center">
											<Box
												bg="white"
												borderRadius="2xl"
												p={4}
												boxShadow="0 10px 22px rgba(0,0,0,0.18)"
											>
												<Image
													src={selectedBrand?.logoUrl}
													alt={selectedBrand?.name}
													maxH="54px"
													maxW="120px"
													objectFit="contain"
												/>
											</Box>
											<Box color="white">
												<Heading
													fontSize={{ base: "28px", md: "42px" }}
													fontWeight="900"
													lineHeight="1.05"
												>
													{selectedBrand?.name} {modelSlug ? `- ${modelSlug.toUpperCase()}` : ""}
												</Heading>
												<Text
													maxW="760px"
													mt={2}
													fontSize={{ base: "14px", md: "16px" }}
													color="whiteAlpha.900"
												>
													{selectedBrand?.description}
												</Text>
											</Box>
										</HStack>
									</Flex>
								</Box>
							</Box>

							<Box>
								<Heading
									fontSize={{ base: "24px", md: "32px" }}
									color="#0F172A"
									textAlign="center"
									mb={8}
								>
									Most Popular{" "}
									<Text as="span" color={accentColor}>
										{selectedBrand?.name}
									</Text>{" "}
									Models
								</Heading>

								<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={5}>
									{(selectedBrand?.featuredCars || []).map((car) => (
										<Box
											key={car.name}
											onClick={() => openModel(car.slug || car.name.toLowerCase().replace(/\s+/g, '-'))}
											cursor="pointer"
											bg="white"
											border="1px solid"
											borderColor={modelSlug === (car.slug || car.name.toLowerCase().replace(/\s+/g, '-')) ? accentColor : "gray.200"}
											borderRadius="2xl"
											overflow="hidden"
											boxShadow="0 10px 24px rgba(15, 23, 42, 0.06)"
											transition="all 0.2s"
											_hover={{ transform: "translateY(-4px)", borderColor: accentColor }}
										>
											<Image
												src={car.imageUrl}
												alt={car.name}
												w="full"
												h="140px"
												objectFit="cover"
											/>
											<Box p={4}>
												<Text fontWeight="800" color="gray.900" fontSize="sm">
													{car.name}
												</Text>
												<Text fontSize="xs" color="gray.600" mt={1} noOfLines={1}>
													{car.trim}
												</Text>
											</Box>
										</Box>
									))}
								</SimpleGrid>
							</Box>

							<Box>
								<Heading
									fontSize={{ base: "24px", md: "32px" }}
									color="#0F172A"
									textAlign="center"
									mb={8}
								>
									{modelSlug ? `${modelSlug.toUpperCase()} Engines` : `Popular ${selectedBrand?.name} engines`} for sale
								</Heading>

								<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
									{brandProducts.map((engine) => (
										<EngineProductCard key={engine._id} engine={engine} />
									))}
								</SimpleGrid>
							</Box>

							<Box>
								<Flex justify="space-between" align="end" wrap="wrap" gap={4} mb={5}>
									<Box>
										<Text
											textTransform="uppercase"
											letterSpacing="0.12em"
											fontSize="12px"
											color="gray.500"
											fontWeight="700"
										>
											Price Table
										</Text>
										<Heading fontSize={{ base: "24px", md: "32px" }} color="#0F172A">
											{selectedBrand?.name} Engine Prices
										</Heading>
									</Box>
								</Flex>

								{/* Desktop Table View */}
								<Box display={{ base: "none", md: "block" }}>
									<TableContainer
										bg="white"
										border="1px solid"
										borderColor="gray.200"
										borderRadius="2xl"
										overflow="hidden"
									>
										<Table variant="simple">
											<Thead bg="gray.50">
												<Tr>
													<Th>Engine</Th>
													<Th>Fuel</Th>
													<Th>Model</Th>
													<Th>Year</Th>
													<Th isNumeric>Price</Th>
													<Th>Quote</Th>
												</Tr>
											</Thead>
											<Tbody>
												{brandProducts.map((engine) => (
													<Tr key={`price-dsktp-${engine._id}`}>
														<Td fontWeight="700">{engine.name}</Td>
														<Td>{engine.engineType}</Td>
														<Td>{engine.model}</Td>
														<Td>{engine.year}</Td>
														<Td isNumeric fontWeight="800">
															£{Number(engine.price || 0).toLocaleString("en-GB")}
														</Td>
														<Td>
															<Button
																as={RouterLink}
																to={`/products/${engine._id}`}
																size="sm"
																colorScheme="green"
															>
																Get Quote
															</Button>
														</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</TableContainer>
								</Box>

								{/* Mobile List Card View */}
								<Box display={{ base: "block", md: "none" }}>
									<VStack spacing={4} align="stretch">
										{brandProducts.map((engine) => (
											<Box
												key={`price-mob-${engine._id}`}
												bg="white"
												p={4}
												borderRadius="xl"
												border="1px solid"
												borderColor="gray.200"
												boxShadow="sm"
											>
												<VStack align="start" spacing={3}>
													<Text fontWeight="800" color="gray.850" fontSize="15px" lineHeight="1.4">
														{engine.name}
													</Text>
													
													<HStack spacing={3} wrap="wrap" fontSize="12px" color="gray.600" fontWeight="600">
														{engine.engineType && <Badge colorScheme="blue" variant="subtle">{engine.engineType}</Badge>}
														{engine.model && <Text>Fit: {engine.model}</Text>}
														{engine.year && <Text>Year: {engine.year}</Text>}
													</HStack>
													
													<Flex w="full" justify="space-between" align="center" pt={2} borderTop="1px dashed" borderColor="gray.100">
														<Text fontSize="16px" fontWeight="950" color="gray.900">
															£{Number(engine.price || 0).toLocaleString("en-GB")}
														</Text>
														<Button
															as={RouterLink}
															to={`/products/${engine._id}`}
															size="sm"
															colorScheme="green"
															h="32px"
															px={4}
														>
															Get Quote
														</Button>
													</Flex>
												</VStack>
											</Box>
										))}
									</VStack>
								</Box>
							</Box>
						</VStack>
					)}
				</Container>
			</Box>
		);
	}

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
								Find Engine Quotes Fast
							</Text>
						</Heading>

						<Text maxW="680px" fontSize={{ base: "14px", md: "16px" }} color="gray.600">
							Tap any brand to open its cars and popular engines from the database.
						</Text>
					</VStack>

					{renderBrandGrid()}
				</VStack>
			</Container>
		</Box>
	);
}
