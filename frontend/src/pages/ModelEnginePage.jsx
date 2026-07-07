import {
	Box,
	Button,
	Center,
	Container,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Spinner,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	VStack,
	Flex,
	SimpleGrid,
	HStack,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import CallSellerPage from "./CallSellerPage";
import EasyStepsSection from "./EasyStepsSection";
import HelpBannerSection from "./HelpBannerSection";
import HeroSection from "./HeroSection";
import ReviewsSection from "./ReviewsSection";
import TrustBar from "./TrustBar";
import WarrantyBannerSection from "./WarrantyBannerSection";
const RED = "#D90404";
const DARK = "#0F172A";

const isSubmodel = (nameB, nameA) => {
	if (nameB.toLowerCase() === nameA.toLowerCase()) return false;
	if (nameB.length <= nameA.length) return false;
	const escapedA = nameA.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	const regex = new RegExp(`^${escapedA}\\b`, "i");
	return regex.test(nameB);
};

export default function ModelEnginePage() {
	const { landingPageSlug } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(true);
	const [brand, setBrand] = useState(null);
	const [model, setModel] = useState(null);
	const [specs, setSpecs] = useState(null);
	const [selectedSpec, setSelectedSpec] = useState("");

	useEffect(() => {
		const loadData = async () => {
			if (!landingPageSlug) return;
			setLoading(true);

			// Standardize slug (support both -engines and -engine endings)
			const cleanSlug = landingPageSlug.replace("-engines", "").replace("-engine", "").toLowerCase();

			try {
				// 1. Fetch all brands to find matching prefix
				const brandsRes = await API.get("/brands");
				const brandsList = brandsRes.data?.data || brandsRes.data || [];

				const matchedBrand = brandsList.find((b) => cleanSlug.startsWith(b.slug));
				if (!matchedBrand) {
					setBrand(null);
					setModel(null);
					setLoading(false);
					return;
				}
				setBrand(matchedBrand);

				// 2. Fetch models for this brand to find the specific model
				const modelsRes = await API.get(`/models/${matchedBrand._id}`);
				const modelsList = modelsRes.data?.data || modelsRes.data || [];

				const modelSlugPart = cleanSlug.substring(matchedBrand.slug.length + 1);
				const matchedModel = modelsList.find((m) => {
					const mName = m.name.toLowerCase();
					const mSlug = m.slug.toLowerCase();
					const cleanPart = modelSlugPart.replace("-series", "").replace("-class", "").replace(/-/g, " ").trim();
					const normPart = modelSlugPart.replace(/-/g, " ").trim();
					
					return (
						mName === normPart ||
						mName === cleanPart ||
						mSlug.includes(modelSlugPart) ||
						normPart.includes(mName) ||
						cleanPart.includes(mName)
					);
				});

				if (!matchedModel) {
					setModel(null);
					setLoading(false);
					return;
				}
				setModel(matchedModel);

				// Find all submodels (including the model itself)
				const submodels = modelsList.filter(
					(m) => m._id === matchedModel._id || isSubmodel(m.name, matchedModel.name)
				);

				// 3. Fetch specifications for all submodels in parallel
				const specsPromises = submodels.map(async (sub) => {
					try {
						const specsRes = await API.get(
							`/models/specs/${matchedBrand.slug}/${sub.name.replace(/\s+/g, "-").toLowerCase()}`
						);
						return specsRes.data?.success && specsRes.data?.data ? specsRes.data.data : null;
					} catch {
						return null;
					}
				});

				const specsList = (await Promise.all(specsPromises)).filter(Boolean);

				if (specsList.length > 0) {
					const combinedDiesel = new Set();
					const combinedPetrol = new Set();
					const combinedCostTable = [];

					specsList.forEach((spec) => {
						if (spec.popularDiesel) {
							spec.popularDiesel.forEach((item) => combinedDiesel.add(item));
						}
						if (spec.popularPetrol) {
							spec.popularPetrol.forEach((item) => combinedPetrol.add(item));
						}
						if (spec.costTable) {
							combinedCostTable.push(...spec.costTable);
						}
					});

					setSpecs({
						brandSlug: matchedBrand.slug,
						modelSlug: matchedModel.slug,
						brandName: matchedBrand.name,
						modelName: matchedModel.name,
						popularDiesel: Array.from(combinedDiesel),
						popularPetrol: Array.from(combinedPetrol),
						costTable: combinedCostTable,
					});
				} else {
					// 4. Fallback: query product database for all submodels in parallel to dynamically build specs
					const productsPromises = submodels.map(async (sub) => {
						try {
							const productsRes = await API.get("/products", {
								params: { make: matchedBrand.name, model: sub.name }
							});
							return productsRes.data?.data || productsRes.data || [];
						} catch {
							return [];
						}
					});

					const allProductsArrays = await Promise.all(productsPromises);
					const products = allProductsArrays.flat();

					if (products.length > 0) {
						// Aggregate from products
						const dieselList = new Set();
						const petrolList = new Set();
						const costRows = [];

						products.forEach(p => {
							const name = p.name || "";
							const engineCode = p.engineCode || (p.specifications && p.specifications["Engine Code"]) || "N/A";
							const size = p.engineSize || (p.specifications && p.specifications["Engine Size"]) || "N/A";
							const fuel = (p.fuelType || "Petrol").toLowerCase();
							const years = p.year || "N/A";
							const priceStr = p.price ? `£${p.price}` : "£1250";

							// Extract submodel like 116d or 118i
							const submodelMatch = name.match(/\b\d{3}[a-zA-Z]\b/);
							const submodel = submodelMatch ? submodelMatch[0].toUpperCase() : size;

							if (fuel.includes("diesel")) {
								dieselList.add(submodel);
							} else {
								petrolList.add(submodel);
							}

							costRows.push({
								model: name,
								engineSize: size,
								fuel: p.fuelType || "Petrol",
								engineCode,
								years,
								price: priceStr
							});
						});

						setSpecs({
							brandSlug: matchedBrand.slug,
							modelSlug: matchedModel.slug,
							brandName: matchedBrand.name,
							modelName: matchedModel.name,
							popularDiesel: Array.from(dieselList),
							popularPetrol: Array.from(petrolList),
							costTable: costRows
						});
					} else {
						// 5. Secondary Fallback: Generate typical specifications dynamically if no data exists
						const isBMW = matchedBrand.slug === "bmw";
						const isAudi = matchedBrand.slug === "audi";

						const dieselList = isBMW
							? ["116D", "118D", "120D", "125D"]
							: (isAudi ? ["2.0 TDI", "3.0 TDI"] : ["1.6 TDI", "2.0 TDI"]);

						const petrolList = isBMW
							? ["116I", "118I", "120I", "M140I"]
							: (isAudi ? ["1.4 TFSI", "1.8 TFSI", "2.0 TFSI"] : ["1.0 TSI", "1.5 TSI", "2.0 TSI"]);

						const costRows = [
							{
								model: `${matchedBrand.name} ${matchedModel.name} 2.0L Petrol`,
								engineSize: "2.0 litre",
								fuel: "Petrol",
								engineCode: "RSE-01",
								years: "2010 - 2020",
								price: "£1450 - £3500"
							},
							{
								model: `${matchedBrand.name} ${matchedModel.name} 2.0L Diesel`,
								engineSize: "2.0 litre",
								fuel: "Diesel",
								engineCode: "RSE-02",
								years: "2012 - 2020",
								price: "£1600 - £3800"
							},
							{
								model: `${matchedBrand.name} ${matchedModel.name} 1.6L Petrol`,
								engineSize: "1.6 litre",
								fuel: "Petrol",
								engineCode: "RSE-03",
								years: "2008 - 2018",
								price: "£1100 - £2800"
							}
						];

						setSpecs({
							brandSlug: matchedBrand.slug,
							modelSlug: matchedModel.slug,
							brandName: matchedBrand.name,
							modelName: matchedModel.name,
							popularDiesel: dieselList,
							popularPetrol: petrolList,
							costTable: costRows
						});
					}
				}
			} catch (error) {
				console.error("Failed to load brand model engine info", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [landingPageSlug]);

	const handleItemClick = (engineType) => {
		setSelectedSpec(engineType);
		onOpen();
	};

	if (loading) {
		return (
			<Center py={40}>
				<Spinner color={RED} size="xl" thickness="4px" />
			</Center>
		);
	}

	if (!brand || !model || !specs) {
		return (
			<Container maxW="container.md" py={20} textAlign="center">
				<Heading as="h1" size="lg" mb={4}>Page Not Found</Heading>
				<Text color="gray.600">We couldn't find an engine page matching this URL structure.</Text>
			</Container>
		);
	}

	return (
		<Box bg="#F8FAFC" minH="100vh">
			{/* ── HERO SECTION ── */}
			<HeroSection
				category="Car Engines"
				initialBrand={brand.slug}
				initialModel={model.name}
			/>

			{/* ── TRUST BAR ── */}
			<TrustBar />

			{/* ── POPULAR ENGINES ACCORDION ── */}
			{/* <Box py={16} bg="white">
				<Container maxW="container.xl" px={{ base: 4, md: 6 }}>
					<VStack spacing={8} align="center" mb={12}>
						<Heading
							as="h2"
							fontSize={{ base: "28px", md: "36px" }}
							color={DARK}
							fontWeight="900"
							textAlign="center"
						>
							Most Popular {brand.name} {model.name} Engines
						</Heading>
						<Text color="gray.600" maxW="600px" textAlign="center" fontSize="md">
							Select a popular configuration below to immediately get a reconditioned price quote.
						</Text>
					</VStack>

					<Accordion defaultIndex={[0, 1]} allowMultiple maxW="960px" mx="auto">
						{specs.popularDiesel?.length > 0 && (
							<AccordionItem border="1px solid" borderColor="gray.100" borderRadius="xl" mb={4} overflow="hidden">
								<AccordionButton bg="gray.50" py={4} _hover={{ bg: "gray.100" }}>
									<Box flex="1" textAlign="left" fontWeight="800" color={DARK} fontSize="15px">
										Diesel
									</Box>
									<AccordionIcon />
								</AccordionButton>
								<AccordionPanel pb={6} pt={4}>
									<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
										{specs.popularDiesel.map((dsl) => (
											<HStack
												key={dsl}
												as="button"
												onClick={() => handleItemClick(`${dsl} Diesel`)}
												justify="space-between"
												p={4}
												bg="gray.50"
												borderRadius="lg"
												border="1px solid"
												borderColor="gray.100"
												cursor="pointer"
												transition="all 0.2s"
												_hover={{ bg: "red.50", borderColor: RED, transform: "translateY(-1px)", boxShadow: "sm" }}
											>
												<Text fontWeight="700" color={DARK} fontSize="14px">{dsl}</Text>
												<AddIcon w={3} h={3} color="gray.400" />
											</HStack>
										))}
									</SimpleGrid>
								</AccordionPanel>
							</AccordionItem>
						)}

						{specs.popularPetrol?.length > 0 && (
							<AccordionItem border="1px solid" borderColor="gray.100" borderRadius="xl" mb={4} overflow="hidden">
								<AccordionButton bg="gray.50" py={4} _hover={{ bg: "gray.100" }}>
									<Box flex="1" textAlign="left" fontWeight="800" color={DARK} fontSize="15px">
										Petrol
									</Box>
									<AccordionIcon />
								</AccordionButton>
								<AccordionPanel pb={6} pt={4}>
									<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
										{specs.popularPetrol.map((pet) => (
											<HStack
												key={pet}
												as="button"
												onClick={() => handleItemClick(`${pet} Petrol`)}
												justify="space-between"
												p={4}
												bg="gray.50"
												borderRadius="lg"
												border="1px solid"
												borderColor="gray.100"
												cursor="pointer"
												transition="all 0.2s"
												_hover={{ bg: "red.50", borderColor: RED, transform: "translateY(-1px)", boxShadow: "sm" }}
											>
												<Text fontWeight="700" color={DARK} fontSize="14px">{pet}</Text>
												<AddIcon w={3} h={3} color="gray.400" />
											</HStack>
										))}
									</SimpleGrid>
								</AccordionPanel>
							</AccordionItem>
						)}
					</Accordion>
				</Container>
			</Box> */}

			{/* ── COST TABLE ── */}
			{specs.costTable?.length > 0 && (
				<Box py={16} bg="#F8FAFC">
					<Container maxW="1400px"px={{ base: 4, md: 6 }}>
						<VStack spacing={8} align="center" mb={12}>
							<Heading
								as="h2"
								fontSize={{ base: "28px", md: "36px" }}
								color={DARK}
								fontWeight="900"
								textAlign="center"
							>
								What is the Cost of <Text as="span" color={RED}>{brand.name} {model.name}</Text> Engine in the UK?
							</Heading>
							<Text color="gray.600" maxW="600px" textAlign="center" fontSize="md">
								Click on any specification below to get a reconditioned, used, or supply-and-fit quote request.
							</Text>
						</VStack>

						{/* Desktop Table View */}
						<Box display={{ base: "none", md: "block" }}>
							<TableContainer
								bg="white"
								borderRadius="2xl"
								boxShadow="lg"
								border="1px solid"
								borderColor="gray.200"
								maxW="100%"
								mx="auto"
								p={2}
							>
								<Table variant="striped" colorScheme="gray" size="md">
									<Thead bg="gray.50">
										<Tr>
											<Th fontWeight="800" color={DARK} fontSize="13px" py={5} whiteSpace="nowrap">Models</Th>
											<Th fontWeight="800" color={DARK} fontSize="13px" whiteSpace="nowrap">Engine Size</Th>
											<Th fontWeight="800" color={DARK} fontSize="13px" whiteSpace="nowrap">Fuel</Th>
											<Th fontWeight="800" color={DARK} fontSize="13px" whiteSpace="nowrap" minW="160px">Engine Code</Th>
											<Th fontWeight="800" color={DARK} fontSize="13px" whiteSpace="nowrap">Years</Th>
											<Th whiteSpace="nowrap"></Th>
										</Tr>
									</Thead>
									<Tbody>
										{specs.costTable.map((row, idx) => (
											<Tr
												key={idx}
												cursor="pointer"
												transition="all 0.15s"
												_hover={{ bg: "red.50", transform: "scale(1.005)" }}
												onClick={() => handleItemClick(`${row.model} (${row.engineSize} - ${row.engineCode})`)}
											>
												<Td fontWeight="700" color={DARK} whiteSpace="nowrap">{row.model}</Td>
												<Td whiteSpace="nowrap">{row.engineSize}</Td>
												<Td whiteSpace="nowrap">{row.fuel}</Td>
												<Td fontFamily="mono" fontSize="12px" color="blue.600" whiteSpace="normal" minW="160px">{row.engineCode}</Td>
												<Td fontWeight="600" whiteSpace="nowrap">{row.years}</Td>
												<Td whiteSpace="nowrap" textAlign="right">
													<Button
														size="sm"
														bg={RED}
														color="white"
														_hover={{ bg: "#c40000" }}
														fontSize="12px"
														fontWeight="700"
														borderRadius="md"
														h="32px"
														px={4}
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

						{/* Mobile Card View */}
						<Box display={{ base: "block", md: "none" }}>
							<VStack spacing={4} align="stretch">
								{specs.costTable.map((row, idx) => (
									<Box
										key={idx}
										bg="white"
										p={5}
										borderRadius="2xl"
										border="1px solid"
										borderColor="gray.200"
										boxShadow="sm"
										onClick={() => handleItemClick(`${row.model} (${row.engineSize} - ${row.engineCode})`)}
										cursor="pointer"
										transition="all 0.2s"
										_hover={{ borderColor: RED, bg: "red.50" }}
									>
										<VStack align="start" spacing={3}>
											<Text fontWeight="800" color={DARK} fontSize="16px" lineHeight="1.4">
												{row.model}
											</Text>
											
											<SimpleGrid columns={2} spacing={3} w="full" fontSize="13px" py={1}>
												<Box>
													<Text color="gray.400" fontWeight="600" fontSize="11px" textTransform="uppercase">Engine Size</Text>
													<Text color="gray.800" fontWeight="700">{row.engineSize}</Text>
												</Box>
												<Box>
													<Text color="gray.400" fontWeight="600" fontSize="11px" textTransform="uppercase">Fuel Type</Text>
													<Text color="gray.800" fontWeight="700">{row.fuel}</Text>
												</Box>
												<Box>
													<Text color="gray.400" fontWeight="600" fontSize="11px" textTransform="uppercase">Engine Code</Text>
													<Text color="blue.600" fontFamily="mono" fontWeight="700">{row.engineCode}</Text>
												</Box>
												<Box>
													<Text color="gray.400" fontWeight="600" fontSize="11px" textTransform="uppercase">Years</Text>
													<Text color="gray.800" fontWeight="700">{row.years}</Text>
												</Box>
											</SimpleGrid>

											<Flex w="full" justify="space-between" align="center" pt={3} borderTop="1px dashed" borderColor="gray.100">
												<Text fontSize="13px" fontWeight="800" color="green.600">
													Quote Request
												</Text>
												<Button
													size="sm"
													bg={RED}
													color="white"
													_hover={{ bg: "#c40000" }}
													fontSize="12px"
													fontWeight="700"
													borderRadius="md"
													h="32px"
													px={5}
												>
													Get Quote
												</Button>
											</Flex>
										</VStack>
									</Box>
								))}
							</VStack>
						</Box>
					</Container>
				</Box>
			)}

			{/* ── SUPPORT SECTIONS ── */}
			<EasyStepsSection />
			{/* <ReviewsSection /> */}
			<WarrantyBannerSection />
			<HelpBannerSection />

			{/* ── QUOTE REQUEST MODAL ── */}
			<Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
				<ModalOverlay backdropFilter="blur(4px)" />
				<ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
					<ModalCloseButton
						zIndex={10}
						top={4}
						right={4}
						bg="white"
						rounded="full"
						shadow="sm"
						_hover={{ bg: "gray.100" }}
					/>
					<ModalBody p={0} bg="#F8FAFC">
						<CallSellerPage
							isModal={true}
							onCloseModal={onClose}
							vrm=""
							brand={brand.name}
							model={model.name}
							engineType={selectedSpec}
							category="Car Engines"
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
}
