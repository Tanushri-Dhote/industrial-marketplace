import React, { useState } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Image,
	Badge,
	Button,
	Icon,
	SimpleGrid,
	Flex,
	Spinner,
	Center,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	FaPhoneAlt,
	FaShieldAlt,
	FaTruck,
	FaCertificate,
	FaCheckCircle,
	FaMapMarkerAlt,
	FaTachometerAlt,
	FaCalendarAlt,
	FaGasPump,
	FaCog,
	FaShareAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import API from "../services/api";

const RED = "#E10600";
const DARK = "#111111";

const MotionBox = motion(Box);

const ProductCard = ({ product }) => (
	<MotionBox
		as={Link}
		to={`/products/${product.slug || product._id}`}
		whileHover={{ y: -8 }}
		transition={{ duration: 0.3 }}
		bg="white"
		borderRadius="xl"
		overflow="hidden"
		boxShadow="md"
		_hover={{ boxShadow: "xl", textDecoration: "none" }}
	>
		<Image src={product.images?.[0]} h="170px" w="full" objectFit="cover" />
		<Box p={4}>
			<Text fontWeight="600" noOfLines={2} fontSize="14px" mb={1}>
				{product.name}
			</Text>
			<Text fontSize="12px" color="gray.500">
				{product.condition} • {product.year}
			</Text>
		</Box>
	</MotionBox>
);

const fetchProduct = async (id) => {
	const res = await API.get(`/products/${id}`);
	return res.data.data || res.data;
};

