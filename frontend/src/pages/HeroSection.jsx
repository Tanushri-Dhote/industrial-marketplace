// src/components/HeroSection.jsx
import React from "react";
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	Input,
	Text,
	VStack,
	Circle,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalBody,
	useDisclosure,
	Select,
	SimpleGrid,
	GridItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
	FaShieldAlt,
	FaTools,
	FaTruck,
	FaSearch,
	FaCog,
	FaPlus,
	FaCar,
	FaCogs,
} from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronRightIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { ShieldCheck, Wrench, Clock, BadgePercent, Car } from "lucide-react";
import CallSellerPage from "./CallSellerPage";
import API from "../services/api";
import { toast } from "sonner";

const MotionBox = motion(Box);

const RED = "#D90404";
const DARK = "#111111";

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

const ShieldCheckIcon = (props) => (
	<Icon viewBox="0 0 24 24" {...props}>
		<path
			fill="currentColor"
			d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-1.5-6l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4-7 7z"
		/>
	</Icon>
);

export default function HeroSection({ category = "Engines", initialBrand = "", initialModel = "" }) {
	const [regNumber, setRegNumber] = useState("");
	const [selectedBrand, setSelectedBrand] = useState(initialBrand || "");
	const [brands, setBrands] = useState([]);
	const [models, setModels] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedModel, setSelectedModel] = useState(initialModel || "");
	const [selectedYear, setSelectedYear] = useState("");
	const [selectedEngineSize, setSelectedEngineSize] = useState("");
	const [selectedPart, setSelectedPart] = useState("Engine");

	const [dynamicYears, setDynamicYears] = useState([]);
	const [dynamicEngines, setDynamicEngines] = useState([]);
	const [loadingModels, setLoadingModels] = useState(false);
	const [loadingProducts, setLoadingProducts] = useState(false);

	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const isInitialBrand = React.useRef(true);

	useEffect(() => {
		if (initialBrand) {
			setSelectedBrand(initialBrand);
		}
	}, [initialBrand]);

	useEffect(() => {
		if (initialModel) {
			setSelectedModel(initialModel);
		}
	}, [initialModel]);

	const yearsList = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"];

	const engineSizesList = [
		"1.0L Petrol",
		"1.2L Petrol",
		"1.4L Petrol",
		"1.6L Diesel",
		"1.6L Petrol",
		"2.0L Diesel",
		"2.0L Petrol",
		"3.0L Diesel",
		"3.0L Petrol",
		"Petrol (Other)",
		"Diesel (Other)"
	];

	// useEffect(() => {
	// 	const fetchBrands = async () => {
	// 		try {
	// 			const res = await API.get("/brands");
	// 			setBrands(res.data.data || []);
	// 		} catch (error) {
	// 			console.error("Failed to fetch brands", error);
	// 		}
	// 	};

	// 	fetchBrands();
	// }, []);


	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const res = await API.get("/brands");

				const filteredBrands = (res.data.data || []);
				setBrands(filteredBrands);
			} catch (error) {
				console.error("Failed to fetch brands", error);
			}
		};

		fetchBrands();
	}, []);

	useEffect(() => {
		const fetchModels = async () => {
			if (!selectedBrand) {
				setModels([]);
				setSelectedClass("");
				setSelectedModel("");
				setDynamicYears([]);
				setSelectedYear("");
				setDynamicEngines([]);
				setSelectedEngineSize("");
				return;
			}
			setLoadingModels(true);
			try {
				const brandObj = brands.find((b) => b.slug === selectedBrand);
				if (brandObj) {
					const res = await API.get(`/models/${brandObj._id}`);
					setModels(res.data?.data || res.data || []);
				} else {
					setModels([]);
				}
				setSelectedClass("");
				if (isInitialBrand.current && initialModel) {
					isInitialBrand.current = false;
				} else {
					setSelectedModel("");
				}
				setDynamicYears([]);
				setSelectedYear("");
				setDynamicEngines([]);
				setSelectedEngineSize("");
			} catch (error) {
				console.error("Failed to fetch models", error);
				setModels([]);
				setSelectedClass("");
				if (isInitialBrand.current && initialModel) {
					isInitialBrand.current = false;
				} else {
					setSelectedModel("");
				}
			} finally {
				setLoadingModels(false);
			}
		};

		fetchModels();
	}, [selectedBrand, brands]);
	useEffect(() => {
		const fetchModelDetails = async () => {
			if (!selectedBrand || !selectedModel) {
				setDynamicYears([]);
				setSelectedYear("");
				setDynamicEngines([]);
				setSelectedEngineSize("");
				return;
			}

			const hasYearType = models.some(m => m.year || m.type);
			if (hasYearType) {
				// const years = [...new Set(
				// 	models
				// 		.filter(m => m.name === selectedModel)
				// 		.map(m => m.year)
				// 		.filter(Boolean)
				// )].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

				const years = [
					...new Set(
						models
							.filter((m) => m.name === selectedModel)
							.flatMap((m) => {
								if (!m.year) return [];

								// Handle ranges like "2009 - 2025"
								if (m.year.includes("-")) {
									const [start, end] = m.year.split("-").map((y) => parseInt(y.trim(), 10));

									if (!isNaN(start) && !isNaN(end)) {
										const arr = [];
										for (let y = start; y <= end; y++) {
											arr.push(String(y));
										}
										return arr;
									}
								}

								return [m.year.trim()];
							})
					)
				].sort((a, b) => Number(a) - Number(b));

				setDynamicYears(years);
				setDynamicYears(years);
				setSelectedYear("");
				setDynamicEngines([]);
				setSelectedEngineSize("");
				return;
			}

			setLoadingProducts(true);
			try {
				const brandObj = brands.find((b) => b.slug === selectedBrand);
				const modelObj = models.find((m) => m.slug === selectedModel);

				const makeFilter = brandObj ? brandObj.name : selectedBrand;
				const modelName = modelObj ? modelObj.name : selectedModel;

				const res = await API.get("/products", {
					params: { make: makeFilter, model: modelName }
				});
				const products = res.data?.data || res.data || [];

				if (products.length > 0) {
					const years = [...new Set(products.map(p => p.year).filter(Boolean))]
						.map(Number)
						.sort((a, b) => b - a)
						.map(String);

					let engines = [];
					products.forEach(p => {
						if (p.engineType) engines.push(p.engineType);
						if (p.specifications) {
							const specsObj = p.specifications instanceof Map
								? Object.fromEntries(p.specifications)
								: p.specifications;

							const size = specsObj["Engine Size"] || specsObj["Engine Size/Type"] || specsObj["engineSize"];
							if (size) engines.push(size);
						}
						if (p.compatibility && Array.isArray(p.compatibility)) {
							p.compatibility.forEach(c => {
								if (c.engine) engines.push(c.engine);
								if (c.code) engines.push(c.code);
							});
						}
					});
					const uniqueEngines = [...new Set(engines.filter(Boolean))].sort();

					setDynamicYears(years.length > 0 ? years : yearsList);
					setDynamicEngines(uniqueEngines.length > 0 ? uniqueEngines : engineSizesList);
				} else {
					setDynamicYears(yearsList);
					setDynamicEngines(engineSizesList);
				}
			} catch (error) {
				console.error("Failed to fetch matching products", error);
				setDynamicYears(yearsList);
				setDynamicEngines(engineSizesList);
			} finally {
				setLoadingProducts(false);
			}
		};

		fetchModelDetails();
	}, [selectedModel, selectedBrand, brands, models]);

	useEffect(() => {
		const hasYearType = models.some(m => m.year || m.type);
		if (hasYearType && selectedModel && selectedYear) {
			const types = [...new Set(
				models
					.filter(m => m.name === selectedModel && m.year === selectedYear)
					.flatMap(m => m.type ? m.type.split("; ") : [])
			)].sort();
			setDynamicEngines(types);
			setSelectedEngineSize("");
		}
	}, [selectedYear, selectedModel, models]);

	const handleSearch = () => {
		if (!regNumber && !selectedBrand) return;

		const query = new URLSearchParams();

		if (regNumber) query.append("search", regNumber);
		if (selectedBrand) query.append("brand", selectedBrand);
		if (selectedModel) query.append("model", selectedModel);

		navigate(`/all-engines?${query.toString()}`);
	};

	const handleGetQuotesSubmit = () => {
		if (!selectedBrand) {
			return toast.error("Please select a brand");
		}
		if (!selectedModel) {
			return toast.error("Please select a model");
		}
		if (!selectedYear) {
			return toast.error("Please select a year");
		}
		if (showEngineSizeSelect && !selectedEngineSize) {
			return toast.error("Please select engine size/type");
		}

		const brandObj = brands.find((b) => b.slug === selectedBrand);
		const hasYearType = models.some(m => m.year || m.type);
		const modelObj = hasYearType
			? models.find((m) => m.name === selectedModel)
			: models.find((m) => m.slug === selectedModel);

		navigate("/call-seller", {
			state: {
				brand: brandObj ? brandObj.name : selectedBrand,
				model: modelObj ? modelObj.name : selectedModel,
				year: selectedYear,
				type: selectedEngineSize,
				category: selectedPart,
				searchType: "manual",
			},
		});
	};

	const filteredModels = selectedBrand === "mercedes-benz"
		? (selectedClass ? models.filter(m => getMercedesClass(m.name) === selectedClass) : [])
		: models;

	const showClassSelect = selectedBrand === "mercedes-benz";
	const showEngineSizeSelect = !selectedYear || dynamicEngines.length > 0;


	return (
		<Box backgroundColor="#F8FAFC" overflow="visible">
			{/* ── HERO VISUAL BACKGROUND SECTION ── */}
			<Box
				bgImage="url('/hero.png')"
				bgSize="cover"
				bgPosition="center"
				bgRepeat="no-repeat"
				minH={{ base: "auto", lg: "75svh" }}
				display={{ lg: "flex" }}
				alignItems={{ lg: "center" }}
				py={{ base: 12, lg: 0 }}
				overflow="visible"
			>
				<Container maxW="container.xl" px={{ base: 4, md: 6 }}>
					{/* ── HERO ROW ── */}
					<Flex
						direction={{ base: "column", lg: "row" }}
						align="center"
						justify="space-between"
						gap={{ base: 10, lg: 8 }}
						position="relative"
						zIndex={2}
					>
						{/* LEFT CONTENT */}
						<MotionBox
							flex={{ base: "1", lg: "1.2" }}
							alignItems={{ base: "center", lg: "flex-start" }}
							display="flex"
							flexDirection="column"
							justifyContent="center"
							textAlign={{ base: "center", lg: "left" }}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<VStack
								align={{ base: "center", lg: "flex-start" }}
								spacing={6}
								w="full"
							>
								{/* Badge */}
								<Flex align="center" gap={3} justify={{ base: "center", lg: "flex-start" }}>
									<Box
										bg={RED}
										color="white"
										pl={4}
										pr={8}
										py="6px"
										fontSize="11px"
										fontWeight="800"
										letterSpacing="0.8px"
										borderRadius="4px"
										clipPath="polygon(0 0, 100% 0, 92% 100%, 0 100%)"
									>
										QUALITY RECONDITIONED ENGINES
									</Box>
									<HStack spacing="5px">
										<Box w="3px" h="14px" bg={RED} transform="skewX(-20deg)" />
										<Box w="3px" h="14px" bg={RED} transform="skewX(-20deg)" />
									</HStack>
								</Flex>

								{/* Heading */}
								<Heading
									fontSize={{ base: "36px", md: "52px", lg: "58px" }}
									lineHeight="1.1"
									fontWeight="900"
									color="#0F172A"
									letterSpacing="-0.5px"
								>
									High Performance.
									<br />
									<Text as="span" color={RED}>
										Like New.
									</Text>
								</Heading>

								{/* Subtitle */}
								<Text
									fontSize={{ base: "14px", md: "16px" }}
									color="gray.600"
									lineHeight="1.6"
									maxW="480px"
								>
									Expertly reconditioned engines with quality parts,
									<br />
									built to last and priced right.
								</Text>

								{/* Feature Icons */}
								<Flex
									direction={{ base: "column", md: "row" }}
									align="center"
									justify={{ base: "center", lg: "flex-start" }}
									gap={{ base: 4, md: 6 }}
									w="full"
									py={2}
								>
									<HStack spacing={3} align="center" justify={{ base: "center", md: "flex-start" }} w={{ base: "full", md: "auto" }}>
										<Box color={RED}>
											<ShieldCheckIcon boxSize="28px" />
										</Box>
										<VStack align={{ base: "center", md: "start" }} spacing={0} textAlign={{ base: "center", md: "left" }}>
											<Text fontWeight="800" fontSize="13px" color="#0F172A" lineHeight="1.2">
												Quality Tested
											</Text>
											<Text fontSize="11px" color="gray.500" fontWeight="500">
												100% Inspected
											</Text>
										</VStack>
									</HStack>

									<Box display={{ base: "none", md: "block" }} w="1px" h="30px" bg="gray.300" mx={1} />

									<HStack spacing={3} align="center" justify={{ base: "center", md: "flex-start" }} w={{ base: "full", md: "auto" }}>
										<Box color={RED}>
											<ShieldCheckIcon boxSize="28px" />
										</Box>
										<VStack align={{ base: "center", md: "start" }} spacing={0} textAlign={{ base: "center", md: "left" }}>
											<Text fontWeight="800" fontSize="13px" color="#0F172A" lineHeight="1.2">
												06 Months Warranty
											</Text>
											<Text fontSize="11px" color="gray.500" fontWeight="500">
												For Peace of Mind
											</Text>
										</VStack>
									</HStack>

									<Box display={{ base: "none", md: "block" }} w="1px" h="30px" bg="gray.300" mx={1} />

									<HStack spacing={3} align="center" justify={{ base: "center", md: "flex-start" }} w={{ base: "full", md: "auto" }}>
										<Box color={RED}>
											<Icon as={FaTruck} boxSize="26px" />
										</Box>
										<VStack align={{ base: "center", md: "start" }} spacing={0} textAlign={{ base: "center", md: "left" }}>
											<Text fontWeight="800" fontSize="13px" color="#0F172A" lineHeight="1.2">
												Nationwide Delivery
											</Text>
											<Text fontSize="11px" color="gray.500" fontWeight="500">
												Across the UK
											</Text>
										</VStack>
									</HStack>
								</Flex>

								{/* Slogan Capsule */}
								<Box
									bg="#0A1128"
									color="white"
									py="10px"
									px={5}
									borderRadius="md"
									display="inline-flex"
									alignItems="center"
									boxShadow="md"
								>
									<Box w="3px" h="14px" bg={RED} mr={3} borderRadius="full" />
									<Text fontSize="13px" fontWeight="600" letterSpacing="0.5px">
										Built to <Text as="span" fontWeight="800" color="white">Perform</Text>. Built to <Text as="span" fontWeight="800" color="white">Last</Text>.
									</Text>
								</Box>

								{/* Buttons */}
								<Flex
									direction={{ base: "column", md: "row" }}
									gap={4}
									w="full"
									justify={{ base: "center", lg: "flex-start" }}
									pt={2}
								>
									<Button
										as={RouterLink}
										to="/#brand-section"
										bg={RED}
										color="white"
										leftIcon={<FaCogs />}
										size="lg"
										w={{ base: "full", md: "auto" }}
										px={8}
										_hover={{ bg: "#c40000", transform: "translateY(-1px)" }}
										_active={{ transform: "translateY(0)" }}
										borderRadius="md"
										fontSize="15px"
										fontWeight="700"
										boxShadow="md"
										onClick={(e) => {
											const element = document.getElementById("brand-section");
											if (element) {
												e.preventDefault();
												element.scrollIntoView({ behavior: "smooth" });
											}
										}}
									>
										View Engines
									</Button>

									<Button
										bg="white"
										color={DARK}
										size="lg"
										w={{ base: "full", md: "auto" }}
										px={8}
										leftIcon={<MdLibraryBooks />}
										border="1px solid"
										borderColor="gray.300"
										_hover={{ bg: "gray.50", transform: "translateY(-1px)" }}
										_active={{ transform: "translateY(0)" }}
										borderRadius="md"
										onClick={onOpen}
										fontSize="15px"
										fontWeight="700"
										boxShadow="sm"
									>
										Get A Quote
									</Button>
								</Flex>
							</VStack>
						</MotionBox>

						{/* RIGHT CONTENT / SPACER / IMAGE */}
						<Box
							flex={{ base: "1", lg: "0.8" }}
							w="full"
							display="flex"
							justifyContent={{ base: "center", lg: "flex-end" }}
						>
							{/* Desktop Spacer (since background image contains the engine) */}
							<Box display={{ base: "none", lg: "block" }} w="100%" h="420px" />
						</Box>
					</Flex>
				</Container>
			</Box>

			{/* ── VEHICLE SELECTOR SECTION (Separate block below background visual) ── */}
			<Box py={{ base: 8, lg: 12 }} bg="#F8FAFC">
				<Container maxW="container.xl" px={{ base: 4, md: 6 }}>
					{/* ── REDESIGNED VEHICLE SELECTOR CARD ── */}
					<Box
						bg="white"
						px={{ base: 5, md: 8 }}
						py={{ base: 6, md: 8 }}
						borderRadius="2xl"
						boxShadow="0 10px 30px -10px rgba(15, 23, 42, 0.08)"
						border="1px solid"
						borderColor="gray.100"
						maxW="980px"
						mx="auto"
						position="relative"
						zIndex={5}
					>
						<VStack spacing={6} align="stretch">
							{/* Header Row */}
							<Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
								<HStack spacing={3} align="center">
									<Circle size="42px" bg="red.50" border="1px solid" borderColor="red.100" flexShrink={0}>
										<Icon as={Car} color={RED} boxSize={5} />
									</Circle>
									<VStack align="start" spacing={0.5}>
										<Heading as="h2" fontSize={{ base: "lg", md: "xl" }} color="gray.955" fontWeight="800">
											Select Your Vehicle Manually
										</Heading>
										<Text fontSize="xs" color="gray.500" fontWeight="500">
											Quickly find matching engines and get premium quotes in a minute
										</Text>
									</VStack>
								</HStack>

								<HStack spacing={2} bg="green.50" px={3} py={1.5} borderRadius="full" border="1px solid" borderColor="green.100" display={{ base: "none", md: "flex" }}>
									<Icon as={ShieldCheck} color="green.600" boxSize={4} />
									<Text fontSize="10px" fontWeight="700" color="green.700" letterSpacing="0.3px">
										TRUSTED BY THOUSANDS OF CUSTOMERS
									</Text>
								</HStack>
							</Flex>

							{/* Dropdowns Grid */}
							<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: showEngineSizeSelect ? 4 : 3 }} spacing={4} w="full" mt={2}>
								{/* Brand Select */}
								<VStack align="start" spacing={1.5} w="full">
									<Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
										Select Brand
									</Text>
									<Select
										placeholder="Choose Brand"
										value={selectedBrand}
										onChange={(e) => {
											setSelectedBrand(e.target.value);
											setSelectedModel("");
											setSelectedClass("");
										}}
										size="md"
										h="46px"
										bg="white"
										borderColor="gray.200"
										borderRadius="lg"
										_hover={{ borderColor: "gray.300" }}
										_focus={{ borderColor: RED, boxShadow: `0 0 0 2px rgba(225,6,0,0.1)` }}
										fontWeight="500"
										fontSize="sm"
									>
										{brands.map((brand) => (
											<option key={brand._id} value={brand.slug}>
												{brand.name}
											</option>
										))}
									</Select>
								</VStack>

								{/* Class Select (Mercedes-Benz only) */}
								{selectedBrand === "mercedes-benz" && (
									<VStack align="start" spacing={1.5} w="full">
										<Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
											Select Class
										</Text>
										<Select
											placeholder="Choose Class"
											value={selectedClass}
											onChange={(e) => {
												setSelectedClass(e.target.value);
												setSelectedModel("");
											}}
											size="md"
											h="46px"
											bg="white"
											borderColor="gray.200"
											borderRadius="lg"
											_hover={{ borderColor: "gray.300" }}
											_focus={{ borderColor: RED, boxShadow: `0 0 0 2px rgba(225,6,0,0.1)` }}
											fontWeight="500"
											fontSize="sm"
										>
											{[...new Set(models.map((m) => getMercedesClass(m.name)))].sort().map((cls) => (
												<option key={cls} value={cls}>
													{cls}
												</option>
											))}
										</Select>
									</VStack>
								)}

								{/* Model Select */}
								<VStack align="start" spacing={1.5} w="full">
									<Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
										Select Model
									</Text>
									<Select
										placeholder={loadingModels ? "Loading Models..." : "Choose Model"}
										value={selectedModel}
										onChange={(e) => setSelectedModel(e.target.value)}
										isDisabled={!selectedBrand || loadingModels || (selectedBrand === "mercedes-benz" && !selectedClass)}
										size="md"
										h="46px"
										bg="white"
										borderColor="gray.200"
										borderRadius="lg"
										_hover={{ borderColor: "gray.300" }}
										_focus={{ borderColor: RED, boxShadow: `0 0 0 2px rgba(225,6,0,0.1)` }}
										fontWeight="500"
										fontSize="sm"
									>
										{filteredModels.some(m => m.year || m.type) ? (
											[...new Set(filteredModels.map(m => m.name))]
												.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
												.map((name) => (
													<option key={name} value={name}>
														{name}
													</option>
												))
										) : (
											filteredModels.map((model) => (
												<option key={model._id} value={model.slug}>
													{model.name}
												</option>
											))
										)}
									</Select>
								</VStack>

								{/* Year Select */}
								<VStack align="start" spacing={1.5} w="full">
									<Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
										Select Year
									</Text>
									<Select
										placeholder={loadingProducts ? "Loading Years..." : "Choose Year"}
										value={selectedYear}
										onChange={(e) => setSelectedYear(e.target.value)}
										isDisabled={!selectedModel || loadingProducts}
										size="md"
										h="46px"
										bg="white"
										borderColor="gray.200"
										borderRadius="lg"
										_hover={{ borderColor: "gray.300" }}
										_focus={{ borderColor: RED, boxShadow: `0 0 0 2px rgba(225,6,0,0.1)` }}
										fontWeight="500"
										fontSize="sm"
									>
										{dynamicYears.map((y) => (
											<option key={y} value={y}>
												{y}
											</option>
										))}
									</Select>
								</VStack>

								{/* Engine Size Select */}
								{showEngineSizeSelect && (
									<VStack align="start" spacing={1.5} w="full">
										<Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
											Engine Size / Type
										</Text>
										<Select
											placeholder={loadingProducts ? "Loading Engines..." : "Select Engine Size/Type"}
											value={selectedEngineSize}
											onChange={(e) => setSelectedEngineSize(e.target.value)}
											isDisabled={!selectedYear || loadingProducts}
											size="md"
											h="46px"
											bg="white"
											borderColor="gray.200"
											borderRadius="lg"
											_hover={{ borderColor: "gray.300" }}
											_focus={{ borderColor: RED, boxShadow: `0 0 0 2px rgba(225,6,0,0.1)` }}
											fontWeight="500"
											fontSize="sm"
										>
											{dynamicEngines.map((size) => (
												<option key={size} value={size}>
													{size}
												</option>
											))}
										</Select>
									</VStack>
								)}
							</SimpleGrid>

							{/* Get Free Quotes Button aligned below */}
							<Box w="full" display="flex" justifyContent="center" mt={2}>
								<Button
									bg={RED}
									color="white"
									borderRadius="lg"
									h="50px"
									px={12}
									fontSize="md"
									fontWeight="800"
									isDisabled={!selectedBrand || !selectedModel || !selectedYear || (showEngineSizeSelect && !selectedEngineSize)}
									_hover={{ bg: "#c40000", transform: "translateY(-1px)", boxShadow: "lg" }}
									_active={{ transform: "translateY(0)" }}
									transition="all 0.15s ease"
									rightIcon={
										<Circle size="20px" bg="white" color={RED} display="inline-flex" alignItems="center" justifyContent="center">
											<ChevronRightIcon size={14} />
										</Circle>
									}
									onClick={handleGetQuotesSubmit}
									boxShadow="sm"
									w={{ base: "full", sm: "auto" }}
								>
									Get Free Quotes
								</Button>
							</Box>

							{/* Bottom Row - Features & Badge */}
							<Flex
								direction={{ base: "column", md: "row" }}
								justify="space-between"
								align="center"
								w="full"
								pt={4}
								borderTop="1px solid"
								borderColor="gray.100"
								gap={4}
								mt={2}
							>
								<HStack spacing={{ base: 4, md: 8 }} wrap="wrap" justify={{ base: "center", md: "start" }} w="full">
									<HStack spacing={2}>
										<Icon as={Wrench} color="green.500" boxSize={4} />
										<Text fontSize="xs" fontWeight="700" color="gray.600">Supply and Fitting Offered</Text>
									</HStack>
									<HStack spacing={2}>
										<Icon as={ShieldCheck} color="green.500" boxSize={4} />
										<Text fontSize="xs" fontWeight="700" color="gray.600">Unlimited Mileage Warranty*</Text>
									</HStack>
									<HStack spacing={2}>
										<Icon as={Clock} color="green.500" boxSize={4} />
										<Text fontSize="xs" fontWeight="700" color="gray.600">It Only Takes a Minute</Text>
									</HStack>
								</HStack>

								<HStack spacing={2} bg="red.50" px={3} py={1.5} borderRadius="full" border="1px solid" borderColor="red.100" flexShrink={0}>
									<Icon as={BadgePercent} color={RED} boxSize={4} />
									<Text fontSize="xs" fontWeight="900" color={RED} letterSpacing="0.5px">GUARANTEED LOWEST PRICES</Text>
								</HStack>
							</Flex>
						</VStack>
					</Box>
				</Container>
			</Box>

			{/* ── MODALS & DIALOGS ── */}
			<Container maxW="container.xl" px={{ base: 4, md: 6 }}>
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
								vrm={regNumber}
								brand={selectedBrand}
								model={selectedModel}
								year={selectedYear}
								engineType={selectedEngineSize}
								category={category}
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			</Container>
		</Box>
	);
}