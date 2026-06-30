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
		<Box bg="#f7f7f7" minH="100vh" pb={16}>
			<Container maxW="container.xl" py={8}>

				{/* Top Bar */}
				<Flex justify="space-between" align="center" mb={8}>
					<Button as={Link} to="/" variant="ghost" leftIcon={<span>←</span>} color={DARK}>
						Back to Home
					</Button>

					<HStack spacing={4}>
						<Button
							leftIcon={<FaShareAlt />}
							variant="ghost"
							color={DARK}
							onClick={handleShare}
							_hover={{ bg: "gray.100" }}
						>
							Share
						</Button>


					</HStack>
				</Flex>

				<Flex direction={{ base: "column", lg: "row" }} gap={8}>

					{/* LEFT - Image Gallery */}
					<Box flex="1">
						<Box bg="white" borderRadius="2xl" p={6} boxShadow="sm">
							{/* Thumbnails */}
							{product.images?.length > 1 && (
								<HStack spacing={3} mb={6} overflowX="auto" pb={2}>
									{product.images.map((img, idx) => (
										<Box
											key={idx}
											cursor="pointer"
											border={selectedImage === idx ? `3px solid ${RED}` : "3px solid transparent"}
											borderRadius="lg"
											overflow="hidden"
											onClick={() => setSelectedImage(idx)}
										>
											<Image src={img} boxSize="85px" objectFit="cover" />
										</Box>
									))}
								</HStack>
							)}

							{/* Main Image */}
							<Image
								src={product.images?.[selectedImage]}
								borderRadius="xl"
								w="full"
								h={{ base: "320px", md: "480px" }}
								objectFit="contain"
								bg="#fafafa"
							/>
						</Box>
					</Box>

					{/* RIGHT - Product Details */}
					<Box flex="1">
						<Wrap mb={5}>
							<Badge bg="#E1060010" color={RED} fontSize="14px" px={5} py={1} borderRadius="full">
								CAR ENGINES
							</Badge>
							<Badge bg="green.100" color="green.700" fontSize="14px" px={5} py={1} borderRadius="full">
								IN STOCK
							</Badge>
						</Wrap>

						<Heading size="xl" mb={6} color={DARK} lineHeight="1.2">
							{product.name}
						</Heading>

						<SimpleGrid columns={{ base: 2, md: 4 }} gap={6} mb={8}>
							{[
								{ icon: FaTachometerAlt, label: "Make & Model", value: [product.make, product.model].filter(Boolean).join(" ") },
								{ icon: FaCalendarAlt, label: "Year", value: product.year },
								{ icon: FaGasPump, label: "Engine", value: product.engineType },
								{ icon: FaCog, label: "Condition", value: product.condition },
							]
								.filter((item) => item.value && String(item.value).trim() !== "")
								.map((item, i) => (
									<Box key={i} bg="white" p={5} borderRadius="xl" boxShadow="sm">
										<Icon as={item.icon} color={RED} mb={3} boxSize={6} />
										<Text fontSize="13px" color="gray.500">{item.label}</Text>
										<Text fontWeight="700" fontSize="16px" color={DARK}>{item.value}</Text>
									</Box>
								))}
						</SimpleGrid>

						<Button
							leftIcon={<FaPhoneAlt />}
							bg={RED}
							color="white"
							w="full"
							h="64px"
							fontSize="17px"
							fontWeight="700"
							_hover={{ bg: "#c40000" }}
							onClick={() => navigate("/call-seller", { state: product })}
						>
							Request Quote
						</Button>
					</Box>
				</Flex>

				{/* Two-Column Details Layout */}
				<Flex direction={{ base: "column", lg: "row" }} gap={8} mt={6} align="start">
					{/* Left Column — 65% on large screens */}
					<VStack flex="3" align="stretch" spacing={8} w="full">
						{/* Product Overview */}
						{product.description && (
							<Box bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
								<Heading size="md" mb={4} color={DARK}>Product Overview</Heading>
								<Box 
									fontSize="15px" 
									lineHeight="1.8" 
									color="gray.600"
									dangerouslySetInnerHTML={{ __html: product.description }}
									sx={{
										"ul, ol": { paddingLeft: "20px", marginY: "10px" },
										"li": { marginY: "5px" },
										"p": { marginY: "10px" },
										"h3": { fontSize: "17px", fontWeight: "bold", marginY: "12px", color: DARK }
									}}
								/>
							</Box>
						)}

						{/* Additional Details */}
						{product.additionalDetails && (
							<Box bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
								<Heading size="md" mb={4} color={DARK}>Additional Details</Heading>
								<Box 
									fontSize="15px" 
									lineHeight="1.8" 
									color="gray.600"
									dangerouslySetInnerHTML={{ __html: product.additionalDetails }}
									sx={{
										"ul, ol": { paddingLeft: "20px", marginY: "10px" },
										"li": { marginY: "5px" },
										"p": { marginY: "10px" },
										"h3": { fontSize: "17px", fontWeight: "bold", marginY: "12px", color: DARK }
									}}
								/>
							</Box>
						)}

						{/* Compatible Vehicles */}
						{product.compatibility && product.compatibility.length > 0 && (
							<Box bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
								<Heading size="md" mb={6} color={DARK}>Compatible Vehicles</Heading>
								<Flex wrap="wrap" gap={3}>
									{product.compatibility.map((c, i) => (
										<Badge
											key={i}
											colorScheme="red"
											px={4}
											py={2}
											borderRadius="lg"
											fontSize="13px"
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

					{/* Right Column — 35% on large screens (Sticky Sidebar) */}
					<VStack flex="2" align="stretch" spacing={8} w="full" position={{ lg: "sticky" }} top="100px">
						{/* Technical Specifications */}
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
									<Heading size="md" mb={6} color={DARK}>Technical Specifications</Heading>
									<VStack align="stretch" spacing={4}>
										{specs.map((item, i) => (
											<HStack key={i} justify="space-between" pb={3} borderBottom={i < specs.length - 1 ? "1px solid" : "none"} borderColor="gray.100">
												<Text color="gray.500" fontSize="14px">{item.label}</Text>
												<Text fontWeight="600" color={DARK} fontSize="14px">{item.value}</Text>
											</HStack>
										))}
									</VStack>
								</Box>
							);
						})()}

						{/* Why Buy From Us Card */}
						<Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
							<Heading size="md" mb={6} color={DARK}>Why Buy From Us?</Heading>
							<VStack align="stretch" spacing={5}>
								{[
									{ icon: FaCertificate, text: "Quality Tested & Certified", desc: "Every unit is thoroughly inspected." },
									{ icon: FaTruck, text: "Nationwide collection & delivery", desc: "Fast shipping options available." },
									{ icon: FaShieldAlt, text: "06 Months Warranty", desc: "Comes with premium warranty coverage." },
									{ icon: FaCheckCircle, text: "Satisfaction Guaranteed", desc: "We ensure total product quality." },
								].map((item, i) => (
									<HStack key={i} spacing={4} align="start">
										<Icon as={item.icon} color={RED} boxSize={5} mt={0.5} />
										<VStack align="flex-start" spacing={0}>
											<Text fontWeight="600" fontSize="14px" color={DARK}>{item.text}</Text>
											<Text fontSize="12px" color="gray.500">{item.desc}</Text>
										</VStack>
									</HStack>
								))}
							</VStack>
						</Box>
					</VStack>
				</Flex>

				{/* Similar Products */}
				{product.similarProducts?.length > 0 && (
					<Box mt={16}>
						<Heading size="lg" mb={8} color={DARK}>You May Also Like</Heading>
						<SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} gap={6}>
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