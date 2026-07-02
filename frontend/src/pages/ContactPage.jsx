import React, { useState } from "react";
import {
	Box,
	Container,
	Grid,
	GridItem,
	Text,
	VStack,
	HStack,
	Input,
	Textarea,
	Button,
	useToast,
	Icon,
	Flex,
	ScaleFade,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import {
	FaPhoneAlt,
	FaHeadset,
	FaPaperPlane,
	FaClock,
} from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import API from "../services/api";

const RED = "#D90404";

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "+44",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await API.post("/contacts/submit", { ...formData, sourcePath: "/contact" });

			toast({
				title: "Message sent successfully!",
				description: "We'll get back to you within 24 hours.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			setFormData({ name: "", email: "", phone: "+44", subject: "", message: "" });
		} catch (error) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{/* Hero Section */}
			<Box
				position="relative"
				h={{ base: "280px", md: "380px" }}
				bgImage="url('/contact.png')"
				bgPosition="center"
				bgSize="cover"
				bgRepeat="no-repeat"
				overflow="hidden"
			>
				{/* Left gradient overlay */}
				<Box
					position="absolute"
					inset={0}
					bg="linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0) 100%)"
					zIndex={1}
				/>

				<Container
					maxW="container.xl"
					h="100%"
					position="relative"
					zIndex={2}
					display="flex"
					alignItems="center"
				>
					<Box maxW="500px">
						{/* Main heading */}
						<Text
							fontSize={{ base: "28px", md: "32px" }}
							fontWeight="900"
							lineHeight="1"
							textTransform="uppercase"
							color="white"
							letterSpacing="1px"
							mb={4}
						>
							CONTACT US
						</Text>

						{/* Description */}
						<Text
							fontSize={{ base: "16px", md: "18px" }}
							color="white"
							lineHeight="1.5"
							maxW="420px"
							mb={6}
						>
							We’re here to help! Get in touch with us
							<br />
							for any queries or support.
						</Text>

						{/* Red underline */}
						<Box
							w="60px"
							h="4px"
							bg="red.500"
							borderRadius="full"
						/>
					</Box>
				</Container>
			</Box>

			<Container maxW="container.xl" py={8} px={6}>

				<Grid
					templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
					gap={6}
					mb={6}
				>
					{[
						{
							icon: MdLocationOn,
							title: "ADDRESS",
							content: "44 Fowler Road, Hainault Business Park, Ilford London, IG6 3UT",
						},
						{
							icon: FaPhoneAlt,
							title: "PHONE",
							content: "02071129397\nMon - Sat: 8:00 AM - 6:00 PM",
						},
						{
							icon: MdEmail,
							title: "EMAIL",
							content: "info@reconditionedengine.co.uk\nWe reply within 24 hours",
						},
						{
							icon: FaClock,
							title: "WORKING HOURS",
							content: "Mon - Sat: 8:00 AM - 6:00 PM\nSunday: Closed",
						},
					].map((item, index) => (
						<GridItem key={index}>
							<Box
								bg="#f8f8f8"
								border="1px solid #efefef"
								borderTop="4px solid #D90404"
								borderRadius="0 0 14px 14px"
								px={6}
								py={5}
								minH="112px"
								transition="all 0.3s ease"
								_hover={{
									boxShadow: "lg",
									transform: "translateY(-4px)",
								}}
							>
								<HStack align="flex-start" spacing={4}>
									{/* Icon */}
									<Flex
										w="42px"
										h="42px"
										bg="#D90404"
										borderRadius="full"
										align="center"
										justify="center"
										flexShrink={0}
										boxShadow="0 4px 12px rgba(217,4,4,0.25)"
									>
										<Icon as={item.icon} color="white" boxSize={5} />
									</Flex>

									{/* Content */}
									<Box>
										<Text
											fontSize="15px"
											fontWeight="800"
											color="#1a1a1a"
											textTransform="uppercase"
											mb={2}
											lineHeight="1"
										>
											{item.title}
										</Text>

										<Text
											fontSize={{
												base: "14.5px", // mobile
												md: "13px",     // tablet
												lg: "11.5px",     // desktop
												xl: "11.5px",     // large desktop
											}}
											color="#666"
											lineHeight="1.8"
											whiteSpace="pre-line"
										>
											{item.content}
										</Text>
									</Box>
								</HStack>
							</Box>
						</GridItem>
					))}
				</Grid>

				<Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10}>
					{/* Contact Form */}
					<GridItem>
						<Box>
							<Text
								fontSize="14px"
								fontWeight="700"
								color={RED}
								letterSpacing="1px"
								textTransform="uppercase"
								mb={2}
							>
								SEND US A MESSAGE
							</Text>
							<Text fontSize="28px" fontWeight="700" mb={8}>
								Get In Touch
							</Text>

							<form onSubmit={handleSubmit}>
								<VStack spacing={6} align="stretch">
									<Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
										<Input
											name="name"
											value={formData.name}
											onChange={handleChange}
											placeholder="Your Name *"
											size="lg"
											h="54px"
											required
											_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)" }}
											transition="all 0.2s"
										/>
										<Input
											name="email"
											type="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="Your Email *"
											size="lg"
											h="54px"
											required
											_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)" }}
											transition="all 0.2s"
										/>
									</Grid>

									<Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
										<Input
											name="phone"
											value={formData.phone}
											onChange={(e) => {
												let value = e.target.value;

												// Always keep +44 at the beginning
												if (!value.startsWith("+44")) {
													value = "+44";
												}

												// Allow only digits after +44
												value = "+44" + value.slice(3).replace(/\D/g, "");

												// Limit to +44 followed by 10 digits
												if (value.length <= 13) {
													setFormData({ ...formData, phone: value });
												}
											}}
											placeholder="02071129397"
											size="lg"
											h="54px"
											type="tel"
											pattern="^(\+44\d{10}|0\d{10})$"
											maxLength={13}
											_focus={{
												borderColor: RED,
												boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)",
											}}
											transition="all 0.2s"
										/>
										<Input
											name="subject"
											value={formData.subject}
											onChange={handleChange}
											placeholder="Subject"
											size="lg"
											h="54px"
											_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)" }}
											transition="all 0.2s"
										/>
									</Grid>

									<Textarea
										name="message"
										value={formData.message}
										onChange={handleChange}
										placeholder="Your Message *"
										rows={6}
										required
										_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)" }}
										transition="all 0.2s"
									/>

									<Button
										type="submit"
										bg={RED}
										color="white"
										size="lg"
										h="58px"
										fontSize="16px"
										fontWeight="600"
										rightIcon={<FaPaperPlane />}
										isLoading={isSubmitting}
										_hover={{ bg: "#b80303", transform: "translateY(-2px)" }}
										transition="all 0.3s ease"
										boxShadow="md"
									>
										SEND MESSAGE
									</Button>
								</VStack>
							</form>
						</Box>
					</GridItem>

					{/* Map Section */}
					<GridItem>
						<Text
							fontSize="14px"
							fontWeight="700"
							color={RED}
							letterSpacing="1px"
							textTransform="uppercase"
							mb={2}
						>
							FIND US HERE
						</Text>
						<Text fontSize="28px" fontWeight="700" mb={6}>
							Our Location
						</Text>

						<Box
							height={{ base: "380px", lg: "460px" }}
							borderRadius="16px"
							overflow="hidden"
							boxShadow="lg"
							border="1px solid"
							borderColor="gray.100"
							transition="all 0.4s ease"
							_hover={{ boxShadow: "2xl", transform: "scale(1.01)" }}
						>
							<iframe
								width="100%"
								height="100%"
								style={{ border: 0 }}
								loading="lazy"
								allowFullScreen
								referrerPolicy="no-referrer-when-downgrade"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.5!2d0.085!3d51.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a8f5f5f5f5f5%3A0x1234567890abcdef!2s38%20Fowler%20Rd%2C%20Ilford%20IG6%203UT!5e0!3m2!1sen!2suk!4v1234567890"
							/>
						</Box>
					</GridItem>
				</Grid>

				{/* Immediate Help Section */}
				<Box
					mt={16}
					bg={RED}
					borderRadius="20px"
					p={{ base: 8, md: 12 }}
					color="white"
					position="relative"
					overflow="hidden"
				>
					<Flex
						direction={{ base: "column", md: "row" }}
						align="center"
						justify="space-between"
						gap={8}
					>
						<HStack spacing={5}>
							<Icon as={FaHeadset} boxSize={12} />
							<Box>
								<Text fontSize="24px" fontWeight="800" mb={2}>
									Need Immediate Help?
								</Text>
								<Text fontSize="16px" opacity={0.95}>
									Call us directly for any urgent queries or support.
								</Text>
							</Box>
						</HStack>

						<Button
							as="a"
							href="tel:02071129397"
							size="lg"
							bg="white"
							color={RED}
							fontWeight="700"
							fontSize="17px"
							px={10}
							h="58px"
							leftIcon={<FaPhoneAlt />}
							_hover={{
								bg: "gray.100",
								transform: "scale(1.05)",
							}}
							transition="all 0.3s ease"
							boxShadow="lg"
						>
							02071129397
						</Button>
					</Flex>
				</Box>
			</Container>
		</>
	);
}