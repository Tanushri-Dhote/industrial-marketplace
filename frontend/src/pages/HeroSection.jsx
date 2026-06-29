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
import { useState } from "react";
import CallSellerPage from "./CallSellerPage";
import API from "../services/api";
import { useEffect } from "react";

const MotionBox = motion(Box);

const RED = "#E10600";
const DARK = "#111111";

export default function HeroSection() {
	const [regNumber, setRegNumber] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("");
	const [brands, setBrands] = useState([]);
	const [models, setModels] = useState([]);
	const [selectedModel, setSelectedModel] = useState("");
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

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

				{/* ── SEARCH CARD (full-width below hero) ── */}
				<Box
					bg="white"
					px={{ base: 5, md: 8 }}
					py={5}
					borderRadius="2xl"
					boxShadow="md"
				>
					<Text
						color={RED}
						fontWeight="800"
						fontSize="sm"
						mb={0}
						textTransform="uppercase"
						letterSpacing="wider"
					>
						Find Your Engine
					</Text>

					<Text fontSize="sm" color="gray.500" mb={4}>
						{/* Search by make, model, reg number or engine code */}
						Search by make, model or select brand

					</Text>

					<Flex
						direction={{ base: "column", md: "row" }}
						align={{ base: "stretch", md: "flex-end" }}
						gap={3}
					>
						{/* Reg Number */}
						<Box flex="1">
							<Input
								placeholder="e.g. VW Golf"
								value={regNumber}
								onChange={(e) => setRegNumber(e.target.value)}
								bg="#FFD400"
								fontWeight="900"
								fontSize="2xl"
								textAlign="center"
								border="none"
								h="52px"
								borderRadius="md"
								_placeholder={{
									color: "gray.600",
									fontSize: "md",
									fontWeight: "500",
								}}
								color="black"
							/>
							<VStack spacing={0} align="flex-start" mt={1}>
								<Text fontSize="xs" color="gray.500" fontWeight="600">
									Search by Make, Model
								</Text>
								<Text fontSize="xs" color={RED}>
									e.g. VW Golf
								</Text>
							</VStack>
						</Box>

						{/* OR */}
						<Circle
							size="44px"
							bg="gray.100"
							fontWeight="700"
							fontSize="xs"
							color="gray.600"
							flexShrink={0}
							mb={{ base: 0, md: "40px" }}
						>
							OR
						</Circle>


						{/* Brand Dropdown */}
						<Box flex="1">
							<Select
								placeholder="Select Brand"
								value={selectedBrand}
								onChange={(e) => {
									setSelectedBrand(e.target.value);
									setSelectedModel("");
								}}
								bg="gray.100"
								h={{ base: "46px", md: "52px", lg: "56px" }}
								border="none"
								fontWeight="600"
								borderRadius="md"
								fontSize={{ base: "14px", md: "15px", lg: "16px" }}
								_placeholder={{
									color: "gray.600",
									fontSize: { base: "14px", md: "15px", lg: "16px" },
									fontWeight: "500",
								}}
							>
								{brands.map((brand) => (
									<option key={brand._id} value={brand.slug}>
										{brand.name}
									</option>
								))}
							</Select>

							<VStack spacing={0} align="flex-start" mt={1}>
								<Text fontSize="xs" color="gray.500" fontWeight="600">
									Filter by Brand
								</Text>
								<Text fontSize="xs" color={RED}>
									e.g. Mercedes-Benz
								</Text>
							</VStack>
						</Box>

						{/* Model Dropdown */}
						{selectedBrand && models.length > 0 && (
							<Box flex="1">
								<Select
									placeholder="Select Model"
									value={selectedModel}
									onChange={(e) => setSelectedModel(e.target.value)}
									bg="gray.100"
									h={{ base: "46px", md: "52px", lg: "56px" }}
									border="none"
									fontWeight="600"
									borderRadius="md"
									fontSize={{ base: "14px", md: "15px", lg: "16px" }}
									_placeholder={{
										color: "gray.600",
										fontSize: { base: "14px", md: "15px", lg: "16px" },
										fontWeight: "500",
									}}
								>
									{models.map((model) => (
										<option key={model._id} value={model.slug}>
											{model.name}
										</option>
									))}
								</Select>

								<VStack spacing={0} align="flex-start" mt={1}>
									<Text fontSize="xs" color="gray.500" fontWeight="600">
										Filter by Model
									</Text>
									<Text fontSize="xs" color={RED}>
										e.g. C-Class
									</Text>
								</VStack>
							</Box>
						)}

						{/* Search Button */}
						<Button
							bg={RED}
							color="white"
							h="52px"
							px={10}
							_hover={{ bg: "#c40000" }}
							borderRadius="md"
							flexShrink={0}
							mb={{ base: 0, md: "40px" }}
							leftIcon={<FaSearch />}
							onClick={handleSearch}
						>
							Search
						</Button>
					</Flex>
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