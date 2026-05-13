import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	Grid,
	GridItem,
	Heading,
	Text,
	VStack,
	HStack,
	Image,
	Badge,
	Button,
	Icon,
	IconButton,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Divider,
	Table,
	Tbody,
	Tr,
	Td,
	Th,
	Thead,
	Flex,
	Avatar,
	Spinner,
	Center,
	useDisclosure,
	SimpleGrid,
	Card,
	CardBody,
	Tag,
	Wrap,
	WrapItem,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
} from "@chakra-ui/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
	FaChevronRight,
	FaCheckCircle,
	FaShippingFast,
	FaShieldAlt,
	FaStar,
	FaPhoneAlt,
	FaClock,
	FaTachometerAlt,
	FaCalendarAlt,
	FaCog,
	FaStore,
	FaGasPump,
	FaCertificate,
	FaThumbsUp,
	FaTruck,
	FaHeadset,
	FaMapMarkerAlt,
	FaEnvelope,
	FaCheck,
} from "react-icons/fa";
import { FiShare2, FiDownload, FiPrinter } from "react-icons/fi";
import API from "../services/api";
import ConfirmProdutModel from "../components/common/ConfirmProdutModel";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionFlex = motion(Flex);
const MotionGrid = motion(Grid);

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const ProductCard = ({ product }) => (
	<MotionBox
		as={Link}
		to={`/products/${product.slug || product._id}`}
		whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
		transition={{ duration: 0.2 }}
		bg="white"
		borderRadius="xl"
		overflow="hidden"
		boxShadow="sm"
		p={3}
		minW="200px"
		cursor="pointer"
		_hover={{
			textDecoration: "none",
		}}
	>
		<Image
			src={product.images?.[0]}
			borderRadius="lg"
			mb={2}
			h="100px"
			w="full"
			objectFit="cover"
		/>
		<Text fontSize="xs" fontWeight="600" noOfLines={1}>
			{product.name}
		</Text>
		<Text fontSize="xx-small" color="gray.500" noOfLines={1}>
			{product.condition} • {product.year}
		</Text>
		<Badge bg="#D9040410" color="#D90404" fontSize="9px" mt={1}>
			Compatible
		</Badge>
	</MotionBox>
);

const fetchProduct = async (id) => {
	const res = await API.get(`/products/${id}`);
	return res.data.data || res.data;
};

