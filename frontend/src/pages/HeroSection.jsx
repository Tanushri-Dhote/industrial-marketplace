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
import CallSellerPage from "./CallSellerPage";
import API from "../services/api";

const MotionBox = motion(Box);

const RED = "#E10600";
const DARK = "#111111";

export default function HeroSection() {
	const [regNumber, setRegNumber] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("");
	const [brands, setBrands] = useState([]);
	const [models, setModels] = useState([]);
	const [selectedModel, setSelectedModel] = useState("");
	const [selectedYear, setSelectedYear] = useState("");
	const [selectedEngineSize, setSelectedEngineSize] = useState("");
	const [selectedPart, setSelectedPart] = useState("Engine");
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

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

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const res = await API.get("/brands");
				setBrands(res.data.data || []);
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
				setSelectedModel("");
				return;
			}
			try {
				const brandObj = brands.find((b) => b.slug === selectedBrand);
				if (brandObj) {
					const res = await API.get(`/models/${brandObj._id}`);
					setModels(res.data?.data || res.data || []);
				} else {
					setModels([]);
					setSelectedModel("");
				}
			} catch (error) {
				console.error("Failed to fetch models", error);
				setModels([]);
				setSelectedModel("");
			}
		};

		fetchModels();
	}, [selectedBrand, brands]);

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
		if (!selectedEngineSize) {
			return toast.error("Please select engine size/type");
		}

		const brandObj = brands.find((b) => b.slug === selectedBrand);
		const modelObj = models.find((m) => m.slug === selectedModel);

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
	return (
		<Box bg="#f7f7f7" pt={{ base: 8, md: 12 }} pb={0} overflow="hidden">
			<Container maxW="container.xl">
				{/* ── HERO ROW ── */}
				<Flex
					direction={{ base: "column", lg: "row" }}
					align="center"
					justify="space-between"
					gap={{ base: 10, lg: 4 }}
					mb={8}
				>
					{/* LEFT CONTENT */}
					<VStack
						flex="1"
						align={{ base: "center", lg: "flex-start" }}
						spacing={5}
						textAlign={{ base: "center", lg: "left" }}
					>
						{/* Badge */}
						<HStack
							bg="white"
							px={4}
							py={2}
							borderRadius="full"
							boxShadow="sm"
							border="1px solid"
							borderColor="gray.200"
							spacing={2}
						>
							<Icon as={FaCog} color={RED} boxSize={3} />
							<Text
								color={RED}
								fontSize="xs"
								fontWeight="700"
								textTransform="uppercase"
								letterSpacing="wide"
							>
								Quality Reconditioned Engines
							</Text>
						</HStack>

						{/* Heading */}
						<Heading
							fontSize={{ base: "38px", md: "54px", lg: "64px" }}
							lineHeight="1.05"
							fontWeight="900"
							color={DARK}
						>
							High Performance.
							<br />
							<Text as="span" color={RED}>
								Like New.
							</Text>
						</Heading>

						{/* Subtitle */}
						<Text
							fontSize={{ base: "14px", md: "15px" }}
							color="gray.600"
							maxW="420px"
						>
							Expertly reconditioned engines with quality parts, built to last
							and priced right.
						</Text>

						{/* Feature Icons */}
						<Flex
							direction="row"
							gap={6}
							flexWrap="wrap"
							justify={{ base: "center", lg: "flex-start" }}
						>
							<HStack spacing={2} align="flex-start">
								<Icon as={FaShieldAlt} color={RED} boxSize={5} mt="2px" />
								<VStack align="start" spacing={0}>
									<Text fontWeight="700" fontSize="xs">
										Quality Tested
									</Text>
									<Text fontSize="xs" color="gray.500">
										100% Inspected
									</Text>
								</VStack>
							</HStack>

							<HStack spacing={2} align="flex-start">
								<Icon as={FaTools} color={RED} boxSize={5} mt="2px" />
								<VStack align="start" spacing={0}>
									<Text fontWeight="700" fontSize="xs">
										06 Months Warranty
									</Text>
									<Text fontSize="xs" color="gray.500">
										For Peace of Mind
									</Text>
								</VStack>
							</HStack>

							<HStack spacing={2} align="flex-start">
								<Icon as={FaTruck} color={RED} boxSize={5} mt="2px" />
								<VStack align="start" spacing={0}>
									<Text fontWeight="700" fontSize="xs">
										Nationwide collection and delivery available.
									</Text>
									<Text fontSize="xs" color="gray.500">
										We can arrange the collection of your vehicle from anywhere in the UK
									</Text>
								</VStack>
							</HStack>
						</Flex>

						{/* Buttons */}
						<HStack
							spacing={4}
							flexWrap="wrap"
							justify={{ base: "center", lg: "flex-start" }}
						>
							<Button
								as={RouterLink}
								to="/all-engines"
								bg={RED}
								color="white"
								leftIcon={<FaCogs />}
								size="lg"
								px={8}
								_hover={{ bg: "#c40000" }}
								borderRadius="md"

							>
								View Engines
							</Button>

							<Button
								bg="white"
								color={DARK}
								size="lg"
								px={8}
								leftIcon={<MdLibraryBooks />}
								border="1px solid"
								borderColor="gray.300"
								_hover={{ bg: "gray.50" }}
								borderRadius="md"
								onClick={onOpen}
							>
								Get A Quote
							</Button>
						</HStack>
					</VStack>

					{/* RIGHT IMAGE */}
					<MotionBox
						flex="1"
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						display="flex"
						justifyContent="flex-end"
					>
						<Image
							src="/engine-hero.png"
							alt="Engine"
							w="100%"
							maxW={{ base: "360px", lg: "580px" }}
							objectFit="contain"
						/>
					</MotionBox>
				</Flex>

				{/* ── MANUAL VEHICLE SELECTOR CARD ── */}
				<Box
					bg="white"
					px={{ base: 5, md: 8 }}
					py={8}
					borderRadius="2xl"
					boxShadow="lg"
					border="1px solid"
					borderColor="gray.100"
					maxW="820px"
					mx="auto"
				>
					<VStack spacing={6} align="center">
						<Heading as="h2" fontSize={{ base: "22px", md: "28px" }} color="gray.800" fontWeight="800" textAlign="center">
							Select Your Vehicle Manually
						</Heading>

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
							{/* Brand Select */}
							<Select
								placeholder="Select Brand"
								value={selectedBrand}
								onChange={(e) => {
									setSelectedBrand(e.target.value);
									setSelectedModel("");
								}}
								size="lg"
								h="52px"
								bg="white"
								borderColor="gray.300"
								borderRadius="xl"
								_hover={{ borderColor: RED }}
								_focus={{ borderColor: RED, boxShadow: `0 0 0 3px rgba(225,6,0,0.15)` }}
								fontWeight="600"
							>
								{brands.map((brand) => (
									<option key={brand._id} value={brand.slug}>
										{brand.name}
									</option>
								))}
							</Select>

							{/* Model Select */}
							<Select
								placeholder="Select Model"
								value={selectedModel}
								onChange={(e) => setSelectedModel(e.target.value)}
								isDisabled={!selectedBrand}
								size="lg"
								h="52px"
								bg="white"
								borderColor="gray.300"
								borderRadius="xl"
								_hover={{ borderColor: RED }}
								_focus={{ borderColor: RED, boxShadow: `0 0 0 3px rgba(225,6,0,0.15)` }}
								fontWeight="600"
							>
								{models.map((model) => (
									<option key={model._id} value={model.slug}>
										{model.name}
									</option>
								))}
							</Select>

							{/* Year Select */}
							<Select
								placeholder="Select Year"
								value={selectedYear}
								onChange={(e) => setSelectedYear(e.target.value)}
								size="lg"
								h="52px"
								bg="white"
								borderColor="gray.300"
								borderRadius="xl"
								_hover={{ borderColor: RED }}
								_focus={{ borderColor: RED, boxShadow: `0 0 0 3px rgba(225,6,0,0.15)` }}
								fontWeight="600"
							>
								{yearsList.map((y) => (
									<option key={y} value={y}>
										{y === "2011" ? "2011 11/61 reg" : y}
									</option>
								))}
							</Select>

							{/* Engine Size Select */}
							<Select
								placeholder="Select Engine Size/Type"
								value={selectedEngineSize}
								onChange={(e) => setSelectedEngineSize(e.target.value)}
								size="lg"
								h="52px"
								bg="white"
								borderColor="gray.300"
								borderRadius="xl"
								_hover={{ borderColor: RED }}
								_focus={{ borderColor: RED, boxShadow: `0 0 0 3px rgba(225,6,0,0.15)` }}
								fontWeight="600"
							>
								{engineSizesList.map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</Select>

							{/* Part Select */}
							<Select
								value={selectedPart}
								onChange={(e) => setSelectedPart(e.target.value)}
								size="lg"
								h="52px"
								bg="white"
								borderColor="gray.300"
								borderRadius="xl"
								_hover={{ borderColor: RED }}
								_focus={{ borderColor: RED, boxShadow: `0 0 0 3px rgba(225,6,0,0.15)` }}
								fontWeight="600"
							>
								<option value="Engine">Engine</option>
							</Select>
						</SimpleGrid>

						<Button
							bg={RED}
							color="white"
							borderRadius="full"
							h="56px"
							px={10}
							fontSize="lg"
							fontWeight="800"
							_hover={{ bg: "#c40000", transform: "translateY(-2px)" }}
							_active={{ transform: "translateY(0)" }}
							transition="all 0.2s"
							rightIcon={
								<Circle size="24px" bg="white" color={RED} display="inline-flex" alignItems="center" justifyContent="center">
									<ChevronRightIcon size={18} />
								</Circle>
							}
							onClick={handleGetQuotesSubmit}
							mt={4}
							boxShadow="lg"
						>
							Get Free Quotes
						</Button>

						{/* Bullet points & badge */}
						<Flex
							direction={{ base: "column", sm: "row" }}
							justify="space-between"
							align="center"
							w="full"
							pt={4}
							gap={6}
						>
							<VStack align="flex-start" spacing={2.5} fontSize="14px" fontWeight="700" color="gray.700">
								<HStack spacing={2.5}>
									<Text color="#10B981" fontSize="16px">✓</Text>
									<Text>Supply and Fitting Offered</Text>
								</HStack>
								<HStack spacing={2.5}>
									<Text color="#10B981" fontSize="16px">✓</Text>
									<Text>Unlimited Mileage Warranty*</Text>
								</HStack>
								<HStack spacing={2.5}>
									<Text color="#10B981" fontSize="16px">✓</Text>
									<Text>It Only Takes a Minute</Text>
								</HStack>
							</VStack>

							<Box
								border="3px double #10B981"
								color="#10B981"
								borderRadius="full"
								px={4}
								py={2}
								fontWeight="900"
								fontSize="11px"
								textTransform="uppercase"
								transform="rotate(-8deg)"
								letterSpacing="1px"
								textAlign="center"
								lineHeight="1.1"
								w="100px"
								h="100px"
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								boxShadow="0 0 0 3px white, 0 0 0 5px #10B981"
								mr={{ sm: 4 }}
								bg="white"
							>
								<Text fontSize="8px">GUARANTEED</Text>
								<Text fontSize="15px" fontWeight="950" my={0.5}>LOWEST</Text>
								<Text fontSize="9px">PRICES</Text>
							</Box>
						</Flex>
					</VStack>
				</Box>




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
							<CallSellerPage isModal={true} onCloseModal={onClose} />
						</ModalBody>
					</ModalContent>
				</Modal>
			</Container>
		</Box>





	);



}