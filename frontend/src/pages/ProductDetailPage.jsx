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
	Stack,
	Flex,
	Avatar,
	Link as ChakraLink,
	useColorModeValue,
	Spinner,
	Center,
	useDisclosure,
	SimpleGrid,
	Card,
	CardBody,
	Tag,
	Wrap,
	WrapItem,
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
	FaTools,
	FaArrowLeft,
	FaArrowRight,
	FaStar,
	FaUndo,
	FaMapMarkerAlt,
	FaInfoCircle,
	FaPhoneAlt,
	FaWhatsapp,
	FaClock,
	FaTruck,
} from "react-icons/fa";
import { FiHeart, FiShare2 } from "react-icons/fi";
import API from "../services/api";

import ConfirmProdutModel from "../components/common/ConfirmProdutModel";

// --- Animated Wrapper ---
const MotionBox = motion(Box);

const ProductCard = ({ product }) => (
	<MotionBox
		as={Link}
		to={`/products/${product.slug || product._id}`}
		whileHover={{ y: -5, scale: 1.02 }}
		transition={{ duration: 0.2 }}
		bg="white"
		borderRadius="2xl"
		overflow="hidden"
		boxShadow="0 2px 8px rgba(0,0,0,0.04)"
		border="1px solid"
		borderColor="gray.100"
		p={3}
		minW="200px"
		cursor="pointer"
		_hover={{
			textDecoration: "none",
			boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
			borderColor: "gray.200"
		}}
	>
		<Image
			src={product.images?.[0]}
			borderRadius="lg"
			mb={3}
			h="120px"
			w="full"
			objectFit="cover"
		/>
		<VStack align="start" spacing={1}>
			<Text fontSize="xs" fontWeight="700" noOfLines={1} color="#D90404" textTransform="uppercase">
				{product.name}
			</Text>
			<Badge bg="#D9040410" color="#D90404" fontSize="10px" px={2} borderRadius="full">
				{product.condition}
			</Badge>
			<Text fontSize="lg" fontWeight="800" color="gray.900">
				£{product.price?.toLocaleString()}
			</Text>
			<HStack spacing={1}>
				<Icon as={FaCheckCircle} color="green.500" boxSize="10px" />
				<Text fontSize="10px" color="green.600" fontWeight="600">
					Supplied & Fitted
				</Text>
			</HStack>
		</VStack>
	</MotionBox>
);

