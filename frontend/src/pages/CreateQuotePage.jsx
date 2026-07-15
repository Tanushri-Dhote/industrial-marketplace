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
import autoTable from "jspdf-autotable";

import { CheckCircle, FileText, Send, User, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);
const MotionHStack = motion(HStack);

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

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

			<HStack spacing={3} flexWrap="wrap"
				justify={{ base: "center", md: "flex-end" }}>
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

	const [customer, setCustomer] = useState({ name: "", email: "", phone: "+44 ", postcode: "" });

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
				email: s.customer.email || "",
				phone: s.customer.phone || "+44 ",
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
			const doc = new jsPDF("p", "mm", "a4");

			// Helper to load image and get base64
			const getBase64Image = (url) => {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.setAttribute("crossOrigin", "anonymous");
					img.onload = () => {
						const canvas = document.createElement("canvas");
						canvas.width = img.width;
						canvas.height = img.height;
						const ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0);
						resolve(canvas.toDataURL("image/png"));
					};
					img.onerror = (e) => reject(e);
					img.src = url;
				});
			};

			let logoBase64 = null;
			try {
				logoBase64 = await getBase64Image("/logo.png");
			} catch (err) {
				console.warn("Could not load logo for PDF:", err);
			}

			const pageWidth = doc.internal.pageSize.getWidth();
			const pageHeight = doc.internal.pageSize.getHeight();
			const leftMargin = 14;
			let y = 20;

			// --- Watermark ---
			doc.setTextColor(240, 240, 240);
			doc.setFontSize(60);
			doc.setFont("helvetica", "bold");
			doc.saveGraphicsState();
			doc.setGState(new doc.GState({ opacity: 0.1 }));
			doc.text("OFFICIAL QUOTATION", pageWidth / 2, pageHeight / 2, {
				align: "center",
				angle: 45,
			});
			doc.restoreGraphicsState();

			// --- Header ---
			doc.setFillColor(15, 23, 42); // DARK
			doc.rect(0, 0, pageWidth, 45, "F");

			if (logoBase64) {
				doc.addImage(logoBase64, "PNG", leftMargin, 12, 40, 18);
			} else {
				doc.setTextColor(255, 255, 255);
				doc.setFont("helvetica", "bold");
				doc.setFontSize(22);
				doc.text("QUOTATION", leftMargin, 28);
			}

			doc.setTextColor(255, 255, 255);
			doc.setFontSize(10);
			doc.setFont("helvetica", "normal");
			doc.text(`Reference: ${meta.refNumber}`, leftMargin, 38);
			doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, pageWidth - leftMargin, 38, { align: "right" });

			const validUntil = new Date();
			validUntil.setDate(validUntil.getDate() + 30);
			doc.setFont("helvetica", "bold");
			doc.text(`Valid Until: ${validUntil.toLocaleDateString("en-GB")}`, pageWidth - leftMargin, 25, { align: "right" });

			if (logoBase64) {
				doc.setFontSize(16);
				doc.text("QUOTATION", pageWidth - leftMargin, 18, { align: "right" });
			}

			y = 55;

			// --- Customer & Vehicle Info ---
			autoTable(doc, {
				startY: y,
				theme: "plain",
				head: [["CLIENT INFORMATION", "VEHICLE SPECIFICATIONS"]],
				body: [
					[
						`Name: ${customer.name}\nPhone: ${customer.phone || "N/A"}\nPostcode: ${customer.postcode || "N/A"}`,
						`Registration: ${meta.vrm || "N/A"}\nEngine Code: ${meta.engineCode || "N/A"}\nDescription: ${meta.vehicleDesc || "N/A"}`,
					],
				],
				styles: { fontSize: 9, cellPadding: 2, textColor: [50, 50, 50] },
				headStyles: { textColor: [217, 4, 4], fontStyle: "bold", fontSize: 10 }, // RED
				columnStyles: {
					0: { cellWidth: (pageWidth - 28) / 2 },
					1: { cellWidth: (pageWidth - 28) / 2 },
				},
			});

			y = doc.lastAutoTable.finalY + 8;

			// --- Items Table ---
			const vatRowLabel = autoVAT ? "VAT (20%)" : "VAT (Manual)";
			const items = [
				["Engine / Component Assembly", `£ ${Number(lines.engine || 0).toFixed(2)}`],
				["Exchange Surcharge (Refundable)", `£ ${Number(lines.exchange || 0).toFixed(2)}`],
				["Logistics & Delivery", `£ ${Number(lines.delivery || 0).toFixed(2)}`],
				[`Recovery Service${recoveryTBC ? " (TBC)" : ""}`, `£ ${Number(lines.recovery || 0).toFixed(2)}`],
				["Professional Installation / Fitting", `£ ${Number(lines.fitting || 0).toFixed(2)}`],
			];

			autoTable(doc, {
				startY: y,
				head: [["Service Description", "Amount"]],
				body: items,
				theme: "striped",
				headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold" },
				alternateRowStyles: { fillColor: [245, 247, 250] },
				columnStyles: {
					0: { cellWidth: "auto" },
					1: { halign: "right", cellWidth: 40, fontStyle: "bold" },
				},
				styles: { fontSize: 10, cellPadding: 4 },
			});

			y = doc.lastAutoTable.finalY + 5;

			// --- Totals ---
			autoTable(doc, {
				startY: y,
				body: [
					["Subtotal", `£ ${Number(subtotal || 0).toFixed(2)}`],
					[vatRowLabel, `£ ${Number(vatAmount || 0).toFixed(2)}`],
					["GRAND TOTAL", `£ ${Number(total || 0).toFixed(2)}`],
				],
				theme: "plain",
				columnStyles: {
					0: { halign: "right", fontStyle: "bold", textColor: [100, 100, 100] },
					1: { halign: "right", fontStyle: "bold", cellWidth: 40 },
				},
				styles: { fontSize: 10 },
				didParseCell: (data) => {
					if (data.row.index === 2) {
						data.cell.styles.fontSize = 14;
						data.cell.styles.textColor = [217, 4, 4]; // RED
						data.cell.styles.fillColor = [255, 240, 240];
					}
				},
				margin: { left: pageWidth - 100 },
			});

			y = doc.lastAutoTable.finalY + 12;

			// --- Warranty & Terms ---
			doc.setFillColor(248, 250, 252);
			doc.rect(leftMargin, y, pageWidth - leftMargin * 2, 25, "F");

			doc.setFont("helvetica", "bold");
			doc.setFontSize(10);
			doc.setTextColor(15, 23, 42);
			doc.text("WARRANTY & CONDITION", leftMargin + 5, y + 8);

			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.text(`Warranty: ${warranty}`, leftMargin + 5, y + 15);
			doc.text(`Condition: ${condition}`, leftMargin + 65, y + 15);
			if (mileage) doc.text(`Mileage: ${mileage}`, leftMargin + 125, y + 15);

			y += 32;
			if (notes?.trim()) {
				doc.setFont("helvetica", "bold");
				doc.text("ADDITIONAL NOTES & TERMS:", leftMargin, y);
				y += 5;
				doc.setFont("helvetica", "normal");
				doc.setFontSize(9);
				const splitNotes = doc.splitTextToSize(notes, pageWidth - leftMargin * 2);
				doc.text(splitNotes, leftMargin, y);
				y += splitNotes.length * 5 + 10;
			}




			// --- Footer ---
			doc.setFillColor(15, 23, 42);
			doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
			doc.setFontSize(7);
			doc.setTextColor(200, 200, 200);
			doc.text(
				"TERMS: This quotation is valid for 30 days. Prices include VAT unless specified. Subject to our standard terms of trade.",
				pageWidth / 2,
				pageHeight - 7,
				{ align: "center" }
			);

			doc.save(`Quote_${meta.refNumber}_${customer.name.replace(/\s+/g, "_")}.pdf`);
			toast({ title: "PDF downloaded", status: "success", duration: 2000, position: "top-right" });
		} catch (err) {
			console.error("PDF Generation Error:", err);
			toast({
				title: "PDF error",
				description: "Could not generate PDF. Check console for details.",
				status: "error"
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSendQuote = async () => {
		if (!customer.name?.trim()) {
			toast({ title: "Customer name required", status: "warning", position: "top-right" });
			return;
		}

		if (customer.phone && customer.phone.trim() !== "" && customer.phone.trim() !== "+44") {
			const cleanedPhone = customer.phone.replace(/\s+/g, "");
			const ukPhoneRegex = /^(?:(?:\+44\s?|0)[12378]\d{8,9})$/;
			if (!ukPhoneRegex.test(cleanedPhone)) {
				toast({ title: "Invalid UK phone number", status: "warning", position: "top-right" });
				return;
			}
		}

		if (customer.postcode && customer.postcode.trim() !== "") {
			const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
			if (!ukPostcodeRegex.test(customer.postcode.trim())) {
				toast({ title: "Invalid UK postcode", status: "warning", position: "top-right" });
				return;
			}
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
					email: customer.email,
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
			<MotionBox
				bg="rgba(15, 23, 42, 0.85)"
				backdropFilter="blur(12px)"
				px={{ base: 3, md: 8 }}
				py={{ base: 3, md: 4 }}
				position="sticky"
				top={0}
				zIndex={10}
				boxShadow="0 4px 30px rgba(0,0,0,0.1)"
				borderBottom="1px solid rgba(255,255,255,0.08)"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "stretch", md: "center" }}
					justify="space-between"
					gap={{ base: 4, md: 0 }}
					maxW="1400px"
					mx="auto"
				>					<HStack spacing={4}>
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
						<HStack spacing={3} flexWrap="wrap"
							justify={{ base: "center", md: "flex-end" }}>
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

					<HStack spacing={3} flexWrap="wrap"
						justify={{ base: "center", md: "flex-end" }}>
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
			</MotionBox>

			<Box maxW="1400px" mx="auto" px={{ base: 3, sm: 4, md: 8 }} py={{ base: 4, md: 8 }}>
				<MotionBox ref={pdfRef} variants={staggerContainer} initial="initial" animate="animate">
					{isSuperAdmin && (
						<MotionBox
							bg="white"
							borderRadius="2xl"
							p={6}
							mb={6}
							boxShadow="0 4px 20px rgba(0,0,0,0.06)"
							border="1px solid"
							borderColor="gray.100"
							variants={fadeInUp}
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
						</MotionBox>
					)}

					{/* ── Vehicle Hero ── */}
					<MotionBox
						bg={DARK}
						borderRadius="2xl"
						p={6}
						mb={6}
						bgGradient={`linear(135deg, ${DARK} 0%, #1E293B 100%)`}
						boxShadow="0 8px 32px rgba(15,23,42,0.3)"
						border="1px solid rgba(255,255,255,0.07)"
						variants={fadeInUp}
					>
						<Flex
							direction={{ base: "column", lg: "row" }}
							align={{ base: "stretch", lg: "center" }}
							justify="space-between"
							gap={4}
						>
							<Flex
								direction={{ base: "column", md: "row" }}
								gap={4}
								flex={1}
								w="full"
							>
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
								<Box w={{ base: "full", md: "130px" }}>
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
										w={{ base: "full", md: "120px" }}
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
							</Flex>
							<UKPlate vrm={meta.vrm} />
						</Flex>
					</MotionBox>

					{/* ── Customer + Quote side by side ── */}
					<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} mb={6}>
						{/* Customer card */}
						<MotionBox
							bg="white"
							borderRadius="2xl"
							p={6}
							boxShadow="0 10px 30px -10px rgba(0,0,0,0.05)"
							border="1px solid"
							borderColor="gray.100"
							variants={fadeInUp}
							whileHover={{
								y: -4,
								boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
								borderColor: `${RED}30`
							}}
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
										_focus={{
											borderColor: RED,
											boxShadow: `0 0 0 3px ${RED}15`,
											bg: "white"
										}}
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
										onChange={(e) => {
											let val = e.target.value.replace(/[^\d+]/g, "");
											if (val.startsWith("0")) val = "+44" + val.substring(1);
											if (val.length > 0 && !val.startsWith("+")) val = "+44" + val;

											let formatted = val;
											if (val.startsWith("+44")) {
												let rest = val.substring(3);
												if (rest.length > 0) {
													formatted = "+44 " + rest.substring(0, 4);
													if (rest.length > 4) {
														formatted += " " + rest.substring(4, 10);
													}
												}
											}
											setCustomer((p) => ({ ...p, phone: formatted }));
										}}
										placeholder="+44 7700 900000"
										size="md"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{
											borderColor: RED,
											boxShadow: `0 0 0 3px ${RED}15`,
											bg: "white"
										}}
									/>
									<Text fontSize="10px" color="gray.400" mt={1} ml={1} fontWeight="600">
										Format: +44 7XXX XXXXXX
									</Text>
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
										Email Address
									</Text>
									<Input
										value={customer.email || ""}
										onChange={(e) => setCustomer((p) => ({ ...p, email: e.target.value }))}
										placeholder="customer@example.com"
										size="md"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{
											borderColor: RED,
											boxShadow: `0 0 0 3px ${RED}15`,
											bg: "white"
										}}
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
										Postcode / Address
									</Text>
									<Input
										value={customer.postcode}
										onChange={(e) => setCustomer((p) => ({ ...p, postcode: e.target.value }))}
										placeholder="SW1A 1AA"
										size="md"
										borderRadius="xl"
										borderColor="gray.200"
										_focus={{
											borderColor: RED,
											boxShadow: `0 0 0 3px ${RED}15`,
											bg: "white"
										}}
									/>
								</Box>
							</VStack>
						</MotionBox>

						{/* Terms card */}
						<MotionBox
							bg="white"
							borderRadius="2xl"
							p={6}
							boxShadow="0 10px 30px -10px rgba(0,0,0,0.05)"
							border="1px solid"
							borderColor="gray.100"
							variants={fadeInUp}
							whileHover={{
								y: -4,
								boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
								borderColor: `${RED}30`
							}}
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
										_focus={{
											borderColor: RED,
											boxShadow: `0 0 0 3px ${RED}15`,
											bg: "white"
										}}
									/>
								</Box>
							</VStack>
						</MotionBox>

						{/* Notes card */}
						<MotionBox
							bg="white"
							borderRadius="2xl"
							p={6}
							boxShadow="0 10px 30px -10px rgba(0,0,0,0.05)"
							border="1px solid"
							borderColor="gray.100"
							variants={fadeInUp}
							whileHover={{
								y: -4,
								boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
								borderColor: `${RED}30`
							}}
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
								h={{ base: "180px", md: "calc(100% - 48px)" }}
								minH="180px"
								borderRadius="xl"
								borderColor="gray.200"
								fontSize="13px"
								resize="none"
								_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
							/>
						</MotionBox>
					</SimpleGrid>

					{/* ── Line Items Card ── */}
					<MotionBox
						bg="white"
						overflowX="auto"
						borderRadius="2xl"
						boxShadow="0 4px 20px rgba(0,0,0,0.06)"
						border="1px solid"
						borderColor="gray.100"
						overflow="hidden"
						mb={6}
						variants={fadeInUp}
					>
						{/* Table header */}
						<Flex
							bg="rgba(15, 23, 42, 0.9)"
							backdropFilter="blur(8px)"
							px={6}
							py={4}
							align="center"
							justify="space-between"
						>
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
									bgGradient={`linear(to-r, ${RED}, #FF4D4D)`}
									px={6}
									py={2.5}
									borderRadius="xl"
									boxShadow={`0 10px 20px -5px ${RED}50`}
									transform="scale(1.02)"
									transition="all 0.2s"
									_hover={{ transform: "scale(1.05)" }}
								>
									<Text fontSize="24px" fontWeight="900" color="white" letterSpacing="-0.5px">
										£ {total.toFixed(2)}
									</Text>
								</Box>
							</Flex>
						</Box>
					</MotionBox>

				{/* ── Action Row ── */}
				<MotionFlex
					direction={{ base: "column", sm: "row" }}
					justify={{ base: "stretch", md: "flex-end" }}
					align="center"
					gap={3}
					wrap="wrap"
					variants={fadeInUp}
				>
					<Button
						w={{ base: "full", sm: "auto" }}
						minW={{ md: "130px" }}
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
						w={{ base: "full", sm: "auto" }}
						minW={{ md: "170px" }}
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
						w={{ base: "full", sm: "auto" }}
						minW={{ md: "170px" }}
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

				</MotionFlex>
			</MotionBox>
		</Box>

			{/* Success Modal */ }
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
		</Box >
	);
}
