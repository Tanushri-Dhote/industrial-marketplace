import React, { useEffect, useState, useRef } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
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
	Spinner,
	FormControl,
	FormErrorMessage,
} from "@chakra-ui/react";
import {
	CheckCircleIcon,
	ChevronRightIcon,
	ChevronLeftIcon,
	EmailIcon,
	PhoneIcon,
} from "@chakra-ui/icons";
import { MapPin, Settings, Package, User, MessageSquare, Truck, ShieldCheck, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const RED = "#E10600";
const DARK = "#111111";

const MotionBox = motion(Box);

export default function CallSellerPage({ 
	isModal = false, 
	onCloseModal,
	vrm: propVrm,
	category: propCategory,
	brand: propBrand,
	model: propModel,
	year: propYear,
	engineType: propEngineType
}) {
	const [step, setStep] = useState(1);
	const [engineOptions, setEngineOptions] = useState([]);
	const [fittingOptions, setFittingOptions] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	let locState = location.state;
	if (typeof locState !== "object" || locState === null) {
		locState = { vrm: locState };
	}
	const { 
		vrm: stateVrm, 
		category: stateCategory, 
		brand: stateBrand, 
		make: stateMake, 
		model: stateModel, 
		year: stateYear, 
		type: stateType, 
		engineType: stateEngineType 
	} = locState || {};

	const vrm = propVrm !== undefined ? propVrm : stateVrm;
	const category = propCategory !== undefined ? propCategory : stateCategory;
	const brand = propBrand !== undefined ? propBrand : (stateBrand || stateMake || "");
	const model = propModel !== undefined ? propModel : stateModel;
	const year = propYear !== undefined ? propYear : stateYear;
	const actualType = propEngineType !== undefined ? propEngineType : (stateType || stateEngineType || "");
	const toText = (value) => (value === null || value === undefined ? "" : String(value));
	const [vrmEngineType, setVrmEngineType] = useState(toText(actualType));

	const safeVrm = toText(vrm).trim();
	const safeBrand = toText(brand).trim();
	const safeModel = toText(model).trim();
	const safeYear = toText(year).trim();
	const hasVehicle = !!(safeVrm || safeBrand || safeModel || safeYear);
	const [manualVrm, setManualVrm] = useState(toText(vrm));
	const finalVehicleVrm = (manualVrm || "").trim() || safeVrm || "";

	const [form, setForm] = useState({
		postcode: "",
		notes: "",
		name: "",
		email: "",
		phone: "",
	});

	const vrmRef = useRef(null);
	const postcodeRef = useRef(null);
	const engineTypeRef = useRef(null);
	const notesRef = useRef(null);
	const nameRef = useRef(null);
	const emailRef = useRef(null);
	const phoneRef = useRef(null);

	const [dvlaBrand, setDvlaBrand] = useState("");
	const [dvlaModel, setDvlaModel] = useState("");
	const [dvlaYear, setDvlaYear] = useState("");
	const [dvlaEngineType, setDvlaEngineType] = useState("");
	const [dvlaData, setDvlaData] = useState(null);
	const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);
	const [debouncedVrm, setDebouncedVrm] = useState("");
	const [lookupError, setLookupError] = useState("");

	const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
	const ukPhoneRegex = /^(?:(?:\+44|0)[12378]\d{8,9})$/;

	// Postcode Validation Flags
	const isPostcodeValid = ukPostcodeRegex.test(form.postcode.trim());
	const showPostcodeError = form.postcode.trim().length >= 5 && !isPostcodeValid;

	// Phone Validation Flags
	const isPhoneValid = ukPhoneRegex.test(form.phone.replace(/\s+/g, ""));
	const showPhoneError = form.phone.replace(/\s+/g, "").length >= 5 && !isPhoneValid;

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedVrm(manualVrm);
		}, 500);
		return () => clearTimeout(handler);
	}, [manualVrm]);
 
	const fetchVehicleDetails = async (vrmToLookup) => {
		if (!vrmToLookup) return;
		setIsLoadingVehicle(true);
		setLookupError("");
		try {
			const API_URL = import.meta.env.VITE_API_URL;
			const res = await fetch(`${API_URL}/lookup-vrm`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vrm: vrmToLookup }),
			});
			const result = await res.json();
			if (res.ok && result.success && result.data) {
				const vehicle = result.data;
				setDvlaData(vehicle);
				setDvlaBrand(vehicle.make || "");
				setDvlaModel(vehicle.model || "");
				setDvlaYear(vehicle.year ? String(vehicle.year) : "");
				
				const capacityL = vehicle.engineCapacity ? (vehicle.engineCapacity / 1000).toFixed(1) + "L" : "";
				const fuel = vehicle.fuelType ? vehicle.fuelType.toUpperCase() : "";
				const engineSpec = [capacityL, fuel].filter(Boolean).join(" ");
				setDvlaEngineType(engineSpec);
				setVrmEngineType(engineSpec);
				setLookupError("");
			} else {
				setDvlaData(null);
				setDvlaBrand("");
				setDvlaModel("");
				setDvlaYear("");
				setDvlaEngineType("");
				if (res.status === 404) {
					setLookupError("Vehicle details not found for this registration.");
				} else {
					setLookupError("Unable to verify vehicle details automatically. Please enter manually.");
				}
			}
		} catch (err) {
			console.error("DVLA lookup error:", err);
			setDvlaData(null);
			setDvlaBrand("");
			setDvlaModel("");
			setDvlaYear("");
			setDvlaEngineType("");
			setLookupError("Unable to verify vehicle details automatically. Please enter manually.");
		} finally {
			setIsLoadingVehicle(false);
		}
	};
 
	useEffect(() => {
		const targetVrm = (debouncedVrm || "").trim() || safeVrm || "";
		if (!targetVrm) {
			setDvlaData(null);
			setDvlaBrand("");
			setDvlaModel("");
			setDvlaYear("");
			setDvlaEngineType("");
			setVrmEngineType(toText(actualType));
			setLookupError("");
			return;
		}
 
		const cleaned = targetVrm.replace(/\s+/g, "").toUpperCase();
		const ukVrmRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;
		if (ukVrmRegex.test(cleaned)) {
			fetchVehicleDetails(cleaned);
		} else {
			setDvlaData(null);
			setDvlaBrand("");
			setDvlaModel("");
			setDvlaYear("");
			setDvlaEngineType("");
			if (cleaned.length >= 4) {
				setLookupError("Invalid UK registration format (e.g. AB12CDE).");
			} else {
				setLookupError("");
			}
		}
	}, [debouncedVrm, safeVrm]);

	const handlePhoneChange = (val) => {
		// Allow only numbers, +, and space
		let cleaned = val.replace(/[^\d+ ]/g, "");

		// Only one '+' allowed at the beginning
		if (cleaned.includes("+")) {
			cleaned = "+" + cleaned.replace(/\+/g, "");
		}

		// Prevent typing beyond standard UK numbers (max digits)
		const digits = cleaned.replace(/\D/g, "");
		if (cleaned.startsWith("+44")) {
			if (digits.length > 12) return; // +44 followed by 10 digits
		} else if (cleaned.startsWith("+")) {
			if (digits.length > 11) return;
		} else if (cleaned.startsWith("0")) {
			if (digits.length > 11) return; // 0 followed by 10 digits
		} else {
			if (digits.length > 11) return;
		}

		setForm((prev) => ({ ...prev, phone: cleaned }));
	};

	useEffect(() => {
		if (!location.state && !isModal) {
			toast.error("Please start from the homepage to capture vehicle details.");
			navigate("/", { replace: true });
		}
	}, [location.state, navigate, isModal]);

	const handleEngineSelect = (value) => {
		setEngineOptions((prev) =>
			prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
		);
	};

	const handleFittingSelect = (value) => {
		setFittingOptions((prev) =>
			prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
		);
	};

	const handleNext = () => {
		if (step === 1) {
			if (!brand) {
				const cleanedVrm = (finalVehicleVrm || "").replace(/\s+/g, "").toUpperCase();
				if (!cleanedVrm) {
					return toast.error("Please enter registration number");
				}
				const ukVrmRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;
				if (!ukVrmRegex.test(cleanedVrm)) {
					return toast.error("Invalid UK registration number format");
				}
			}

			if (engineOptions.length === 0) return toast.error("Please select condition");
			if (fittingOptions.length === 0) return toast.error("Please select fitting option");
			if (!form.postcode) return toast.error("Postcode is required");

			if (!isPostcodeValid) {
				return toast.error("Invalid UK postcode format");
			}
		}
		setStep(step + 1);
		window.scrollTo(0, 0);
	};

	const handleBack = () => {
		setStep(step - 1);
		window.scrollTo(0, 0);
	};

	const handleGetQuote = async () => {
		if (!finalVehicleVrm && !brand) {
			return toast.error("Enter registration number");
		}
		setSubmitting(true);
		try {
			const API_URL = import.meta.env.VITE_API_URL;
			const res = await fetch(`${API_URL}/validate-vrm`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					vrm: finalVehicleVrm,
					brand: dvlaBrand || brand,
					model: dvlaModel || model,
					year: dvlaYear || year,
					engineType: dvlaEngineType || (brand ? actualType : vrmEngineType),
					category,
					engineOptions,
					fittingOptions,
					...form,
				}),
			});

			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.message || "Failed to submit");

			setStep(3);
			toast.success("Quote request submitted successfully!");
		} catch (err) {
			toast.error(err.message || "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};

	const ProgressBar = () => (
		<HStack w="full" spacing={3} mb={5}>
			{[1, 2, 3].map((i) => (
				<Box
					key={i}
					flex={1}
					h="4px"
					bg={step >= i ? RED : "#E5E7EB"}
					borderRadius="full"
				/>
			))}
		</HStack>
	);

	return (
		<Box bg={isModal ? "transparent" : "#f7f7f7"} minH={isModal ? "auto" : "100vh"} py={isModal ? 4 : { base: 8, md: 16 }}>
			<Container maxW={isModal ? "full" : "container.md"} px={isModal ? 5 : undefined}>
				<ProgressBar />

				<AnimatePresence mode="wait">
					{/* STEP 1 */}
					{step === 1 && (
						<MotionBox
							key="step1"
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -40 }}
						>
							<Box mb={5}>
								<Heading size="lg" mb={1} color={DARK}>Tell Us What You Need</Heading>
								<Text fontSize="sm" color="gray.600">Select your preferences to get accurate quotes</Text>
							</Box>

							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignItems="start">
								{/* Left Column */}
								<VStack spacing={4} align="stretch">
									{/* Vehicle Info */}
									<Box bg="white" borderRadius="xl" p={4} border="1px solid" borderColor="gray.100" boxShadow="sm">
										<HStack spacing={3}>
											<Box bg={RED} color="white" p={2.5} borderRadius="lg">
												<Settings size={20} />
											</Box>
											<VStack align="start" spacing={0}>
												<Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
													YOUR VEHICLE
												</Text>
												<Heading size="xs" fontSize="15px" color={DARK}>
													{hasVehicle ? (safeVrm || `${safeBrand} ${safeModel} ${safeYear}`) : "Enter Registration"}
												</Heading>
											</VStack>
										</HStack>

										{!safeVrm && (
											<Box
												position="relative"
												bg="#FFD300"
												border="2px solid #111111"
												borderRadius="lg"
												h="54px"
												w="full"
												overflow="hidden"
												boxShadow="sm"
												display="flex"
												alignItems="center"
												mt={3}
											>
												{/* Blue UK Band */}
												<VStack
													bg="#003399"
													w="40px"
													h="full"
													justify="center"
													spacing={1}
													px={1.5}
													flexShrink={0}
													borderRight="1px solid #111111"
												>
													{/* SVG Union Jack */}
													<Box w="20px" h="12px" borderRadius="xs" overflow="hidden">
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="100%" height="100%">
															<clipPath id="s">
																<path d="M0,0 L60,0 L60,30 L0,30 Z"/>
															</clipPath>
															<clipPath id="t">
																<path d="M30,15 L0,0 L0,30 Z"/>
															</clipPath>
															<path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
															<path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="4"/>
															<path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10"/>
															<path d="M30,0 L30,30 M0,15 L60,15" stroke="#c8102e" strokeWidth="6"/>
														</svg>
													</Box>
													<Text color="#FFD300" fontSize="9px" fontWeight="900" lineHeight="1" letterSpacing="0.5px">
														UK
													</Text>
												</VStack>

												{/* Input Field */}
												<Input
													ref={vrmRef}
													value={manualVrm}
													onChange={(e) => setManualVrm(e.target.value.toUpperCase().replace(/\s+/g, ""))}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															postcodeRef.current?.focus();
														}
													}}
													placeholder="ENTER YOUR REG"
													border="none"
													bg="transparent"
													h="full"
													flex="1"
													color="#111111"
													fontSize="20px"
													fontWeight="bold"
													fontFamily="'Impact', 'Arial Black', sans-serif"
													letterSpacing="3px"
													textAlign="center"
													_focus={{ boxShadow: "none" }}
													_placeholder={{ color: "rgba(17, 17, 17, 0.35)", letterSpacing: "2px" }}
													textTransform="uppercase"
												/>
											</Box>
										)}

										{isLoadingVehicle && (
											<HStack mt={3} justify="center" spacing={2}>
												<Spinner size="xs" color={RED} />
												<Text fontSize="xs" color="gray.500">Searching vehicle details...</Text>
											</HStack>
										)}

										{!isLoadingVehicle && dvlaData && (
											<Box mt={3} p={3} bg="green.50" border="1px solid" borderColor="green.200" borderRadius="lg">
												<HStack spacing={2.5} align="center">
													<Icon as={CheckCircleIcon} color="green.500" boxSize={4} />
													<VStack align="start" spacing={0.5}>
														<Text fontSize="xs" fontWeight="bold" color="green.800" textAlign="left">
															Vehicle Verified: {dvlaData.colour} {dvlaData.make} {dvlaData.year ? `(${dvlaData.year})` : ""}
														</Text>
														<Text fontSize="10px" color="green.600" textAlign="left">
															Engine: {dvlaData.engineCapacity ? `${(dvlaData.engineCapacity/1000).toFixed(1)}L` : "N/A"} | Fuel: {dvlaData.fuelType || "N/A"}
														</Text>
													</VStack>
												</HStack>
											</Box>
										)}

										{!isLoadingVehicle && lookupError && (
											<Box mt={3} p={3} bg="orange.50" border="1px solid" borderColor="orange.200" borderRadius="lg">
												<HStack spacing={2.5} align="start">
													<Box color="orange.600" mt="2px">
														<AlertTriangle size={16} />
													</Box>
													<VStack align="start" spacing={0.5}>
														<Text fontSize="xs" fontWeight="bold" color="orange.800" textAlign="left">
															{lookupError}
														</Text>
														<Text fontSize="10px" color="orange.600" textAlign="left">
															You can still continue and enter details manually below.
														</Text>
													</VStack>
												</HStack>
											</Box>
										)}
									</Box>

									{/* Postcode, Engine Type & Notes */}
									<Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
										<Text fontWeight="700" fontSize="sm" color="gray.700" mb={3}>
											Delivery & Details
										</Text>
										<VStack spacing={3} align="stretch" w="full">
											<FormControl isInvalid={showPostcodeError}>
												<InputGroup size="md">
													<InputLeftElement h="40px" pointerEvents="none">
														<MapPin color="#E10600" size={18} />
													</InputLeftElement>
													<Input
														ref={postcodeRef}
														placeholder="Your Postcode"
														borderRadius="lg"
														value={form.postcode}
														maxLength={8}
														onChange={(e) => {
															const cleaned = e.target.value.replace(/[^A-Za-z0-9 ]/g, "").toUpperCase();
															setForm({ ...form, postcode: cleaned });
														}}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																if (!brand && engineTypeRef.current) {
																	engineTypeRef.current.focus();
																} else {
																	notesRef.current?.focus();
																}
															}
														}}
													/>
												</InputGroup>
												<FormErrorMessage fontSize="xs" mt={1}>
													Invalid UK postcode format (e.g. SW1A 1AA)
												</FormErrorMessage>
											</FormControl>

											{!brand && (
												<InputGroup size="md">
													<InputLeftElement h="40px" pointerEvents="none">
														<Settings color="#E10600" size={18} />
													</InputLeftElement>
													<Input
														ref={engineTypeRef}
														placeholder="Engine Type / Code (Optional, e.g. 2.0L Diesel)"
														borderRadius="lg"
														value={vrmEngineType}
														onChange={(e) => setVrmEngineType(e.target.value)}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																notesRef.current?.focus();
															}
														}}
													/>
												</InputGroup>
											)}

											<Textarea
												ref={notesRef}
												placeholder="Additional requirements or notes..."
												rows={2}
												borderRadius="lg"
												fontSize="sm"
												value={form.notes}
												onChange={(e) => setForm({ ...form, notes: e.target.value })}
											/>
										</VStack>
									</Box>
								</VStack>

								{/* Right Column */}
								<VStack spacing={4} align="stretch">
									{/* Condition Selection */}
									<Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
										<Text fontWeight="700" fontSize="sm" color="gray.700" mb={3}>
											Preferred Condition
										</Text>

										<SimpleGrid columns={2} gap={3}>
											{[
												{
													title: "Reconditioned/Rebuild",
													desc: "Premium quality",
													icon: ShieldCheck,
												},
												{
													title: "Used (low mileage)",
													desc: "Best value",
													icon: Package,
												},
												{
													title: "New",
													desc: "Factory standard",
													icon: CheckCircleIcon,
												},
												{
													title: "Will consider all",
													desc: "Flexible",
													icon: MessageSquare,
												},
											].map((item) => {
												const isSelected = engineOptions.includes(item.title);

												return (
													<Box
														key={item.title}
														p={3}
														bg="white"
														borderRadius="xl"
														border="2px solid"
														borderColor={isSelected ? RED : "gray.100"}
														cursor="pointer"
														onClick={() => handleEngineSelect(item.title)}
														transition="all 0.2s ease"
														_hover={{
															borderColor: RED,
															transform: "translateY(-2px)",
														}}
														display="flex"
														alignItems="center"
													>
														<HStack spacing={2.5} align="center">
															<Icon
																as={item.icon}
																color={isSelected ? RED : "gray.400"}
																boxSize={5}
																flexShrink={0}
															/>

															<VStack align="start" spacing={0}>
																<Text fontWeight="700" fontSize="12px" lineHeight="1.2">
																	{item.title}
																</Text>

																<Text fontSize="10px" color="gray.500" mt={0.5}>
																	{item.desc}
																</Text>
															</VStack>
														</HStack>
													</Box>
												);
											})}
										</SimpleGrid>
									</Box>

									{/* Fitting Options */}
									<Box bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
										<Text fontWeight="700" fontSize="sm" color="gray.700" mb={3}>
											Supply & Fitting
										</Text>

										<SimpleGrid columns={3} gap={2}>
											{[
												{ title: "Supplied & Fitted", icon: Settings },
												{ title: "Supplied Only", icon: Truck },
												{ title: "Will consider both", icon: Package },
											].map((item) => {
												const isSelected = fittingOptions.includes(item.title);

												return (
													<Box
														key={item.title}
														p={2.5}
														bg="white"
														borderRadius="xl"
														border="2px solid"
														borderColor={isSelected ? RED : "gray.100"}
														textAlign="center"
														cursor="pointer"
														onClick={() => handleFittingSelect(item.title)}
														transition="0.2s ease"
														_hover={{
															borderColor: RED,
															transform: "translateY(-2px)",
														}}
														display="flex"
														flexDirection="column"
														alignItems="center"
														justifyContent="center"
														minH="72px"
													>
														<Icon
															as={item.icon}
															color={isSelected ? RED : "gray.400"}
															boxSize={5}
															mb={1.5}
														/>

														<Text fontWeight="700" fontSize="11px" lineHeight="1.2">
															{item.title}
														</Text>
													</Box>
												);
											})}
										</SimpleGrid>
									</Box>
								</VStack>
							</SimpleGrid>

							<Button
								size="md"
								bg={RED}
								color="white"
								h="52px"
								fontSize="16px"
								fontWeight="700"
								borderRadius="xl"
								rightIcon={<ChevronRightIcon />}
								onClick={handleNext}
								isDisabled={!form.postcode || !isPostcodeValid}
								mt={6}
								w="full"
								_hover={{ bg: "#C10500" }}
							>
								Continue to Contact Details
							</Button>
						</MotionBox>
					)}

					{/* STEP 2 */}
					{step === 2 && (
						<MotionBox key="step2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
							<Button leftIcon={<ChevronLeftIcon />} variant="ghost" size="sm" mb={4} onClick={handleBack}>
								Back
							</Button>

							<Box mb={4}>
								<Heading size="md" mb={1} color={DARK}>Contact Information</Heading>
								<Text fontSize="sm" color="gray.600">We'll use this to contact you regarding your engine rebuild request</Text>
							</Box>

							<Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm" maxW="md" mx="auto">
								<VStack spacing={4}>
									<InputGroup size="md">
										<InputLeftElement h="40px"><User color="#E10600" size={18} /></InputLeftElement>
										<Input
											ref={nameRef}
											placeholder="Full Name"
											borderRadius="lg"
											value={form.name}
											onChange={(e) => setForm({ ...form, name: e.target.value })}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													emailRef.current?.focus();
												}
											}}
										/>
									</InputGroup>

									<InputGroup size="md">
										<InputLeftElement h="40px"><EmailIcon color="#E10600" /></InputLeftElement>
										<Input
											ref={emailRef}
											type="email"
											placeholder="Email Address"
											borderRadius="lg"
											value={form.email}
											onChange={(e) => setForm({ ...form, email: e.target.value })}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													phoneRef.current?.focus();
												}
											}}
										/>
									</InputGroup>

									<FormControl isInvalid={showPhoneError}>
										<InputGroup size="md">
											<InputLeftElement h="40px"><PhoneIcon color="#E10600" /></InputLeftElement>
											<Input
												ref={phoneRef}
												type="tel"
												placeholder="+44 7700 900000"
												borderRadius="lg"
												value={form.phone}
												onChange={(e) => handlePhoneChange(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														if (form.name && form.email && form.phone && isPhoneValid) {
															handleGetQuote();
														}
													}
												}}
											/>
										</InputGroup>
										<FormErrorMessage fontSize="xs" mt={1}>
											Invalid UK phone number (e.g. 07700 900000 or +44 7700 900000)
										</FormErrorMessage>
									</FormControl>

									<Button
										w="full"
										size="md"
										bg={RED}
										color="white"
										h="52px"
										fontSize="16px"
										fontWeight="700"
										borderRadius="xl"
										onClick={handleGetQuote}
										isDisabled={!form.name || !form.email || !form.phone || !isPhoneValid}
										isLoading={submitting}
										loadingText="Submitting Request..."
										_hover={{ bg: "#C10500" }}
									>
										Submit Request
									</Button>
								</VStack>
							</Box>
						</MotionBox>
					)}

					{/* STEP 3 - Success */}
					{step === 3 && (
						<MotionBox key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} textAlign="center" py={4}>
							<Box mx="auto" w="80px" h="80px" bg="green.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mb={4}>
								<CheckCircleIcon boxSize={9} color="green.500" />
							</Box>

							<Heading size="lg" mb={2} color={DARK}>Request Sent Successfully!</Heading>
							<Text fontSize="sm" color="gray.600" maxW="450px" mx="auto" mb={6}>
								Our engine rebuild specialists have received your request. You should hear back shortly.
							</Text>

							<SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
								{[
									{ icon: "📞", title: "Contact", desc: "Our team will reach out soon" },
									{ icon: "💰", title: "Quotes", desc: "Get a comprehensive quote directly" },
									{ icon: "✅", title: "Save", desc: "Get the best deal" },
								].map((item, i) => (
									<Box key={i} bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
										<Text fontSize="28px" mb={2}>{item.icon}</Text>
										<Text fontWeight="700" fontSize="sm" mb={1}>{item.title}</Text>
										<Text fontSize="xs" color="gray.500">{item.desc}</Text>
									</Box>
								))}
							</SimpleGrid>

							<Button
								size="md"
								onClick={() => isModal && onCloseModal ? onCloseModal() : navigate("/")}
								colorScheme="gray"
								h="40px"
								borderRadius="lg"
							>
								{isModal ? "Close" : "Back to Homepage"}
							</Button>
						</MotionBox>
					)}
				</AnimatePresence>
			</Container>
		</Box>
	);
}