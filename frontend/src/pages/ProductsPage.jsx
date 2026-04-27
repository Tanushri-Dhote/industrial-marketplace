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
import { FaArrowLeft, FaArrowRight, FaCarSide, FaTools } from "react-icons/fa";
import { Link as RouterLink, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const accentColor = "#D90404";
const surfaceColor = "#F3F5F8";
const darkColor = "#0F172A";

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
					src={engine.images?.[0] || engine.image || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1000"}
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

				<HStack spacing={1} fontSize="11px" color="gray.600" align="center" w="full">
					<Text fontWeight="700">Fits:</Text>
					<Text noOfLines={1}>{engine.model || "Universal Fit"}</Text>
					<Box w="3px" h="3px" borderRadius="full" bg="gray.400" />
					<Text color="green.700" fontWeight="600" noOfLines={1}>
						In Stock
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

				<Flex w="full" justify="space-between" align="center" pt={1}>
					<Text fontSize="10px" color="gray.500" fontWeight="500">
						Shipping available
					</Text>
					<HStack spacing={1} color={accentColor}>
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

export default function ProductsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	
	const brandSlug = searchParams.get("brand");
	const modelSlug = searchParams.get("model");

	// Fetch all brands (for fallback or selection)
	const { data: brands = [], isLoading: loadingBrands } = useQuery({
		queryKey: ['brands'],
		queryFn: async () => {
			const res = await API.get("/brands");
			return res.data?.data || res.data || [];
		},
		staleTime: 1000 * 60 * 30,
	});

	// Find basic brand info from the list
	const currentBrand = brands.find((b) => b.slug === brandSlug);

	// Fetch models for the brand
	const { data: models = [], isLoading: loadingModels } = useQuery({
		queryKey: ['models', currentBrand?._id],
		queryFn: async () => {
			if (!currentBrand?._id) return [];
			const res = await API.get(`/models/${currentBrand._id}`);
			return res.data?.data || [];
		},
		enabled: !!currentBrand?._id,
		staleTime: 1000 * 60 * 10,
	});

	// Find selected model
	const currentModel = models.find(m => m.slug === modelSlug);

	// Fetch products filtered by brand (make) and model
	const { data: products = [], isLoading: loadingProducts } = useQuery({
		queryKey: ['products', { brandSlug, modelSlug }],
		queryFn: async () => {
			const params = {};
			if (currentBrand) params.make = currentBrand.productMake || currentBrand.name;
			if (currentModel) params.model = currentModel.name;
			
			const res = await API.get("/products", { params });
			return res.data?.data || res.data || [];
		},
		enabled: !!currentBrand,
		staleTime: 1000 * 60 * 5,
	});

	const handleModelSelect = (slug) => {
		setSearchParams({ brand: brandSlug, model: slug });
	};

	const clearModel = () => {
		setSearchParams({ brand: brandSlug });
	};

	if (loadingBrands || (brandSlug && !currentBrand && !loadingBrands)) {
		return (
			<Center py={20} minH="60vh">
				<VStack spacing={4}>
					{loadingBrands ? (
						<Spinner color={accentColor} size="xl" thickness="4px" />
					) : (
						<>
							<Heading size="md">Brand not found</Heading>
							<Button as={RouterLink} to="/" colorScheme="red">Back to Home</Button>
						</>
					)}
				</VStack>
			</Center>
		);
	}

	if (!brandSlug) {
		return (
			<Box py={20} bg={surfaceColor}>
				<Container maxW="container.xl">
					<VStack spacing={8} textAlign="center">
						<Heading>Browse Engines by Brand</Heading>
						<Text>Please select a brand to view available engines.</Text>
						<Button as={RouterLink} to="/" colorScheme="red">Go to Home</Button>
					</VStack>
				</Container>
			</Box>
		);
	}

	return (
		<Box
			py={{ base: 12, md: 16 }}
			bg="linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)"
			minH="100vh"
		>
			<Container maxW="container.xl">
				<VStack spacing={10} align="stretch">
					{/* Breadcrumbs / Back button */}
					<Flex justify="space-between" align="center">
						<Button 
							leftIcon={<FaArrowLeft />} 
							variant="ghost" 
							onClick={() => navigate("/")}
						>
							Back to Brands
						</Button>
						
						{modelSlug && (
							<Button 
								rightIcon={<FaTools />} 
								variant="outline" 
								size="sm"
								onClick={clearModel}
							>
								Clear Model Filter: {currentModel?.name || modelSlug}
							</Button>
						)}
					</Flex>

					{/* Brand Header */}
					<Box
						bg="white"
						borderRadius="3xl"
						p={{ base: 6, md: 8 }}
						boxShadow="0 10px 30px rgba(15, 23, 42, 0.08)"
						border="1px solid"
						borderColor="gray.100"
					>
						<HStack spacing={6} align="center">
							<Box 
								bg="white" 
								p={4} 
								borderRadius="2xl" 
								border="1px solid" 
								borderColor="gray.100"
								boxShadow="sm"
							>
								<Image 
									src={currentBrand?.logoUrl} 
									alt={currentBrand?.name} 
									maxH="60px" 
									maxW="120px" 
									objectFit="contain" 
								/>
							</Box>
							<VStack align="start" spacing={1}>
								<Heading fontSize={{ base: "24px", md: "36px" }} fontWeight="900">
									{currentBrand?.name} {currentModel ? currentModel.name : "Engines"}
								</Heading>
								<Text color="gray.600">
									Showing {products.length} {currentModel ? `${currentModel.name} specific` : "available"} engine listings
								</Text>
							</VStack>
						</HStack>
					</Box>

					{/* Models Selection (Horizontal Scroll or Grid) */}
					{!modelSlug && models.length > 0 && (
						<Box>
							<Heading fontSize="20px" mb={5} color={darkColor}>
								Popular {currentBrand?.name} Models
							</Heading>
							<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
								{models.map((model) => (
									<Box
										key={model._id}
										onClick={() => handleModelSelect(model.slug)}
										cursor="pointer"
										bg="white"
										p={4}
										borderRadius="xl"
										border="1px solid"
										borderColor="gray.200"
										textAlign="center"
										transition="all 0.2s"
										_hover={{ 
											transform: "translateY(-4px)", 
											borderColor: accentColor,
											boxShadow: "md"
										}}
									>
										<Text fontWeight="700">{model.name}</Text>
									</Box>
								))}
							</SimpleGrid>
						</Box>
					)}

					{/* Product Listings */}
					{loadingProducts ? (
						<Center py={20}>
							<Spinner color={accentColor} size="xl" thickness="4px" />
						</Center>
					) : products.length > 0 ? (
						<VStack spacing={12} align="stretch">
							<Box>
								<Heading fontSize="22px" mb={6} color={darkColor} display="flex" alignItems="center">
									<Box as={FaCarSide} mr={3} color={accentColor} />
									Available {currentModel?.name || ""} Engine Inventory
								</Heading>
								<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
									{products.map((engine) => (
										<EngineProductCard key={engine._id} engine={engine} />
									))}
								</SimpleGrid>
							</Box>

							{/* Price Table */}
							<Box>
								<VStack align="start" spacing={1} mb={6}>
									<Text fontSize="12px" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="wider">
										Market Overview
									</Text>
									<Heading fontSize="22px" color={darkColor}>
										{currentBrand?.name} {currentModel?.name || ""} Price Comparison Table
									</Heading>
								</VStack>
								<TableContainer 
									bg="white" 
									borderRadius="2xl" 
									border="1px solid" 
									borderColor="gray.200" 
									boxShadow="sm"
									overflow="hidden"
								>
									<Table variant="simple">
										<Thead bg="gray.50">
											<Tr>
												<Th color="gray.600">Engine Details</Th>
												<Th color="gray.600">Condition</Th>
												<Th color="gray.600">Model Fit</Th>
												<Th color="gray.600" isNumeric>Price</Th>
												<Th color="gray.600"></Th>
											</Tr>
										</Thead>
										<Tbody>
											{products.map((engine) => (
												<Tr key={`table-${engine._id}`} _hover={{ bg: "gray.50" }}>
													<Td fontWeight="700">{engine.name}</Td>
													<Td>
														<Badge colorScheme={engine.condition?.toLowerCase() === 'reconditioned' ? 'green' : 'blue'} variant="subtle">
															{engine.condition || "Used"}
														</Badge>
													</Td>
													<Td fontSize="sm">{engine.model}</Td>
													<Td isNumeric fontWeight="900" fontSize="lg">
														£{Number(engine.price || 0).toLocaleString("en-GB")}
													</Td>
													<Td isNumeric>
														<Button 
															as={RouterLink} 
															to={`/products/${engine._id}`} 
															size="sm" 
															bg={darkColor}
															color="white"
															_hover={{ bg: accentColor }}
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
						</VStack>
					) : (
						<Center py={20} bg="white" borderRadius="2xl" border="1px dashed" borderColor="gray.300">
							<VStack spacing={4}>
								<Text fontSize="lg" color="gray.500" fontWeight="600">
									No engines found for this selection.
								</Text>
								<Button colorScheme="red" variant="outline" onClick={() => navigate("/")}>
									Browse All Brands
								</Button>
							</VStack>
						</Center>
					)}
				</VStack>
			</Container>
		</Box>
	);
}
