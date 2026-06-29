import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
import { useLocation, useNavigate } from "react-router-dom";

const RefreshPopUp = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const location = useLocation();
	const navigate = useNavigate();

	// Step management
	const [step, setStep] = useState(1);
	const [defaultPartTypeId, setDefaultPartTypeId] = useState("");
	const [selectedPartType, setSelectedPartType] = useState("");
	const [selectedServiceType, setSelectedServiceType] = useState("");
	const [selectedCondition, setSelectedCondition] = useState("");
	const [vrm, setVrm] = useState("");
	const [vrmError, setVrmError] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const { data: partTypes = [], isLoading: loadingPartTypes } = useQuery({
		queryKey: ["part-types"],
		queryFn: async () => {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/part-types`);
			return res.data?.data || res.data || [];
		},
		staleTime: 1000 * 60 * 30,
	});

	// ✅ Routes where popup SHOULD show (landing page variants only)
	const allowedRoutes = [
		"/",
		"/car-engines",
		"/used-engines",
		"/reconditioned-engines",
		"/gearboxes",
	];

	useEffect(() => {
		const isAllowed = allowedRoutes.includes(location.pathname);

		// Check if popup was shown recently (within 24 hours)
		const lastShown = localStorage.getItem("last_popup_shown");
		const now = new Date().getTime();
		const interval = 30 * 60 * 1000; // 30 minutes

		const shouldShow = !lastShown || now - parseInt(lastShown) > interval;

		if (isAllowed && shouldShow) {
			const timer = setTimeout(() => {
				onOpen();
				localStorage.setItem("last_popup_shown", now.toString());
			}, 5000); // 5 second delay

			return () => clearTimeout(timer);
		}
	}, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

	// Reset state when modal closes
	const handleClose = () => {
		setStep(1);
		setSelectedPartType(defaultPartTypeId);
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
		setStep(2);
	};

	const handleConditionSelect = (value) => {
		setSelectedCondition(value);
		setStep(3);
	};

	useEffect(() => {
		if (!isOpen || partTypes.length === 0) {
			return;
		}

		if (!selectedPartType) {
			const enginePart = partTypes.find((type) => type.name?.toLowerCase().includes("engine"));
			const defaultId = enginePart ? enginePart._id : partTypes[0]._id;
			setSelectedPartType(defaultPartTypeId || defaultId);
		}
	}, [defaultPartTypeId, isOpen, partTypes, selectedPartType]);

	const validateVRM = (reg) => {
		const vrmPattern =
			/^[A-Z]{2}\d{2}[A-Z]{3}$|^[A-Z]{2}\d{2}[A-Z]{2}$|^[A-Z]{1,2}\d{1,4}[A-Z]{1,3}$/i;
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

		const cleanedVRM = vrm.toUpperCase().replace(/\s+/g, "");
		const selectedPart = partTypes.find((type) => type._id === selectedPartType);

		setIsChecking(false);
		handleClose();
		navigate("/call-seller", {
			state: {
				vrm: cleanedVRM,
				category: selectedPart?.name || "",
				searchType: "vrm",
			},
		});
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<VStack spacing={5} width="100%">
						<Box textAlign="center" mb={2}>
							<Badge bg="#D90404" color="white" px={3} py={1} borderRadius="full" mb={3}>
								Step 1 of 3
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
							{loadingPartTypes && <option value="">Loading...</option>}

							{/* No Data */}
							{!loadingPartTypes && partTypes.length === 0 && (
								<option value="">No part types found</option>
							)}

							{/* Data */}
							{!loadingPartTypes &&
								partTypes.length > 0 &&
								partTypes
									.filter((type) => type.name?.toLowerCase().includes("engine"))
									.map((type) => (
										<option key={type._id} value={type._id}>
											{type.name}
										</option>
									))}
						</Select>

						<Box textAlign="center" pt={2}>
							<Heading size="sm" color="#0F172A" mb={2}>
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
									borderColor={selectedServiceType === option.label ? "#D90404" : "#E2E8F0"}
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

			case 2:
				return (
					<VStack spacing={5} width="100%">
						<Box textAlign="center" mb={2}>
							<Badge bg="#D90404" color="white" px={3} py={1} borderRadius="full" mb={3}>
								Step 2 of 3
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
									borderColor={selectedCondition === option.label ? "#D90404" : "#E2E8F0"}
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
							<Badge bg="#D90404" color="white" px={3} py={1} borderRadius="full" mb={3}>
								Final Step
							</Badge>
							<Heading size="md" color="#0F172A" mb={2}>
								Enter your vehicle registration
							</Heading>
							<Text fontSize="sm" color="gray.500">
								17 suppliers currently online
							</Text>
						</Box>
						<HStack justify="center" spacing={2} mb={2}>
							<Text fontSize="sm" color="gray.500">
								Please enter your registration
							</Text>
							<Box w={2} h={2} bg="green.500" borderRadius="full" />
						</HStack>

						<FormControl isInvalid={!!vrmError}>
							<InputGroup size="lg">
								<InputLeftElement pointerEvents="none" fontSize="1.5rem" pl={3}>
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
		if (partTypes.length > 0 && !defaultPartTypeId) {
			const enginePart = partTypes.find((type) => type.name?.toLowerCase().includes("engine"));
			const defaultId = enginePart ? enginePart._id : partTypes[0]._id;
			setDefaultPartTypeId(defaultId);
			setSelectedPartType(defaultId);
		}
	}, [partTypes, defaultPartTypeId]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			closeOnOverlayClick={false} // ❌ disable outside click
			closeOnEsc={false}
			size={{ base: "md", sm: "lg", md: "xl" }}
			isCentered={false}
		>
			<ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
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

				<ModalBody p={8} textAlign="center">
					{renderStep()}

					{/* Navigation hint for mobile */}
					{step > 1 && step < 3 && (
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
