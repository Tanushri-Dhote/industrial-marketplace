import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    Grid,
    VStack,
    HStack,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    Center,
    Badge,
    Icon,
    Divider,
    SimpleGrid,
    useToast,
} from "@chakra-ui/react";
import { 
    CheckCircleIcon, 
    ChevronRightIcon, 
    ChevronLeftIcon,
    EmailIcon, 
    PhoneIcon,
} from "@chakra-ui/icons";
import { 
    MapPin, 
    Settings, 
    Package, 
    User, 
    MessageSquare,
    Truck,
    ShieldCheck
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DARK = "#0F172A";
const RED = "#D90404";

export default function CallSellerPage() {
    const [step, setStep] = useState(1);
    const [engineOptions, setEngineOptions] = useState([]);
    const [fittingOptions, setFittingOptions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();

    const { vrm, category, brand, model, year, type, searchType } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            toast({
                title: "Start from the quote form",
                description: "Please begin on the homepage so we can capture your vehicle details.",
                status: "warning",
                position: "top-right",
                duration: 3000,
            });
            navigate("/", { replace: true });
        }
    }, [location.state, navigate, toast]);

    const [form, setForm] = useState({
        postcode: "",
        notes: "",
        name: "",
        email: "",
        phone: "",
    });

    const handleEngineSelect = (value) => {
        setEngineOptions(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
    };

    const handleFittingSelect = (value) => {
        setFittingOptions(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
    };

    const handleNext = () => {
        if (step === 1) {
            if (engineOptions.length === 0) return toast({ title: "Please select a condition", status: "warning" });
            if (fittingOptions.length === 0) return toast({ title: "Please select a fitting option", status: "warning" });
            if (!form.postcode) return toast({ title: "Postcode is required", status: "warning" });
        }
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const API = import.meta.env.VITE_API_URL;

    const handleGetQuote = async () => {
        if (!location.state) {
            toast({
                title: "Missing vehicle details",
                description: "Please start from the homepage quote form.",
                status: "warning",
                position: "top-right",
            });
            navigate("/", { replace: true });
            return;
        }

        try {
            const res = await fetch(`${API}/validate-vrm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vrm,
                    brand,
                    model,
                    year,
                    engineType: type,
                    category,
                    engineOptions,
                    fittingOptions,
                    ...form,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong");
            setStep(3);
        } catch (err) {
            toast({ title: "Error", description: err.message, status: "error" });
        }
    };

    const VehicleSummary = () => (
        <Box bg="white" borderRadius="2xl" p={6} mb={8} border="1px solid" borderColor="gray.200" boxShadow="sm">
            <HStack spacing={4} align="center">
                <Box bg={DARK} color="white" p={3} borderRadius="xl">
                    <Settings size={24} />
                </Box>
                <VStack align="flex-start" spacing={0}>
                    <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                        Vehicle Selected
                    </Text>
                    <Heading size="md" color={DARK}>
                        {vrm ? vrm : `${brand} ${model} ${year}`}
                    </Heading>
                    <HStack spacing={2} mt={1}>
                        <Badge colorScheme="red" variant="subtle" px={2} borderRadius="md">{category}</Badge>
                        {type && <Badge colorScheme="blue" variant="subtle" px={2} borderRadius="md">{type}</Badge>}
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );

    const Progress = () => (
        <HStack w="full" spacing={2} mb={8}>
            {[1, 2, 3].map(i => (
                <Box 
                    key={i} 
                    flex={1} 
                    h="6px" 
                    bg={step >= i ? RED : "gray.200"} 
                    borderRadius="full" 
                    transition="all 0.3s"
                />
            ))}
        </HStack>
    );

    return (
        <Box bg="#F8FAFC" minH="100vh" py={{ base: 6, md: 12 }}>
            <Container maxW="container.md">
                <Progress />
                <VehicleSummary />

                {/* STEP 1: OPTIONS & LOCATION */}
                {step === 1 && (
                    <VStack spacing={8} align="stretch">
                        <Box>
                            <Heading size="lg" mb={2} color={DARK}>1. Request Details</Heading>
                            <Text color="gray.500">Tailor your request to get the most accurate quotes.</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="800" mb={4} fontSize="sm" color="gray.600" textTransform="uppercase">What condition do you need?</Text>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                                {[
                                    { title: "Reconditioned/Rebuild", desc: "Premium quality", icon: ShieldCheck },
                                    { title: "Used (low mileage)", desc: "Best value", icon: Package },
                                    { title: "New", desc: "Manufacturer standard", icon: CheckCircleIcon },
                                    { title: "Will consider all", desc: "Show me all options", icon: MessageSquare },
                                ].map((item) => {
                                    const isSelected = engineOptions.includes(item.title);
                                    return (
                                        <HStack
                                            key={item.title}
                                            p={4}
                                            bg="white"
                                            borderRadius="xl"
                                            cursor="pointer"
                                            border="2px solid"
                                            borderColor={isSelected ? RED : "white"}
                                            boxShadow="sm"
                                            onClick={() => handleEngineSelect(item.title)}
                                            transition="all 0.2s"
                                            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                                        >
                                            <Box color={isSelected ? RED : "gray.400"}>
                                                <Icon as={item.icon} boxSize={5} />
                                            </Box>
                                            <VStack align="flex-start" spacing={0}>
                                                <Text fontWeight="700" fontSize="14px">{item.title}</Text>
                                                <Text fontSize="12px" color="gray.500">{item.desc}</Text>
                                            </VStack>
                                        </HStack>
                                    );
                                })}
                            </SimpleGrid>
                        </Box>

                        <Box>
                            <Text fontWeight="800" mb={4} fontSize="sm" color="gray.600" textTransform="uppercase">Supply & Fitting</Text>
                            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
                                {[
                                    { title: "Supplied & Fitted", icon: Settings },
                                    { title: "Supplied Only", icon: Truck },
                                    { title: "Will consider both", icon: Package },
                                ].map((item) => {
                                    const isSelected = fittingOptions.includes(item.title);
                                    return (
                                        <VStack
                                            key={item.title}
                                            p={4}
                                            bg="white"
                                            borderRadius="xl"
                                            cursor="pointer"
                                            border="2px solid"
                                            borderColor={isSelected ? RED : "white"}
                                            boxShadow="sm"
                                            onClick={() => handleFittingSelect(item.title)}
                                            transition="all 0.2s"
                                            _hover={{ boxShadow: "md" }}
                                        >
                                            <Box color={isSelected ? RED : "gray.400"}>
                                                <Icon as={item.icon} boxSize={5} />
                                            </Box>
                                            <Text fontWeight="700" fontSize="13px" textAlign="center">{item.title}</Text>
                                        </VStack>
                                    );
                                })}
                            </SimpleGrid>
                        </Box>

                        <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
                            <Text fontWeight="800" mb={4} fontSize="sm" color="gray.600" textTransform="uppercase">Location & Additional Notes</Text>
                            <VStack spacing={4}>
                                <InputGroup size="lg">
                                    <InputLeftElement color="gray.400"><MapPin size={20} /></InputLeftElement>
                                    <Input 
                                        placeholder="Your Postcode (e.g. SW1A 1AA)" 
                                        borderRadius="xl" 
                                        bg="gray.50"
                                        border="none"
                                        _focus={{ bg: "white", boxShadow: "0 0 0 2px " + RED }}
                                        value={form.postcode}
                                        onChange={(e) => setForm({...form, postcode: e.target.value.toUpperCase()})}
                                    />
                                </InputGroup>
                                <Textarea 
                                    placeholder="Any specific requirements or engine codes?" 
                                    borderRadius="xl" 
                                    bg="gray.50"
                                    border="none"
                                    _focus={{ bg: "white", boxShadow: "0 0 0 2px " + RED }}
                                    rows={3}
                                    value={form.notes}
                                    onChange={(e) => setForm({...form, notes: e.target.value})}
                                />
                            </VStack>
                        </Box>

                        <Button 
                            size="lg" 
                            bg={RED} 
                            color="white" 
                            h="60px" 
                            fontSize="18px" 
                            fontWeight="800"
                            borderRadius="xl"
                            rightIcon={<ChevronRightIcon />}
                            onClick={handleNext}
                            _hover={{ bg: "#B70303", transform: "scale(1.02)" }}
                            transition="all 0.2s"
                        >
                            Continue
                        </Button>
                    </VStack>
                )}

                {/* STEP 2: CONTACT DETAILS */}
                {step === 2 && (
                    <VStack spacing={8} align="stretch">
                        <Box>
                            <Button leftIcon={<ChevronLeftIcon />} variant="ghost" onClick={handleBack} mb={4} color="gray.500">Back</Button>
                            <Heading size="lg" mb={2} color={DARK}>2. Contact Information</Heading>
                            <Text color="gray.500">Suppliers will use these details to send your quotes.</Text>
                        </Box>

                        <VStack spacing={4} bg="white" p={8} borderRadius="2xl" boxShadow="md">
                            <InputGroup size="lg">
                                <InputLeftElement color={DARK}><User size={20} /></InputLeftElement>
                                <Input 
                                    placeholder="Full Name" 
                                    borderRadius="xl"
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                />
                            </InputGroup>

                            <InputGroup size="lg">
                                <InputLeftElement color={DARK}><EmailIcon /></InputLeftElement>
                                <Input 
                                    type="email"
                                    placeholder="Email Address" 
                                    borderRadius="xl"
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                />
                            </InputGroup>

                            <InputGroup size="lg">
                                <InputLeftElement color={DARK}><PhoneIcon /></InputLeftElement>
                                <Input 
                                    type="tel"
                                    placeholder="Phone Number" 
                                    borderRadius="xl"
                                    value={form.phone}
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                />
                            </InputGroup>

                            <Divider py={4} />

                            <VStack align="start" w="full" spacing={1}>
                                <Text fontSize="xs" color="gray.500">By clicking below, you agree to our Terms and allow verified suppliers to contact you regarding your request.</Text>
                            </VStack>

                            <Button 
                                w="full"
                                size="lg" 
                                bg={RED} 
                                color="white" 
                                h="60px" 
                                fontSize="18px" 
                                fontWeight="800"
                                borderRadius="xl"
                                onClick={handleGetQuote}
                                isDisabled={!form.name || !form.email || !form.phone}
                                _hover={{ bg: "#B70303" }}
                            >
                                Get My Free Quotes
                            </Button>
                        </VStack>
                    </VStack>
                )}

                {/* STEP 3: THANK YOU */}
                {step === 3 && (
                    <VStack spacing={8} textAlign="center" py={10}>
                        <Box bg="green.500" color="white" p={6} borderRadius="full">
                            <CheckCircleIcon boxSize={12} />
                        </Box>
                        <Box>
                            <Heading size="xl" mb={4}>Request Received!</Heading>
                            <Text fontSize="lg" color="gray.600">We've securely shared your request with our network of specialists.</Text>
                        </Box>

                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} w="full">
                            <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm">
                                <Text fontSize="24px" mb={2}>📞</Text>
                                <Text fontWeight="700" mb={1}>Step 1</Text>
                                <Text fontSize="sm" color="gray.500">Suppliers contact you via phone or email.</Text>
                            </Box>
                            <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm">
                                <Text fontSize="24px" mb={2}>💰</Text>
                                <Text fontWeight="700" mb={1}>Step 2</Text>
                                <Text fontSize="sm" color="gray.500">Compare multiple offers and warranties.</Text>
                            </Box>
                            <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm">
                                <Text fontSize="24px" mb={2}>✅</Text>
                                <Text fontWeight="700" mb={1}>Step 3</Text>
                                <Text fontSize="sm" color="gray.500">Choose the best deal and save up to 50%.</Text>
                            </Box>
                        </SimpleGrid>

                        <Button 
                            variant="link" 
                            color={DARK} 
                            onClick={() => navigate("/")}
                            textDecoration="underline"
                        >
                            Return to Homepage
                        </Button>
                    </VStack>
                )}
            </Container>
        </Box>
    );
}