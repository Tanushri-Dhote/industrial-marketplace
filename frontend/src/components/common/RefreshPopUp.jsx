import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    VStack,
    Heading,
    Text,
    Box,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormErrorMessage,
    Spinner,
    HStack,
    Badge,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const RefreshPopUp = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const location = useLocation();

    // Step management
    const [step, setStep] = useState(1);
    const [selectedPartType, setSelectedPartType] = useState("");
    const [selectedServiceType, setSelectedServiceType] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [vrm, setVrm] = useState("");
    const [vrmError, setVrmError] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [partTypes, setPartTypes] = useState([]);
    const [loadingPartTypes, setLoadingPartTypes] = useState(false);

    // ❌ Routes where popup should NOT show
    const excludedRoutes = [
        "/privacy-policy",
        "/terms-and-conditions",
        "/about",
        "/contact",
        "/blog",
    ];

    useEffect(() => {
        const isExcluded = excludedRoutes.some((route) =>
            location.pathname.startsWith(route)
        );

        if (!isExcluded) {
            onOpen();
        }
    }, [location.pathname, onOpen]);

    // Reset state when modal closes
    const handleClose = () => {
        setStep(1);
        setSelectedPartType("");
        setSelectedServiceType("");
        setSelectedCondition("");
        setVrm("");
        setVrmError("");
        onClose();
    };

    // Service options
    const serviceOptions = [
        { value: "supply_fit", label: "Supply & fit" },
        { value: "supply_only", label: "Supply only" },
        { value: "both", label: "Will consider both" },
    ];

    // Condition options
    const conditionOptions = [
        { value: "used", label: "Used" },
        { value: "reconditioned", label: "Reconditioned" },
        { value: "new", label: "New" },
        { value: "all", label: "Will consider all" },
    ];

    const handleServiceSelect = (value) => {
        setSelectedServiceType(value);
        setStep(3);
    };

    const handleConditionSelect = (value) => {
        setSelectedCondition(value);
        setStep(4);
    };

    const validateVRM = (reg) => {
        const vrmPattern = /^[A-Z]{2}\d{2}[A-Z]{3}$|^[A-Z]{2}\d{2}[A-Z]{2}$|^[A-Z]{1,2}\d{1,4}[A-Z]{1,3}$/i;
        return vrmPattern.test(reg.toUpperCase().replace(/\s/g, ""));
    };

    const handleCheckAvailability = async () => {
        if (!vrm.trim()) {
            setVrmError("Please enter your VRM");
            return;
        }

        if (!validateVRM(vrm)) {
            setVrmError("VRM validation failed. Try again.");
            return;
        }

        setVrmError("");
        setIsChecking(true);

        setTimeout(() => {
            setIsChecking(false);
            console.log("Checking availability for:", vrm);
        }, 1500);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <VStack spacing={5} width="100%">
                        <Box textAlign="center" mb={2}>
                            <Badge
                                bg="#D90404"
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                                mb={3}
                            >
                                Step 1 of 4
                            </Badge>
                            <Heading size="md" color="#0F172A" mb={2}>
                                Select Part Type
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                Choose the part you're looking for
                            </Text>
                        </Box>
                        <Select
                            value={selectedPartType}
                            onChange={(e) => {
                                setSelectedPartType(e.target.value);
                                if (e.target.value) setStep(2);
                            }}
                            maxW="320px"
                            width="100%"
                            bg="white"
                            border="2px solid"
                            borderColor="#D90404"
                            focusBorderColor="#D90404"
                            _hover={{ borderColor: "#0F172A" }}
                            _focus={{
                                boxShadow: "0 0 0 2px rgba(217, 4, 4, 0.3)",
                            }}
                            size="lg"
                            borderRadius="xl"
                            height="55px"
                            fontSize="md"
                            fontWeight="medium"
                            boxShadow="sm"
                        >
                            {/* Loading */}
                            {loadingPartTypes && (
                                <option value="">Loading...</option>
                            )}

                            {/* No Data */}
                            {!loadingPartTypes && partTypes.length === 0 && (
                                <option value="">No part types found</option>
                            )}

                            {/* Data */}
                            {!loadingPartTypes &&
                                partTypes.length > 0 &&
                                partTypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                        </Select>
                    </VStack>
                );

            case 2:
                return (
                    <VStack spacing={5} width="100%">
                        <Box textAlign="center" mb={2}>
                            <Badge
                                bg="#D90404"
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                                mb={3}
                            >
                                Step 2 of 4
                            </Badge>
                            <Heading size="md" color="#0F172A" mb={2}>
                                Which service are you looking for?
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                Select your preferred service type
                            </Text>
                        </Box>
                        <VStack spacing={3} width="100%">
                            {serviceOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => handleServiceSelect(option.label)}
                                    width="100%"
                                    py={6}
                                    bg="white"
                                    border="2px solid"
                                    borderColor={
                                        selectedServiceType === option.label ? "#D90404" : "#E2E8F0"
                                    }
                                    color="#0F172A"
                                    _hover={{ borderColor: "#D90404", bg: "#FFF5F5" }}
                                    borderRadius="xl"
                                    fontWeight="medium"
                                    height="60px"
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </VStack>
                    </VStack>
                );

            case 3:
                return (
                    <VStack spacing={5} width="100%">
                        <Box textAlign="center" mb={2}>
                            <Badge
                                bg="#D90404"
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                                mb={3}
                            >
                                Step 3 of 4
                            </Badge>
                            <Heading size="md" color="#0F172A" mb={2}>
                                What condition do you prefer?
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                Select your preferred part condition
                            </Text>
                        </Box>
                        <VStack spacing={3} width="100%">
                            {conditionOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => handleConditionSelect(option.label)}
                                    width="100%"
                                    py={6}
                                    bg="white"
                                    border="2px solid"
                                    borderColor={
                                        selectedCondition === option.label ? "#D90404" : "#E2E8F0"
                                    }
                                    color="#0F172A"
                                    _hover={{ borderColor: "#D90404", bg: "#FFF5F5" }}
                                    borderRadius="xl"
                                    fontWeight="medium"
                                    height="60px"
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </VStack>
                    </VStack>
                );

            case 4:
                return (
                    <VStack spacing={5} width="100%">
                        <Box textAlign="center" mb={2}>
                            <Badge
                                bg="#D90404"
                                color="white"
                                px={3}
                                py={1}
                                borderRadius="full"
                                mb={3}
                            >
                                Final Step
                            </Badge>
                            <Heading size="md" color="#0F172A" mb={2}>
                                Enter your vehicle registration
                            </Heading>
                            <HStack justify="center" spacing={2} mb={2}>
                                <Text fontSize="sm" color="gray.500">
                                    17 suppliers currently online
                                </Text>
                                <Box w={2} h={2} bg="green.500" borderRadius="full" />
                            </HStack>
                        </Box>

                        <FormControl isInvalid={!!vrmError}>
                            <InputGroup size="lg">
                                <InputLeftElement
                                    pointerEvents="none"
                                    fontSize="1.5rem"
                                    pl={3}
                                >
                                    🚗
                                </InputLeftElement>
                                <Input
                                    placeholder="Enter Reg. (e.g., AB12 CDE)"
                                    value={vrm}
                                    onChange={(e) => {
                                        setVrm(e.target.value.toUpperCase());
                                        setVrmError("");
                                    }}
                                    bg="white"
                                    borderColor={vrmError ? "red.500" : "#D90404"}
                                    focusBorderColor={vrmError ? "red.500" : "#D90404"}
                                    _hover={{ borderColor: "#0F172A" }}
                                    borderRadius="xl"
                                    textTransform="uppercase"
                                    fontSize="md"
                                    pl={12}
                                    height="60px"
                                />
                            </InputGroup>
                            {vrmError && (
                                <FormErrorMessage fontSize="sm" mt={2}>
                                    ❌ {vrmError}
                                </FormErrorMessage>
                            )}
                        </FormControl>

                        <Button
                            onClick={handleCheckAvailability}
                            isLoading={isChecking}
                            loadingText="Checking..."
                            width="100%"
                            bg="#D90404"
                            color="white"
                            _hover={{ bg: "#B80303" }}
                            _active={{ bg: "#9A0202" }}
                            size="lg"
                            borderRadius="xl"
                            py={6}
                            fontSize="md"
                            fontWeight="bold"
                            height="60px"
                        >
                            {isChecking ? <Spinner size="sm" mr={2} /> : "🔍"}
                            Check Engine Availability
                        </Button>

                        <Button
                            variant="link"
                            color="#D90404"
                            fontSize="sm"
                            onClick={() => {
                                setVrm("");
                                setVrmError("");
                            }}
                            _hover={{ color: "#B80303" }}
                        >
                            Don't have reg? Click here
                        </Button>
                    </VStack>
                );

            default:
                return null;
        }
    };


    useEffect(() => {
        const fetchPartTypes = async () => {
            try {
                setLoadingPartTypes(true);

                const res = await fetch(`${import.meta.env.VITE_API_URL}/part-types`);
                const data = await res.json();

                setPartTypes(data);

                // ✅ set default using _id
                if (data.length > 0) {
                    setSelectedPartType(data[0]._id);
                }

            } catch (error) {
                console.error("Error fetching part types:", error);
            } finally {
                setLoadingPartTypes(false);
            }
        };

        fetchPartTypes();
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            closeOnOverlayClick={false}   // ❌ disable outside click
            closeOnEsc={false}
            isCentered
            size={{ base: "md", sm: "lg", md: "xl" }}
            isCentered={false}

        >
            <ModalOverlay bg="blackAlpha.300" />
            <ModalContent
                borderRadius="2xl"
                overflow="visible"
                bg="white"
                position="relative"
                maxW="550px"
                w="90%"
                mt="210px"
            >
                {/* Top accent bar */}
                <Box h="5px" bg="#D90404" />

                <ModalCloseButton
                    top={3}
                    right={3}
                    color="gray.500"
                    _hover={{ color: "#D90404", bg: "gray.100" }}
                    borderRadius="full"
                    zIndex={1}
                />

                <ModalBody p={8} textAlign="center" >
                    {renderStep()}

                    {/* Navigation hint for mobile */}
                    {step > 1 && step < 4 && (
                        <Text fontSize="xs" color="gray.400" mt={5}>
                            Click to select your option
                        </Text>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RefreshPopUp;