import React, { useState } from "react";
import {
	Badge,
	Box,
	Button,
	Center,
	Container,
	Flex,
	Grid,
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
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaTimes, FaTools, FaCarSide, FaCheckCircle } from "react-icons/fa";
import API from "../services/api";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionGrid = motion(Grid);

const accentColor = "#D90404";
const surfaceColor = "#F3F5F8";
const darkColor = "#0F172A";

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, scale: 0.9 },
	show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function BrandCard({ brand, onSelect, isSelected }) {
	return (
		<MotionBox
			variants={itemVariants}
			as="button"
			onClick={() => onSelect(brand)}
			bg="white"
			borderRadius="12px"
			p={4}
			textAlign="center"
			cursor="pointer"
			transition="all 0.25s ease"
			border={isSelected ? `2px solid ${accentColor}` : "2px solid transparent"}
			_hover={{
				transform: "translateY(-4px)",
				boxShadow: `0 12px 24px rgba(217, 4, 4, 0.15)`,
				borderColor: accentColor,
			}}
			position="relative"
		>
			{brand.spriteSheetUrl ? (
				<Box
					className="make-sprite"
					w={`${brand.spriteSize?.width || 105}px`}
					h={`${brand.spriteSize?.height || 105}px`}
					backgroundImage={`url(${brand.spriteSheetUrl})`}
					backgroundPosition={`${brand.spritePosition?.x || 0}px ${brand.spritePosition?.y || 0}px`}
					backgroundRepeat="no-repeat"
					backgroundSize="auto" // Ensure it doesn't stretch
					mx="auto"
					mb={3}
				/>
			) : (
				<Image src={brand.logoUrl} alt={brand.name} h="60px" objectFit="contain" mx="auto" mb={3} />
			)}
			<Text fontSize="14px" fontWeight="700" color={darkColor} noOfLines={2}>
				{brand.name}
			</Text>
		</MotionBox>
	);
}

// function ModelCard({ model, onSelect }) {
function ModelCard({ model, onSelect, brandName }) {
	return (
		<MotionBox
			variants={itemVariants}
			as="button"
			onClick={() => onSelect(model)}
			bg="white"
			borderRadius="12px"
			p={4}
			textAlign="center"
			cursor="pointer"
			transition="all 0.25s ease"
			_hover={{
				transform: "translateY(-4px)",
				boxShadow: `0 12px 24px rgba(217, 4, 4, 0.15)`,
				borderColor: accentColor,
			}}
		>
			{model.spriteSheetUrl ? (
				<Box
					className="make-cars-sprite"
					w={`${model.spriteSize?.width || 135}px`}
					h={`${model.spriteSize?.height || 76}px`}
					backgroundImage={`url(${model.spriteSheetUrl})`}
					backgroundPosition={`${model.spritePosition?.x || 0}px ${model.spritePosition?.y || 0}px`}
					backgroundRepeat="no-repeat"
					backgroundSize="auto"
					mx="auto"
					mb={3}
				/>
			) : model.imageUrl ? (
				<Image
					src={model.imageUrl}
					alt={model.name}
					h="80px"
					objectFit="contain"
					mx="auto"
					mb={3}
				/>
			) : (
				<Center h="80px" mb={3} bg="gray.50" borderRadius="lg">
					<FaCarSide size={30} color="gray.300" />
				</Center>
			)}
			{/* <Text fontSize="14px" fontWeight="700" color={darkColor} noOfLines={2}>
				{model.name}
			</Text> */}
			<Text fontSize="14px" fontWeight="700" color={darkColor} noOfLines={2}>
    {brandName} {model.name}
</Text>
		</MotionBox>
	);
}

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

				<HStack spacing={1} fontSize="11px" color="gray.600" align="center" w="full" overflow="hidden">
					<Text fontWeight="700" flexShrink={0} whiteSpace="nowrap">Fits:</Text>
					<Text noOfLines={1} flexGrow={1}>{engine.model || "Universal Fit"}</Text>
					<Box w="3px" h="3px" borderRadius="full" bg="gray.400" flexShrink={0} />
					<Text color="green.700" fontWeight="600" noOfLines={1} flexShrink={0} whiteSpace="nowrap">
						Stock
					</Text>
				</HStack>

				<Box h="1px" w="full" bg="gray.100" />

				<Flex w="full" justify="space-between" align="center" pt={1} mt="auto" overflow="hidden">
					<Text fontSize="10px" color="gray.500" fontWeight="500" flexShrink={1} noOfLines={1} overflow="hidden">
						Shipping available
					</Text>
					<HStack spacing={1} color={accentColor} flexShrink={0} whiteSpace="nowrap">
						<Text fontSize="12px" fontWeight="700">
							Get Quote
						</Text>
						<FaArrowRight size={10} />
					</HStack>
				</Flex>
			</VStack>
		</Box>
	);
}

