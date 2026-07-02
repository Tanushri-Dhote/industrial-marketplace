import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import {
	CheckCircleIcon,
	ChevronRightIcon,
	ChevronLeftIcon,
	EmailIcon,
	PhoneIcon,
} from "@chakra-ui/icons";
import { MapPin, Settings, Package, User, MessageSquare, Truck, ShieldCheck } from "lucide-react";
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
		phone: "+44 ",
	});

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

			const cleanedPostcode = (form.postcode || "").replace(/\s+/g, "").toUpperCase();
			const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
			if (!ukPostcodeRegex.test(cleanedPostcode)) {
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
					brand,
					model,
					year,
					engineType: brand ? actualType : vrmEngineType,
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
		<HStack w="full" spacing={4} mb={10}>
			{[1, 2, 3].map((i) => (
				<Box
					key={i}
					flex={1}
					h="8px"
					bg={step >= i ? RED : "#E5E7EB"}
					borderRadius="full"
				/>
			))}
		</HStack>
	);

	return (
		<Box bg="#f7f7f7" minH={isModal ? "auto" : "100vh"} py={{ base: 8, md: 16 }}>
			<Container maxW="container.md">
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
							{/* Vehicle Info */}
							<Box bg="white" borderRadius="3xl" p={8} mb={10} boxShadow="lg">
								<HStack spacing={5}>
									<Box bg={RED} color="white" p={5} borderRadius="2xl">
										<Settings size={32} />
									</Box>
									<VStack align="start" spacing={1}>
										<Text fontSize="sm" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="1px">
											YOUR VEHICLE
										</Text>
										<Heading size="lg" color={DARK}>
											{hasVehicle ? (safeVrm || `${safeBrand} ${safeModel} ${safeYear}`) : "Enter Registration"}
										</Heading>
									</VStack>
								</HStack>

								{!safeVrm && (
									<Box
										position="relative"
										bg="#FFD300"
										border="3px solid #111111"
										borderRadius="xl"
										h="76px"
										w="full"
										overflow="hidden"
										boxShadow="md"
										display="flex"
										alignItems="center"
										mt={6}
									>
										{/* Blue UK Band */}
										<VStack
											bg="#003399"
											w="50px"
											h="full"
											justify="center"
											spacing={1.5}
											px={2}
											flexShrink={0}
											borderRight="1px solid #111111"
										>
											{/* SVG Union Jack */}
											<Box w="28px" h="16px" borderRadius="xs" overflow="hidden">
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
											<Text color="#FFD300" fontSize="11px" fontWeight="900" lineHeight="1" letterSpacing="0.5px">
												UK
											</Text>
										</VStack>

										{/* Input Field */}
										<Input
											value={manualVrm}
											onChange={(e) => setManualVrm(e.target.value.toUpperCase().replace(/\s+/g, ""))}
											placeholder="ENTER YOUR REG"
											border="none"
											bg="transparent"
											h="full"
											flex="1"
											color="#111111"
											fontSize="28px"
											fontWeight="bold"
											fontFamily="'Impact', 'Arial Black', sans-serif"
											letterSpacing="4px"
											textAlign="center"
											_focus={{ boxShadow: "none" }}
											_placeholder={{ color: "rgba(17, 17, 17, 0.35)", letterSpacing: "2px" }}
											textTransform="uppercase"
										/>
									</Box>
								)}
							</Box>

							<VStack spacing={10} align="stretch">
								<Box>
									<Heading size="xl" mb={2} color={DARK}>Tell Us What You Need</Heading>
									<Text color="gray.600">Select your preferences to get accurate quotes</Text>
								</Box>

								{/* Condition Selection */}
								<Box>
									<Text fontWeight="700" mb={5} color="gray.700">
										Preferred Condition
									</Text>

									<SimpleGrid
										columns={{ base: 1, md: 2 }}
										gap={5}
									>
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
													p={6}
													bg="white"
													borderRadius="2xl"
													border="2px solid"
													borderColor={isSelected ? RED : "gray.100"}
													cursor="pointer"
													onClick={() => handleEngineSelect(item.title)}
													transition="all 0.2s ease"
													_hover={{
														borderColor: RED,
														transform: "translateY(-4px)",
													}}
												>
													<HStack spacing={4}>
														<Icon
															as={item.icon}
															color={isSelected ? RED : "gray.400"}
															boxSize={7}
														/>

														<VStack align="start" spacing={0.5}>
															<Text fontWeight="700" fontSize="15px">
																{item.title}
															</Text>

															<Text fontSize="sm" color="gray.500">
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
								<Box>
									<Text fontWeight="700" mb={5} color="gray.700">
										Supply & Fitting
									</Text>

									<SimpleGrid
										columns={{ base: 1, md: 3 }}
										gap={5}
									>
										{[
											{ title: "Supplied & Fitted", icon: Settings },
											{ title: "Supplied Only", icon: Truck },
											{ title: "Will consider both", icon: Package },
										].map((item) => {
											const isSelected = fittingOptions.includes(item.title);

											return (
												<Box
													key={item.title}
													p={6}
													bg="white"
													borderRadius="2xl"
													border="2px solid"
													borderColor={isSelected ? RED : "gray.100"}
													textAlign="center"
													cursor="pointer"
													onClick={() => handleFittingSelect(item.title)}
													transition="0.3s ease"
													_hover={{
														borderColor: RED,
														transform: "translateY(-4px)",
													}}
												>
													<Icon
														as={item.icon}
														color={isSelected ? RED : "gray.400"}
														boxSize={8}
														mb={3}
													/>

													<Text fontWeight="700" fontSize="14px">
														{item.title}
													</Text>
												</Box>
											);
										})}
									</SimpleGrid>
								</Box>

								{/* Postcode, Engine Type & Notes */}
								<Box bg="white" p={8} borderRadius="3xl" boxShadow="sm">
									<VStack spacing={6}>
										<InputGroup>
											<InputLeftElement h="52px" pointerEvents="none">
												<MapPin color="#E10600" />
											</InputLeftElement>
											<Input
												size="lg"
												placeholder="Your Postcode"
												borderRadius="xl"
												value={form.postcode}
												onChange={(e) => setForm({ ...form, postcode: e.target.value.toUpperCase() })}
											/>
										</InputGroup>

										{!brand && (
											<InputGroup>
												<InputLeftElement h="52px" pointerEvents="none">
													<Settings color="#E10600" />
												</InputLeftElement>
												<Input
													size="lg"
													placeholder="Engine Type / Code (Optional, e.g. 2.0L Diesel)"
													borderRadius="xl"
													value={vrmEngineType}
													onChange={(e) => setVrmEngineType(e.target.value)}
												/>
											</InputGroup>
										)}

										<Textarea
											placeholder="Additional requirements or notes..."
											rows={4}
											borderRadius="xl"
											value={form.notes}
											onChange={(e) => setForm({ ...form, notes: e.target.value })}
										/>
									</VStack>
								</Box>

								<Button
									size="lg"
									bg={RED}
									color="white"
									h="66px"
									fontSize="18px"
									fontWeight="700"
									borderRadius="2xl"
									rightIcon={<ChevronRightIcon />}
									onClick={handleNext}
								>
									Continue to Contact Details
								</Button>
							</VStack>
						</MotionBox>
					)}

					{/* STEP 2 */}
					{step === 2 && (
						<MotionBox key="step2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
							<Button leftIcon={<ChevronLeftIcon />} variant="ghost" mb={6} onClick={handleBack}>
								Back
							</Button>

							<Heading size="xl" mb={3} color={DARK}>Contact Information</Heading>
							<Text color="gray.600" mb={8}>We'll use this to connect you with suppliers</Text>

							<Box bg="white" p={10} borderRadius="3xl" boxShadow="lg">
								<VStack spacing={6}>
									<InputGroup>
										<InputLeftElement h="52px"><User color="#E10600" /></InputLeftElement>
										<Input size="lg" placeholder="Full Name" borderRadius="xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
									</InputGroup>

									<InputGroup>
										<InputLeftElement h="52px"><EmailIcon color="#E10600" /></InputLeftElement>
										<Input size="lg" type="email" placeholder="Email Address" borderRadius="xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
									</InputGroup>

									<InputGroup>
										<InputLeftElement h="52px"><PhoneIcon color="#E10600" /></InputLeftElement>
										<Input size="lg" type="tel" placeholder="+44 7700 900000" borderRadius="xl" value={form.phone} onChange={(e) => handlePhoneChange(e.target.value)} />
									</InputGroup>

									<Button
										w="full"
										size="lg"
										bg={RED}
										color="white"
										h="66px"
										fontSize="18px"
										fontWeight="700"
										borderRadius="2xl"
										onClick={handleGetQuote}
										isDisabled={!form.name || !form.email || !form.phone}
										isLoading={submitting}
										loadingText="Submitting Request..."
									>
										Submit Request
									</Button>
								</VStack>
							</Box>
						</MotionBox>
					)}

					{/* STEP 3 - Success */}
					{step === 3 && (
						<MotionBox key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} textAlign="center" py={12}>
							<Box mx="auto" w="120px" h="120px" bg="green.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mb={8}>
								<CheckCircleIcon boxSize={16} color="green.500" />
							</Box>

							<Heading size="2xl" mb={4} color={DARK}>Request Sent Successfully!</Heading>
							<Text fontSize="lg" color="gray.600" maxW="500px" mx="auto" mb={12}>
								Our network of specialists has received your request. You should hear back shortly.
							</Text>

							<SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={12}>
								{[
									{ icon: "📞", title: "Contact", desc: "Suppliers will reach out soon" },
									{ icon: "💰", title: "Quotes", desc: "Get competitive offers directly" },
									{ icon: "✅", title: "Save", desc: "Get the best deal" },
								].map((item, i) => (
									<Box key={i} bg="white" p={8} borderRadius="2xl" boxShadow="md">
										<Text fontSize="42px" mb={4}>{item.icon}</Text>
										<Text fontWeight="700" mb={2}>{item.title}</Text>
										<Text color="gray.500">{item.desc}</Text>
									</Box>
								))}
							</SimpleGrid>

							<Button
								size="lg"
								onClick={() => isModal && onCloseModal ? onCloseModal() : navigate("/")}
								colorScheme="gray"
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