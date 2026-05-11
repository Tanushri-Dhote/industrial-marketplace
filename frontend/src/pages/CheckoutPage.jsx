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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function CheckoutPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const product = location.state?.product;
	const [cart, setCart] = useState(() => (product ? [{ ...product, qty: 1 }] : []));

	if (!product && cart.length === 0) {
		return (
			<Center minH="100vh">
				<VStack spacing={4}>
					<Heading size="lg">No Product Selected</Heading>
					<Text>Please select a product to checkout.</Text>
					<Button onClick={() => navigate("/")}>Return Home</Button>
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
					return { ...item, qty: nextQty };
				})
				.filter((item) => item.qty > 0),
		);
	};

	const removeFromCart = (productId) => {
		setCart((prev) => prev.filter((item) => item._id !== productId));
	};

	return (
		<Box bg="gray.50" minH="100vh" py={10}>
			<Container maxW="container.xl">
				{/* Title */}
				<HStack
					justify="space-between"
					mb={4}
					flexWrap="wrap"
					spacing={3}
				>
					<Heading>Checkout</Heading>

					<Button variant="outline">🛒 Cart ({cartItemCount})</Button>
				</HStack>

				{/* CART TABLE */}
				<Box bg="white" p={{ base: 3, md: 6 }} borderRadius="lg" boxShadow="sm">
					<Box overflowX="auto">
						<Table minW="700px" size={{ base: "sm", md: "md" }}>
							<Thead>
								<Tr>
									<Th whiteSpace="nowrap">Product</Th>
									<Th whiteSpace="nowrap">Price</Th>
									<Th whiteSpace="nowrap">Qty</Th>
									<Th whiteSpace="nowrap">Total</Th>
									<Th></Th>
								</Tr>
							</Thead>

							<Tbody>
								{cart.map((item) => {
									const price = Number(item.price || 0);
									const lineTotal = price * Number(item.qty || 0);

									return (
										<Tr key={item._id}>
											<Td minW="220px">
												<Text fontSize={{ base: "sm", md: "md" }} fontWeight="500">
													{item.name} {item.make} {item.model} {item.year}
												</Text>
											</Td>

											<Td whiteSpace="nowrap">
												£{price.toLocaleString("en-GB")}
											</Td>

											<Td>
												<HStack spacing={2}>
													<Button
														size="xs"
														onClick={() => updateQuantity(item._id, -1)}
													>
														-
													</Button>

													<Box minW="20px" textAlign="center">
														{item.qty}
													</Box>

													<Button
														size="xs"
														onClick={() => updateQuantity(item._id, 1)}
													>
														+
													</Button>
												</HStack>
											</Td>

											<Td whiteSpace="nowrap">
												£{lineTotal.toLocaleString("en-GB")}
											</Td>

											<Td>
												<Button
													colorScheme="red"
													size="xs"
													onClick={() => removeFromCart(item._id)}
												>
													Remove
												</Button>
											</Td>
										</Tr>
									);
								})}

								<Tr bg="blue.50">
									<Td colSpan={3} fontWeight="bold">
										Total
									</Td>
									<Td fontWeight="bold">
										£{total?.toLocaleString()}
									</Td>
								</Tr>
							</Tbody>
						</Table>
					</Box>
				</Box>

				{/* FORM SECTION */}
				<Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 4, md: 6 }} mt={{ base: 6, md: 8 }}>

					{/* LEFT SIDE */}
					<VStack spacing={6} align="stretch">
						{/* Service */}
						<Box bg="white" p={5} borderRadius="lg">
							<Text fontWeight="bold">1. Please select a service.</Text>
							<HStack mt={2}>
								<Checkbox>Supplied & Fitted</Checkbox>
								<Checkbox defaultChecked>Supply Only</Checkbox>
								<Checkbox>Will consider both</Checkbox>
							</HStack>
						</Box>

						{/* Condition */}
						<Box bg="white" p={5} borderRadius="lg">
							<Text fontWeight="bold">2. Select a condition</Text>
							<HStack mt={2}>
								<Checkbox defaultChecked>Reconditioned</Checkbox>
								<Checkbox>Used</Checkbox>
								<Checkbox>New</Checkbox>
								<Checkbox>All</Checkbox>
							</HStack>
						</Box>

						{/* Postcode */}
						<Box bg="white" p={5} borderRadius="lg">
							<Text fontWeight="bold">3. Your postcode</Text>
							<Input placeholder="e.g. OX11 2TX" mt={2} />
						</Box>

						{/* Extra */}
						<Box bg="white" p={5} borderRadius="lg">
							<Text fontWeight="bold">4. Additional information</Text>

							<HStack mt={3}>
								<Text>Does vehicle drive?</Text>
								<RadioGroup defaultValue="no">
									<HStack>
										<Radio value="yes">Yes</Radio>
										<Radio value="no">No</Radio>
									</HStack>
								</RadioGroup>
							</HStack>

							<Textarea mt={3} placeholder="Extra notes" />
						</Box>

						{/* Payment */}
						<Box bg="white" p={5} borderRadius="lg">
							<Text fontWeight="bold">5. Payment Method</Text>
							<RadioGroup defaultValue="card">
								<HStack mt={2}>
									<Radio value="card">Credit card</Radio>
									<Radio value="debit">Debit card</Radio>
									<Radio value="paypal">PayPal</Radio>
								</HStack>
							</RadioGroup>
						</Box>
					</VStack>

					{/* RIGHT SIDE */}
					<Box bg="white" p={6} borderRadius="lg">
						<Heading size="md" mb={4}>
							Confirm Your Details
						</Heading>

						<VStack spacing={4}>
							<Input placeholder="Email address*" />
							<Input placeholder="Name*" />
							<Input placeholder="Phone Number*" />

							<Button
								bg="green.600"
								color="white"
								w="full"
								h="50px"
								_hover={{ bg: "green.700" }}
								onClick={() => navigate("/thank-you")}
							>
								Proceed
							</Button>

							<Text fontSize="xs" color="gray.500">
								By clicking proceed you agree to terms & privacy policy.
							</Text>
						</VStack>
					</Box>
				</Grid>
			</Container>
		</Box>
	);
}
