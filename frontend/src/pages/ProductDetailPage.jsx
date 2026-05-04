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
} from "react-icons/fa";
import API from "../services/api";

import ConfirmProdutModel from "../components/common/ConfirmProdutModel";

// --- Animated Wrapper ---
const MotionBox = motion(Box);

const ProductCard = ({ product }) => (
	<MotionBox
		as={Link}
		to={`/products/${product.slug || product._id}`}
		whileHover={{ y: -5 }}
		bg="white"
		borderRadius="xl"
		overflow="hidden"
		boxShadow="sm"
		border="1px solid"
		borderColor="gray.100"
		p={4}
		minW="220px"
		cursor="pointer"
		_hover={{ textDecoration: "none" }}
	>
		<Image
			src={product.images?.[0]}
			borderRadius="lg"
			mb={4}
			h="140px"
			w="full"
			objectFit="cover"
		/>
		<VStack align="start" spacing={1}>
			<Text fontSize="xs" fontWeight="bold" noOfLines={1} color="#D90404" textTransform="uppercase">
				{product.name}
			</Text>
			<Badge colorScheme="blue" variant="subtle" fontSize="9px">
				{product.condition}
			</Badge>
			<Text fontSize="lg" fontWeight="800">
				£{product.price?.toLocaleString()}
			</Text>
			<HStack spacing={1}>
				<Text fontSize="xs" color="green.600" fontWeight="700">
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
		<Flex justify="space-between" align="center" py={isTotal ? 4 : 2}>
			<Text fontWeight={isTotal ? "800" : "600"} fontSize={isTotal ? "lg" : "md"} color={color}>
				{label}
			</Text>
			<Text
				fontWeight={isTotal ? "900" : "700"}
				fontSize={isTotal ? "3xl" : "md"}
				color={isTotal ? "red.600" : "gray.900"}
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
					<Spinner size="xl" color="brand.500" thickness="4px" />
					<Text fontWeight="bold" color="gray.500">
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
					<Button as={Link} to="/" colorScheme="brand" variant="outline">
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
			{/* Top Banner Area (Seller info integrated) */}
			<Box borderBottom="1px solid" borderColor="gray.100" py={4}>
				<Container maxW="container.xl">
					<HStack justify="space-between" align="center">
						<HStack spacing={3}>
							<Avatar size="xs" name={product.seller?.name} bg="brand.500" />
							<HStack spacing={2}>
								<Text fontSize="xs" fontWeight="800" color="gray.700">
									{product.seller?.name}
								</Text>
								<Badge colorScheme="green" fontSize="9px" variant="solid" borderRadius="sm">
									{product.seller?.rating}
								</Badge>
							</HStack>
						</HStack>
						<Breadcrumb
							spacing="8px"
							separator={<Icon as={FaChevronRight} color="gray.300" fontSize="8px" />}
							fontSize="xs"
							display={{ base: "none", md: "block" }}
						>
							<BreadcrumbItem>
								<BreadcrumbLink as={Link} to="/">
									Home
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink color="gray.400">{product.name}</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
					</HStack>
				</Container>
			</Box>

			<Container maxW="container.xl" py={10}>
				<Grid templateColumns={{ base: "1fr", lg: "repeat(12, 1fr)" }} gap={16}>
					{/* LEFT CONTENT */}
					<GridItem colSpan={{ base: 1, lg: 8 }}>
						<VStack spacing={12} align="stretch">
							{/* Product Header Refined */}
							<VStack align="start" spacing={5}>
								<Heading
									fontSize={{ base: "2xl", md: "4xl" }}
									fontWeight="900"
									lineHeight="1.1"
									color="gray.800"
								>
									{product.name} With Warranty Supply And Fit Engine
								</Heading>

								<HStack spacing={8}>
									<VStack align="start" spacing={0}>
										<Text fontSize="4xl" fontWeight="900" color="gray.900">
											£{product.price?.toLocaleString()}.00
										</Text>
										<Text fontSize="xs" color="gray.400" fontWeight="bold">
											EXCLUSIVE OF VAT
										</Text>
									</VStack>
									<Divider orientation="vertical" h="40px" />
									<HStack spacing={4}>
										<VStack align="start" spacing={0}>
											<Text fontSize="xs" color="gray.400" fontWeight="bold">
												CONDITION
											</Text>
											<Text fontWeight="800" fontSize="sm">
												{product.condition}
											</Text>
										</VStack>
										<VStack align="start" spacing={0}>
											<Text fontSize="xs" color="gray.400" fontWeight="bold">
												COMPATIBILITY
											</Text>
											<ChakraLink color="#D90404" fontWeight="800" fontSize="sm">
												Check Vehicles
											</ChakraLink>
										</VStack>
									</HStack>
								</HStack>
							</VStack>

							{/* Gallery Section - Cleaner */}
							<Box position="relative">
								<AnimatePresence mode="wait">
									<MotionBox
										key={selectedImage}
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.3 }}
										borderRadius="2xl"
										overflow="hidden"
										boxShadow="2xl"
									>
										<Image
											src={product.images?.[selectedImage]}
											w="full"
											h={{ base: "300px", md: "520px" }}
											objectFit="cover"
										/>
									</MotionBox>
								</AnimatePresence>
								<HStack spacing={4} mt={6} justify="start">
									{product.images?.map((img, idx) => (
										<Box
											key={idx}
											cursor="pointer"
											border="3px solid"
											borderColor={selectedImage === idx ? "brand.500" : "transparent"}
											borderRadius="xl"
											overflow="hidden"
											onClick={() => setSelectedImage(idx)}
											transition="all 0.2s"
											_hover={{ transform: "scale(1.05)" }}
										>
											<Image src={img} boxSize="90px" objectFit="cover" />
										</Box>
									))}
								</HStack>
							</Box>

							{/* People Also Search - Premium Scroller */}
							<Box>
								<HStack justify="space-between" mb={6}>
									<Heading fontSize="xl" fontWeight="900">
										People also Search
									</Heading>
									<HStack spacing={2}>
										<Button size="xs" variant="ghost" borderRadius="full" isDisabled>
											<FaArrowLeft />
										</Button>
										<Button size="xs" variant="ghost" borderRadius="full" isDisabled>
											<FaArrowRight />
										</Button>
									</HStack>
								</HStack>
								<HStack
									spacing={6}
									overflowX="auto"
									pb={6}
									css={{ "&::-webkit-scrollbar": { display: "none" } }}
								>
									{product.similarProducts?.map((p, idx) => (
										<ProductCard key={idx} product={p} />
									)) || (
										<Text fontSize="sm" color="gray.400">
											Loading similar items...
										</Text>
									)}
								</HStack>
							</Box>

							{/* Detailed Content Sections */}
							<VStack align="start" spacing={16}>
								{/* Description */}
								<Box w="full">
									<Heading fontSize="2xl" fontWeight="900" mb={6} color="gray.800">
										Complete Description
									</Heading>
									<Text fontSize="lg" color="gray.600" lineHeight="1.8" letterSpacing="tight">
										{product.description}
									</Text>
								</Box>

								{/* Compatibility Table - Refined */}
								<Box w="full">
									<Heading fontSize="2xl" fontWeight="900" mb={8} color="gray.800">
										Vehicle Compatibility Guide
									</Heading>
									<Box
										overflowX="auto"
										borderRadius="2xl"
										border="1px solid"
										borderColor="gray.100"
										boxShadow="sm"
									>
										<Table variant="simple" size="md">
											<Thead bg="gray.50">
												<Tr>
													<Th color="gray.400" fontSize="xs">
														Make
													</Th>
													<Th color="gray.400" fontSize="xs">
														Model
													</Th>
													<Th color="gray.400" fontSize="xs">
														Variant
													</Th>
													<Th color="gray.400" fontSize="xs">
														Year
													</Th>
													<Th color="gray.400" fontSize="xs">
														Engine Detail
													</Th>
												</Tr>
											</Thead>
											<Tbody>
												{product.compatibility?.map((item, idx) => (
													<Tr key={idx} _hover={{ bg: "blue.50" }} transition="0.2s">
														<Td fontWeight="900" color="gray.800">
															{item.make}
														</Td>
														<Td fontWeight="600">{item.model}</Td>
														<Td color="gray.500" fontSize="sm">
															{item.variant}
														</Td>
														<Td fontWeight="700">{item.year}</Td>
														<Td color="#D90404" fontWeight="bold" fontSize="xs">
															{item.engine}
														</Td>
													</Tr>
												))}
											</Tbody>
										</Table>
									</Box>
								</Box>

								{/* Price Breakdown - Modern Grid */}
								<Box w="full" bg="gray.50" p={10} borderRadius="3xl">
									<Heading fontSize="2xl" fontWeight="900" mb={10} textAlign="center">
										Estimate Pricing Breakdown
									</Heading>
									<Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }} gap={12}>
										<VStack
											align="stretch"
											spacing={4}
											bg="white"
											p={8}
											borderRadius="2xl"
											boxShadow="sm"
										>
											<Flex
												justify="space-between"
												pb={4}
												borderBottom="1px dashed"
												borderColor="gray.200"
											>
												<Text fontWeight="800">Exchange Engine</Text>
												<Text fontWeight="800">£{itemPrice.toLocaleString("en-GB")}.00</Text>
											</Flex>
											<Flex
												justify="space-between"
												pb={4}
												borderBottom="1px dashed"
												borderColor="gray.200"
											>
												<Text fontWeight="800">Standard Delivery</Text>
												<Text fontWeight="800">£{deliveryPrice.toLocaleString("en-GB")}.00</Text>
											</Flex>
											<VStack align="start" spacing={3} pt={4} color="gray.500" fontSize="sm">
												<HStack>
													<Icon as={FaInfoCircle} />
													<Text>Based on engine mileage from listing</Text>
												</HStack>
												<HStack>
													<Icon as={FaInfoCircle} />
													<Text>Quote includes core exchange basis</Text>
												</HStack>
											</VStack>
										</VStack>

										<VStack align="stretch" spacing={6}>
											<Box>
												<PriceRow label="Subtotal" value={itemPrice + deliveryPrice} />
												<PriceRow label="VAT" value={vatAmount} />
												<Divider my={4} />
												<PriceRow label="Total Amount" value={totalAmount} isTotal />
											</Box>
											{/* <Button
												colorScheme="brand"
												h="65px"
												fontSize="lg"
												borderRadius="2xl"
												boxShadow="0 10px 20px -5px rgba(21, 101, 192, 0.4)"
											>
												Request Fresh Quote
											</Button> */}
										</VStack>
									</Grid>
								</Box>
							</VStack>
						</VStack>
					</GridItem>

					{/* RIGHT SIDEBAR - Refined Focus */}
					<GridItem colSpan={{ base: 1, lg: 4 }}>
						<Box position="sticky" top="40px">
							<VStack spacing={8} align="stretch">
								{/* Main Action Buttons */}
								<VStack spacing={4}>
									<Button
										bg="#D90404"
										color="white"
										h="75px"
										w="full"
										_hover={{ bg: "brand.700", transform: "translateY(-2px)", boxShadow: "xl" }}
										borderRadius="2xl"
										fontSize="lg"
										fontWeight="900"
										boxShadow="lg"
										as={Link}
										transition="all 0.3s"
										onClick={onOpen}
									>
										Confirm car for Custom Quote
									</Button>
									<Button onClick={handleBuyItNow} variant="outline" h="55px" w="full">
										Buy It Now
									</Button>
									<Button
										onClick={handleBuyItNow}
										variant="outline"
										h="55px"
										w="full"
										_hover={{ bg: "gray.50" }}
										fontWeight="800"
									>
										Add to Cart
									</Button>
									<Button
										variant="outline"
										h="55px"
										w="full"
										_hover={{ bg: "gray.50" }}
										fontWeight="800"
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
										Call Seller
									</Button>{" "}
								</VStack>

								{/* Trust & Activity Card */}
								<Box
									p={8}
									borderRadius="2xl"
									border="1px solid"
									borderColor="gray.100"
									bg="white"
									boxShadow="sm"
								>
									<VStack align="start" spacing={6}>
										<HStack spacing={4}>
											<Icon as={FaShippingFast} color="brand.500" boxSize={6} />
											<VStack align="start" spacing={0}>
												<Text fontSize="sm" fontWeight="900">
													National Shipping
												</Text>
												<Text fontSize="xs" color="gray.500">
													Available anywhere in the UK
												</Text>
											</VStack>
										</HStack>
										<HStack spacing={4}>
											<Icon as={FaStar} color="orange.400" boxSize={6} />
											<VStack align="start" spacing={0}>
												<Text fontSize="sm" fontWeight="900">
													Trending Item
												</Text>
												<Text fontSize="xs" color="gray.500">
													Popular view item this week
												</Text>
											</VStack>
										</HStack>
										<HStack spacing={4}>
											<Icon as={FaUndo} color="purple.500" boxSize={6} />
											<VStack align="start" spacing={0}>
												<Text fontSize="sm" fontWeight="900">
													Vehicle Recovery
												</Text>
												<Text fontSize="xs" color="gray.500">
													Pick-up and drop-off offered
												</Text>
											</VStack>
										</HStack>
									</VStack>
								</Box>

								{/* Offer Notice - More Subtle */}
								<Box
									border="2px dashed"
									borderColor="red.200"
									bg="red.50"
									p={5}
									borderRadius="2xl"
									textAlign="center"
								>
									<Text color="red.700" fontWeight="900" fontSize="sm">
										LIMITED OFFER: 30 days left
									</Text>
								</Box>

								{/* Meta Details */}
								<VStack align="stretch" spacing={3} px={4}>
									<Flex justify="space-between">
										<Text fontSize="xs" color="gray.400" fontWeight="bold">
											LOCATION
										</Text>
										<Text fontSize="xs" fontWeight="900">
											{product.shipping?.location}
										</Text>
									</Flex>
									<Flex justify="space-between">
										<Text fontSize="xs" color="gray.400" fontWeight="bold">
											DELIVERY
										</Text>
										<Text fontSize="xs" fontWeight="900">
											{product.shipping?.delivery}
										</Text>
									</Flex>
									<Flex justify="space-between">
										<Text fontSize="xs" color="gray.400" fontWeight="bold">
											RETURNS
										</Text>
										<Text fontSize="xs" fontWeight="900" color="#D90404">
											ACCEPTED
										</Text>
									</Flex>
								</VStack>
							</VStack>
						</Box>
					</GridItem>
				</Grid>
			</Container>

			{/*  */}
			<ConfirmProdutModel isOpen={isOpen} onClose={onClose} />
		</Box>
	);
}
