import React, { useState } from "react";
import {
	Container,
	SimpleGrid,
	Box,
	Heading,
	Text,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Button,
	useToast,
	Icon,
	HStack,
	Flex,
	Badge,
	Divider,
	useColorModeValue,
	InputGroup,
	InputLeftElement,
	Grid,
	GridItem,
	Card,
	CardBody,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import {
	FaPhone,
	FaEnvelope,
	FaMapMarkerAlt,
	FaClock,
	FaHeadset,
	FaCommentDots,
	FaPaperPlane,
	FaUser,
	FaRegBuilding,
	FaIndustry,
} from "react-icons/fa";
import { MdEmail, MdMessage } from "react-icons/md";
import API from "../services/api";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.100", "gray.600");
	const cardBg = useColorModeValue("gray.50", "gray.700");
	const accentColor = "#D90404";
	const darkBg = "#0F172A";

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await API.post("/contacts/submit", {
				...formData,
				sourcePath: "/contact",
			});

			toast({
				title: "Message sent successfully!",
				description: "Thank you for contacting us. We will respond within 24 hours.",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-right",
				variant: "left-accent",
			});
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			toast({
				title: "Failed to send message",
				description: error.response?.data?.message || "Please try again in a moment.",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-right",
				variant: "left-accent",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const contactInfo = [
		{
			icon: FaPhone,
			title: "Phone",
			details: "+44 1234 567890",
			subtext: "Mon-Fri 9AM-6PM",
		},
		{
			icon: FaEnvelope,
			title: "Email",
			details: "info@industrialmarket.co.uk",
			subtext: "support@industrialmarket.co.uk",
		},
		{
			icon: FaMapMarkerAlt,
			title: "Office",
			details: "United Kingdom",
			subtext: "Nationwide Service",
		},
		{
			icon: FaClock,
			title: "Hours",
			details: "Mon - Sat",
			subtext: "8:00 AM - 6:00 PM",
		},
	];

	return (
		<>
			<Helmet>
				<title>Contact Us - All Engine 4 You | UK's Leading Engine Price Comparison</title>
				<meta
					name="description"
					content="Get in touch with  All Engine 4 You for engine price comparison, quotes, and customer support across the UK."
				/>
			</Helmet>

			{/* Hero Section - Matching Header Theme */}
			<Box bg={darkBg} color="white" py={12} mb={8}>
				<Container maxW="container.xl">
					<VStack spacing={3} textAlign="center">
						<Badge bg={accentColor} color="white" px={3} py={1} borderRadius="full" fontSize="12px">
							Get in Touch
						</Badge>
						<Heading fontSize="36px" fontWeight="800">
							Contact Us
						</Heading>
						<Text fontSize="16px" maxW="2xl" opacity={0.9}>
							Have questions about engine prices or need assistance? We're here to help.
						</Text>
					</VStack>
				</Container>
			</Box>

			<Container maxW="container.xl" py={4}>
				{/* Contact Info Cards */}
				<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={12}>
					{contactInfo.map((info, index) => (
						<Card
							key={index}
							bg={bgColor}
							border="1px solid"
							borderColor={borderColor}
							borderRadius="lg"
							boxShadow="sm"
							_hover={{ transform: "translateY(-5px)", boxShadow: "lg", borderColor: accentColor }}
							transition="all 0.3s"
						>
							<CardBody py={5}>
								<VStack spacing={2} textAlign="center">
									<Box bg="orange.50" p={3} borderRadius="full" color={accentColor}>
										<Icon as={info.icon} boxSize={5} />
									</Box>
									<Text
										fontSize="13px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="1px"
									>
										{info.title}
									</Text>
									<Text fontWeight="bold" fontSize="15px" color={darkBg}>
										{info.details}
									</Text>
									<Text color="gray.500" fontSize="12px">
										{info.subtext}
									</Text>
								</VStack>
							</CardBody>
						</Card>
					))}
				</SimpleGrid>

				<Grid templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} gap={10}>
					{/* Left Column - Additional Info */}
					<GridItem>
						<VStack align="stretch" spacing={6}>
							<Box>
								<Flex align="center" mb={3}>
									<Icon as={FaIndustry} boxSize={6} color={accentColor} mr={2} />
									<Heading fontSize="24px" color={darkBg}>
										Let's Talk
									</Heading>
								</Flex>
								<Text color="gray.600" fontSize="15px" lineHeight="1.6">
									Get free quotes, compare prices, and find the best deals on reconditioned and used
									engines from trusted UK suppliers.
								</Text>
							</Box>

							<Box bg={cardBg} p={5} borderRadius="lg" borderLeft={`4px solid ${accentColor}`}>
								<Flex align="center" mb={3}>
									<Icon as={FaHeadset} boxSize={5} color={accentColor} mr={2} />
									<Heading size="sm" fontSize="18px">
										Customer Support
									</Heading>
								</Flex>
								<Text fontSize="14px" mb={3} lineHeight="1.6">
									Dedicated support for engine price comparison, order tracking, and technical
									assistance. Get help finding the right engine for your vehicle.
								</Text>
								<Button
									variant="link"
									color={accentColor}
									fontSize="13px"
									fontWeight="600"
									rightIcon={<FaPaperPlane />}
									_hover={{ textDecoration: "none", color: "#e55a00" }}
								>
									Learn more about our service
								</Button>
							</Box>

							<Box bg={cardBg} p={5} borderRadius="lg" borderLeft={`4px solid ${accentColor}`}>
								<Flex align="center" mb={3}>
									<Icon as={FaRegBuilding} boxSize={5} color={accentColor} mr={2} />
									<Heading size="sm" fontSize="18px">
										Supplier Inquiries
									</Heading>
								</Flex>
								<Text fontSize="14px" mb={2}>
									Interested in becoming a trusted supplier? Join our network of verified engine
									suppliers.
								</Text>
								<HStack spacing={2}>
									<Icon as={FaEnvelope} color={accentColor} boxSize={4} />
									<Text fontSize="13px" fontWeight="500">
										partners@industrialmarket.co.uk
									</Text>
								</HStack>
							</Box>

							{/* Trust Badges */}
							<Box bg={darkBg} p={5} borderRadius="lg" textAlign="center">
								<SimpleGrid columns={2} spacing={3}>
									<VStack spacing={1}>
										<Text fontSize="24px" fontWeight="bold" color={accentColor}>
											500+
										</Text>
										<Text fontSize="11px" color="white">
											Engines Available
										</Text>
									</VStack>
									<VStack spacing={1}>
										<Text fontSize="24px" fontWeight="bold" color={accentColor}>
											100+
										</Text>
										<Text fontSize="11px" color="white">
											Trusted Suppliers
										</Text>
									</VStack>
									<VStack spacing={1}>
										<Text fontSize="24px" fontWeight="bold" color={accentColor}>
											50K+
										</Text>
										<Text fontSize="11px" color="white">
											Happy Customers
										</Text>
									</VStack>
									<VStack spacing={1}>
										<Text fontSize="24px" fontWeight="bold" color={accentColor}>
											24/7
										</Text>
										<Text fontSize="11px" color="white">
											Support Available
										</Text>
									</VStack>
								</SimpleGrid>
							</Box>
						</VStack>
					</GridItem>

					{/* Right Column - Contact Form */}
					<GridItem>
						<Box
							bg={bgColor}
							p={6}
							borderRadius="lg"
							border="1px solid"
							borderColor={borderColor}
							boxShadow="lg"
							_hover={{ boxShadow: "xl" }}
							transition="all 0.3s"
						>
							<VStack spacing={5} align="stretch">
								<Box>
									<Heading fontSize="24px" mb={2} color={darkBg}>
										Send us a Message
									</Heading>
									<Text color="gray.500" fontSize="14px">
										Get free engine price quotes. Fill out the form and we'll get back to you within
										24 hours.
									</Text>
								</Box>

								<form onSubmit={handleSubmit}>
									<VStack spacing={4}>
										<FormControl isRequired>
											<FormLabel fontWeight="600" fontSize="13px" color={darkBg}>
												Full Name
											</FormLabel>
											<Flex
												border="1px solid"
												borderColor={borderColor}
												borderRadius="md"
												px={3}
												align="center"
												bg="white"
												_focus-within={{
													borderColor: accentColor,
													boxShadow: `0 0 0 1px ${accentColor}`,
												}}
											>
												<Icon as={FaUser} color={accentColor} boxSize={4} mr={3} flexShrink={0} />
												<Input
													name="name"
													value={formData.name}
													onChange={handleChange}
													placeholder="John Doe"
													fontSize="14px"
													border="none"
													p={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													height="44px"
												/>
											</Flex>
										</FormControl>

										<FormControl isRequired>
											<FormLabel fontWeight="600" fontSize="13px" color={darkBg}>
												Email Address
											</FormLabel>
											<Flex
												border="1px solid"
												borderColor={borderColor}
												borderRadius="md"
												px={3}
												align="center"
												bg="white"
												_focus-within={{
													borderColor: accentColor,
													boxShadow: `0 0 0 1px ${accentColor}`,
												}}
											>
												<Icon as={MdEmail} color={accentColor} boxSize={4} mr={3} flexShrink={0} />
												<Input
													name="email"
													type="email"
													value={formData.email}
													onChange={handleChange}
													placeholder="john@example.com"
													fontSize="14px"
													border="none"
													p={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													height="44px"
												/>
											</Flex>
										</FormControl>

										<FormControl isRequired>
											<FormLabel fontWeight="600" fontSize="13px" color={darkBg}>
												Subject
											</FormLabel>
											<Flex
												border="1px solid"
												borderColor={borderColor}
												borderRadius="md"
												px={3}
												align="center"
												bg="white"
												_focus-within={{
													borderColor: accentColor,
													boxShadow: `0 0 0 1px ${accentColor}`,
												}}
											>
												<Icon
													as={FaCommentDots}
													color={accentColor}
													boxSize={4}
													mr={3}
													flexShrink={0}
												/>
												<Input
													name="subject"
													value={formData.subject}
													onChange={handleChange}
													placeholder="Engine price quote request"
													fontSize="14px"
													border="none"
													p={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													height="44px"
												/>
											</Flex>
										</FormControl>

										<FormControl isRequired>
											<FormLabel fontWeight="600" fontSize="13px" color={darkBg}>
												Message
											</FormLabel>
											<Flex
												border="1px solid"
												borderColor={borderColor}
												borderRadius="md"
												px={3}
												py={3}
												bg="white"
												align="flex-start"
												_focus-within={{
													borderColor: accentColor,
													boxShadow: `0 0 0 1px ${accentColor}`,
												}}
											>
												<Icon
													as={MdMessage}
													color={accentColor}
													boxSize={4}
													mr={3}
													mt={1}
													flexShrink={0}
												/>
												<Textarea
													name="message"
													value={formData.message}
													onChange={handleChange}
													placeholder="Please provide your vehicle registration number and engine requirements..."
													rows={5}
													fontSize="14px"
													border="none"
													p={0}
													m={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													resize="none"
												/>
											</Flex>
										</FormControl>

										<Button
											type="submit"
											bg={accentColor}
											color="white"
											size="lg"
											fontSize="15px"
											fontWeight="600"
											width="100%"
											borderRadius="md"
											isLoading={isSubmitting}
											loadingText="Sending..."
											leftIcon={<FaPaperPlane />}
											_hover={{
												bg: "#e55a00",
												transform: "translateY(-2px)",
												boxShadow: "lg",
											}}
											transition="all 0.2s"
										>
											Get Free Quotes
										</Button>
									</VStack>
								</form>

								<Divider />

								<Text fontSize="11px" color="gray.500" textAlign="center">
									By submitting, you agree to our privacy policy. We'll never share your
									information.
								</Text>
							</VStack>
						</Box>
					</GridItem>
				</Grid>

				{/* Bottom Trust Bar */}
				<Box mt={10} textAlign="center" py={4}>
					<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
						<Text fontSize="12px" color="gray.500">
							✓ Trusted UK Suppliers
						</Text>
						<Text fontSize="12px" color="gray.500">
							✓ Best Price Guarantee
						</Text>
						<Text fontSize="12px" color="gray.500">
							✓ Free Quotes
						</Text>
						<Text fontSize="12px" color="gray.500">
							✓ Nationwide Delivery
						</Text>
					</SimpleGrid>
				</Box>
			</Container>
		</>
	);
}
