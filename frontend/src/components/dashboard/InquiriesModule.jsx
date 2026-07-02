import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	IconButton,
	HStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	useToast,
	Badge,
	Box,
	VStack,
	Text,
	Icon,
	InputGroup,
	InputLeftElement,
	Input,
	Spinner,
	Center,
	Flex,
	SimpleGrid,
	Button,
	Divider,
	Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import {
	MessageSquare,
	Mail,
	Phone,
	MapPin,
	ClipboardList,
	Car,
	Settings,
	FileText,
	EyeOff,
	Eye,
	Briefcase,
	CheckCircle,
} from "lucide-react";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { canModify } from "../../utils/permissions";

const DARK = "#0F172A";
const RED = "#D90404";
const PLATE_YELLOW = "#F5C518";

const STORAGE_KEY = "inquiry_statuses"; // { [id]: "enquiry" | "quoted" | "job" | "hidden" }

function loadStatuses() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
	} catch {
		return {};
	}
}
function saveStatuses(s) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const mapInquiryFromApi = (inquiry) => ({
	id: inquiry._id,
	registrationNumber: inquiry.registrationNumber || "—",
	brand: inquiry.brand || "",
	model: inquiry.model || "",
	year: inquiry.year || "",
	engineType: inquiry.engineType || "",
	category: inquiry.category || "—",
	engineOptions: inquiry.engineOptions || [],
	fittingOptions: inquiry.fittingOptions || [],
	postcode: inquiry.postcode || "—",
	notes: inquiry.notes || "",
	name: inquiry.name || "—",
	email: inquiry.email || "—",
	phone: inquiry.phone || "—",
	date: inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "—",
	refNumber: inquiry._id?.slice(-6).toUpperCase() || "——",
});

function UKPlate({ vrm }) {
	return (
		<Flex
			display="inline-flex"
			align="center"
			bg={PLATE_YELLOW}
			border="2px solid"
			borderColor={DARK}
			borderRadius="6px"
			overflow="hidden"
			h="28px"
			boxShadow="0 2px 6px rgba(0,0,0,0.15)"
		>
			<Flex bg={DARK} h="100%" w="22px" flexDir="column" align="center" justify="center">
				<Text color="white" fontSize="5px" fontWeight="900">
					GB
				</Text>
				<Text color={PLATE_YELLOW} fontSize="7px">
					★
				</Text>
			</Flex>
			<Text
				px={2}
				fontSize="12px"
				fontWeight="900"
				letterSpacing="1.5px"
				color={DARK}
				fontFamily="'Arial Black', sans-serif"
			>
				{vrm || "—"}
			</Text>
		</Flex>
	);
}

const TABS = [
	{ key: "enquiry", label: "Enquiries", icon: MessageSquare, color: "red" },
	{ key: "quoted", label: "My Quotes", icon: FileText, color: "red" },
	{ key: "job", label: "My Jobs", icon: Briefcase, color: "red" },
	{ key: "hidden", label: "Hidden", icon: EyeOff, color: "gray" },
];

