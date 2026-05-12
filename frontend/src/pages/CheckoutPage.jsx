import React, { useState } from "react";
import {
	Box,
	Container,
	Heading,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	Input,
	Grid,
	VStack,
	HStack,
	Text,
	Checkbox,
	Radio,
	RadioGroup,
	Textarea,
	Center,
	Divider,
	Icon,
	Badge,
	Card,
	CardBody,
	Flex,
	Avatar,
	Tag,
	Wrap,
	WrapItem,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	FormLabel,
	IconButton,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	FaShoppingCart,
	FaTrash,
	FaPlus,
	FaMinus,
	FaCar,
	FaTools,
	FaMapMarkerAlt,
	FaInfoCircle,
	FaCreditCard,
	FaPaypal,
	FaEnvelope,
	FaUser,
	FaPhone,
	FaShieldAlt,
	FaTruck,
} from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

export default function CheckoutPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const product = location.state?.product;
	const [cart, setCart] = useState(() => (product ? [{ ...product, qty: 1 }] : []));
	const [postcode, setPostcode] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");
	const [serviceType, setServiceType] = useState("supply_only");
	const [condition, setCondition] = useState("reconditioned");
	const [drives, setDrives] = useState("no");
	const [paymentMethod, setPaymentMethod] = useState("card");

	if (!product && cart.length === 0) {
		return (
			<Center minH="100vh" bg="gray.50">
				<VStack spacing={6} p={8} bg="white" borderRadius="2xl" shadow="xl">
					<Box bg="red.50" p={4} borderRadius="full">
						<Icon as={FaShoppingCart} boxSize={8} color="red.500" />
					</Box>
					<Heading size="lg">No Product Selected</Heading>
					<Text color="gray.600">Please select a product to checkout.</Text>
					<Button
						onClick={() => navigate("/")}
						bg="#D90404"
						color="white"
						_hover={{ bg: "#B70303" }}
						size="lg"
						px={8}
					>
						Return Home
					</Button>
				</VStack>
			</Center>
		);
	}

	const cartItemCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
	const total = cart.reduce(
		(sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
		0,
	);

	const updateQuantity = (productId, delta) => {
		setCart((prev) =>
			prev
				.map((item) => {
					if (item._id !== productId) {
						return item;
					}
					const nextQty = Number(item.qty || 1) + delta;
					if (nextQty < 1) return item;
					return { ...item, qty: nextQty };
				})
				.filter((item) => item.qty > 0),
		);
	};

	const removeFromCart = (productId) => {
		setCart((prev) => prev.filter((item) => item._id !== productId));
	};

	const handleProceed = () => {
		// Validation
		if (!email || !name || !phone) {
			// You can add toast notification here
			return;
		}
		navigate("/thank-you");
	};

	return (
		<Box bg="linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)" minH="100vh" py={8}>
			<Container maxW="container.xl">
				{/* Header */}
				<Flex
					direction={{ base: "column", sm: "row" }}
					justify="space-between"
					align={{ base: "flex-start", sm: "center" }}
					mb={6}
					gap={4}
				>
					<Flex align="center" gap={3}>
						<Box bg="#D90404" p={2} borderRadius="xl">
							<Icon as={FaShoppingCart} color="white" boxSize={5} />
						</Box>
						<Heading size={{ base: "md", md: "lg" }} fontWeight="800">
							Checkout
						</Heading>
					</Flex>

					<Badge
						bg="#D90404"
						color="white"
						fontSize={{ base: "12px", md: "14px" }}
						px={4}
						py={2}
						borderRadius="full"
						display="flex"
						alignItems="center"
						gap={2}
						w="fit-content"
					>
						<Icon as={FaShoppingCart} />
						{cartItemCount} {cartItemCount === 1 ? "Item" : "Items"} in Cart
					</Badge>
				</Flex>

				<Grid templateColumns={{ base: "1fr", lg: "1.5fr 1fr" }} gap={8}>
					{/* LEFT COLUMN - Cart & Forms */}
					<VStack spacing={6} align="stretch">
						{/* Cart Summary Card */}
						<Card shadow="lg" borderRadius="2xl" overflow="hidden">
							<Box bg="#D90404" px={5} py={3}>
								<Text color="white" fontWeight="700" fontSize="18px">
									Order Summary
								</Text>
							</Box>

							{/* Mobile List View */}
							<Box display={{ base: "block", md: "none" }} p={4}>
								<VStack spacing={4} align="stretch">
									{cart.map((item) => {
										const price = Number(item.price || 0);
										const lineTotal = price * Number(item.qty || 0);
										return (
											<Box
												key={item._id}
												p={4}
												border="1px solid"
												borderColor="gray.100"
												borderRadius="xl"
												bg="gray.50"
											>
												<Flex justify="space-between" align="start" mb={3}>
													<VStack align="start" spacing={1} flex="1">
														<Text fontSize="sm" fontWeight="700" noOfLines={2}>
															{item.name}
														</Text>
														<Text fontSize="xs" color="gray.500">
															{item.make} {item.model} {item.year}
														</Text>
													</VStack>
													<IconButton
														icon={<FaTrash />}
														size="sm"
														variant="ghost"
														color="red.500"
														onClick={() => removeFromCart(item._id)}
														aria-label="Remove"
													/>
												</Flex>

												<Divider mb={3} />

												<Flex justify="space-between" align="center">
													<VStack align="start" spacing={0}>
														<Text fontSize="xs" color="gray.500">Price</Text>
														<Text fontSize="sm" fontWeight="600">£{price.toLocaleString("en-GB")}</Text>
													</VStack>

													<HStack spacing={2} bg="white" p={1} borderRadius="lg" border="1px solid" borderColor="gray.200">
														<IconButton
															icon={<FaMinus />}
															size="xs"
															variant="ghost"
															onClick={() => updateQuantity(item._id, -1)}
															aria-label="Decrease"
														/>
														<Text minW="20px" textAlign="center" fontSize="sm" fontWeight="700">
															{item.qty}
														</Text>
														<IconButton
															icon={<FaPlus />}
															size="xs"
															variant="ghost"
															onClick={() => updateQuantity(item._id, 1)}
															aria-label="Increase"
														/>
													</HStack>

													<VStack align="end" spacing={0}>
														<Text fontSize="xs" color="gray.500">Total</Text>
														<Text fontSize="md" fontWeight="800" color="#D90404">£{lineTotal.toLocaleString("en-GB")}</Text>
													</VStack>
												</Flex>
											</Box>
										);
									})}

									<Box p={4} bg="#D9040405" borderRadius="xl" border="1px dashed" borderColor="#D9040430">
										<Flex justify="space-between" align="center">
											<VStack align="start" spacing={0}>
												<Text fontWeight="800" fontSize="md">Total Amount</Text>
												<Text fontSize="xs" color="gray.500">Excluding VAT</Text>
											</VStack>
											<Text fontWeight="900" fontSize="2xl" color="#D90404">
												£{total?.toLocaleString()}
											</Text>
										</Flex>
									</Box>
								</VStack>
							</Box>

							{/* Desktop Table View */}
							<Box display={{ base: "none", md: "block" }} overflowX="auto">
								<Table variant="simple" size="md">
									<Thead bg="gray.50">
										<Tr>
											<Th fontSize="12px">Product</Th>
											<Th fontSize="12px">Price</Th>
											<Th fontSize="12px">Qty</Th>
											<Th fontSize="12px">Total</Th>
											<Th></Th>
										</Tr>
									</Thead>
									<Tbody>
										{cart.map((item) => {
											const price = Number(item.price || 0);
											const lineTotal = price * Number(item.qty || 0);
											return (
												<Tr key={item._id}>
													<Td>
														<Text fontSize="sm" fontWeight="600" noOfLines={2}>
															{item.name}
														</Text>
														<Text fontSize="xs" color="gray.500" mt={1}>
															{item.make} {item.model} {item.year}
														</Text>
													</Td>
													<Td fontSize="sm" fontWeight="600">
														£{price.toLocaleString("en-GB")}
													</Td>
													<Td>
														<HStack spacing={1}>
															<IconButton
																icon={<FaMinus />}
																size="xs"
																variant="outline"
																onClick={() => updateQuantity(item._id, -1)}
																aria-label="Decrease"
															/>
															<Text minW="25px" textAlign="center" fontSize="sm" fontWeight="600">
																{item.qty}
															</Text>
															<IconButton
																icon={<FaPlus />}
																size="xs"
																variant="outline"
																onClick={() => updateQuantity(item._id, 1)}
																aria-label="Increase"
															/>
														</HStack>
													</Td>
													<Td fontSize="sm" fontWeight="700" color="#D90404">
														£{lineTotal.toLocaleString("en-GB")}
													</Td>
													<Td>
														<IconButton
															icon={<FaTrash />}
															size="xs"
															variant="ghost"
															color="red.500"
															onClick={() => removeFromCart(item._id)}
															aria-label="Remove"
														/>
													</Td>
												</Tr>
											);
										})}

										{/* Total Row */}
										<Tr bg="#D9040405" borderTop="2px solid" borderColor="#D9040410">
											<Td colSpan={3}>
												<Text fontWeight="800" fontSize="lg">Total Amount</Text>
												<Text fontSize="xs" color="gray.500">Excluding VAT</Text>
											</Td>
											<Td colSpan={2}>
												<Text fontWeight="800" fontSize="2xl" color="#D90404">
													£{total?.toLocaleString()}
												</Text>
											</Td>
										</Tr>
									</Tbody>
								</Table>
							</Box>
						</Card>

						{/* Service & Options Card */}
						<Card shadow="md" borderRadius="2xl">
							<CardBody p={6}>
								<VStack align="stretch" spacing={6}>
									<Box>
										<Flex align="center" gap={2} mb={3}>
											<Icon as={FaTools} color="#D90404" />
											<Text fontWeight="700" fontSize="16px">Service Type</Text>
										</Flex>
										<Wrap spacing={3}>
											<WrapItem flex={{ base: "1", sm: "auto" }}>
												<Button
													variant={serviceType === "supply_fitted" ? "solid" : "outline"}
													bg={serviceType === "supply_fitted" ? "#D90404" : "transparent"}
													color={serviceType === "supply_fitted" ? "white" : "#D90404"}
													borderColor="#D90404"
													size={{ base: "sm", md: "md" }}
													w="full"
													onClick={() => setServiceType("supply_fitted")}
												>
													Supplied & Fitted
												</Button>
											</WrapItem>
											<WrapItem flex={{ base: "1", sm: "auto" }}>
												<Button
													variant={serviceType === "supply_only" ? "solid" : "outline"}
													bg={serviceType === "supply_only" ? "#D90404" : "transparent"}
													color={serviceType === "supply_only" ? "white" : "#D90404"}
													borderColor="#D90404"
													size={{ base: "sm", md: "md" }}
													w="full"
													onClick={() => setServiceType("supply_only")}
												>
													Supply Only
												</Button>
											</WrapItem>
											<WrapItem flex={{ base: "1", sm: "auto" }}>
												<Button
													variant={serviceType === "both" ? "solid" : "outline"}
													bg={serviceType === "both" ? "#D90404" : "transparent"}
													color={serviceType === "both" ? "white" : "#D90404"}
													borderColor="#D90404"
													size={{ base: "sm", md: "md" }}
													w="full"
													onClick={() => setServiceType("both")}
												>
													Will consider both
												</Button>
											</WrapItem>
										</Wrap>
									</Box>

									<Divider />

									<Box>
										<Flex align="center" gap={2} mb={3}>
											<Icon as={FaCar} color="#D90404" />
											<Text fontWeight="700" fontSize="16px">Engine Condition</Text>
										</Flex>
										<Wrap spacing={3}>
											{["reconditioned", "used", "new", "all"].map((cond) => (
												<WrapItem key={cond} flex={{ base: "1", sm: "auto" }}>
													<Button
														variant={condition === cond ? "solid" : "outline"}
														bg={condition === cond ? "#D90404" : "transparent"}
														color={condition === cond ? "white" : "#D90404"}
														borderColor="#D90404"
														size={{ base: "sm", md: "md" }}
														w="full"
														onClick={() => setCondition(cond)}
														textTransform="capitalize"
													>
														{cond}
													</Button>
												</WrapItem>
											))}
										</Wrap>
									</Box>

									<Divider />

									<Box>
										<Flex align="center" gap={2} mb={3}>
											<Icon as={FaMapMarkerAlt} color="#D90404" />
											<Text fontWeight="700" fontSize="16px">Your Postcode</Text>
										</Flex>
										<InputGroup>
											<Input
												placeholder="e.g. OX11 2TX"
												value={postcode}
												onChange={(e) => setPostcode(e.target.value)}
												size="lg"
												borderRadius="xl"
											/>
											<InputRightElement width="auto" mr={2} mt={1}>
												<Icon as={MdLocalShipping} color="#D90404" />
											</InputRightElement>
										</InputGroup>
									</Box>

									<Divider />

									<Box>
										<Flex align="center" gap={2} mb={3}>
											<Icon as={FaInfoCircle} color="#D90404" />
											<Text fontWeight="700" fontSize="16px">Additional Information</Text>
										</Flex>
										<VStack align="stretch" spacing={3}>
											<Flex align="center" gap={4} wrap="wrap">
												<Text fontSize="14px" fontWeight="500">Does vehicle drive?</Text>
												<HStack spacing={3}>
													<Button
														size="sm"
														variant={drives === "yes" ? "solid" : "outline"}
														bg={drives === "yes" ? "green.500" : "transparent"}
														color={drives === "yes" ? "white" : "gray.600"}
														onClick={() => setDrives("yes")}
													>
														Yes
													</Button>
													<Button
														size="sm"
														variant={drives === "no" ? "solid" : "outline"}
														bg={drives === "no" ? "red.500" : "transparent"}
														color={drives === "no" ? "white" : "gray.600"}
														onClick={() => setDrives("no")}
													>
														No
													</Button>
												</HStack>
											</Flex>
											<Textarea
												placeholder="Additional notes or special requirements..."
												value={additionalNotes}
												onChange={(e) => setAdditionalNotes(e.target.value)}
												rows={3}
												borderRadius="xl"
											/>
										</VStack>
									</Box>

									<Divider />

									<Box>
										<Flex align="center" gap={2} mb={3}>
											<Icon as={FaCreditCard} color="#D90404" />
											<Text fontWeight="700" fontSize="16px">Payment Method</Text>
										</Flex>
										<Wrap spacing={3}>
											<WrapItem>
												<Button
													variant={paymentMethod === "card" ? "solid" : "outline"}
													bg={paymentMethod === "card" ? "#D90404" : "transparent"}
													color={paymentMethod === "card" ? "white" : "#D90404"}
													borderColor="#D90404"
													size="md"
													leftIcon={<FaCreditCard />}
													onClick={() => setPaymentMethod("card")}
												>
													Credit Card
												</Button>
											</WrapItem>
											<WrapItem>
												<Button
													variant={paymentMethod === "debit" ? "solid" : "outline"}
													bg={paymentMethod === "debit" ? "#D90404" : "transparent"}
													color={paymentMethod === "debit" ? "white" : "#D90404"}
													borderColor="#D90404"
													size="md"
													leftIcon={<FaCreditCard />}
													onClick={() => setPaymentMethod("debit")}
												>
													Debit Card
												</Button>
											</WrapItem>
											<WrapItem>
												<Button
													variant={paymentMethod === "paypal" ? "solid" : "outline"}
													bg={paymentMethod === "paypal" ? "#0070BA" : "transparent"}
													color={paymentMethod === "paypal" ? "white" : "#0070BA"}
													borderColor="#0070BA"
													size="md"
													leftIcon={<FaPaypal />}
													onClick={() => setPaymentMethod("paypal")}
												>
													PayPal
												</Button>
											</WrapItem>
										</Wrap>
									</Box>
								</VStack>
							</CardBody>
						</Card>
					</VStack>

					{/* RIGHT COLUMN - Customer Details */}
					<Card shadow="lg" borderRadius="2xl" position="sticky" top="100px" h="fit-content">
						<Box bg="linear-gradient(135deg, #D90404 0%, #B70303 100%)" px={6} py={4} borderTopRadius="2xl">
							<Text color="white" fontWeight="800" fontSize="20px">
								Confirm Your Details
							</Text>
							<Text color="white" opacity="0.8" fontSize="13px">
								Please fill in your information
							</Text>
						</Box>

						<CardBody p={6}>
							<VStack spacing={5}>
								<Box w="full">
									<FormLabel fontSize="13px" fontWeight="600" mb={2}>
										Email Address *
									</FormLabel>
									<InputGroup>
										<InputLeftElement>
											<Icon as={FaEnvelope} color="gray.400" />
										</InputLeftElement>
										<Input
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											borderRadius="xl"
											size="lg"
										/>
									</InputGroup>
								</Box>

								<Box w="full">
									<FormLabel fontSize="13px" fontWeight="600" mb={2}>
										Full Name *
									</FormLabel>
									<InputGroup>
										<InputLeftElement>
											<Icon as={FaUser} color="gray.400" />
										</InputLeftElement>
										<Input
											placeholder="John Doe"
											value={name}
											onChange={(e) => setName(e.target.value)}
											borderRadius="xl"
											size="lg"
										/>
									</InputGroup>
								</Box>

								<Box w="full">
									<FormLabel fontSize="13px" fontWeight="600" mb={2}>
										Phone Number *
									</FormLabel>
									<InputGroup>
										<InputLeftElement>
											<Icon as={FaPhone} color="gray.400" />
										</InputLeftElement>
										<Input
											placeholder="+44 1234 567890"
											type="tel"
											maxLength={10}
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											borderRadius="xl"
											size="lg"
										/>
									</InputGroup>
								</Box>

								<Divider />

								<Box w="full" bg="gray.50" p={4} borderRadius="xl">
									<HStack spacing={3} mb={3}>
										<Icon as={FaShieldAlt} color="#D90404" />
										<Text fontSize="13px" fontWeight="600">Order Protection</Text>
									</HStack>
									<Text fontSize="12px" color="gray.600">
										Your order is protected by our buyer guarantee. Full refund if not delivered.
									</Text>
								</Box>

								<Button
									bg="#D90404"
									color="white"
									w="full"
									h="56px"
									size="lg"
									_hover={{ bg: "#B70303", transform: "translateY(-2px)" }}
									_active={{ transform: "translateY(0)" }}
									onClick={handleProceed}
									boxShadow="0 4px 15px rgba(217, 4, 4, 0.3)"
									transition="all 0.2s"
									fontWeight="700"
									fontSize="16px"
								>
									Proceed to Payment →
								</Button>

								<Text fontSize="11px" color="gray.500" textAlign="center">
									By clicking proceed you agree to our
									<Button variant="link" color="#D90404" size="xs" ml={1}>
										Terms & Conditions
									</Button>
									{" "}and{" "}
									<Button variant="link" color="#D90404" size="xs">
										Privacy Policy
									</Button>
								</Text>
							</VStack>
						</CardBody>
					</Card>
				</Grid>
			</Container>
		</Box>
	);
}