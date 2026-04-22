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
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const [cart, setCart] = useState([]);
    const product = location.state?.product;
    if (!product) {
        return (
            <Center minH="100vh">
                <VStack spacing={4}>
                    <Heading size="lg">No Product Selected</Heading>
                    <Text>Please select a product to checkout.</Text>
                    <Button onClick={() => navigate('/')}>Return Home</Button>
                </VStack>
            </Center>
        );
    }

    const price = product.price || 0;
    const total = price * qty;

    const addToCart = (product, quantity) => {
        setCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);

            if (existing) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, qty: quantity }
                        : item
                );
            }

            return [...prev, { ...product, qty: quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item._id !== productId));
    };

    return (
        <Box bg="gray.50" minH="100vh" py={10}>
            <Container maxW="container.xl">

                {/* Title */}
                <HStack justify="space-between" mb={4}>
                    <Heading>Checkout</Heading>

                    <Button variant="outline">
                        🛒 Cart ({cart.length})
                    </Button>
                </HStack>

                {/* CART TABLE */}
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Product</Th>
                                <Th>Price</Th>
                                <Th>Qty</Th>
                                <Th>Total</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            <Tr>
                                <Td>
                                    {product.name} {product.make} {product.model} {product.year}
                                </Td>
                                <Td>£{price?.toLocaleString()}</Td>

                                <Td>
                                    <HStack>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                const newQty = qty - 1;

                                                if (newQty <= 0) {
                                                    setQty(1);
                                                    removeFromCart(product._id);
                                                } else {
                                                    setQty(newQty);
                                                    addToCart(product, newQty);
                                                }
                                            }}
                                        >
                                            -
                                        </Button>                                        <Box>{qty}</Box>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                const newQty = qty + 1;
                                                setQty(newQty);
                                                addToCart(product, newQty);
                                            }}
                                        >
                                            +
                                        </Button>                                    </HStack>
                                </Td>

                                <Td>£{total}</Td>

                                <Td>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => removeFromCart(product._id)}
                                    >
                                        Remove
                                    </Button>
                                </Td>
                            </Tr>

                            <Tr bg="blue.50">
                                <Td colSpan={3} fontWeight="bold">Total</Td>
                                <Td fontWeight="bold">£{total?.toLocaleString()}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>

                {/* FORM SECTION */}
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mt={8}>

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