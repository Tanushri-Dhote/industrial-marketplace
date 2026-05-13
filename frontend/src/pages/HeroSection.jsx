// src/components/HeroSection.jsx
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	Input,
	SimpleGrid,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import { FaArrowRight, FaCar, FaCheckCircle, FaTools } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionFlex = motion(Flex);

const DARK = "#0F172A";
const RED = "#D90404";
const GOLD = "#FFD700";

const POPULAR_BRANDS = [
	{ name: "Ford", slug: "ford" },
	{ name: "Volkswagen", slug: "volkswagen" },
	{ name: "BMW", slug: "bmw" },
	{ name: "Audi", slug: "audi" },
	{ name: "Mercedes-Benz", slug: "mercedes-benz" },
	{ name: "Vauxhall", slug: "vauxhall" },
];

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
	animate: { transition: { staggerChildren: 0.12 } },
};

export default function HeroSection({ category }) {
	const navigate = useNavigate();
	const toast = useToast();
	const queryClient = useQueryClient();

	// Shared States
	const [activeTab, setActiveTab] = useState("vrm"); // "vrm" or "manual"
	const [vrm, setVrm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");

	// Local states for dependent lookups
	const [models, setModels] = useState([]);
	const [years, setYears] = useState([]);
	const [types, setTypes] = useState([]);

	const [selectedBrand, setSelectedBrand] = useState("");
	const [selectedModel, setSelectedModel] = useState("");
	const [selectedYear, setSelectedYear] = useState("");
	const [selectedType, setSelectedType] = useState("");

	const isCategoryPage = category && category !== "Industrial Engines";

	// TanStack Queries
	const { data: brands = [] } = useQuery({
		queryKey: ["brands"],
		queryFn: async () => {
			const res = await API.get("/brands");
			return res.data?.data || res.data || [];
		},
		staleTime: 1000 * 60 * 30, // 30 minutes
	});

	const { data: partTypes = [] } = useQuery({
		queryKey: ["part-types"],
		queryFn: async () => {
			const res = await API.get("/part-types");
			return res.data?.data || res.data || [];
		},
		staleTime: 1000 * 60 * 30,
	});

	// Handlers
	const handleBrandChange = async (brandId) => {
		setSelectedBrand(brandId);
		setSelectedModel("");
		setSelectedYear("");
		setSelectedType("");
		setModels([]);
		setYears([]);
		setTypes([]);

		if (brandId) {
			try {
				const data = await queryClient.fetchQuery({
					queryKey: ["models", brandId],
					queryFn: async () => {
						const res = await API.get(`/models/${brandId}`);
						return res.data?.data || [];
					},
				});
				setModels(data);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleModelChange = async (modelId) => {
		setSelectedModel(modelId);
		setSelectedYear("");
		setSelectedType("");
		setYears([]);
		setTypes([]);

		if (modelId) {
			try {
				const res = await API.get(`/years/${modelId}`);
				setYears(res.data?.data || []);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleYearChange = async (year) => {
		setSelectedYear(year);
		setSelectedType("");
		setTypes([]);

		if (year) {
			try {
				const res = await API.get(`/types/${year}`);
				setTypes(res.data?.data || []);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleVRMSubmit = () => {
		if (!vrm.trim()) return toast({ title: "Enter registration number", status: "warning" });
		if (!selectedCategory) return toast({ title: "Please select a part", status: "warning" });

		const cleanedVRM = vrm.replace(/\s+/g, "").toUpperCase();
		const ukVrmRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;

		if (!ukVrmRegex.test(cleanedVRM)) {
			return toast({
				title: "Invalid Registration",
				description: "Enter valid UK number plate",
				status: "error",
			});
		}

		navigate("/call-seller", {
			state: { vrm: cleanedVRM, category: selectedCategory, searchType: "vrm" },
		});
	};

	const handleManualSubmit = () => {
		if (!selectedBrand || !selectedModel || !selectedYear || !selectedType || !selectedCategory) {
			return toast({ title: "Incomplete Selection", status: "warning" });
		}

		const brandName = brands.find((b) => b._id === selectedBrand)?.name || "";
		const modelName = models.find((m) => m._id === selectedModel)?.name || "";

		navigate("/call-seller", {
			state: {
				brand: brandName,
				model: modelName,
				year: selectedYear,
				type: selectedType,
				category: selectedCategory,
				searchType: "manual",
			},
		});
	};

	const BrandQuickSelect = () => (
		<VStack align="stretch" spacing={3}>
			<Text fontSize="xs" fontWeight="800" color="whiteAlpha.600" textTransform="uppercase">
				Popular Makes
			</Text>
			<SimpleGrid columns={3} spacing={2}>
				{POPULAR_BRANDS.map((b) => {
					const brandObj = brands.find((db) => db.slug === b.slug);
					return (
						<Button
							key={b.slug}
							size="sm"
							variant="outline"
							color="white"
							borderColor="whiteAlpha.300"
							_hover={{ bg: "whiteAlpha.200", borderColor: "white", transform: "translateY(-2px)" }}
							transition="all 0.2s"
							fontSize="11px"
							onClick={() => {
								setActiveTab("manual");
								if (brandObj) handleBrandChange(brandObj._id);
							}}
						>
							{b.name}
						</Button>
					);
				})}
			</SimpleGrid>
		</VStack>
	);

	return (
		<Box
			position="relative"
			minH={{ base: "85vh", lg: "750px" }}
			display="flex"
			alignItems="center"
			overflow="hidden"
		>
			{/* Background */}
			<Box position="absolute" inset={0} bg={DARK}>
				<MotionBox
					initial={{ scale: 1.1, opacity: 0 }}
					animate={{ scale: 1, opacity: 0.4 }}
					transition={{ duration: 1.5, ease: "easeOut" }}
					w="full"
					h="full"
				>
					<Image
						src="/car-engine-banner.jpg"
						alt="Banner"
						objectFit="cover"
						w="full"
						h="full"
						filter="grayscale(20%)"
					/>
				</MotionBox>
				<Box
					position="absolute"
					inset={0}
					bgGradient="linear(to-b, transparent, rgba(15, 23, 42, 0.9))"
				/>
			</Box>

			<Container maxW="container.xl" position="relative" zIndex={2} py={12}>
				<Flex
					direction={{ base: "column", lg: "row" }}
					align="center"
					justify="space-between"
					gap={12}
				>
					{/* Left Side: Copy */}
					<MotionVStack
						align={{ base: "center", lg: "flex-start" }}
						spacing={6}
						flex={1.2}
						textAlign={{ base: "center", lg: "left" }}
						variants={staggerContainer}
						initial="initial"
						animate="animate"
					>
						<MotionBox variants={fadeInUp}>
							<Badge
								colorScheme="red"
								px={3}
								py={1}
								borderRadius="full"
								fontSize="xs"
								fontWeight="800"
								letterSpacing="widest"
							>
								UK'S #1 ENGINE NETWORK
							</Badge>
						</MotionBox>

						<MotionBox variants={fadeInUp}>
							<Heading
								color="white"
								fontSize={{ base: "32px", md: "48px", lg: "64px" }}
								fontWeight="900"
								lineHeight={{ base: "1.2", md: "1.1" }}
							>
								{isCategoryPage ? `Find ${category} for Sale` : "Engine Replacement Made Easy."}
							</Heading>
						</MotionBox>

						<MotionBox variants={fadeInUp}>
							<Text color="whiteAlpha.800" fontSize={{ base: "16px", md: "20px" }} maxW="600px">
								Get access to 200+ verified reconditioners and breakers across the UK. Save up
								to 50% on used & reconditioned engines.
							</Text>
						</MotionBox>

						<MotionBox variants={fadeInUp}>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} w="full" maxW="500px">
								{[
									"Verified Suppliers Only",
									"Up to 1 Year Warranty",
									"Free Nationwide Delivery",
									"No Upfront Payment"
								].map((feature, i) => (
									<HStack key={i} color="whiteAlpha.900">
										<Icon as={FaCheckCircle} color="green.400" />
										<Text fontWeight="600">{feature}</Text>
									</HStack>
								))}
							</SimpleGrid>
						</MotionBox>
					</MotionVStack>

					{/* Right Side: The Form Card */}
					<MotionBox
						bg="rgba(15, 23, 42, 0.85)"
						backdropFilter="blur(20px)"
						p={{ base: 5, md: 8 }}
						borderRadius={{ base: "2xl", md: "3xl" }}
						boxShadow="2xl"
						w="full"
						maxW="480px"
						border="1px solid"
						borderColor="whiteAlpha.200"
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
					>
						{/* Tabs */}
						<HStack bg="whiteAlpha.100" p={1} borderRadius="xl" mb={8}>
							<Button
								flex={1}
								variant="ghost"
								size="sm"
								color={activeTab === "vrm" ? DARK : "white"}
								bg={activeTab === "vrm" ? GOLD : "transparent"}
								_hover={{ bg: activeTab === "vrm" ? GOLD : "whiteAlpha.200" }}
								onClick={() => setActiveTab("vrm")}
								leftIcon={<FaCar />}
								fontWeight="800"
								transition="all 0.3s"
							>
								Registration
							</Button>
							<Button
								flex={1}
								variant="ghost"
								size="sm"
								color={activeTab === "manual" ? DARK : "white"}
								bg={activeTab === "manual" ? GOLD : "transparent"}
								_hover={{ bg: activeTab === "manual" ? GOLD : "whiteAlpha.200" }}
								onClick={() => setActiveTab("manual")}
								leftIcon={<FaTools />}
								fontWeight="800"
								transition="all 0.3s"
							>
								Manual
							</Button>
						</HStack>

						<AnimatePresence mode="wait">
							<MotionBox
								key={activeTab}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
							>
								<VStack spacing={6} align="stretch">
									{activeTab === "vrm" ? (
										<VStack spacing={4} align="stretch">
											<Box>
												<MotionFlex
													bg={GOLD}
													borderRadius="xl"
													overflow="hidden"
													h={{ base: "56px", md: "64px" }}
													align="stretch"
													border="3px solid"
													borderColor={GOLD}
													boxShadow="lg"
													whileFocusWithin={{ scale: 1.02 }}
													transition={{ duration: 0.2 }}
												>
													<VStack bg="#003399" w="50px" justify="center" spacing={0}>
														<Text fontSize="10px" color="white" fontWeight="900">GB</Text>
														<Text color={GOLD} fontSize="12px">★</Text>
													</VStack>
													<Input
														placeholder="ENTER REG"
														value={vrm}
														onChange={(e) => setVrm(e.target.value.toUpperCase())}
														variant="unstyled"
														bg="white"
														color={DARK}
														_placeholder={{ color: "gray.300" }}
														h="full"
														fontSize="28px"
														fontWeight="900"
														textAlign="center"
														letterSpacing="2px"
													/>
												</MotionFlex>
											</Box>

											<select
												value={selectedCategory}
												onChange={(e) => setSelectedCategory(e.target.value)}
												style={{
													padding: "16px",
													borderRadius: "12px",
													fontSize: "16px",
													fontWeight: "700",
													width: "100%",
													backgroundColor: "rgba(255,255,255,0.1)",
													color: "white",
													border: "1px solid rgba(255,255,255,0.2)",
												}}
											>
												<option value="" style={{ color: DARK }}>Select Part Type</option>
												{partTypes.map((pt) => (
													<option key={pt._id} value={pt.slug} style={{ color: DARK }}>{pt.name}</option>
												))}
											</select>

											<Button
												w="full"
												h={{ base: "56px", md: "64px" }}
												bg={RED}
												color="white"
												fontSize={{ base: "16px", md: "18px" }}
												fontWeight="900"
												borderRadius="xl"
												onClick={handleVRMSubmit}
												_hover={{ bg: "#B70303", transform: "translateY(-2px)", boxShadow: "xl" }}
												rightIcon={<FaArrowRight />}
											>
												Get Free Quotes
											</Button>

											<BrandQuickSelect />
										</VStack>
									) : (
										<VStack spacing={4} align="stretch">
											<SimpleGrid columns={2} spacing={3}>
												<select
													value={selectedBrand}
													onChange={(e) => handleBrandChange(e.target.value)}
													style={{ padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", background: "white" }}
												>
													<option value="">Make</option>
													{brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
												</select>
												<select
													value={selectedModel}
													onChange={(e) => handleModelChange(e.target.value)}
													style={{ padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", background: "white" }}
												>
													<option value="">Model</option>
													{models.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
												</select>
											</SimpleGrid>

											<SimpleGrid columns={2} spacing={3}>
												<select
													value={selectedYear}
													onChange={(e) => handleYearChange(e.target.value)}
													style={{ padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", background: "white" }}
												>
													<option value="">Year</option>
													{years.map((y, i) => <option key={i} value={y.name}>{y.name}</option>)}
												</select>
												<select
													value={selectedType}
													onChange={(e) => setSelectedType(e.target.value)}
													style={{ padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", background: "white" }}
												>
													<option value="">Type</option>
													{types.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
												</select>
											</SimpleGrid>

											<select
												value={selectedCategory}
												onChange={(e) => setSelectedCategory(e.target.value)}
												style={{
													padding: "16px",
													borderRadius: "12px",
													fontSize: "16px",
													fontWeight: "700",
													width: "100%",
													backgroundColor: "rgba(255,255,255,0.1)",
													color: "white",
													border: "1px solid rgba(255,255,255,0.2)",
												}}
											>
												<option value="" style={{ color: DARK }}>Select Part Type</option>
												{partTypes.map((pt) => (
													<option key={pt._id} value={pt.slug} style={{ color: DARK }}>{pt.name}</option>
												))}
											</select>

											<Button
												w="full"
												h="64px"
												bg={RED}
												color="white"
												fontSize="18px"
												fontWeight="900"
												borderRadius="xl"
												onClick={handleManualSubmit}
												_hover={{ bg: "#B70303", transform: "translateY(-2px)", boxShadow: "xl" }}
												rightIcon={<FaArrowRight />}
											>
												Get Free Quotes
											</Button>
										</VStack>
									)}

									<Text textAlign="center" color="whiteAlpha.600" fontSize="xs">
										By searching, you agree to our{" "}
										<Text as="span" textDecor="underline" cursor="pointer" _hover={{ color: "white" }} onClick={() => navigate("/terms-and-conditions")}>
											Terms of Service
										</Text>
										.
									</Text>
								</VStack>
							</MotionBox>
						</AnimatePresence>
					</MotionBox>
				</Flex>
			</Container>
		</Box>
	);
}