const getMercedesClass = (modelName) => {
	const nameUpper = modelName.toUpperCase();
	if (nameUpper.startsWith("A ")) return "A-Class";
	if (nameUpper.startsWith("B ")) return "B-Class";
	if (nameUpper.startsWith("C ")) {
		if (nameUpper.startsWith("CLK")) return "CLK";
		if (nameUpper.startsWith("CLS")) return "CLS";
		if (nameUpper.startsWith("CLC")) return "CLC-Class";
		if (nameUpper.startsWith("CITAN")) return "Citan";
		return "C-Class";
	}
	if (nameUpper.startsWith("E ")) return "E-Class";
	if (nameUpper.startsWith("S ")) {
		if (nameUpper.startsWith("SLC")) return "SLC";
		if (nameUpper.startsWith("SLK")) return "SLK";
		if (nameUpper.startsWith("SLS")) return "SLS AMG";
		if (nameUpper.startsWith("SL")) return "SL";
		return "S-Class";
	}
	if (nameUpper.startsWith("G ")) {
		if (nameUpper.startsWith("GLA")) return "GLA-Class";
		if (nameUpper.startsWith("GLB")) return "GLB-Class";
		if (nameUpper.startsWith("GLC")) return "GLC-Class";
		if (nameUpper.startsWith("GLE")) return "GLE";
		if (nameUpper.startsWith("GLS")) return "GLS";
		if (nameUpper.startsWith("GLK")) return "GLK-Class";
		if (nameUpper.startsWith("GL")) return "GL-Class";
		return "G-Class";
	}
	if (nameUpper.startsWith("GLA ")) return "GLA-Class";
	if (nameUpper.startsWith("GLB ")) return "GLB-Class";
	if (nameUpper.startsWith("GLC ")) return "GLC-Class";
	if (nameUpper.startsWith("GLE ")) return "GLE";
	if (nameUpper.startsWith("GLS ")) return "GLS";
	if (nameUpper.startsWith("GLK ")) return "GLK-Class";
	if (nameUpper.startsWith("GL ")) return "GL-Class";
	if (nameUpper.startsWith("CLK ")) return "CLK";
	if (nameUpper.startsWith("CLS ")) return "CLS";
	if (nameUpper.startsWith("SL ")) return "SL";
	if (nameUpper.startsWith("SLK ")) return "SLK";
	if (nameUpper.startsWith("SLC ")) return "SLC";
	if (nameUpper.startsWith("AMG GT")) return "AMG GT";
	if (nameUpper.startsWith("CLA ")) return "CLA";
	if (nameUpper.startsWith("SPRINTER ")) return "Sprinter";
	if (nameUpper.startsWith("VITO ")) return "Vito";
	if (nameUpper.startsWith("VIANO ")) return "Viano";
	if (nameUpper.startsWith("CITAN ")) return "Citan";
	if (nameUpper.startsWith("X ")) return "X-Class";
	if (nameUpper.startsWith("MB 100") || nameUpper.startsWith("MB100")) return "MB100";
	if (nameUpper.startsWith("MB 140") || nameUpper.startsWith("MB140")) return "MB140";
	if (nameUpper.startsWith("R ")) return "R-Class";
	if (nameUpper.startsWith("VANEO ")) return "Vaneo";
	if (nameUpper.startsWith("VARIO ")) return "Vario";
	if (nameUpper.startsWith("SLS ")) return "SLS AMG";
	if (nameUpper.startsWith("CLC ")) return "CLC-Class";
	if (nameUpper.startsWith("ML ") || nameUpper.startsWith("ML-") || nameUpper.startsWith("M-")) return "M-Class";
	return "Other";
};