export default function ProductDetailPage() {
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);
	const navigate = useNavigate();

	const { data: product, isLoading, error } = useQuery({
		queryKey: ["product", id],
		queryFn: () => fetchProduct(id),
		enabled: !!id,
		onSuccess: () => window.scrollTo(0, 0),
	});

	const handleShare = async () => {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: product.name,
					text: `Check out this ${product.name}`,
					url: url,
				});
			} catch (err) {
				// User cancelled or error
			}
		} else {
			// Fallback: Copy to clipboard
			try {
				await navigator.clipboard.writeText(url);
				toast.success("Link copied to clipboard!");
			} catch (err) {
				toast.error("Failed to copy link");
			}
		}
	};

	if (isLoading) {
		return (
			<Center minH="100vh" bg="#f7f7f7">
				<VStack>
					<Spinner size="xl" color={RED} />
					<Text mt={3} color="gray.600">Loading product details...</Text>
				</VStack>
			</Center>
		);
	}

	if (error || !product) {
		return (
			<Center minH="100vh" bg="#f7f7f7">
				<VStack spacing={4}>
					<Heading color={RED}>Product Not Found</Heading>
					<Button as={Link} to="/" bg={RED} color="white">Back to Products</Button>
				</VStack>
			</Center>
		);
	}

	return (
		<Box bg="#f7f7f7" pb={8}>
			<Container maxW="container.xl" py={4}>

				{/* Top Bar / Breadcrumb Row */}
				<Flex justify="space-between" align="center" mb={4}>
					<Button 
						as={Link} 
						to="/" 
						variant="ghost" 
						leftIcon={<span>←</span>} 
						color={DARK}
						size="sm"
						fontSize="13px"
						_hover={{ bg: "gray.100" }}
					>
						Back to Home
					</Button>

					<Button
						leftIcon={<FaShareAlt />}
						variant="ghost"
						color={DARK}
						size="sm"
						fontSize="13px"
						onClick={handleShare}
						_hover={{ bg: "gray.100" }}
					>
						Share
					</Button>
				</Flex>

				{/* Single Unified 2-Column Responsive Layout */}
				<Flex direction={{ base: "column", lg: "row" }} gap={6} align="start">

					{/* LEFT COLUMN - Media & Descriptive Content (58% width on desktop) */}
					<VStack flex={{ base: "1", lg: "1.3" }} align="stretch" spacing={6} w="full">
						
						{/* Image Gallery Card */}
						<Box bg="white" borderRadius="2xl" p={5} boxShadow="sm" border="1px solid" borderColor="gray.100">
							{/* Main Image */}
							<Image
								src={product.images?.[selectedImage]}
								borderRadius="xl"
								w="full"
								h={{ base: "260px", md: "400px" }}
								objectFit="contain"
								bg="#fafafa"
								mb={product.images?.length > 1 ? 4 : 0}
							/>

							{/* Thumbnails */}
							{product.images?.length > 1 && (
								<HStack spacing={3} overflowX="auto" pb={1}>
									{product.images.map((img, idx) => (
										<Box
											key={idx}
											cursor="pointer"
											border={selectedImage === idx ? `2px solid ${RED}` : "2px solid transparent"}
											borderRadius="lg"
											overflow="hidden"
											transition="all 0.2s"
											_hover={{ opacity: 0.8 }}
											onClick={() => setSelectedImage(idx)}
											flexShrink={0}
										>
											<Image src={img} boxSize="70px" objectFit="cover" />
										</Box>
									))}
								</HStack>
							)}
						</Box>

						{/* Product Overview Card */}
						{product.description && (
							<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
								<Heading size="sm" mb={4} color={DARK} fontWeight="800" textTransform="uppercase" letterSpacing="0.5px" fontSize="14px">
									Product Overview
								</Heading>
								<Box 
									fontSize="14px" 
									lineHeight="1.7" 
									color="gray.600"
									dangerouslySetInnerHTML={{ __html: product.description }}
									sx={{
										"ul, ol": { paddingLeft: "20px", marginY: "8px" },
										"li": { marginY: "4px" },
										"p": { marginY: "8px" },
										"h3": { fontSize: "15px", fontWeight: "bold", marginY: "10px", color: DARK }
									}}
								/>
							</Box>
						)}

						{/* Additional Details Card */}
						{product.additionalDetails && (
							<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
								<Heading size="sm" mb={4} color={DARK} fontWeight="800" textTransform="uppercase" letterSpacing="0.5px" fontSize="14px">
									Additional Details
								</Heading>
								<Box 
									fontSize="14px" 
									lineHeight="1.7" 
									color="gray.600"
									dangerouslySetInnerHTML={{ __html: product.additionalDetails }}
									sx={{
										"ul, ol": { paddingLeft: "20px", marginY: "8px" },
										"li": { marginY: "4px" },
										"p": { marginY: "8px" },
										"h3": { fontSize: "15px", fontWeight: "bold", marginY: "10px", color: DARK }
									}}
								/>
							</Box>
						)}

						{/* Compatibility Card */}
						{product.compatibility && product.compatibility.length > 0 && (
							<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
								<Heading size="sm" mb={4} color={DARK} fontWeight="800" textTransform="uppercase" letterSpacing="0.5px" fontSize="14px">
									Compatible Vehicles
								</Heading>
								<Flex wrap="wrap" gap={2}>
									{product.compatibility.map((c, i) => (
										<Badge
											key={i}
											colorScheme="red"
											px={3}
											py={1.5}
											borderRadius="md"
											fontSize="12px"
											fontWeight="bold"
											variant="subtle"
										>
											{c.make} {c.model}
										</Badge>
									))}
								</Flex>
							</Box>
						)}
					</VStack>

					{/* RIGHT COLUMN - Sticky Sidebar (42% width on desktop) */}
					<VStack 
						flex="1" 
						align="stretch" 
						spacing={6} 
						w="full" 
						position={{ lg: "sticky" }} 
						top="80px"
					>
						{/* Main Title & Action Card */}
						<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
							<HStack spacing={2} mb={3}>
								<Badge bg="#E1060010" color={RED} fontSize="11px" px={3} py={0.5} borderRadius="full" fontWeight="700">
									CAR ENGINES
								</Badge>
								<Badge bg="green.50" color="green.700" fontSize="11px" px={3} py={0.5} borderRadius="full" fontWeight="700">
									IN STOCK
								</Badge>
							</HStack>

							<Heading size="lg" mb={4} color={DARK} lineHeight="1.3" fontWeight="800">
								{product.name}
							</Heading>

							{/* Call to Action Button */}
							<Button
								leftIcon={<FaPhoneAlt />}
								bg={RED}
								color="white"
								w="full"
								h="54px"
								fontSize="16px"
								fontWeight="700"
								borderRadius="xl"
								boxShadow="md"
								_hover={{ bg: "#c40000", transform: "translateY(-1px)", boxShadow: "lg" }}
								transition="all 0.2s"
								onClick={() => navigate("/call-seller", { state: product })}
								mb={1}
							>
								Request Quote
							</Button>
						</Box>

						{/* Technical Specifications Table */}
						{(() => {
							const specs = [
								{ label: "Make", value: product.make },
								{ label: "Model", value: product.model },
								{ label: "Year", value: product.year },
								{ label: "Engine Type", value: product.engineType },
								{ label: "Condition", value: product.condition },
							].filter((item) => item.value && String(item.value).trim() !== "");

							if (specs.length === 0) return null;

							return (
								<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
									<Heading size="sm" mb={4} color={DARK} fontWeight="800" textTransform="uppercase" letterSpacing="0.5px" fontSize="13px">
										Technical Specifications
									</Heading>
									<VStack align="stretch" spacing={3}>
										{specs.map((item, i) => (
											<Flex key={i} justify="space-between" pb={2.5} borderBottom={i < specs.length - 1 ? "1px solid" : "none"} borderColor="gray.50">
												<Text color="gray.500" fontSize="13px" fontWeight="600">{item.label}</Text>
												<Text fontWeight="700" color={DARK} fontSize="13px">{item.value}</Text>
											</Flex>
										))}
									</VStack>
								</Box>
							);
						})()}

						{/* Why Buy From Us Trust Points */}
						<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
							<Heading size="sm" mb={4} color={DARK} fontWeight="800" textTransform="uppercase" letterSpacing="0.5px" fontSize="13px">
								Why Buy From Us?
							</Heading>
							<VStack align="stretch" spacing={4}>
								{[
									{ icon: FaCertificate, text: "Quality Tested & Certified", desc: "Every unit is thoroughly inspected." },
									{icon: FaTruck, text: "Local collection & delivery", desc: "Fast shipping options available."},
									{ icon: FaShieldAlt, text: "06 Months Warranty", desc: "Comes with premium warranty coverage." },
									{ icon: FaCheckCircle, text: "Satisfaction Guaranteed", desc: "We ensure total product quality." },
								].map((item, i) => (
									<HStack key={i} spacing={3} align="start">
										<Icon as={item.icon} color={RED} boxSize={4.5} mt={0.5} />
										<VStack align="flex-start" spacing={0}>
											<Text fontWeight="700" fontSize="13px" color={DARK} lineHeight="1.2">{item.text}</Text>
											<Text fontSize="11px" color="gray.500">{item.desc}</Text>
										</VStack>
									</HStack>
								))}
							</VStack>
						</Box>
					</VStack>
				</Flex>

				{/* Similar Products */}
				{product.similarProducts?.length > 0 && (
					<Box mt={10}>
						<Heading size="md" mb={6} color={DARK} fontWeight="800">
							You May Also Like
						</Heading>
						<SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} gap={4}>
							{product.similarProducts.slice(0, 5).map((p, i) => (
								<ProductCard key={i} product={p} />
							))}
						</SimpleGrid>
					</Box>
				)}
			</Container>
		</Box>
	);
}