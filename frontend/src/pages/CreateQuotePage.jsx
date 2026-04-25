import { ArrowBackIcon, DownloadIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Checkbox,
	Flex,
	HStack,
	Icon,
	Input,
	NumberInput,
	NumberInputField,
	Select,
	SimpleGrid,
	Text,
	Textarea,
	useToast,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CheckCircle, FileText, Send, User, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const DARK = "#0F172A";
const RED = "#D90404";
const PLATE_YELLOW = "#F5C518";

function UKPlate({ vrm }) {
	return (
		<Flex
			align="center"
			bg={PLATE_YELLOW}
			border="2.5px solid"
			borderColor={DARK}
			borderRadius="8px"
			overflow="hidden"
			h="42px"
			boxShadow="0 4px 12px rgba(0,0,0,0.2)"
		>
			<Flex bg={DARK} h="100%" w="34px" flexDir="column" align="center" justify="center" px={1}>
				<Text color="white" fontSize="7px" fontWeight="900" letterSpacing="0.5px">
					GB
				</Text>
				<Text color={PLATE_YELLOW} fontSize="10px">
					★
				</Text>
			</Flex>
			<Text
				px={4}
				fontSize="20px"
				fontWeight="900"
				letterSpacing="2px"
				color={DARK}
				fontFamily="'Arial Black', sans-serif"
			>
				{vrm || "— — — —"}
			</Text>
		</Flex>
	);
}

function LineRow({
	label,
	sublabel,
	value,
	onChange,
	hasTBC,
	tbcVal,
	onTBC,
	hasVAT,
	vatVal,
	onVAT,
}) {
	return (
		<Flex
			align="center"
			px={6}
			py={3}
			borderBottom="1px solid"
			borderColor="gray.100"
			_hover={{ bg: "rgba(217,4,4,0.03)" }}
			transition="background 0.15s"
			gap={4}
		>
			<Box flex={1}>
				<Text
					fontSize="13px"
					fontWeight="700"
					color={DARK}
					textTransform="uppercase"
					letterSpacing="0.5px"
				>
					{label}
				</Text>
				{sublabel && (
					<Text fontSize="11px" color="gray.400">
						{sublabel}
					</Text>
				)}
			</Box>

			<HStack spacing={3}>
				{hasTBC && (
					<HStack spacing={1} opacity={0.7}>
						<Checkbox
							size="sm"
							isChecked={tbcVal}
							onChange={(e) => onTBC(e.target.checked)}
							colorScheme="red"
						/>
						<Text fontSize="11px" fontWeight="600" color="gray.500">
							TBC
						</Text>
					</HStack>
				)}
				{hasVAT && (
					<HStack spacing={1} opacity={0.7}>
						<Checkbox
							size="sm"
							isChecked={vatVal}
							onChange={(e) => onVAT(e.target.checked)}
							colorScheme="red"
						/>
						<Text fontSize="11px" fontWeight="600" color="gray.500">
							Auto
						</Text>
					</HStack>
				)}
			</HStack>

			<HStack spacing={2} minW="140px" justify="flex-end">
				<Text fontWeight="700" color="gray.500" fontSize="14px">
					£
				</Text>
				<NumberInput
					value={value}
					onChange={(_, v) => onChange(isNaN(v) ? 0 : v)}
					min={0}
					precision={2}
					w="100px"
				>
					<NumberInputField
						h="36px"
						textAlign="right"
						fontSize="15px"
						fontWeight="700"
						bg="gray.50"
						border="1.5px solid"
						borderColor="gray.200"
						borderRadius="lg"
						px={3}
						color={DARK}
						_focus={{ borderColor: RED, bg: "white", boxShadow: `0 0 0 3px rgba(217,4,4,0.1)` }}
					/>
				</NumberInput>
			</HStack>
		</Flex>
	);
}

export default function CreateQuotePage() {
	const pdfRef = useRef();
	const importedRef = useRef(false);
	const toast = useToast();
	const navigate = useNavigate();
	const location = useLocation();
	const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
	const [successData, setSuccessData] = useState(null);

	const [user, setUser] = useState(null);
	const isSuperAdmin = user?.role === "super_admin";
	const [selectedWebsiteId, setSelectedWebsiteId] = useState("");

	const [isGenerating, setIsGenerating] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: websites = [] } = useQuery({
		queryKey: ["websites", "quote-create"],
		queryFn: async () => {
			const res = await API.get("/websites");
			return res.data?.data || [];
		},
		enabled: isSuperAdmin,
	});

	const [meta, setMeta] = useState({
		refNumber: `AE4U-${Math.floor(800000 + Math.random() * 99999)}`,
		vrm: "",
		vehicleDesc: "",
		engineCode: "",
	});

	const [customer, setCustomer] = useState({ name: "", phone: "", postcode: "" });

	const [lines, setLines] = useState({
		engine: 0,
		exchange: 0,
		delivery: 0,
		recovery: 0,
		fitting: 0,
		vatManual: 0,
	});
	const [recoveryTBC, setRecoveryTBC] = useState(false);
	const [autoVAT, setAutoVAT] = useState(false);

	const [warranty, setWarranty] = useState("6 Months");
	const [condition, setCondition] = useState("Reconditioned");
	const [mileage, setMileage] = useState("");
	const [notes, setNotes] = useState("");

	const subtotal = lines.engine + lines.exchange + lines.delivery + lines.recovery + lines.fitting;
	const vatAmount = autoVAT ? subtotal * 0.2 : lines.vatManual;
	const total = subtotal + vatAmount;

	const setLine = (k, v) => setLines((p) => ({ ...p, [k]: v }));

	useEffect(() => {
		const stored = localStorage.getItem("user");
		if (stored) {
			const parsedUser = JSON.parse(stored);
			setUser(parsedUser);
			if (parsedUser.website_id) {
				setSelectedWebsiteId(parsedUser.website_id);
			}
		}

		const s = location.state;
		if (s?.fromInquiry && s?.customer && !importedRef.current) {
			importedRef.current = true;
			setCustomer({
				name: s.customer.name || "",
				phone: s.customer.phone || "",
				postcode: s.customer.address || "",
			});
			if (s.inquiryMeta) {
				setMeta((p) => ({
					...p,
					vrm: s.inquiryMeta.vrm || "",
					vehicleDesc: s.inquiryMeta.vehicleDescription || "",
					engineCode: s.inquiryMeta.engineCode || "",
				}));
			}
			if (s.quoteNotes) setNotes(s.quoteNotes);
			toast({
				title: "Inquiry imported",
				description: "Customer details pre-filled.",
				status: "success",
				duration: 2500,
				position: "top-right",
			});
		}
	}, [navigate, toast]); // eslint-disable-line

	const handlePDF = async () => {
		if (!customer.name) {
			toast({ title: "Customer name required", status: "warning", position: "top-right" });
			return;
		}
		setIsGenerating(true);
		try {
			const canvas = await html2canvas(pdfRef.current, {
				scale: 2,
				useCORS: true,
				backgroundColor: "#ffffff",
			});
			const img = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "mm", "a4");
			const w = pdf.internal.pageSize.getWidth();
			pdf.addImage(img, "PNG", 0, 0, w, (canvas.height * w) / canvas.width);
			pdf.save(`Quote_${meta.refNumber}_${customer.name.replace(/\s+/g, "_")}.pdf`);
			toast({ title: "PDF downloaded", status: "success", duration: 2000, position: "top-right" });
		} catch {
			toast({ title: "PDF error", status: "error" });
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSendQuote = async () => {
		if (!customer.name?.trim()) {
			toast({
				title: "Customer name required",
				status: "warning",
				position: "top-right",
			});
			return;
		}

		if (isSuperAdmin && !selectedWebsiteId) {
			toast({
				title: "Select a website first",
				status: "warning",
				position: "top-right",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const payload = {
				website_id: selectedWebsiteId || user?.website_id,
				refNumber: meta.refNumber,
				customer: {
					name: customer.name,
					phone: customer.phone,
					postcode: customer.postcode,
				},
				vehicle: {
					vrm: meta.vrm,
					vehicleDesc: meta.vehicleDesc,
					engineCode: meta.engineCode,
				},
				pricing: {
					engine: lines.engine,
					exchange: lines.exchange,
					delivery: lines.delivery,
					recovery: lines.recovery,
					fitting: lines.fitting,
					vat: vatAmount,
					subtotal,
					total,
					autoVAT,
					recoveryTBC,
				},
				warranty,
				condition,
				mileage,
				notes,
				status: "Sent",
			};

			const res = await API.post("/quotes", payload);
			setSuccessData({ ...payload, _id: res.data?.data?._id || res.data?._id });

			onSuccessOpen();

		} catch (error) {
			toast({
				title: "Failed to create quote",
				description: error.response?.data?.message || "Please try again",
				status: "error",
				position: "top-right",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSuccessClose = () => {
		onSuccessClose();
		navigate("/dashboard", { state: { defaultModule: "inquiries" }, replace: true });
	};

	return (
		<Box bg="#F8FAFC" minH="100vh">
			{/* ── Top Bar ── */}
			<Box
				bg={DARK}
				px={8}
				py={4}
				position="sticky"
				top={0}
				zIndex={10}
				boxShadow="0 4px 20px rgba(0,0,0,0.3)"
			>
				<Flex align="center" justify="space-between" maxW="1400px" mx="auto">
					<HStack spacing={4}>
						<Button
							leftIcon={<ArrowBackIcon />}
							variant="ghost"
							color="whiteAlpha.700"
							_hover={{ color: "white", bg: "whiteAlpha.100" }}
							size="sm"
							onClick={() => navigate(-1)}
						>
							Back
						</Button>
						<Box w="1px" h="20px" bg="whiteAlpha.200" />
						<HStack spacing={3}>
							<Icon as={FileText} color={RED} size={18} />
							<Text color="white" fontWeight="800" fontSize="16px">
								Create Quotation
							</Text>
						</HStack>
						<Badge
							bg="rgba(217,4,4,0.2)"
							color={RED}
							px={3}
							py={1}
							borderRadius="full"
							fontSize="12px"
							fontWeight="700"
						>
							Ref: {meta.refNumber}
						</Badge>
					</HStack>

					<HStack spacing={3}>
						<Button
							leftIcon={<DownloadIcon />}
							variant="outline"
							borderColor="whiteAlpha.300"
							color="white"
							_hover={{ bg: "whiteAlpha.100" }}
							size="sm"
							onClick={handlePDF}
							isLoading={isGenerating}
							loadingText="Generating..."
						>
							Download PDF
						</Button>
						<Button
							leftIcon={<Icon as={Send} size={14} />}
							bg={RED}
							color="white"
							_hover={{
								bg: "#c00404",
								transform: "translateY(-1px)",
								boxShadow: "0 4px 15px rgba(217,4,4,0.4)",
							}}
							transition="all 0.2s"
							size="sm"
							px={6}
							onClick={handleSendQuote}
							isLoading={isSubmitting}
							loadingText="Sending..."
						>
							Send Quote
						</Button>
					</HStack>
				</Flex>
			</Box>

			<Box maxW="1400px" mx="auto" px={8} py={8}>
				<Box ref={pdfRef}>
					{isSuperAdmin && (
						<Box
							bg="white"
							borderRadius="2xl"
							p={6}
							mb={6}
							boxShadow="0 4px 20px rgba(0,0,0,0.06)"
							border="1px solid"
							borderColor="gray.100"
						>
							<HStack spacing={2} mb={4}>
								<Box bg={`${RED}15`} p={2} borderRadius="lg">
									<Icon as={User} color={RED} size={16} />
								</Box>
								<Text fontWeight="800" fontSize="15px" color={DARK}>
									Quote Website
								</Text>
							</HStack>
							<Text
								fontSize="11px"
								fontWeight="700"
								color="gray.500"
								textTransform="uppercase"
								letterSpacing="0.5px"
								mb={1.5}
							>
								Assign Quote To Website
							</Text>
							<Select
								value={selectedWebsiteId}
								onChange={(e) => setSelectedWebsiteId(e.target.value)}
								placeholder="Select a website"
								borderRadius="xl"
								borderColor="gray.200"
								_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
							>
								{websites.map((site) => (
									<option key={site._id} value={site._id}>
										{site.name}
										{site.domain ? ` (${site.domain})` : ""}
									</option>
								))}
							</Select>
						</Box>
					)}

					{/* ── Vehicle Hero ── */}
					<Box
						bg={DARK}
						borderRadius="2xl"
						p={6}
						mb={6}
						bgGradient={`linear(135deg, ${DARK} 0%, #1E293B 100%)`}
						boxShadow="0 8px 32px rgba(15,23,42,0.3)"
						border="1px solid rgba(255,255,255,0.07)"
					>
						<Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
							<HStack spacing={6} flex={1}>
								<Box>
									<Text
										fontSize="11px"
										color="whiteAlpha.500"
										fontWeight="700"
										textTransform="uppercase"
										letterSpacing="1px"
										mb={1}
									>
										Registration
									</Text>
									<Input
										value={meta.vrm}
										onChange={(e) => setMeta((p) => ({ ...p, vrm: e.target.value.toUpperCase() }))}
										placeholder="AB12 CDE"
										size="sm"
										w="120px"
										bg="whiteAlpha.100"
										border="1px solid"
										borderColor="whiteAlpha.200"
										color="white"
										fontWeight="800"
										textTransform="uppercase"
										letterSpacing="2px"
										_placeholder={{ color: "whiteAlpha.300" }}
										_focus={{ borderColor: RED, bg: "whiteAlpha.200" }}
										borderRadius="lg"
									/>
								</Box>
								<Box flex={1}>
									<Text
										fontSize="11px"
										color="whiteAlpha.500"
										fontWeight="700"
										textTransform="uppercase"
										letterSpacing="1px"
										mb={1}
									>
										Vehicle Description
									</Text>
									<Input
										value={meta.vehicleDesc}
										onChange={(e) => setMeta((p) => ({ ...p, vehicleDesc: e.target.value }))}
										placeholder="e.g. VOLVO XC60 SE 2.4D 2010 DIESEL 2400CC"
										size="sm"
										bg="whiteAlpha.100"
										border="1px solid"
										borderColor="whiteAlpha.200"
										color="white"
										fontWeight="600"
										_placeholder={{ color: "whiteAlpha.300" }}
										_focus={{ borderColor: RED, bg: "whiteAlpha.200" }}
										borderRadius="lg"
									/>
								</Box>
								<Box w="130px">
									<Text
										fontSize="11px"
										color="whiteAlpha.500"
										fontWeight="700"
										textTransform="uppercase"
										letterSpacing="1px"
										mb={1}
									>
										Engine Code
									</Text>
									<Input
										value={meta.engineCode}
										onChange={(e) =>
											setMeta((p) => ({ ...p, engineCode: e.target.value.toUpperCase() }))
										}
										placeholder="D5244T"
										size="sm"
										bg="whiteAlpha.100"
										border="1px solid"
										borderColor="whiteAlpha.200"
										color="white"
										fontWeight="700"
										textTransform="uppercase"
										_placeholder={{ color: "whiteAlpha.300" }}
										_focus={{ borderColor: RED, bg: "whiteAlpha.200" }}
										borderRadius="lg"
									/>
								</Box>
							</HStack>
							<UKPlate vrm={meta.vrm} />
						</Flex>
					</Box>

					{/* ── Customer + Quote side by side ── */}
					<SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
						{/* Customer card */}
						<Box
							bg="white"
							borderRadius="2xl"
							p={6}
							boxShadow="0 4px 20px rgba(0,0,0,0.06)"
							border="1px solid"
							borderColor="gray.100"
						>
							<HStack spacing={2} mb={5}>
								<Box bg={`${RED}15`} p={2} borderRadius="lg">
									<Icon as={User} color={RED} size={16} />
								</Box>
								<Text fontWeight="800" fontSize="15px" color={DARK}>
									Customer Details
								</Text>
							</HStack>
							<VStack spacing={4} align="stretch">
								<Box>
									<Text
										fontSize="11px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="0.5px"
										mb={1.5}
									>
										Full Name
									</Text>
									<Input
										value={customer.name}
										onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
										placeholder="John Smith"
										size="md"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
										fontWeight="600"
									/>
								</Box>
								<Box>
									<Text
										fontSize="11px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="0.5px"
										mb={1.5}
									>
										Phone Number
									</Text>
									<Input
										value={customer.phone}
										onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))}
										placeholder="+44 7700 900000"
										size="md"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
									/>
								</Box>
								<Box>
									<Text
										fontSize="11px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="0.5px"
										mb={1.5}
									>
										Postcode / Address
									</Text>
									<Input
										value={customer.postcode}
										onChange={(e) => setCustomer((p) => ({ ...p, postcode: e.target.value }))}
										placeholder="SW1A 1AA"
										size="md"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
									/>
								</Box>
							</VStack>
						</Box>

						{/* Terms card */}
						<Box
							bg="white"
							borderRadius="2xl"
							p={6}
							boxShadow="0 4px 20px rgba(0,0,0,0.06)"
							border="1px solid"
							borderColor="gray.100"
						>
							<HStack spacing={2} mb={5}>
								<Box bg={`${RED}15`} p={2} borderRadius="lg">
									<Icon as={Wrench} color={RED} size={16} />
								</Box>
								<Text fontWeight="800" fontSize="15px" color={DARK}>
									Terms & Condition
								</Text>
							</HStack>
							<VStack spacing={4} align="stretch">
								<Box>
									<Text
										fontSize="11px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="0.5px"
										mb={1.5}
									>
										Warranty
									</Text>
									<Select
										value={warranty}
										onChange={(e) => setWarranty(e.target.value)}
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{ borderColor: RED }}
									>
										<option>None</option>
										<option>3 Months</option>
										<option>6 Months</option>
										<option>12 Months</option>
										<option>24 Months</option>
									</Select>
								</Box>
								<Box>
									<Text
										fontSize="11px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="0.5px"
										mb={1.5}
									>
										Condition
									</Text>
									<Select
										value={condition}
										onChange={(e) => setCondition(e.target.value)}
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{ borderColor: RED }}
									>
										<option>Used</option>
										<option>New</option>
										<option>Reconditioned</option>
										<option>Remanufactured</option>
									</Select>
								</Box>
								<Box>
									<Text
										fontSize="11px"
										fontWeight="700"
										color="gray.500"
										textTransform="uppercase"
										letterSpacing="0.5px"
										mb={1.5}
									>
										Mileage
									</Text>
									<Input
										value={mileage}
										onChange={(e) => setMileage(e.target.value)}
										placeholder="e.g. 45000"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
									/>
								</Box>
							</VStack>
						</Box>

						{/* Notes card */}
						<Box
							bg="white"
							borderRadius="2xl"
							p={6}
							boxShadow="0 4px 20px rgba(0,0,0,0.06)"
							border="1px solid"
							borderColor="gray.100"
						>
							<HStack spacing={2} mb={5}>
								<Box bg={`${RED}15`} p={2} borderRadius="lg">
									<Icon as={FileText} color={RED} size={16} />
								</Box>
								<Text fontWeight="800" fontSize="15px" color={DARK}>
									Quote Notes
								</Text>
							</HStack>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Additional notes, terms, or special conditions for this quotation..."
								h="calc(100% - 48px)"
								minH="160px"
								borderRadius="xl"
								borderColor="gray.200"
								fontSize="13px"
								resize="none"
								_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
							/>
						</Box>
					</SimpleGrid>

					{/* ── Line Items Card ── */}
					<Box
						bg="white"
						borderRadius="2xl"
						boxShadow="0 4px 20px rgba(0,0,0,0.06)"
						border="1px solid"
						borderColor="gray.100"
						overflow="hidden"
						mb={6}
					>
						{/* Table header */}
						<Flex bg={DARK} px={6} py={4} align="center" justify="space-between">
							<Text color="white" fontWeight="800" fontSize="15px" letterSpacing="0.5px">
								Price Breakdown
							</Text>
							<Text color="whiteAlpha.500" fontSize="12px">
								Enter amounts in GBP (£)
							</Text>
						</Flex>

						{/* Column labels */}
						<Flex px={6} py={2} bg="gray.50" borderBottom="1px solid" borderColor="gray.100">
							<Text
								flex={1}
								fontSize="11px"
								fontWeight="700"
								color="gray.400"
								textTransform="uppercase"
								letterSpacing="1px"
							>
								Item
							</Text>
							<Text
								minW="140px"
								textAlign="right"
								fontSize="11px"
								fontWeight="700"
								color="gray.400"
								textTransform="uppercase"
								letterSpacing="1px"
							>
								Amount
							</Text>
						</Flex>

						<LineRow label="Engine" value={lines.engine} onChange={(v) => setLine("engine", v)} />
						<LineRow
							label="Exchange Surcharge"
							sublabel="Refundable deposit"
							value={lines.exchange}
							onChange={(v) => setLine("exchange", v)}
						/>
						<LineRow
							label="Delivery Charges"
							value={lines.delivery}
							onChange={(v) => setLine("delivery", v)}
						/>
						<LineRow
							label="Recovery / Pickup"
							value={lines.recovery}
							onChange={(v) => setLine("recovery", v)}
							hasTBC
							tbcVal={recoveryTBC}
							onTBC={setRecoveryTBC}
						/>
						<LineRow
							label="Fitting"
							value={lines.fitting}
							onChange={(v) => setLine("fitting", v)}
						/>
						<LineRow
							label="VAT"
							sublabel={autoVAT ? "Auto-calculated at 20%" : "Manual entry"}
							value={autoVAT ? parseFloat(vatAmount.toFixed(2)) : lines.vatManual}
							onChange={(v) => {
								if (!autoVAT) setLine("vatManual", v);
							}}
							hasVAT
							vatVal={autoVAT}
							onVAT={(v) => {
								setAutoVAT(v);
								if (!v) setLine("vatManual", 0);
							}}
						/>

						{/* Totals */}
						<Box bg="gray.50" borderTop="2px solid" borderColor="gray.100">
							<Flex
								px={6}
								py={3}
								align="center"
								justify="space-between"
								borderBottom="1px solid"
								borderColor="gray.100"
							>
								<Text fontSize="13px" fontWeight="600" color="gray.500">
									Subtotal
								</Text>
								<Text fontSize="14px" fontWeight="700" color={DARK}>
									£ {subtotal.toFixed(2)}
								</Text>
							</Flex>
							<Flex
								px={6}
								py={3}
								align="center"
								justify="space-between"
								borderBottom="1px solid"
								borderColor="gray.100"
							>
								<Text fontSize="13px" fontWeight="600" color="gray.500">
									VAT {autoVAT ? "(20%)" : ""}
								</Text>
								<Text fontSize="14px" fontWeight="700" color={DARK}>
									£ {vatAmount.toFixed(2)}
								</Text>
							</Flex>
							<Flex px={6} py={4} align="center" justify="space-between">
								<Text
									fontSize="16px"
									fontWeight="800"
									color={DARK}
									textTransform="uppercase"
									letterSpacing="0.5px"
								>
									Total Amount
								</Text>
								<Box
									bg={RED}
									px={6}
									py={2}
									borderRadius="xl"
									boxShadow="0 4px 15px rgba(217,4,4,0.3)"
								>
									<Text fontSize="22px" fontWeight="900" color="white" letterSpacing="-0.5px">
										£ {total.toFixed(2)}
									</Text>
								</Box>
							</Flex>
						</Box>
					</Box>

					{/* ── Action Row ── */}
					<Flex justify="flex-end" gap={3}>
						<Button
							variant="outline"
							borderColor="gray.300"
							color="gray.600"
							_hover={{ bg: "gray.50" }}
							borderRadius="xl"
							px={8}
							h="48px"
							onClick={() => navigate(-1)}
						>
							Cancel
						</Button>
						<Button
							leftIcon={<DownloadIcon />}
							variant="outline"
							borderColor={DARK}
							color={DARK}
							_hover={{ bg: DARK, color: "white" }}
							transition="all 0.2s"
							borderRadius="xl"
							px={8}
							h="48px"
							fontWeight="700"
							onClick={handlePDF}
							isLoading={isGenerating}
						>
							Download PDF
						</Button>
						<Button
							leftIcon={<Icon as={Send} size={16} />}
							bg={RED}
							color="white"
							_hover={{
								bg: "#c00404",
								transform: "translateY(-2px)",
								boxShadow: "0 8px 25px rgba(217,4,4,0.4)",
							}}
							transition="all 0.2s"
							borderRadius="xl"
							px={10}
							h="48px"
							fontWeight="800"
							fontSize="15px"
							letterSpacing="0.5px"
							onClick={handleSendQuote}
							isLoading={isSubmitting}
							loadingText="Sending..."
						>
							Send Quote
						</Button>
					</Flex>
				</Box>
			</Box>

			{/* Success Modal */}
			<Modal
				isOpen={isSuccessOpen}
				onClose={handleSuccessClose}
				isCentered
				size="md"
				closeOnOverlayClick={false}
			>
				<ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
				<ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
					<ModalBody p={10}>
						<VStack spacing={6}>
							<Box bg="green.50" p={5} borderRadius="full">
								<Icon as={CheckCircle} color="green.500" size={48} />
							</Box>
							<VStack spacing={2} textAlign="center">
								<Text fontSize="24px" fontWeight="900" color={DARK}>
									Quote Created!
								</Text>
								<Text color="gray.500" fontSize="15px">
									Reference:{" "}
									<Text as="span" fontWeight="800" color={RED}>
										{successData?.refNumber}
									</Text>
								</Text>
								<Text color="gray.500" fontSize="14px">
									The quotation has been saved and is now visible in the history.
								</Text>
							</VStack>

							<VStack w="full" spacing={3} pt={4}>
								<Button
									w="full"
									h="54px"
									borderRadius="2xl"
									bg={DARK}
									color="white"
									_hover={{ bg: "#1e293b", transform: "translateY(-2px)" }}
									onClick={handleSuccessClose}
									fontWeight="800"
								>
									Go to Inquiries
								</Button>
								<Button
									w="full"
									h="54px"
									borderRadius="2xl"
									variant="outline"
									borderColor="gray.200"
									color="gray.600"
									onClick={() => {
										onSuccessClose();
										window.location.reload();
									}}
									fontWeight="700"
								>
									Create Another Quote
								</Button>
							</VStack>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
}