const PriceRow = ({ label, value, isTotal, color = "gray.600" }) => {
	const amount = Number(value || 0);
	const formattedAmount = Number.isFinite(amount) ? amount.toLocaleString("en-GB") : "0";

	return (
		<Flex justify="space-between" align="center" py={isTotal ? 3 : 2}>
			<Text fontWeight={isTotal ? "700" : "500"} fontSize={isTotal ? "md" : "sm"} color={color}>
				{label}
			</Text>
			<Text
				fontWeight={isTotal ? "800" : "600"}
				fontSize={isTotal ? "2xl" : "md"}
				color={isTotal ? "#D90404" : "gray.800"}
			>
				£{formattedAmount}
			</Text>
		</Flex>
	);
};

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

	const handleBuyItNow = () => {
		navigate("/checkout", { state: { product } });
	};

	const bgColor = "white";

	if (isLoading) {
		return (
			<Center minH="100vh">
				<VStack spacing={4}>
					<Spinner size="xl" color="#D90404" thickness="4px" />
					<Text fontWeight="600" color="gray.500">
						Loading premium part details...
					</Text>
				</VStack>
			</Center>
		);
	}

	if (error || !product) {
		return (
			<Center minH="100vh">
				<VStack spacing={4}>
					<Heading size="lg" color="red.500">
						Oops! Product Not Found
					</Heading>
					<Text color="gray.500">We couldn't find the engine you're looking for.</Text>
					<Button as={Link} to="/" bg="#D90404" color="white" _hover={{ bg: "#B70303" }}>
						Return Home
					</Button>
				</VStack>
			</Center>
		);
	}

	const itemPrice = Number.isFinite(Number(product.pricingBreakdown?.item ?? product.price ?? 0))
		? Number(product.pricingBreakdown?.item ?? product.price ?? 0)
		: 0;
	const deliveryPrice = Number.isFinite(Number(product.pricingBreakdown?.delivery ?? 0))
		? Number(product.pricingBreakdown?.delivery ?? 0)
		: 0;
	const vatRate = Number.isFinite(Number(product.pricingBreakdown?.vatRate ?? 0.2))
		? Number(product.pricingBreakdown?.vatRate ?? 0.2)
		: 0.2;
	const vatAmount = (itemPrice + deliveryPrice) * vatRate;
	const totalAmount = itemPrice + deliveryPrice + vatAmount;

	return (
		<Box bg={bgColor} minH="100vh">
			{/* Modern Top Bar */}
			<Box borderBottom="1px solid" borderColor="gray.100" py={3} bg="white">
				<Container maxW="container.xl">
					<Flex justify="space-between" align="center" wrap="wrap" gap={3}>
						<HStack spacing={3}>
							<Avatar size="sm" name={product.seller?.name} bg="#D90404" color="white" />
							<Box>
								<Text fontSize="sm" fontWeight="700" color="gray.800">
									{product.seller?.name}
								</Text>
								<HStack spacing={1}>
									<Icon as={FaStar} color="gold" boxSize="10px" />
									<Text fontSize="xs" color="gray.500">{product.seller?.rating}</Text>
								</HStack>
							</Box>
						</HStack>
						<Breadcrumb
							spacing="8px"
							separator={<Icon as={FaChevronRight} color="gray.300" fontSize="10px" />}
							fontSize="xs"
							display={{ base: "none", md: "flex" }}
						>
							<BreadcrumbItem>
								<BreadcrumbLink as={Link} to="/" color="gray.500">Home</BreadcrumbLink>
							</BreadcrumbItem>
							{/* <BreadcrumbItem>
								<BreadcrumbLink as={Link} to="/products" color="gray.500">Products</BreadcrumbLink>
							</BreadcrumbItem> */}
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink color="#D90404" fontWeight="600">{product.name?.substring(0, 30)}...</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
						<HStack spacing={2}>
							{/* <IconButton
								icon={<FiHeart />}
								variant="ghost"
								size="sm"
								aria-label="Wishlist"
							/> */}
							<IconButton
								icon={<FiShare2 />}
								variant="ghost"
								size="sm"
								aria-label="Share"
								onClick={() => {
									if (navigator.share) {
										navigator.share({
											title: document.title,
											text: "Check this out",
											url: window.location.href,
										});
									} else {
										navigator.clipboard.writeText(window.location.href);
										alert("Link copied to clipboard");
									}
								}}
							/>
						</HStack>
					</Flex>
				</Container>
			</Box>

			<Container maxW="container.xl" py={8}>
				<Grid templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }} gap={8}>
					{/* LEFT CONTENT */}
					<GridItem colSpan={{ base: 1, lg: 8 }}>
						<VStack spacing={8} align="stretch">
							{/* Product Header */}
							<VStack align="start" spacing={4}>
								<Wrap spacing={2}>
									<WrapItem>
										<Tag bg="#D9040410" color="#D90404" borderRadius="full" fontSize="11px" fontWeight="600">
											{product.category?.name || "Engine Part"}
										</Tag>
									</WrapItem>
									<WrapItem>
										<Tag bg="green.50" color="green.600" borderRadius="full" fontSize="11px" fontWeight="600">
											In Stock
										</Tag>
									</WrapItem>
								</Wrap>

								<Heading
									fontSize={{ base: "28px", md: "36px" }}
									fontWeight="800"
									lineHeight="1.2"
									color="gray.800"
									letterSpacing="-0.5px"
								>
									{product.name}
								</Heading>

								<Flex align="baseline" gap={4} wrap="wrap">
									{/* <VStack align="start" spacing={0}>
										<Text
											fontSize="32px"
											fontWeight="800"
											color="#D90404"
											lineHeight="1"
										>
											<Text
												as="span"
												fontSize="14px"
												fontWeight="600"
												color="gray.500"
												mr={2}
												verticalAlign="middle"
											>
												Starting From
											</Text>

											£{product.price?.toLocaleString()}
										</Text>

										<Text
											fontSize="11px"
											color="gray.400"
											fontWeight="500"
										>
											EXCLUSIVE OF VAT
										</Text>
									</VStack> */}
									<Divider orientation="vertical" h="40px" />
									<VStack align="start" spacing={0}>
										<Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">
											Condition
										</Text>
										<Text fontWeight="700" fontSize="14px">{product.condition}</Text>
									</VStack>
									{/* <VStack align="start" spacing={0}>
										<Text fontSize="10px" color="gray.400" fontWeight="600" textTransform="uppercase">
											Compatibility
										</Text>
										<ChakraLink color="#D90404" fontWeight="700" fontSize="14px">
											Check Vehicles →
										</ChakraLink>
									</VStack> */}
								</Flex>
							</VStack>

							{/* Gallery Section */}
							<Box position="relative">
								<AnimatePresence mode="wait">
									<MotionBox
										key={selectedImage}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										borderRadius="2xl"
										overflow="hidden"
										bg="gray.50"
									>
										<Image
											src={product.images?.[selectedImage]}
											w="full"
											h={{ base: "300px", md: "450px" }}
											objectFit="contain"
											fallbackSrc="https://via.placeholder.com/600x400?text=No+Image"
										/>
									</MotionBox>
								</AnimatePresence>
								{product.images?.length > 1 && (
									<HStack spacing={3} mt={4} justify="center" wrap="wrap">
										{product.images?.map((img, idx) => (
											<Box
												key={idx}
												cursor="pointer"
												border="2px solid"
												borderColor={selectedImage === idx ? "#D90404" : "transparent"}
												borderRadius="lg"
												overflow="hidden"
												onClick={() => setSelectedImage(idx)}
												transition="all 0.2s"
												_hover={{ transform: "scale(1.05)", borderColor: "#D90404" }}
											>
												<Image src={img} boxSize="70px" objectFit="cover" />
											</Box>
										))}
									</HStack>
								)}
							</Box>

							{/* People Also Search */}
							{product.similarProducts?.length > 0 && (
								<Box>
									<Flex justify="space-between" align="center" mb={4}>
										<Heading fontSize="xl" fontWeight="800">
											People also search
										</Heading>
									</Flex>
									<HStack
										spacing={4}
										overflowX="auto"
										pb={4}
										css={{ "&::-webkit-scrollbar": { display: "none" } }}
									>
										{product.similarProducts?.map((p, idx) => (
											<ProductCard key={idx} product={p} />
										))}
									</HStack>
								</Box>
							)}

							{/* Description */}
							<Box>
								<Heading fontSize="22px" fontWeight="800" mb={4} color="gray.800">
									Product Description
								</Heading>
								<Text fontSize="15px" color="gray.600" lineHeight="1.7">
									{product.description}
								</Text>
							</Box>

							{/* Compatibility Table */}
							{product.compatibility?.length > 0 && (
								<Box>
									<Heading fontSize="22px" fontWeight="800" mb={4} color="gray.800">
										Vehicle Compatibility
									</Heading>
									<Box
										borderRadius="xl"
										border="1px solid"
										borderColor="gray.200"
										overflowX="auto"
									>
										<Table variant="simple" size="sm">
											<Thead bg="gray.50">
												<Tr>
													<Th fontSize="11px" fontWeight="700">Make</Th>
													<Th fontSize="11px" fontWeight="700">Model</Th>
													<Th fontSize="11px" fontWeight="700">Variant</Th>
													<Th fontSize="11px" fontWeight="700">Year</Th>
													<Th fontSize="11px" fontWeight="700">Engine</Th>
												</Tr>
											</Thead>
											<Tbody>
												{product.compatibility?.slice(0, 5).map((item, idx) => (
													<Tr key={idx} _hover={{ bg: "gray.50" }}>
														<Td fontWeight="600" fontSize="13px">{item.make}</Td>
														<Td fontSize="13px">{item.model}</Td>
														<Td fontSize="12px" color="gray.600">{item.variant}</Td>
														<Td fontSize="13px">{item.year}</Td>
														<Td fontSize="12px" color="#D90404" fontWeight="600">{item.engine}</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</Box>
									{product.compatibility?.length > 5 && (
										<Button variant="link" color="#D90404" mt={3} size="sm">
											View all {product.compatibility.length} vehicles →
										</Button>
									)}
								</Box>
							)}

							{/* Price Breakdown */}
							<Box bg="gray.50" p={6} borderRadius="2xl">
								{/* <Heading fontSize="20px" fontWeight="800" mb={6} textAlign="center">
									Pricing Breakdown
								</Heading> */}
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
									{/* <Card variant="outline" borderColor="gray.200">
										<CardBody>
											<VStack align="stretch" spacing={3}>
												<Flex justify="space-between">
													<Text fontWeight="600">
														Engine Price
													</Text>
													<Text fontWeight="700">
														<Text as="span" fontSize="11px" color="gray.500">
															Starting From
														</Text>{" "}
														£{itemPrice.toLocaleString()}</Text>
												</Flex>
												<Flex justify="space-between">
													<Text fontWeight="600">Delivery</Text>
													<Text fontWeight="700">£{deliveryPrice.toLocaleString()}</Text>
												</Flex>
												<Divider />
												<Flex justify="space-between">
													<Text fontWeight="600">Subtotal</Text>
													<Text fontWeight="700">£{(itemPrice + deliveryPrice).toLocaleString()}</Text>
												</Flex>
											</VStack>
										</CardBody>
									</Card> */}
									<Card bg="#D9040405" borderColor="#D9040420">
										<CardBody>
											<VStack align="stretch" spacing={3}>
												<Flex justify="space-between">
													<Text fontWeight="600">VAT ({Math.round(vatRate * 100)}%)</Text>
													{/* <Text fontWeight="700">£{vatAmount.toLocaleString()}</Text> */}
												</Flex>
												<Divider borderColor="#D9040420" />
												{/* <Flex justify="space-between">
													<Text fontWeight="800" fontSize="lg">Total</Text>
													<Text fontWeight="800" fontSize="2xl" color="#D90404">£{totalAmount.toLocaleString()}</Text>
												</Flex> */}
											</VStack>
										</CardBody>
									</Card>
								</SimpleGrid>
							</Box>
						</VStack>
					</GridItem>

					{/* RIGHT SIDEBAR */}
					<GridItem colSpan={{ base: 1, lg: 4 }}>
						<Box position="sticky" top="100px">
							<VStack spacing={5} align="stretch">
								{/* Main Action Buttons */}
								<Card shadow="lg" borderRadius="2xl" border="none">
									<CardBody p={2}>
										<VStack spacing={2}>
											{/* <Button
												bg="#D90404"
												color="white"
												h="60px"
												w="full"
												_hover={{ bg: "#B70303", transform: "translateY(-2px)" }}
												_active={{ transform: "translateY(0)" }}
												borderRadius="xl"
												fontSize="16px"
												fontWeight="700"
												boxShadow="0 4px 12px rgba(217, 4, 4, 0.3)"
												transition="all 0.2s"
												onClick={onOpen}
											>
												Get Custom Quote
											</Button> */}

											{/* <Button
												onClick={handleBuyItNow}
												variant="outline"
												borderColor="#D90404"
												color="#D90404"
												h="50px"
												w="full"
												borderRadius="xl"
												fontWeight="600"
												_hover={{ bg: "#D90404", color: "white", borderColor: "#D90404" }}
											>
												Buy It Now
											</Button> */}

											{/* <Button
												variant="ghost"
												h="50px"
												w="full"
												borderRadius="xl"
												fontWeight="600"
												leftIcon={<FaWhatsapp />}
												color="green.600"
												_hover={{ bg: "green.50" }}
											>
												Chat on WhatsApp
											</Button> */}

											<Button
												variant="ghost"
												h="50px"
												w="full"
												borderColor="#D90404"
												color="#D90404"
												borderRadius="xl"
												fontWeight="600"
												leftIcon={<FaPhoneAlt />}
												onClick={() =>
													navigate("/call-seller", {
														state: {
															brand: toText(product.make || product.brand),
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
										</VStack>
									</CardBody>
								</Card>

								{/* Features Card */}
								<Card borderRadius="2xl" border="1px solid" borderColor="gray.100">
									<CardBody p={5}>
										<VStack align="start" spacing={4}>
											<HStack spacing={3}>
												<Box bg="blue.50" p={2} borderRadius="lg">
													<Icon as={FaShippingFast} color="#D90404" boxSize={5} />
												</Box>
												<VStack align="start" spacing={0}>
													<Text fontSize="14px" fontWeight="700">Nationwide Delivery</Text>
													<Text fontSize="11px" color="gray.500">Fast shipping across UK</Text>
												</VStack>
											</HStack>
											<HStack spacing={3}>
												<Box bg="orange.50" p={2} borderRadius="lg">
													<Icon as={FaShieldAlt} color="#D90404" boxSize={5} />
												</Box>
												<VStack align="start" spacing={0}>
													<Text fontSize="14px" fontWeight="700">Warranty Included</Text>
													<Text fontSize="11px" color="gray.500">12 months guarantee</Text>
												</VStack>
											</HStack>
											<HStack spacing={3}>
												<Box bg="green.50" p={2} borderRadius="lg">
													<Icon as={FaClock} color="#D90404" boxSize={5} />
												</Box>
												<VStack align="start" spacing={0}>
													<Text fontSize="14px" fontWeight="700">Quick Installation</Text>
													<Text fontSize="11px" color="gray.500">24-48 hour fitting available</Text>
												</VStack>
											</HStack>
										</VStack>
									</CardBody>
								</Card>

								{/* Limited Offer */}
								{/* <Box
									bg="linear-gradient(135deg, #D90404 0%, #B70303 100%)"
									color="white"
									p={4}
									borderRadius="xl"
									textAlign="center"
								>
									<Text fontWeight="800" fontSize="13px">
										🔥 LIMITED TIME OFFER
									</Text>
									<Text fontSize="11px" opacity="0.9">
										Exclusive savings available today
									</Text>
								</Box> */}

								{/* Meta Info */}
								<VStack align="stretch" spacing={2} px={2}>
									<Flex justify="space-between">
										<Text fontSize="11px" color="gray.500">Location</Text>
										<Text fontSize="11px" fontWeight="600">{product.shipping?.location || "United Kingdom"}</Text>
									</Flex>
									{/* <Flex justify="space-between">
										<Text fontSize="11px" color="gray.500">Delivery</Text>
										<Text fontSize="11px" fontWeight="600">{product.shipping?.delivery || "3-5 business days"}</Text>
									</Flex> */}
									{/* <Flex justify="space-between">
										<Text fontSize="11px" color="gray.500">Returns</Text>
										<Text fontSize="11px" fontWeight="700" color="#D90404">30 Day Returns</Text>
									</Flex> */}
								</VStack>
							</VStack>
						</Box>
					</GridItem>
				</Grid>
			</Container>

			<ConfirmProdutModel isOpen={isOpen} onClose={onClose} />
		</Box>
	);
}