export default function ProductDetailPage() {
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);
	const toText = (value) => (value === null || value === undefined ? "" : String(value));
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		data: product,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["product", id],
		queryFn: () => fetchProduct(id),
		enabled: !!id,
		retry: 1,
		onSuccess: () => window.scrollTo(0, 0),
	});

	const navigate = useNavigate();

	if (isLoading) {
		return (
			<Center minH="100vh" bg="gray.50">
				<VStack spacing={3}>
					<Spinner size="xl" color="#D90404" thickness="3px" />
					<Text color="gray.500" fontSize="sm">Loading product details...</Text>
				</VStack>
			</Center>
		);
	}

	if (error || !product) {
		return (
			<Center minH="100vh" bg="gray.50">
				<VStack spacing={3}>
					<Heading size="md" color="red.500">Product Not Found</Heading>
					<Button as={Link} to="/" bg="#D90404" color="white" size="sm">
						Return Home
					</Button>
				</VStack>
			</Center>
		);
	}

	return (
		<Box bg="gray.50" minH="100vh">
			{/* Top Bar */}
			<MotionBox 
				bg="white" 
				borderBottom="1px solid" 
				borderColor="gray.100" 
				py={2}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Container maxW="container.xl" px={4}>
					<Flex justify="space-between" align="center">
						<HStack spacing={3}>
							<Avatar size="xs" name={product.seller?.name} bg="#D90404" />
							<Text fontSize="xs" fontWeight="500">{product.seller?.name}</Text>
							{product.seller?.rating && (
								<HStack spacing={0.5}>
									<Icon as={FaStar} color="gold" boxSize="8px" />
									<Text fontSize="9px">{product.seller?.rating}</Text>
								</HStack>
							)}
						</HStack>
						<HStack spacing={2}>
							<IconButton icon={<FiShare2 />} variant="ghost" size="xs" aria-label="Share"
								onClick={() => navigator.clipboard.writeText(window.location.href)} />

						</HStack>
					</Flex>
				</Container>
			</MotionBox>

			<Container maxW="container.xl" py={6} px={4}>
				<MotionGrid 
					templateColumns={{ base: "1fr", lg: "1fr 0.9fr" }} 
					gap={8}
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>

					{/* LEFT COLUMN */}
					<MotionVStack spacing={6} align="stretch" variants={fadeInUp}>

						{/* Gallery */}
						<Box bg="white" borderRadius="lg" overflow="hidden" p={4} boxShadow="sm">
							<AnimatePresence mode="wait">
								<MotionBox 
									key={selectedImage} 
									initial={{ opacity: 0, scale: 0.95 }} 
									animate={{ opacity: 1, scale: 1 }} 
									exit={{ opacity: 0, scale: 1.05 }}
									transition={{ duration: 0.3 }}
								>
									<Image
										src={product.images?.[selectedImage]}
										h={{ base: "250px", md: "350px" }}
										w="full"
										objectFit="contain"
									/>
								</MotionBox>
							</AnimatePresence>
							{product.images?.length > 1 && (
								<HStack spacing={2} mt={3} justify="center">
									{product.images?.map((img, idx) => (
										<MotionBox
											key={idx}
											cursor="pointer"
											border={selectedImage === idx ? "2px solid #D90404" : "1px solid #E2E8F0"}
											borderRadius="md"
											onClick={() => setSelectedImage(idx)}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
										>
											<Image src={img} boxSize="50px" objectFit="cover" />
										</MotionBox>
									))}
								</HStack>
							)}
						</Box>

						{/* Product Header */}
						<MotionBox variants={fadeInUp}>
							<Wrap spacing={2} mb={2}>
								<Tag size="sm" bg="#D9040410" color="#D90404" fontSize="10px">
									{product.category?.name}
								</Tag>
								<Tag size="sm" bg="green.50" color="green.600" fontSize="10px">
									{!product.isSold ? "In Stock" : "Sold"}
								</Tag>
								{product.isFeatured && (
									<Tag size="sm" bg="blue.50" color="blue.600" fontSize="10px">
										⭐ Featured
									</Tag>
								)}
							</Wrap>
							<Heading fontSize="24px" fontWeight="700" mb={3} lineHeight="1.3">
								{product.name}
							</Heading>

							{/* Quick Specs */}
							<SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
								{[
									{ icon: FaTachometerAlt, label: "Make & Model", value: `${product.make} ${product.model}`, show: product.make && product.model },
									{ icon: FaCalendarAlt, label: "Year", value: product.year, show: product.year },
									{ icon: FaGasPump, label: "Engine Type", value: product.engineType, show: product.engineType },
									{ icon: FaCog, label: "Condition", value: product.condition, show: product.condition },
								].map((spec, i) => spec.show && (
									<MotionBox 
										key={i} 
										bg="white" 
										p={2} 
										borderRadius="md" 
										border="1px solid" 
										borderColor="gray.100"
										whileHover={{ y: -2, borderColor: "#D90404" }}
									>
										<Icon as={spec.icon} color="#D90404" mb={1} />
										<Text fontSize="9px" color="gray.500">{spec.label}</Text>
										<Text fontSize="13px" fontWeight="600">{spec.value}</Text>
									</MotionBox>
								))}
							</SimpleGrid>
						</MotionBox>

						{/* Product Description */}
						<MotionBox bg="white" p={5} borderRadius="lg" variants={fadeInUp} boxShadow="sm">
							<Heading fontSize="18px" fontWeight="700" mb={3}>Product Overview</Heading>
							<Text fontSize="14px" color="gray.600" lineHeight="1.6">
								{product.description}
							</Text>
						</MotionBox>

						{/* Technical Specifications */}
						<MotionBox bg="white" p={5} borderRadius="lg" variants={fadeInUp} boxShadow="sm">
							<Heading fontSize="18px" fontWeight="700" mb={3}>Technical Specifications</Heading>
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
								{[
									{ label: "Make", value: product.make },
									{ label: "Model", value: product.model },
									{ label: "Year", value: product.year },
									{ label: "Engine Type", value: product.engineType },
									{ label: "Condition", value: product.condition },
									{ label: "Currency", value: product.currency },
								].map((item, i) => item.value && (
									<Flex key={i} justify="space-between" py={1} borderBottom="1px solid" borderColor="gray.100">
										<Text fontSize="13px" color="gray.600">{item.label}</Text>
										<Text fontSize="13px" fontWeight="500">{item.value}</Text>
									</Flex>
								))}
							</SimpleGrid>
						</MotionBox>

						{/* Compatibility Table */}
						{product.compatibility && product.compatibility.length > 0 && (
							<MotionBox bg="white" p={5} borderRadius="lg" variants={fadeInUp} boxShadow="sm">
								<Heading fontSize="18px" fontWeight="700" mb={3}>Vehicle Compatibility</Heading>
								<Text fontSize="13px" color="gray.500" mb={3}>This engine fits the following vehicles:</Text>
								<Box overflowX="auto">
									<Table variant="simple" size="sm">
										<Thead bg="gray.50">
											<Tr>
												<Th fontSize="11px">Make</Th>
												<Th fontSize="11px">Model</Th>
												<Th fontSize="11px">Variant</Th>
												<Th fontSize="11px">Year</Th>
												<Th fontSize="11px">Engine</Th>
											</Tr>
										</Thead>
										<Tbody>
											{product.compatibility?.slice(0, 6).map((item, idx) => (
												<Tr key={idx} _hover={{ bg: "gray.50" }}>
													<Td fontSize="12px" fontWeight="500">{item.make}</Td>
													<Td fontSize="12px">{item.model}</Td>
													<Td fontSize="12px">{item.variant || "-"}</Td>
													<Td fontSize="12px">{item.year || "-"}</Td>
													<Td fontSize="12px" color="#D90404" fontWeight="500">{item.engine || "-"}</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</Box>
							</MotionBox>
						)}

						{/* Similar Products */}
						{product.similarProducts && product.similarProducts.length > 0 && (
							<MotionBox variants={fadeInUp}>
								<Heading fontSize="18px" fontWeight="700" mb={3}>You May Also Like</Heading>
								<HStack spacing={3} overflowX="auto" pb={4} pt={1} px={1}>
									{product.similarProducts?.slice(0, 5).map((p, idx) => (
										<ProductCard key={idx} product={p} />
									))}
								</HStack>
							</MotionBox>
						)}
					</MotionVStack>

					{/* RIGHT COLUMN - Sticky Sidebar */}
					<MotionBox position="sticky" top="80px" variants={fadeInUp}>
						<VStack spacing={4} align="stretch">

							{/* Request Quote Card */}
							<Card shadow="lg" borderRadius="xl" overflow="hidden" border="1px solid" borderColor="gray.100">
								<Box bg="linear-gradient(135deg, #D90404 0%, #B70303 100%)" p={4} textAlign="center">
									<Text color="white" fontWeight="700" fontSize="16px">Interested in this {product.category?.name || "product"}?</Text>
									<Text color="white" opacity="0.9" fontSize="12px">Get a quote today</Text>
								</Box>
								<CardBody p={4}>
									<Button
										bg="#D90404"
										color="white"
										w="full"
										h="50px"
										_hover={{ bg: "#B70303", transform: "scale(1.02)" }}
										_active={{ transform: "scale(0.98)" }}
										borderRadius="md"
										fontWeight="600"
										leftIcon={<FaPhoneAlt />}
										mb={3}
										transition="all 0.2s"
										onClick={() =>
											navigate("/call-seller", {
												state: {
													brand: toText(product.make),
													model: toText(product.model),
													year: toText(product.year),
													type: toText(product.engineType),
													category: toText(product.category?.name),
													searchType: "manual",
												},
											})
										}
									>
										Request Quote
									</Button>

									<Text fontSize="11px" color="gray.500" textAlign="center">
										No commitment. Free consultation.
									</Text>
								</CardBody>
							</Card>

							{/* Seller Details */}
							{product.seller && (
								<Card borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
									<CardBody p={4}>
										<HStack spacing={2} mb={3}>
											<Icon as={FaStore} color="#D90404" />
											<Text fontSize="14px" fontWeight="700">About the Seller</Text>
										</HStack>
										<Text fontSize="13px" fontWeight="600">{product.seller?.name}</Text>
										<HStack spacing={2} mb={2}>
											<Icon as={FaMapMarkerAlt} color="gray.400" boxSize="10px" />
											<Text fontSize="11px" color="gray.500">{product.shipping?.location || "United Kingdom"}</Text>
										</HStack>

										<Divider my={3} />

										{product.seller?.rating && (
											<Stat size="sm">
												<StatLabel fontSize="11px">Seller Rating</StatLabel>

												<StatNumber fontSize="14px">
													{product.seller?.rating} / 5.0
												</StatNumber>

												<StatHelpText fontSize="10px">
													<HStack spacing={0.5}>
														{[1, 2, 3, 4, 5].map((star) => (
															<Icon
																key={star}
																as={FaStar}
																color={
																	star <= Math.round(product.seller?.rating)
																		? "yellow.400"
																		: "gray.300"
																}
																boxSize="10px"
															/>
														))}
													</HStack>
												</StatHelpText>
											</Stat>
										)}
									</CardBody>
								</Card>
							)}

							{/* Key Benefits */}
							<Card borderRadius="xl" bg="#D9040405" border="1px dashed" borderColor="#D9040430">
								<CardBody p={4}>
									<VStack spacing={3} align="start">
										{[
											{ icon: FaCertificate, text: "Certified Quality" },
											{ icon: FaTruck, text: "UK Delivery Available" },
											{ icon: FaShieldAlt, text: "Warranty Included" },
											{ icon: FaThumbsUp, text: "Satisfaction Guaranteed" },
										].map((benefit, i) => (
											<HStack key={i} spacing={2}>
												<Box
													w="25px"
													h="25px"
													borderRadius="full"
													bg="#D90404"
													display="flex"
													alignItems="center"
													justifyContent="center"
												>
													<Icon as={benefit.icon} color="white" boxSize="10px" />
												</Box>
												<Text fontSize="12px" fontWeight="600">
													{benefit.text}
												</Text>
											</HStack>
										))}
									</VStack>
								</CardBody>
							</Card>

							{/* Warranty & Support Accordion */}
							<Accordion allowToggle defaultIndex={[0]}>
								{[
									{ 
										icon: FaShieldAlt, 
										title: "Warranty Information", 
										content: [
											"✓ 12 months comprehensive warranty included",
											"✓ Parts and labour covered at approved garages",
											"✓ Nationwide coverage"
										] 
									},
									{ 
										icon: FaShippingFast, 
										title: "Delivery Information", 
										content: [
											`✓ ${product.shipping?.delivery || "Standard delivery available"}`,
											"✓ Professional installation service available"
										] 
									},
									{ 
										icon: FaHeadset, 
										title: "Customer Support", 
										content: [
											"✓ Dedicated support team available",
											"✓ Email support with quick response",
											"✓ Technical advice from certified mechanics"
										] 
									},
								].map((item, i) => (
									<AccordionItem key={i} bg="white" borderRadius="lg" border="none" mb={3} boxShadow="sm">
										<AccordionButton _expanded={{ bg: "#D90404", color: "white" }} borderRadius="lg">
											<Box flex="1" textAlign="left" fontWeight="600">
												<Icon as={item.icon} mr={2} /> {item.title}
											</Box>
											<AccordionIcon />
										</AccordionButton>
										<AccordionPanel pb={4} pt={4}>
											<VStack align="start" spacing={2}>
												{item.content.map((line, j) => (
													<Text key={j} fontSize="13px">{line}</Text>
												))}
											</VStack>
										</AccordionPanel>
									</AccordionItem>
								))}
							</Accordion>

							{/* Trust Badges */}
							<Box textAlign="center" p={3}>
								<HStack justify="center" spacing={3} mb={2}>
									<Icon as={FaCertificate} color="gray.400" />
									<Icon as={FaShieldAlt} color="gray.400" />
									<Icon as={FaCheckCircle} color="gray.400" />
								</HStack>
								<Text fontSize="10px" color="gray.500">
									Premium Quality Assured
								</Text>
							</Box>
						</VStack>
					</MotionBox>
				</MotionGrid>
			</Container>

			<ConfirmProdutModel isOpen={isOpen} onClose={onClose} />
		</Box>
	);
}