export default function InquiriesModule({ moduleId }) {
	const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
	const currentRole = currentUser.role || "viewer";
	const isViewer = currentRole === "viewer" || currentRole === "Viewer";

	const [inquiries, setInquiries] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("enquiry");
	const [statuses, setStatuses] = useState(loadStatuses);

	// Sync active tab with dashboard moduleId
	useEffect(() => {
		if (moduleId === "quotes") {
			setActiveTab("quoted");
		} else {
			setActiveTab("enquiry");
		}
	}, [moduleId]);
	const [viewingInquiry, setViewingInquiry] = useState(null);
	const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
	const toast = useToast();
	const navigate = useNavigate();

	const fetchInquiries = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await API.get("/inquiries");
			setInquiries((res.data?.data || []).map(mapInquiryFromApi));
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Failed to load inquiries",
				status: "error",
				position: "top-right",
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchInquiries();
	}, [fetchInquiries]);

	const updateStatus = (id, status) => {
		setStatuses((prev) => {
			const next = { ...prev, [id]: status };
			saveStatuses(next);
			return next;
		});
	};

	const getStatus = (id) => statuses[id] || "enquiry";

	// Counts for tab badges
	const counts = useMemo(() => {
		const c = { enquiry: 0, quoted: 0, job: 0, hidden: 0 };
		inquiries.forEach((i) => {
			const s = getStatus(i.id);
			if (c[s] !== undefined) c[s]++;
		});
		return c;
	}, [inquiries, statuses]); // eslint-disable-line

	const visibleInquiries = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return inquiries
			.filter((i) => getStatus(i.id) === activeTab)
			.filter(
				(i) =>
					!query ||
					i.registrationNumber.toLowerCase().includes(query) ||
					i.name.toLowerCase().includes(query) ||
					i.email.toLowerCase().includes(query) ||
					i.category.toLowerCase().includes(query),
			);
	}, [inquiries, statuses, activeTab, searchTerm]); // eslint-disable-line

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this inquiry permanently?")) return;
		try {
			await API.delete(`/inquiries/${id}`);
			toast({ title: "Inquiry deleted", status: "info", position: "top-right" });
			await fetchInquiries();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Delete failed",
				status: "error",
				position: "top-right",
			});
		}
	};

	const handleHide = (id) => {
		updateStatus(id, "hidden");
		toast({
			title: "Inquiry hidden",
			description: "Find it under the Hidden tab.",
			status: "info",
			duration: 2000,
			position: "top-right",
		});
	};

	const handleUnhide = (id) => {
		updateStatus(id, "enquiry");
		toast({ title: "Inquiry restored", status: "success", duration: 2000, position: "top-right" });
	};

	const handleMarkJob = (id) => {
		updateStatus(id, "job");
		toast({
			title: "Marked as Job",
			description: "Moved to My Jobs tab.",
			status: "success",
			duration: 2000,
			position: "top-right",
		});
	};

	const handleCreateQuote = (inquiry) => {
		updateStatus(inquiry.id, "quoted");
		navigate("/create-quote", {
			state: {
				fromInquiry: true,
				customer: {
					name: inquiry.name,
					email: inquiry.email,
					phone: inquiry.phone,
					company: "",
					address: inquiry.postcode,
				},
				inquiryMeta: {
					vrm: inquiry.registrationNumber,
					vehicleDescription: inquiry.category,
					engineCode: inquiry.engineOptions?.join(", ") || "",
				},
				quoteNotes: [
					`VRM: ${inquiry.registrationNumber}`,
					`Category: ${inquiry.category}`,
					inquiry.engineOptions?.length > 0
						? `Engine Options: ${inquiry.engineOptions.join(", ")}`
						: null,
					inquiry.fittingOptions?.length > 0
						? `Fitting Options: ${inquiry.fittingOptions.join(", ")}`
						: null,
					inquiry.notes ? `Customer Notes: ${inquiry.notes}` : null,
				]
					.filter(Boolean)
					.join("\n"),
			},
		});
	};

	return (
		<ModuleFrame
			icon={MessageSquare}
			title="Vehicle Inquiries"
			description="Manage, quote, and track vehicle inquiries from customers."
		>
			{/* ÔöÇÔöÇ Tab bar ÔöÇÔöÇ */}
			<Flex mb={6} gap={2} p={1.5} bg="gray.100" borderRadius="2xl" align="center" flexWrap="wrap">
				{TABS.map((tab) => {
					const isActive = activeTab === tab.key;
					return (
						<Button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							size="sm"
							h="38px"
							px={5}
							borderRadius="xl"
							fontWeight="700"
							fontSize="13px"
							bg={isActive ? "white" : "transparent"}
							color={isActive ? DARK : "gray.500"}
							boxShadow={isActive ? "0 2px 8px rgba(0,0,0,0.1)" : "none"}
							_hover={{ bg: isActive ? "white" : "gray.200", color: DARK }}
							leftIcon={<Icon as={tab.icon} size={14} />}
							transition="all 0.2s"
						>
							{tab.label}
							{counts[tab.key] > 0 && (
								<Badge
									ml={2}
									bg={isActive ? RED : "gray.300"}
									color={isActive ? "white" : "gray.600"}
									borderRadius="full"
									fontSize="10px"
									px={1.5}
									py={0.5}
								>
									{counts[tab.key]}
								</Badge>
							)}
						</Button>
					);
				})}
				<Box flex={1} />
				<InputGroup maxW="280px">
					<InputLeftElement pointerEvents="none" h="38px">
						<SearchIcon color="gray.400" boxSize={3.5} />
					</InputLeftElement>
					<Input
						placeholder="Search inquiries..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						fontSize="13px"
						h="38px"
						borderRadius="xl"
						bg="white"
						border="1px solid"
						borderColor="gray.200"
						_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
					/>
				</InputGroup>
			</Flex>

			{/* ÔöÇÔöÇ Tab hint ÔöÇÔöÇ */}
			{activeTab === "hidden" && (
				<Box
					bg="gray.50"
					border="1px solid"
					borderColor="gray.200"
					borderRadius="xl"
					px={4}
					py={3}
					mb={4}
				>
					<Text fontSize="13px" color="gray.600" fontWeight="600">
						<Icon as={EyeOff} size={14} style={{ display: "inline", marginRight: 6 }} />
						These inquiries are hidden from your main view. Click <b>Un-Hide</b> to restore them.
					</Text>
				</Box>
			)}

			{activeTab === "quoted" && (
				<Box
					bg="red.50"
					border="1px solid"
					borderColor="red.100"
					borderRadius="xl"
					px={4}
					py={3}
					mb={4}
				>
					<Text fontSize="13px" color={RED} fontWeight="600">
						<Icon as={FileText} size={14} style={{ display: "inline", marginRight: 6 }} />
						Inquiries you have sent a quote for. Mark as <b>Job</b> once the customer accepts.
					</Text>
				</Box>
			)}

			{/* ÔöÇÔöÇ Table ÔöÇÔöÇ */}
			{isLoading ? (
				<Center py={16}>
					<Spinner size="xl" color={RED} thickness="4px" />
				</Center>
			) : visibleInquiries.length === 0 ? (
				<Flex justify="center" py={20}>
					<VStack spacing={3} color="gray.400">
						<Icon as={activeTab === "hidden" ? EyeOff : MessageSquare} size={40} />
						<Text fontWeight="700" fontSize="15px">
							No {TABS.find((t) => t.key === activeTab)?.label} found
						</Text>
						<Text fontSize="13px">
							{activeTab === "hidden" ? "No inquiries hidden." : "Check other tabs or search."}
						</Text>
					</VStack>
				</Flex>
			) : (
				<Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
					<Table variant="simple" size="sm">
						<Thead>
							<Tr bg={DARK}>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
									py={3}
								>
									Ref #
								</Th>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
								>
									VRM
								</Th>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
								>
									Customer
								</Th>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
								>
									Category
								</Th>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
								>
									Location
								</Th>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
								>
									Date
								</Th>
								<Th
									color="whiteAlpha.700"
									fontSize="11px"
									fontWeight="700"
									textTransform="uppercase"
									letterSpacing="1px"
								>
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{visibleInquiries.map((inquiry, idx) => (
								<Tr
									key={inquiry.id}
									bg={idx % 2 === 0 ? "white" : "gray.50"}
									_hover={{ bg: "blue.50" }}
									transition="background 0.15s"
								>
									<Td>
										<Text fontSize="12px" fontWeight="700" color="gray.500" fontFamily="mono">
											{inquiry.refNumber}
										</Text>
									</Td>
									<Td>
										<UKPlate vrm={inquiry.registrationNumber} />
									</Td>
									<Td>
										<VStack align="flex-start" spacing={0}>
											<Text fontSize="13px" fontWeight="700" color={DARK}>
												{inquiry.name}
											</Text>
											<Text fontSize="11px" color="gray.400">
												{inquiry.email}
											</Text>
										</VStack>
									</Td>
									<Td>
										<Badge
											colorScheme="blue"
											variant="subtle"
											fontSize="11px"
											px={2}
											borderRadius="full"
										>
											{inquiry.category}
										</Badge>
									</Td>
									<Td>
										<HStack spacing={1}>
											<Icon as={MapPin} size={12} color="gray.400" />
											<Text fontSize="12px" color="gray.600">
												{inquiry.postcode}
											</Text>
										</HStack>
									</Td>
									<Td fontSize="12px" color="gray.500">
										{inquiry.date}
									</Td>
									<Td>
										<HStack spacing={1}>
											{/* View details */}
											<Tooltip label="View Details" placement="top">
												<IconButton
													icon={<ViewIcon />}
													size="sm"
													variant="ghost"
													color="gray.600"
													_hover={{ bg: "blue.50", color: "blue.600" }}
													onClick={() => {
														setViewingInquiry(inquiry);
														onViewOpen();
													}}
													aria-label="View"
												/>
											</Tooltip>

											{/* Enquiry tab: Create Quote + Hide */}
											{activeTab === "enquiry" && !isViewer && (
												<>
													<Tooltip label="Create Quote" placement="top">
														<Button
															size="xs"
															bg={RED}
															color="white"
															_hover={{ bg: "#c00404" }}
															fontWeight="700"
															fontSize="10px"
															borderRadius="lg"
															px={3}
															onClick={() => handleCreateQuote(inquiry)}
															leftIcon={<Icon as={FileText} size={11} />}
														>
															Quote
														</Button>
													</Tooltip>
													<Tooltip label="Mark as Job" placement="top">
														<Button
															size="xs"
															bg={DARK}
															color="white"
															_hover={{ bg: "#1E293B" }}
															fontWeight="700"
															fontSize="10px"
															borderRadius="lg"
															px={3}
															onClick={() => handleMarkJob(inquiry.id)}
															leftIcon={<Icon as={Briefcase} size={11} />}
														>
															Job
														</Button>
													</Tooltip>
													<Tooltip label="Hide inquiry" placement="top">
														<IconButton
															icon={<Icon as={EyeOff} size={14} />}
															size="sm"
															variant="ghost"
															color="gray.400"
															_hover={{ bg: "gray.100", color: "gray.700" }}
															onClick={() => handleHide(inquiry.id)}
															aria-label="Hide"
														/>
													</Tooltip>
												</>
											)}

											{/* Quoted tab: Mark as Job + Hide */}
											{activeTab === "quoted" && !isViewer && (
												<>
													<Tooltip label="Mark as Job" placement="top">
														<Button
															size="xs"
															bg={DARK}
															color="white"
															_hover={{ bg: "#1E293B" }}
															fontWeight="700"
															fontSize="10px"
															borderRadius="lg"
															px={3}
															onClick={() => handleMarkJob(inquiry.id)}
															leftIcon={<Icon as={CheckCircle} size={11} />}
														>
															Accept Job
														</Button>
													</Tooltip>
													<Tooltip label="Hide" placement="top">
														<IconButton
															icon={<Icon as={EyeOff} size={14} />}
															size="sm"
															variant="ghost"
															color="gray.400"
															_hover={{ bg: "gray.100" }}
															onClick={() => handleHide(inquiry.id)}
															aria-label="Hide"
														/>
													</Tooltip>
												</>
											)}

											{/* Job tab: Hide */}
											{activeTab === "job" && !isViewer && (
												<Tooltip label="Hide" placement="top">
													<IconButton
														icon={<Icon as={EyeOff} size={14} />}
														size="sm"
														variant="ghost"
														color="gray.400"
														_hover={{ bg: "gray.100" }}
														onClick={() => handleHide(inquiry.id)}
														aria-label="Hide"
													/>
												</Tooltip>
											)}

											{/* Hidden tab: Un-Hide + Delete */}
											{activeTab === "hidden" && (
												<>
													<Button
														size="xs"
														variant="outline"
														borderColor="gray.400"
														color="gray.600"
														_hover={{ bg: "gray.100" }}
														fontWeight="700"
														fontSize="10px"
														borderRadius="lg"
														px={3}
														onClick={() => handleUnhide(inquiry.id)}
														leftIcon={<Icon as={Eye} size={11} />}
													>
														Un-Hide
													</Button>
													{!isViewer && canModify() && (
														<Tooltip label="Delete permanently" placement="top">
															<IconButton
																icon={<DeleteIcon />}
																size="sm"
																variant="ghost"
																colorScheme="red"
																onClick={() => handleDelete(inquiry.id)}
																aria-label="Delete"
															/>
														</Tooltip>
													)}
												</>
											)}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}

			<InquiryViewModal
				isOpen={isViewOpen}
				onClose={onViewClose}
				inquiry={viewingInquiry}
				isViewer={isViewer}
				onCreateQuote={handleCreateQuote}
				onHide={handleHide}
				onUnhide={handleUnhide}
				onMarkJob={handleMarkJob}
				status={viewingInquiry ? getStatus(viewingInquiry.id) : "enquiry"}
			/>
		</ModuleFrame>
	);
}

/* ÔöÇÔöÇÔöÇ Detail Modal ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */
function InquiryViewModal({
	isOpen,
	onClose,
	inquiry,
	isViewer,
	onCreateQuote,
	onHide,
	onUnhide,
	onMarkJob,
	status,
}) {
	if (!inquiry) return null;

	const actionClose = (fn) => {
		onClose();
		fn(inquiry.id || inquiry);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
			<ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
			<ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
				{/* Header */}
				<Box bgGradient={`linear(to-r, ${DARK}, #1E293B)`} color="white" py={8} px={8}>
					<HStack spacing={4} justify="space-between">
						<HStack spacing={4}>
							<Icon as={Car} size={28} opacity={0.9} />
							<VStack align="flex-start" spacing={0}>
								<Text fontSize="22px" fontWeight="900">
									Inquiry Details
								</Text>
								<Text opacity={0.7} fontSize="13px">
									{inquiry.registrationNumber !== "—"
										? `Reference: ${inquiry.refNumber}`
										: `${inquiry.brand} ${inquiry.model} ${inquiry.year}`.trim() ||
											"Manual Selection"}
								</Text>
							</VStack>
						</HStack>

						{inquiry.registrationNumber !== "—" && (
							<Flex
								bg={PLATE_YELLOW}
								border="2.5px solid #1a1a1a"
								borderRadius="8px"
								overflow="hidden"
								h="36px"
								align="center"
								boxShadow="lg"
							>
								<Flex
									bg="#003399"
									h="100%"
									w="28px"
									flexDir="column"
									align="center"
									justify="center"
								>
									<Text color="white" fontSize="6px" fontWeight="900">
										GB
									</Text>
									<Text color={PLATE_YELLOW} fontSize="9px">
										★
									</Text>
								</Flex>
								<Text
									px={3}
									fontSize="16px"
									fontWeight="900"
									letterSpacing="2px"
									color="#1a1a1a"
									fontFamily="'Arial Black', sans-serif"
								>
									{inquiry.registrationNumber}
								</Text>
							</Flex>
						)}
					</HStack>
				</Box>
				<ModalCloseButton color="white" top={6} right={6} />

				<ModalBody p={8}>
					<VStack spacing={6} align="stretch">
						<SimpleGrid columns={2} spacing={6}>
							<VStack align="flex-start" spacing={1}>
								<HStack color="gray.400">
									<Icon as={Mail} size={13} />
									<Text fontSize="11px" fontWeight="700" textTransform="uppercase">
										Customer
									</Text>
								</HStack>
								<Text fontSize="16px" fontWeight="700" color={DARK}>
									{inquiry.name}
								</Text>
								<Text fontSize="13px" color="gray.500">
									{inquiry.email}
								</Text>
							</VStack>
							<VStack align="flex-start" spacing={1}>
								<HStack color="gray.400">
									<Icon as={Phone} size={13} />
									<Text fontSize="11px" fontWeight="700" textTransform="uppercase">
										Phone
									</Text>
								</HStack>
								<Text fontSize="16px" fontWeight="700" color={DARK}>
									{inquiry.phone}
								</Text>
							</VStack>
						</SimpleGrid>

						<Divider />

						<SimpleGrid columns={2} spacing={6}>
							<VStack align="flex-start" spacing={1}>
								<HStack color="gray.400">
									<Icon as={Settings} size={13} />
									<Text fontSize="11px" fontWeight="700" textTransform="uppercase">
										Category & Location
									</Text>
								</HStack>
								<Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
									{inquiry.category}
								</Badge>
								<HStack>
									<Icon as={MapPin} size={12} color="red.400" />
									<Text fontSize="13px">{inquiry.postcode}</Text>
								</HStack>
							</VStack>
							<VStack align="flex-start" spacing={1}>
								<HStack color="gray.400">
									<Icon as={ClipboardList} size={13} />
									<Text fontSize="11px" fontWeight="700" textTransform="uppercase">
										Options
									</Text>
								</HStack>
								<HStack flexWrap="wrap" spacing={1}>
									{inquiry.engineOptions?.map((o, i) => (
										<Badge key={i} colorScheme="green" variant="subtle" fontSize="11px">
											{o}
										</Badge>
									))}
								</HStack>
								<HStack flexWrap="wrap" spacing={1}>
									{inquiry.fittingOptions?.map((o, i) => (
										<Badge key={i} colorScheme="purple" variant="subtle" fontSize="11px">
											{o}
										</Badge>
									))}
								</HStack>
							</VStack>
						</SimpleGrid>

						{inquiry.notes && (
							<Box bg="gray.50" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100">
								<Text
									fontSize="11px"
									fontWeight="700"
									color="gray.400"
									mb={2}
									textTransform="uppercase"
								>
									Notes
								</Text>
								<Text fontSize="14px" whiteSpace="pre-wrap">
									{inquiry.notes}
								</Text>
							</Box>
						)}

						<Text fontSize="11px" color="gray.400" textAlign="right">
							Submitted: {inquiry.date}
						</Text>
					</VStack>
				</ModalBody>

				<ModalFooter bg="gray.50" py={5} px={8} borderTop="1px solid" borderColor="gray.100">
					<HStack spacing={3} w="full" justify="space-between">
						<Button onClick={onClose} variant="ghost" color="gray.600">
							Close
						</Button>
						<HStack spacing={2}>
							{status === "hidden" ? (
								<Button
									leftIcon={<Icon as={Eye} size={15} />}
									onClick={() => {
										onClose();
										onUnhide(inquiry.id);
									}}
									variant="outline"
									colorScheme="gray"
									borderRadius="xl"
									fontWeight="700"
								>
									Un-Hide
								</Button>
							) : (
								<Button
									leftIcon={<Icon as={EyeOff} size={15} />}
									onClick={() => {
										onClose();
										onHide(inquiry.id);
									}}
									variant="ghost"
									color="gray.500"
									borderRadius="xl"
									fontWeight="700"
								>
									Hide
								</Button>
							)}
							{status !== "job" && !isViewer && (
								<Button
									leftIcon={<Icon as={Briefcase} size={15} />}
									onClick={() => {
										onClose();
										onMarkJob(inquiry.id);
									}}
									bg={DARK}
									color="white"
									_hover={{ bg: "#1E293B" }}
									borderRadius="xl"
									fontWeight="700"
								>
									Mark as Job
								</Button>
							)}
							{status !== "hidden" && !isViewer && (
								<Button
									leftIcon={<Icon as={FileText} size={15} />}
									onClick={() => {
										onClose();
										onCreateQuote(inquiry);
									}}
									bg={RED}
									color="white"
									_hover={{
										bg: "#c00404",
										transform: "translateY(-1px)",
										boxShadow: "0 4px 15px rgba(217,4,4,0.3)",
									}}
									borderRadius="xl"
									fontWeight="700"
									transition="all 0.2s"
								>
									Create Quotation
								</Button>
							)}
						</HStack>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
