import React, { useState } from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    Grid,
    VStack,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    Center,
    List,
    ListItem,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Link,
    Badge,
} from "@chakra-ui/react";
import { CheckCircleIcon, ChevronRightIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";

export default function CallSellerPage() {
    const [step, setStep] = useState(1);
    const [engineOptions, setEngineOptions] = useState([]);
    const [fittingOptions, setFittingOptions] = useState([]);

    const [form, setForm] = useState({
        postcode: "",
        notes: "",
        name: "",
        email: "",
        phone: "",
    });

    const handleEngineSelect = (value) => {
        setEngineOptions(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleFittingSelect = (value) => {
        setFittingOptions(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleNext = () => {
        if (step === 1 && engineOptions.length === 0) return;
        if (step === 2 && fittingOptions.length === 0) return;
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleGetQuote = () => {
        if (!form.name || !form.email || !form.phone) return;
        setStep(5);
    };

    const ProgressIndicator = () => (
        <Box display="flex" justifyContent="center" mb={8} gap={2}>
            {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                    <Box
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={step >= s ? "#0F172A" : "gray.200"}
                        color={step >= s ? "white" : "gray.500"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                    >
                        {s}
                    </Box>
                    {s < 4 && <ChevronRightIcon color="gray.400" mt={2} />}
                </React.Fragment>
            ))}
        </Box>
    );

    return (
        <Box bg="gray.100" minH="100vh" py={10}>
            <Container maxW="container.lg">
                <ProgressIndicator />

                {/* STEP 1 */}
                {step === 1 && (
                    <Box>
                        <Heading textAlign="center" mb={2} size="lg">
                            Choose the option that suits you
                        </Heading>
                        <Text textAlign="center" color="gray.600" mb={4}>
                            Select one or more options below
                        </Text>
                        <Text textAlign="center" fontSize="sm" color="green.600" mb={8}>
                            ✓ You can select multiple options
                        </Text>

                        <Grid templateColumns={{ base: "1fr", md: "repeat(4,1fr)" }} gap={5}>
                            {[
                                { title: "Reconditioned/Rebuild", desc: "Ready to fit, with up to 5 years warranty", icon: "🔧" },
                                { title: "Used (low mileage)", desc: "Budget-friendly – up to 18 months warranty.", icon: "📉" },
                                { title: "New", desc: "Brand-new engines with manufacturer cover.", icon: "✨" },
                                { title: "Will consider all", desc: "Keep all options open.", icon: "🔍" },
                            ].map((item) => {
                                const isSelected = engineOptions.includes(item.title);
                                return (
                                    <Box
                                        key={item.title}
                                        p={5}
                                        bg="white"
                                        borderRadius="lg"
                                        textAlign="center"
                                        cursor="pointer"
                                        position="relative"
                                        border="2px solid"
                                        borderColor={isSelected ? "#0F172A" : "gray.200"}
                                        boxShadow={isSelected ? "0 0 0 1px green" : "none"}
                                        _hover={{ borderColor: "green.300", boxShadow: "md" }}
                                        transition="all 0.2s"
                                        onClick={() => handleEngineSelect(item.title)}
                                    >
                                        {isSelected && (
                                            <Badge
                                                position="absolute"
                                                top="-10px"
                                                right="10px"
                                                colorScheme="green"
                                                borderRadius="full"
                                                px={2}
                                                fontSize="xs"
                                            >
                                                ✓ SELECTED
                                            </Badge>
                                        )}
                                        <Box fontSize="3xl" mb={2}>
                                            {item.icon}
                                        </Box>
                                        <Text fontWeight="bold" mb={2}>
                                            {item.title}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {item.desc}
                                        </Text>
                                        {isSelected && (
                                            <Box mt={3}>
                                                <CheckCircleIcon color="#0F172A" boxSize={5} />
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Grid>

                        <Center mt={10}>
                            <Button
                                size="lg"
                                colorScheme="green"
                                onClick={handleNext}
                                isDisabled={engineOptions.length === 0}
                                rightIcon={<ChevronRightIcon />}
                                px={8}
                            >
                                {/* Next ({engineOptions.length} selected) */}
                                Next
                            </Button>
                        </Center>
                    </Box>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <Box>
                        <Heading textAlign="center" mb={2} size="lg">
                            Choose the option that suits you
                        </Heading>
                        <Text textAlign="center" color="gray.600" mb={4}>
                            Select one or more options below
                        </Text>
                        <Text textAlign="center" fontSize="sm" color="green.600" mb={8}>
                            ✓ You can select multiple options
                        </Text>

                        <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={5}>
                            {[
                                { title: "Supplied & Fitted", desc: "Recommended if you need engine + installation.", icon: "🔧" },
                                { title: "Supplied", desc: "If you arrange fitting yourself.", icon: "📦" },
                                { title: "Will consider both", desc: "Keep all options open!", icon: "🤝" },
                            ].map((item) => {
                                const isSelected = fittingOptions.includes(item.title);
                                return (
                                    <Box
                                        key={item.title}
                                        p={5}
                                        bg="white"
                                        borderRadius="lg"
                                        textAlign="center"
                                        cursor="pointer"
                                        position="relative"
                                        border="2px solid"
                                        borderColor={isSelected ? "#0F172A" : "gray.200"}
                                        _hover={{ borderColor: "green.300", boxShadow: "md" }}
                                        transition="all 0.2s"
                                        onClick={() => handleFittingSelect(item.title)}
                                    >
                                        {isSelected && (
                                            <Badge
                                                position="absolute"
                                                top="-10px"
                                                right="10px"
                                                colorScheme="green"
                                                borderRadius="full"
                                                px={2}
                                                fontSize="xs"
                                            >
                                                ✓ SELECTED
                                            </Badge>
                                        )}
                                        <Box fontSize="3xl" mb={2}>
                                            {item.icon}
                                        </Box>
                                        <Text fontWeight="bold" mb={2}>
                                            {item.title}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {item.desc}
                                        </Text>
                                        {isSelected && (
                                            <Box mt={3}>
                                                <CheckCircleIcon color="#0F172A" boxSize={5} />
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Grid>

                        <Center mt={10} gap={4}>
                            <Button size="lg" variant="outline" onClick={handleBack} px={8}>
                                Back
                            </Button>
                            <Button
                                size="lg"
                                colorScheme="#D90404"
                                onClick={handleNext}
                                isDisabled={fittingOptions.length === 0}
                                rightIcon={<ChevronRightIcon />}
                                px={8}
                            >
                                Next ({fittingOptions.length} selected)
                            </Button>
                        </Center>
                    </Box>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <Box bg="white" borderRadius="2xl" p={8} shadow="md" maxW="2xl" mx="auto">
                        <Heading textAlign="center" mb={2} size="lg">
                            Almost there! Share your location
                        </Heading>
                        <Text textAlign="center" color="gray.600" mb={8}>
                            We'll find the best deals near you
                        </Text>

                        <VStack spacing={5}>
                            <InputGroup size="lg">
                                <InputLeftElement pointerEvents="none" color="gray.500" fontSize="xl">
                                    📍
                                </InputLeftElement>
                                <Input
                                    placeholder="Postcode (e.g. SW1A 1AA)"
                                    value={form.postcode}
                                    onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                                />
                            </InputGroup>

                            <Textarea
                                size="lg"
                                placeholder="Notes (e.g., car model, engine size, any specific requirements)"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                rows={4}
                            />

                            <Center gap={4} pt={4}>
                                <Button size="lg" variant="outline" onClick={handleBack} px={8}>
                                    Back
                                </Button>
                                <Button size="lg" colorScheme="green" onClick={handleNext} rightIcon={<ChevronRightIcon />} px={8}>
                                    Next
                                </Button>
                            </Center>
                        </VStack>
                    </Box>
                )}

                {/* STEP 4 - WITH ICONS */}
                {step === 4 && (
                    <Box bg="white" borderRadius="2xl" p={8} shadow="md" maxW="2xl" mx="auto">
                        <Heading textAlign="center" mb={2} size="lg">
                            Great news! Get your quotes
                        </Heading>
                        <Text textAlign="center" color="gray.600" mb={8}>
                            Enter your details to receive the best offers
                        </Text>

                        <VStack spacing={5}>
                            {/* Name Input with Icon */}
                            <InputGroup size="lg">
                                <InputLeftElement pointerEvents="none" color="#0F172A" fontSize="xl">
                                    👤
                                </InputLeftElement>
                                <Input
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </InputGroup>

                            {/* Email Input with Icon */}
                            <InputGroup size="lg">
                                <InputLeftElement pointerEvents="none" color="#0F172A">
                                    <EmailIcon />
                                </InputLeftElement>
                                <Input
                                    placeholder="Email Address"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </InputGroup>

                            {/* Phone Input with Icon */}
                            <InputGroup size="lg">
                                <InputLeftElement pointerEvents="none" color="#0F172A">
                                    <PhoneIcon />
                                </InputLeftElement>
                                <Input
                                    placeholder="Phone Number"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </InputGroup>

                            <Center gap={4} pt={4}>
                                <Button size="lg" variant="outline" onClick={handleBack} px={8}>
                                    Back
                                </Button>
                                <Button
                                    size="lg"
                                    colorScheme="green"
                                    onClick={handleGetQuote}
                                    isDisabled={!form.name || !form.email || !form.phone}
                                    px={8}
                                >
                                    Get Quote
                                </Button>
                            </Center>
                        </VStack>
                    </Box>
                )}

                {/* STEP 5 - THANK YOU */}
                {step === 5 && (
                    <Box bg="white" borderRadius="2xl" p={8} shadow="md">
                        <Box textAlign="center" mb={6}>
                            <Box fontSize="5xl" mb={3}>✅</Box>
                            <Heading color="green.600" mb={2}>
                                Thank You — Your Request Has Been Sent
                            </Heading>
                            <Text color="gray.600">
                                We've received your details and securely shared them with our network of engine suppliers.
                            </Text>
                        </Box>

                        <Box bg="gray.50" p={4} borderRadius="lg" mb={6}>
                            <Heading size="sm" mb={3}>Your Selected Options:</Heading>
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={4}>
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" color="green.600">Engine Type:</Text>
                                    <List spacing={1} mt={1}>
                                        {engineOptions.map(opt => (
                                            <ListItem key={opt} fontSize="sm">✓ {opt}</ListItem>
                                        ))}
                                    </List>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" color="green.600">Fitting Option:</Text>
                                    <List spacing={1} mt={1}>
                                        {fittingOptions.map(opt => (
                                            <ListItem key={opt} fontSize="sm">✓ {opt}</ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Grid>
                        </Box>

                        <Box borderTop="1px solid" borderColor="gray.200" pt={6}>
                            <Heading size="md" mb={4}>What Happens Next</Heading>
                            <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={4} mb={8}>
                                <Box p={4} bg="blue.50" borderRadius="lg">
                                    <Text fontWeight="bold" mb={2}>📞 Supplier contact</Text>
                                    <Text fontSize="sm">One or more engine suppliers will contact you by phone or email to confirm your requirements and send tailored quotes.</Text>
                                </Box>
                                <Box p={4} bg="green.50" borderRadius="lg">
                                    <Text fontWeight="bold" mb={2}>💰 Receive multiple offers</Text>
                                    <Text fontSize="sm">You'll receive a range of quotes so you can compare price, quality, warranty and delivery times.</Text>
                                </Box>
                                <Box p={4} bg="purple.50" borderRadius="lg">
                                    <Text fontWeight="bold" mb={2}>⭐ Review request</Text>
                                    <Text fontSize="sm">Around 24 hours after your submission we may send a short request for feedback to help us maintain the highest standards.</Text>
                                </Box>
                            </Grid>
                        </Box>

                        <Box mb={6}>
                            <Heading size="md" mb={3}>How to Choose with Confidence</Heading>
                            <Text fontSize="sm" color="gray.600" mb={3}>
                                We're a comparison platform — not a supplier. Any purchase, warranty or work is provided directly by the supplier you choose. Please read the supplier's terms carefully. (<Link href="#" color="#0F172A">Full Terms & Conditions</Link>)
                            </Text>

                            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={3} mb={4}>
                                <Text fontSize="sm">✓ Check your details: We pass the information you provide to suppliers exactly as submitted.</Text>
                                <Text fontSize="sm">✓ Research suppliers: Look for independent reviews, check their website and ask questions.</Text>
                                <Text fontSize="sm">✓ Look beyond price: The cheapest quote may carry hidden costs or lower quality.</Text>
                                <Text fontSize="sm">✓ Pay securely: Paying by credit card typically offers greater protection for consumers in the UK.</Text>
                                <Text fontSize="sm">✓ Avoid off-platform deals: Only accept offers from verifiedAll Engine 4 You channels.</Text>
                                <Text fontSize="sm">✓ We're not liable for supplier faults: Any disputes should be raised directly with the supplier.</Text>
                            </Grid>
                        </Box>

                        <Box bg="gray.50" p={5} borderRadius="lg" mb={6}>
                            <Heading size="sm" mb={3}>Quick Reminders</Heading>
                            <Table variant="unstyled" size="sm">
                                <Tbody>
                                    <Tr><Td py={1} width="60px">1.</Td><Td py={1}>Stay accessible — Keep your phone and email handy for supplier contact.</Td></Tr>
                                    <Tr><Td py={1}>2.</Td><Td py={1}>Compare — Consider time, cost, quality and warranty together.</Td></Tr>
                                    <Tr><Td py={1}>3.</Td><Td py={1}>Use secure payment — Prefer credit card for additional buyer protection.</Td></Tr>
                                    <Tr><Td py={1}>4.</Td><Td py={1}>Verify — Only communicate throughAll Engine 4 You verified channels.</Td></Tr>
                                    <Tr><Td py={1}>5.</Td><Td py={1}>Feedback — We'll ask for a short review — your experience helps us improve.</Td></Tr>
                                </Tbody>
                            </Table>
                            <Text fontSize="sm" fontStyle="italic" mt={3}>
                                Tip: Responding quickly to supplier outreach helps secure the best offers and avoids delays.
                            </Text>
                        </Box>

                        <Text fontSize="xs" color="gray.400" textAlign="center" mb={6}>
                            All Engine 4 You is a comparison platform. For details on liability, data use and complaints please review our Terms & Conditions and Privacy Policy.
                        </Text>

                        <Center>
                            <Button colorScheme="green" onClick={() => {
                                setStep(1);
                                setEngineOptions([]);
                                setFittingOptions([]);
                                setForm({ postcode: "", notes: "", name: "", email: "", phone: "" });
                            }}>
                                Back to Start
                            </Button>
                        </Center>
                    </Box>
                )}
            </Container>
        </Box>
    );
}