export default function BrandModelSelectorSection() {
	const navigate = useNavigate();
	const [selectedBrand, setSelectedBrand] = useState(null);
	const [selectedClass, setSelectedClass] = useState(null);
	const [selectedModel, setSelectedModel] = useState(null);
	const [showModels, setShowModels] = useState(false);

	// Fetch all brands
	const { data: brands = [], isLoading: loadingBrands } = useQuery({
		queryKey: ["brands"],
		queryFn: async () => {
			const res = await API.get("/brands");
			// return (res.data?.data || res.data || []).filter((b) => b.isActive !== false);
			return (res.data?.data || res.data || []).filter(
				(brand) => brand.isActive !== false
			);
		},
		staleTime: 1000 * 60 * 30,
	});

	// Fetch models for selected brand
	const { data: models = [], isLoading: loadingModels } = useQuery({
		queryKey: ["models", selectedBrand?._id],
		queryFn: async () => {
			if (!selectedBrand?._id) return [];
			const res = await API.get(`/models/${selectedBrand._id}`);
			return res.data?.data || [];
		},
		enabled: !!selectedBrand?._id,
		staleTime: 1000 * 60 * 30,
	});

	// Fetch products for selected model
	const { data: products = [], isLoading: loadingProducts } = useQuery({
		queryKey: ["products", { brand: selectedBrand?.name, model: selectedModel?.name }],
		queryFn: async () => {
			if (!selectedBrand || !selectedModel) return [];
			const res = await API.get("/products", {
				params: {
					make: selectedBrand.productMake || selectedBrand.name,
					model: selectedModel.name,
					limit: 12
				}
			});
			return res.data?.data || res.data || [];
		},
		enabled: !!selectedBrand && !!selectedModel,
		staleTime: 1000 * 60 * 10,
	});

	const handleBrandSelect = (brand) => {
		setSelectedBrand(brand);
		setShowModels(true);
		setSelectedModel(null);
		setSelectedClass(null);
	};

	const handleClassSelect = (classObj) => {
		setSelectedClass(classObj.name);
	};

	const handleModelSelect = (model) => {
		const brandSlug = selectedBrand?.slug || "";
		const modelSlugPart = model.name.toLowerCase().replace(/\s+/g, "-");
		navigate(`/${brandSlug}-${modelSlugPart}-engines`);
	};

	const handleBackToBrands = () => {
		setShowModels(false);
		setSelectedBrand(null);
		setSelectedModel(null);
		setSelectedClass(null);
	};

	const handleBackToClasses = () => {
		setSelectedClass(null);
	};

	const handleBackToModels = () => {
		setSelectedModel(null);
	};


	if (loadingBrands) {
		return (
			<Center py={20}>
				<Spinner color={accentColor} size="lg" thickness="4px" />
			</Center>
		);
	}

	return (
		<Box id="brand-section" bg={surfaceColor} py={{ base: 8, md: 10 }}>
			<Container maxW="7xl" px={{ base: 4, md: 6 }}>
				<VStack spacing={12} align="stretch">
					{/* Header */}
					<VStack spacing={3} textAlign="center">
						<Heading as="h2" size={{ base: "lg", md: "xl" }} color={darkColor} fontWeight="900">
							{selectedModel ? (
								<HStack justify="center" spacing={3}>
									<Button
										size="sm"
										variant="ghost"
										onClick={handleBackToModels}
										leftIcon={<FaArrowLeft />}
										colorScheme="red"
									>
										Back
									</Button>
									<Text>{selectedModel.name} Engines</Text>
								</HStack>
							) : showModels && selectedBrand ? (
								selectedBrand.slug === "mercedes-benz" ? (
									selectedClass ? (
										<HStack justify="center" spacing={3}>
											<Button
												size="sm"
												variant="ghost"
												onClick={handleBackToClasses}
												leftIcon={<FaArrowLeft />}
												colorScheme="red"
											>
												Back
											</Button>
											<Text>{selectedBrand.name} {selectedClass} Models</Text>
										</HStack>
									) : (
										<HStack justify="center" spacing={3}>
											<Button
												size="sm"
												variant="ghost"
												onClick={handleBackToBrands}
												leftIcon={<FaArrowLeft />}
												colorScheme="red"
											>
												Back
											</Button>
											<Text>{selectedBrand.name} Classes</Text>
										</HStack>
									)
								) : (
									<HStack justify="center" spacing={3}>
										<Button
											size="sm"
											variant="ghost"
											onClick={handleBackToBrands}
											leftIcon={<FaArrowLeft />}
											colorScheme="red"
										>
											Back
										</Button>
										<Text>{selectedBrand.name} Models</Text>
									</HStack>
								)
							) : (
								"Select Your Car Brand"
							)}
						</Heading>
						<Text fontSize={{ base: "sm", md: "md" }} color="gray.600" maxW="600px">
							{selectedModel
								? `Browse available engines for ${selectedBrand?.name} ${selectedModel.name}`
								: showModels && selectedBrand
									? selectedBrand.slug === "mercedes-benz"
										? selectedClass
											? `Choose a ${selectedClass} model to find compatible engines`
											: "Choose a Mercedes-Benz class to view available models"
										: "Choose a model to find compatible engines"
									: "Click on your car brand to view all available models"}
						</Text>
					</VStack>

					<AnimatePresence mode="wait">
						{/* State 2: Engines & Available Catalog */}
						{selectedModel ? (
							<MotionVStack
								key="engines-view"
								variants={containerVariants}
								initial="hidden"
								animate="show"
								spacing={12}
								align="stretch"
							>
								{loadingProducts ? (
									<Center py={20}>
										<Spinner color={accentColor} size="lg" thickness="4px" />
									</Center>
								) : products.length > 0 ? (
									<>
										<Box>
											<Heading fontSize="26px" mb={8} color={darkColor} textAlign="center" fontWeight="800">
												Popular {selectedBrand?.name} {selectedModel.name} engines for sale
											</Heading>
											<SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 6 }} spacing={4}>
												{products.map((engine) => (
													<EngineProductCard key={engine._id} engine={engine} />
												))}
											</SimpleGrid>
										</Box>

										<Box>
											<Heading fontSize="26px" mb={8} color={darkColor} textAlign="center" fontWeight="800">
												Available {selectedBrand?.name} {selectedModel.name} Engines
											</Heading>
											{/* Desktop Table View */}
											<Box display={{ base: "none", md: "block" }}>
												<TableContainer
													bg="white"
													borderRadius="2xl"
													border="1px solid"
													borderColor="gray.200"
													boxShadow="0 10px 20px rgba(0,0,0,0.04)"
													overflow="hidden"
												>
													<Table variant="simple">
														<Thead bg="gray.50">
															<Tr>
																<Th color="gray.600">Engine Details</Th>
																<Th color="gray.600">Condition</Th>
																<Th color="gray.600">Model Fit</Th>
																<Th color="gray.600"></Th>
															</Tr>
														</Thead>
														<Tbody>
															{products.map((engine) => (
																<Tr key={`table-dsktp-${engine._id}`} _hover={{ bg: "gray.50" }}>
																	<Td fontWeight="700">{engine.name}</Td>
																	<Td>
																		<Badge colorScheme={engine.condition?.toLowerCase() === 'reconditioned' ? 'green' : 'blue'} variant="subtle">
																			{engine.condition || "Used"}
																		</Badge>
																	</Td>
																	<Td fontSize="sm">{engine.model}</Td>
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

											{/* Mobile List Card View */}
											<Box display={{ base: "block", md: "none" }}>
												<VStack spacing={4} align="stretch">
													{products.map((engine) => (
														<Box
															key={`table-mob-${engine._id}`}
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
																
																<HStack spacing={3} wrap="wrap">
																	<Badge colorScheme={engine.condition?.toLowerCase() === 'reconditioned' ? 'green' : 'blue'} variant="subtle" fontSize="10px">
																		{engine.condition || "Used"}
																	</Badge>
																	{engine.model && (
																		<Text fontSize="12px" color="gray.600" fontWeight="600">
																			Fit: {engine.model}
																		</Text>
																	)}
																</HStack>
																
																<Flex w="full" justify="space-between" align="center" pt={2} borderTop="1px dashed" borderColor="gray.100">
																	<Text fontSize="12px" color="gray.500" fontWeight="500">
																		Instant Quote Available
																	</Text>
																	<Button
																		as={RouterLink}
																		to={`/products/${engine._id}`}
																		size="sm"
																		bg={darkColor}
																		color="white"
																		_hover={{ bg: accentColor }}
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

										<Box bg="white" p={8} borderRadius="2xl" boxShadow="sm">
											<Heading fontSize="20px" mb={6} textAlign="center" color={darkColor}>
												Replacement {selectedBrand?.name} Engine Offerings
											</Heading>
											<SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
												{[
													"Brand New Engines",
													"Brand New Crate Engines",
													"Rebuilt Engines",
													"Reconditioned Engines",
													"Refurbished Engines",
													"Refurbished & Tested Engines",
													"Remanufactured Engines",
													"Remanufactured OEM Specification Engines",
													"Used Secondhand Low Mileage Engines"
												].map((item, i) => (
													<HStack key={i} spacing={3} align="start">
														<Box as={FaCheckCircle} color="green.500" mt={1} />
														<Text fontSize="14px" fontWeight="500">{selectedBrand?.name} {item}</Text>
													</HStack>
												))}
											</SimpleGrid>
										</Box>

										<Box textAlign="center" py={8}>
											<Heading fontSize="22px" mb={4}>{selectedBrand?.name} Engine History</Heading>
											<Text color="gray.600" lineHeight="1.8">
												{selectedBrand?.description || `${selectedBrand?.name} is a renowned automotive manufacturer known for producing reliable and high-performance engines. Whether you are looking for reconditioned, remanufactured, or used engines, we specialize in professional engine rebuilding and fitting services across the UK.`}
											</Text>
										</Box>
									</>
								) : (
									<Center py={20} bg="white" borderRadius="2xl" border="1px dashed" borderColor="gray.300">
										<VStack spacing={4}>
											<Text fontSize="lg" color="gray.500" fontWeight="600">
												No engines found for {selectedBrand.name} {selectedModel.name}.
											</Text>
											<Button colorScheme="red" variant="outline" onClick={handleBackToModels}>
												Choose Another Model
											</Button>
										</VStack>
									</Center>
								)}
							</MotionVStack>
						) : /* State 1: Model Grid */
							showModels && selectedBrand ? (
								<MotionVStack
									key={selectedClass ? "models-view" : "classes-view"}
									variants={containerVariants}
									initial="hidden"
									animate="show"
									spacing={8}
									align="stretch"
								>
									<Heading fontSize="26px" color={darkColor} textAlign="center" fontWeight="800">
										{selectedBrand.slug === "mercedes-benz" && !selectedClass ? (
											<>Browse <Text as="span" color={accentColor}>{selectedBrand.name}</Text> by Class</>
										) : (
											<>Most Popular <Text as="span" color={accentColor}>{selectedBrand.name}</Text> Engines</>
										)}
									</Heading>
									<MotionGrid
										variants={containerVariants}
										templateColumns={{
											base: "repeat(2, 1fr)",
											// sm: "repeat(3, 1fr)",
											md: "repeat(4, 1fr)",
											lg: "repeat(5, 1fr)",
											xl: "repeat(6, 1fr)",
										}}
										gap={{ base: 4, md: 6 }}
									>
										{loadingModels ? (
											<Center py={20} gridColumn="1 / -1">
												<Spinner color={accentColor} size="lg" thickness="4px" />
											</Center>
										) : models.length > 0 ? (
											(() => {
												const fallbackModel = models.find((m) => m.spriteSheetUrl || m.imageUrl);

												const getDisplayModel = (model) => {
													const hasImage = model.spriteSheetUrl || model.imageUrl;
													if (hasImage || !fallbackModel) return model;
													return {
														...model,
														spriteSheetUrl: fallbackModel.spriteSheetUrl || null,
														spritePosition: fallbackModel.spritePosition || null,
														spriteSize: fallbackModel.spriteSize || null,
														imageUrl: fallbackModel.imageUrl || null,
													};
												};

												if (selectedBrand.slug === "mercedes-benz") {
													if (!selectedClass) {
														// Group models by class
														const classMap = {};
														models.forEach((m) => {
															const className = getMercedesClass(m.name);
															if (!classMap[className]) {
																classMap[className] = [];
															}
															classMap[className].push(m);
														});

														const sortedClassNames = Object.keys(classMap).sort();
														const classesToRender = sortedClassNames.map((className) => {
															const classModels = classMap[className];
															const repModel = classModels.find((m) => m.spriteSheetUrl || m.imageUrl) || fallbackModel;
															return {
																_id: `class-${className}`,
																name: className,
																spriteSheetUrl: repModel?.spriteSheetUrl || null,
																spritePosition: repModel?.spritePosition || null,
																spriteSize: repModel?.spriteSize || null,
																imageUrl: repModel?.imageUrl || null,
															};
														});

														return classesToRender.map((classObj) => (
															<ModelCard key={classObj._id} model={classObj} onSelect={handleClassSelect} />
														));
													} else {
														// Render models in selected class
														const filteredModels = models.filter(
															(m) => getMercedesClass(m.name) === selectedClass
														);
														const uniqueModels = [];
														const modelNamesSeen = new Set();
														for (const m of filteredModels) {
															if (!modelNamesSeen.has(m.name)) {
																modelNamesSeen.add(m.name);
																uniqueModels.push(m);
															}
														}
														return uniqueModels.map((model) => (
															<ModelCard key={model._id} model={getDisplayModel(model)} onSelect={handleModelSelect} />
														));
													}
												} else {
													const uniqueModels = [];
													const modelNamesSeen = new Set();
													for (const m of models) {
														if (!modelNamesSeen.has(m.name)) {
															modelNamesSeen.add(m.name);
															uniqueModels.push(m);
														}
													}
													return uniqueModels.map((model) => (
														<ModelCard 
															key={model._id} 
															model={getDisplayModel(model)} 
															onSelect={handleModelSelect} 
															brandName={selectedBrand?.name}
														/>
													));
												}
											})()
										) : (
											<Center py={20} gridColumn="1 / -1">
												<VStack spacing={3}>
													<Text fontSize="md" color="gray.500" fontWeight="600">
														No models found for {selectedBrand?.name}
													</Text>
													<Button colorScheme="red" onClick={handleBackToBrands}>
														Choose Another Brand
													</Button>
												</VStack>
											</Center>
										)}
									</MotionGrid>
								</MotionVStack>
							) : (
								/* State 0: Brand Grid */
								<MotionGrid
									key="brands-grid"
									variants={containerVariants}
									initial="hidden"
									animate="show"
									templateColumns={{
										base: "repeat(2, 1fr)",
										md: "repeat(4, 1fr)",
										lg: "repeat(5, 1fr)",
									}}
									gap={{ base: 3, md: 4 }}
								>
									{brands.map((brand) => (
										<BrandCard
											key={brand._id}
											brand={brand}
											onSelect={handleBrandSelect}
											isSelected={selectedBrand?._id === brand._id}
										/>
									))}
								</MotionGrid>
							)}
					</AnimatePresence>

					{/* Info Cards */}
					{!showModels && !selectedModel && (
						<SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mt={8}>
							<VStack bg="white" p={6} borderRadius="12px" textAlign="center" spacing={3}>
								<Box
									w="50px"
									h="50px"
									borderRadius="50%"
									bg={`${accentColor}15`}
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontSize="24px"
									mx="auto"
								>
									🏎️
								</Box>
								<Text fontWeight="700" color={darkColor}>
									Wide Selection
								</Text>
								<Text fontSize="sm" color="gray.600">
									Browse engines for all major car brands
								</Text>
							</VStack>

							<VStack bg="white" p={6} borderRadius="12px" textAlign="center" spacing={3}>
								<Box
									w="50px"
									h="50px"
									borderRadius="50%"
									bg={`${accentColor}15`}
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontSize="24px"
									mx="auto"
								>
									⚡
								</Box>
								<Text fontWeight="700" color={darkColor}>
									Quick Search
								</Text>
								<Text fontSize="sm" color="gray.600">
									Find the right engine for your vehicle model
								</Text>
							</VStack>

							<VStack bg="white" p={6} borderRadius="12px" textAlign="center" spacing={3}>
								<Box
									w="50px"
									h="50px"
									borderRadius="50%"
									bg={`${accentColor}15`}
									display="flex"
									alignItems="center"
									justifyContent="center"
									fontSize="24px"
									mx="auto"
								>
									✓
								</Box>
								<Text fontWeight="700" color={darkColor}>
									Best Prices
								</Text>
								<Text fontSize="sm" color="gray.600">
									Get the best quotes on premium engines
								</Text>
							</VStack>
						</SimpleGrid>
					)}
				</VStack>
			</Container>
		</Box>
	);
}

