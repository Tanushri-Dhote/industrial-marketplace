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
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionSimpleGrid = motion(SimpleGrid);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);

const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
	viewport: { once: true },
};

const staggerContainer = {
	initial: { opacity: 0 },
	whileInView: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
	viewport: { once: true },
};

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
			details: "info@reconditionedengine.co.uk",
			subtext: "support@reconditionedengine.co.uk",
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
				<title>Contact Us - Re-Conditioned Engine | UK's Leading Engine </title>
				<meta
					name="description"
					content="Get in touch with  Re-Conditioned Engine for engine price, quotes, and customer support across the UK."
				/>
			</Helmet>

			{/* Hero Section - Matching Header Theme */}
			<Box bg={darkBg} color="white" py={20} mb={8} position="relative" overflow="hidden">
				<Box position="absolute" top="-10%" right="-5%" w="400px" h="400px" bg={accentColor} filter="blur(150px)" opacity={0.1} />
				<Container maxW="container.xl">
					<MotionVStack spacing={4} textAlign="center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
						<Badge bg={accentColor} color="white" px={4} py={1.5} borderRadius="full" fontSize="12px" fontWeight="800" letterSpacing="1px">
							GET IN TOUCH
						</Badge>
						<Heading fontSize={{ base: "42px", md: "56px" }} fontWeight="900" lineHeight="1.1">
							We're Here to <Text as="span" color={accentColor}>Help.</Text>
						</Heading>
						<Text fontSize="18px" maxW="2xl" opacity={0.8} lineHeight="1.6">
							Have questions about engine prices or need assistance? Our specialists are ready to support you.
						</Text>
					</MotionVStack>
				</Container>
			</Box>

			<Container maxW="container.xl" py={4}>
				{/* Contact Info Cards */}
				<MotionSimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={20} variants={staggerContainer} initial="initial" whileInView="whileInView">
					{contactInfo.map((info, index) => (
						<MotionBox
							key={index}
							bg={bgColor}
							p={8}
							borderRadius="2xl"
							border="1px solid"
							borderColor={borderColor}
							boxShadow="xl"
							variants={fadeInUp}
							whileHover={{ y: -10, borderColor: accentColor, boxShadow: "2xl" }}
							transition="all 0.3s"
						>
							<VStack spacing={4} textAlign="center">
								<Box bg="orange.50" p={4} borderRadius="2xl" color={accentColor}>
									<Icon as={info.icon} boxSize={6} />
								</Box>
								<Text
									fontSize="12px"
									fontWeight="800"
									color="gray.400"
									textTransform="uppercase"
									letterSpacing="2px"
								>
									{info.title}
								</Text>
								<Text fontWeight="800" fontSize="16px" color={darkBg}>
									{info.details}
								</Text>
								<Text color="gray.500" fontSize="13px">
									{info.subtext}
								</Text>
							</VStack>
						</MotionBox>
					))}
				</MotionSimpleGrid>

				<Grid templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} gap={16}>
					{/* Left Column */}
					<GridItem>
						<MotionVStack align="stretch" spacing={8} initial="initial" whileInView="whileInView" variants={staggerContainer}>
							<MotionBox variants={fadeInUp}>
								<Flex align="center" mb={4}>
									<Icon as={FaIndustry} boxSize={8} color={accentColor} mr={4} />
									<MotionHeading fontSize="32px" color={darkBg} fontWeight="900">
										Let's Talk
									</MotionHeading>
								</Flex>
								<Text color="gray.600" fontSize="17px" lineHeight="1.8">
									Get free quotes, and find the best deals on reconditioned and used
									engines from trusted UK suppliers.
								</Text>
							</MotionBox>

							<MotionBox bg={cardBg} p={8} borderRadius="2xl" borderLeft={`6px solid ${accentColor}`} variants={fadeInUp} whileHover={{ x: 10 }}>
								<Flex align="center" mb={4}>
									<Icon as={FaHeadset} boxSize={6} color={accentColor} mr={3} />
									<Heading fontSize="22px" fontWeight="800">
										Customer Support
									</Heading>
								</Flex>
								<Text fontSize="15px" color="gray.600" mb={4} lineHeight="1.7">
									Dedicated support for engine price, order tracking, and technical
									assistance. Get help finding the right engine.
								</Text>
								<Button
									variant="link"
									color={accentColor}
									fontSize="14px"
									fontWeight="800"
									rightIcon={<FaPaperPlane />}
									_hover={{ textDecoration: "none", transform: "translateX(5px)" }}
									transition="all 0.2s"
								>
									SERVICE GUIDE
								</Button>
							</MotionBox>

							<MotionBox bg={cardBg} p={8} borderRadius="2xl" borderLeft={`6px solid ${darkBg}`} variants={fadeInUp} whileHover={{ x: 10 }}>
								<Flex align="center" mb={4}>
									<Icon as={FaRegBuilding} boxSize={6} color={accentColor} mr={3} />
									<Heading fontSize="22px" fontWeight="800">
										Supplier Inquiries
									</Heading>
								</Flex>
								<Text fontSize="15px" color="gray.600" mb={4} lineHeight="1.7">
									Interested in becoming a trusted supplier? Join our network of verified engine
									suppliers.
								</Text>
								<HStack spacing={3}>
									<Icon as={FaEnvelope} color={accentColor} boxSize={5} />
									<Text fontSize="15px" fontWeight="700">
										partners@reconditionedengine.co.uk
									</Text>
								</HStack>
							</MotionBox>

							{/* Stats */}
							<MotionBox bg={darkBg} p={10} borderRadius="3xl" textAlign="center" variants={fadeInUp}>
								<SimpleGrid columns={2} spacing={8}>
									{[
										{ val: "500+", label: "Engines" },
										{ val: "100+", label: "Suppliers" },
										{ val: "50K+", label: "Customers" },
										{ val: "24/7", label: "Support" },
									].map((s, idx) => (
										<VStack key={idx} spacing={1}>
											<Text fontSize="28px" fontWeight="900" color={accentColor}>
												{s.val}
											</Text>
											<Text fontSize="12px" color="whiteAlpha.700" fontWeight="700" letterSpacing="1px">
												{s.label.toUpperCase()}
											</Text>
										</VStack>
									))}
								</SimpleGrid>
							</MotionBox>
						</MotionVStack>
					</GridItem>

					{/* Right Column - Form */}
					<GridItem>
						<MotionBox
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							bg={bgColor}
							p={{ base: 6, md: 12 }}
							borderRadius="3xl"
							border="1px solid"
							borderColor={borderColor}
							boxShadow="2xl"
						>
							<VStack spacing={8} align="stretch">
								<Box>
									<Heading fontSize="32px" mb={3} color={darkBg} fontWeight="900">
										Send a Message
									</Heading>
									<Text color="gray.500" fontSize="16px">
										Get free engine price quotes. We'll respond within 24 hours.
									</Text>
								</Box>

								<form onSubmit={handleSubmit}>
									<VStack spacing={6}>
										<FormControl isRequired>
											<FormLabel fontWeight="800" fontSize="13px" color={darkBg} letterSpacing="1px">
												FULL NAME
											</FormLabel>
											<Flex
												border="2px solid"
												borderColor={borderColor}
												borderRadius="xl"
												px={4}
												align="center"
												bg="gray.50"
												_focus-within={{
													borderColor: accentColor,
													bg: "white",
													boxShadow: "0 0 0 1px " + accentColor,
												}}
												transition="all 0.2s"
											>
												<Icon as={FaUser} color={accentColor} boxSize={5} mr={4} />
												<Input
													name="name"
													value={formData.name}
													onChange={handleChange}
													placeholder="John Doe"
													fontSize="15px"
													fontWeight="600"
													border="none"
													p={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													height="56px"
												/>
											</Flex>
										</FormControl>

										<FormControl isRequired>
											<FormLabel fontWeight="800" fontSize="13px" color={darkBg} letterSpacing="1px">
												EMAIL ADDRESS
											</FormLabel>
											<Flex
												border="2px solid"
												borderColor={borderColor}
												borderRadius="xl"
												px={4}
												align="center"
												bg="gray.50"
												_focus-within={{
													borderColor: accentColor,
													bg: "white",
													boxShadow: "0 0 0 1px " + accentColor,
												}}
												transition="all 0.2s"
											>
												<Icon as={MdEmail} color={accentColor} boxSize={5} mr={4} />
												<Input
													name="email"
													type="email"
													value={formData.email}
													onChange={handleChange}
													placeholder="john@example.com"
													fontSize="15px"
													fontWeight="600"
													border="none"
													p={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													height="56px"
												/>
											</Flex>
										</FormControl>

										<FormControl isRequired>
											<FormLabel fontWeight="800" fontSize="13px" color={darkBg} letterSpacing="1px">
												SUBJECT
											</FormLabel>
											<Flex
												border="2px solid"
												borderColor={borderColor}
												borderRadius="xl"
												px={4}
												align="center"
												bg="gray.50"
												_focus-within={{
													borderColor: accentColor,
													bg: "white",
													boxShadow: "0 0 0 1px " + accentColor,
												}}
												transition="all 0.2s"
											>
												<Icon
													as={FaCommentDots}
													color={accentColor}
													boxSize={5}
													mr={4}
												/>
												<Input
													name="subject"
													value={formData.subject}
													onChange={handleChange}
													placeholder="Engine quote request"
													fontSize="15px"
													fontWeight="600"
													border="none"
													p={0}
													_focus={{ outline: "none", boxShadow: "none" }}
													height="56px"
												/>
											</Flex>
										</FormControl>

										<FormControl isRequired>
											<FormLabel fontWeight="800" fontSize="13px" color={darkBg} letterSpacing="1px">
												MESSAGE
											</FormLabel>
											<Flex
												border="2px solid"
												borderColor={borderColor}
												borderRadius="xl"
												px={4}
												py={4}
												bg="gray.50"
												align="flex-start"
												_focus-within={{
													borderColor: accentColor,
													bg: "white",
													boxShadow: "0 0 0 1px " + accentColor,
												}}
												transition="all 0.2s"
											>
												<Icon
													as={MdMessage}
													color={accentColor}
													boxSize={5}
													mr={4}
													mt={1}
												/>
												<Textarea
													name="message"
													value={formData.message}
													onChange={handleChange}
													placeholder="How can we help?"
													rows={5}
													fontSize="15px"
													fontWeight="600"
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
											h="64px"
											width="100%"
											borderRadius="xl"
											isLoading={isSubmitting}
											leftIcon={<FaPaperPlane />}
											fontSize="18px"
											fontWeight="800"
											_hover={{
												bg: "#B70303",
												transform: "translateY(-4px)",
												boxShadow: "0 20px 40px rgba(217, 4, 4, 0.3)",
											}}
											transition="all 0.3s"
										>
											Send Message
										</Button>
									</VStack>
								</form>

								<Text fontSize="12px" color="gray.500" textAlign="center">
									By submitting, you agree to our privacy policy. We'll never share your
									information.
								</Text>
							</VStack>
						</MotionBox>
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
