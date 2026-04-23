import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	IconButton,
	HStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	useDisclosure,
	useToast,
	Badge,
	Box,
	VStack,
	SimpleGrid,
	Text,
	Icon,
	InputGroup,
	InputLeftElement,
	Spinner,
	Center,
	Flex,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import { TrendingUp, UserCheck } from "lucide-react";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";

const STATUS_OPTIONS = ["New", "Contacted", "Quoted", "Won", "Lost", "Dead"];

const statusColorScheme = (status) => {
	const normalized = (status || "").toLowerCase();
	if (normalized === "won") return "green";
	if (normalized === "lost" || normalized === "dead") return "red";
	if (normalized === "contacted") return "blue";
	if (normalized === "quoted") return "purple";
	return "orange";
};

const mapLeadFromApi = (lead) => ({
	id: lead._id,
	name: lead.customer_name,
	email: lead.customer_email || "—",
	phone: lead.customer_phone || "—",
	product: lead.product_interest || "—",
	message: lead.message || "",
	status: lead.status || "New",
	date: lead.createdAt ? new Date(lead.createdAt).toISOString().split("T")[0] : "—",
	website_id: lead.website_id?._id || lead.website_id || "",
	websiteName: lead.website_id?.name || "—",
	assignedName: lead.assigned_to?.name || "Unassigned",
});

export default function LeadsModule() {
	const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
	const currentRole = currentUser.role || "viewer";
	const isViewer = currentRole === "viewer" || currentRole === "Viewer";
	const isSuperAdmin = currentRole === "super_admin" || currentRole === "Super Admin";

	const [leads, setLeads] = useState([]);
	const [websites, setWebsites] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [isLoading, setIsLoading] = useState(true);
	const [editingLead, setEditingLead] = useState(null);
	const [viewingLead, setViewingLead] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
	const toast = useToast();

	const fetchWebsites = useCallback(async () => {
		if (!isSuperAdmin) return;

		try {
			const res = await API.get("/websites");
			setWebsites(res.data?.data || []);
		} catch (error) {
			console.error("Error fetching websites:", error);
		}
	}, [isSuperAdmin]);

	const fetchLeads = useCallback(async () => {
		setIsLoading(true);
		try {
			const params = {};
			if (statusFilter !== "All") {
				params.status = statusFilter;
			}

			const res = await API.get("/leads", { params });
			setLeads((res.data?.data || []).map(mapLeadFromApi));
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Failed to load leads",
				status: "error",
				position: "top-right",
			});
		} finally {
			setIsLoading(false);
		}
	}, [statusFilter, toast]);

	useEffect(() => {
		fetchWebsites();
	}, [fetchWebsites]);

	useEffect(() => {
		fetchLeads();
	}, [fetchLeads]);

	const filteredLeads = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return leads;

		return leads.filter((lead) => {
			return (
				lead.name.toLowerCase().includes(query) ||
				lead.email.toLowerCase().includes(query) ||
				lead.phone.toLowerCase().includes(query) ||
				lead.product.toLowerCase().includes(query) ||
				lead.websiteName.toLowerCase().includes(query)
			);
		});
	}, [leads, searchTerm]);

	const handleSave = async (formData) => {
		const payload = {
			customer_name: formData.name,
			customer_email: formData.email,
			customer_phone: formData.phone,
			product_interest: formData.product,
			message: formData.message,
			status: formData.status,
			website_id: formData.website_id || undefined,
		};

		try {
			if (editingLead) {
				await API.put(`/leads/${editingLead.id}`, payload);
				toast({ title: "Lead updated", status: "success", position: "top-right" });
			} else {
				if (isSuperAdmin && !payload.website_id) {
					toast({ title: "Select a website first", status: "warning", position: "top-right" });
					return;
				}

				await API.post("/leads", payload);
				toast({ title: "Lead added", status: "success", position: "top-right" });
			}

			await fetchLeads();
			onClose();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Save failed",
				status: "error",
				position: "top-right",
			});
		}
	};

	const handleDelete = async (id) => {
		try {
			await API.delete(`/leads/${id}`);
			toast({ title: "Lead deleted", status: "info", position: "top-right" });
			await fetchLeads();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Delete failed",
				status: "error",
				position: "top-right",
			});
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		if (isViewer) return;

		try {
			await API.put(`/leads/${id}`, { status: newStatus });
			toast({ title: `Lead marked as ${newStatus}`, status: "info", position: "top-right" });
			await fetchLeads();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Status update failed",
				status: "error",
				position: "top-right",
			});
		}
	};

	return (
		<ModuleFrame
			icon={TrendingUp}
			title="Sales Leads"
			description="Track incoming inquiries, qualify prospects, and move opportunities through the pipeline."
		>
			<HStack justify="space-between" mb={6} flexWrap="wrap" gap={4}>
				<InputGroup maxW="320px">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search leads..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						fontSize="14px"
						h="42px"
						borderRadius="lg"
					/>
				</InputGroup>

				<HStack spacing={3} flexWrap="wrap">
					<Select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						fontSize="14px"
						h="42px"
						borderRadius="lg"
						maxW="180px"
					>
						<option value="All">All Statuses</option>
						{STATUS_OPTIONS.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</Select>

					{!isViewer && (
						<Button
							leftIcon={<AddIcon />}
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c00404" }}
							onClick={() => {
								setEditingLead(null);
								onOpen();
							}}
							fontSize="14px"
							px={6}
							h="42px"
							borderRadius="lg"
						>
							Add Lead
						</Button>
					)}
				</HStack>
			</HStack>

			{isLoading ? (
				<Center py={16}>
					<Spinner size="xl" color="#D90404" thickness="4px" />
				</Center>
			) : (
				<Box overflowX="auto">
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Name
								</Th>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Email
								</Th>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Product
								</Th>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Website
								</Th>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Status
								</Th>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Date
								</Th>
								<Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{filteredLeads.map((lead) => (
								<Tr key={lead.id}>
									<Td fontSize="13px" fontWeight="600">
										{lead.name}
									</Td>
									<Td fontSize="13px">{lead.email}</Td>
									<Td fontSize="13px">{lead.product}</Td>
									<Td fontSize="13px">{lead.websiteName}</Td>
									<Td>
										<Select
											value={lead.status}
											size="sm"
											width="130px"
											fontSize="12px"
											borderRadius="md"
											onChange={(e) => handleStatusChange(lead.id, e.target.value)}
											isDisabled={isViewer}
										>
											{STATUS_OPTIONS.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</Select>
									</Td>
									<Td fontSize="13px">{lead.date}</Td>
									<Td>
										<HStack spacing={1}>
											<IconButton
												icon={<ViewIcon />}
												size="sm"
												variant="ghost"
												onClick={() => {
													setViewingLead(lead);
													onViewOpen();
												}}
												aria-label="View Lead"
											/>
											{!isViewer && (
												<>
													<IconButton
														icon={<EditIcon />}
														size="sm"
														variant="ghost"
														onClick={() => {
															setEditingLead(lead);
															onOpen();
														}}
														aria-label="Edit Lead"
													/>
													<IconButton
														icon={<DeleteIcon />}
														size="sm"
														variant="ghost"
														colorScheme="red"
														onClick={() => handleDelete(lead.id)}
														aria-label="Delete Lead"
													/>
												</>
											)}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>

					{filteredLeads.length === 0 && (
						<Flex justify="center" py={16}>
							<VStack spacing={3} color="gray.500">
								<Icon as={UserCheck} boxSize={10} />
								<Text fontWeight="600">No leads found</Text>
							</VStack>
						</Flex>
					)}
				</Box>
			)}

			<LeadModal
				isOpen={isOpen}
				onClose={onClose}
				onSave={handleSave}
				lead={editingLead}
				websites={websites}
				isSuperAdmin={isSuperAdmin}
			/>
			<LeadViewModal isOpen={isViewOpen} onClose={onViewClose} lead={viewingLead} />
		</ModuleFrame>
	);
}

function LeadModal({ isOpen, onClose, onSave, lead, websites, isSuperAdmin }) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		product: "",
		message: "",
		status: "New",
		website_id: "",
	});

	useEffect(() => {
		if (lead) {
			setFormData({
				name: lead.name || "",
				email: lead.email || "",
				phone: lead.phone || "",
				product: lead.product || "",
				message: lead.message || "",
				status: lead.status || "New",
				website_id: lead.website_id || "",
			});
		} else {
			setFormData({
				name: "",
				email: "",
				phone: "",
				product: "",
				message: "",
				status: "New",
				website_id: "",
			});
		}
	}, [lead, isOpen]);

	const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
	const isEditing = !!lead;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
			<ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
			<ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
				<Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={8} px={8}>
					<HStack spacing={4}>
						<Icon as={UserCheck} boxSize={9} opacity={0.9} />
						<VStack align="flex-start" spacing={0}>
							<ModalHeader fontSize="27px" fontWeight="800" p={0} letterSpacing="-0.6px">
								{isEditing ? "Edit Lead" : "Add New Lead"}
							</ModalHeader>
							<Text opacity={0.9} fontSize="15px">
								{isEditing ? "Update lead details and status" : "Capture a new sales inquiry"}
							</Text>
						</VStack>
					</HStack>
				</Box>

				<ModalCloseButton color="white" top={6} right={6} />

				<ModalBody p={10}>
					<VStack spacing={8} align="stretch">
						{isSuperAdmin && (
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									ASSIGNED WEBSITE
								</FormLabel>
								<Select
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.website_id}
									onChange={(e) => updateField("website_id", e.target.value)}
								>
									<option value="">Select a website</option>
									{websites.map((site) => (
										<option key={site._id} value={site._id}>
											{site.name}
											{site.domain ? ` (${site.domain})` : ""}
										</option>
									))}
								</Select>
							</FormControl>
						)}

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									FULL NAME
								</FormLabel>
								<Input
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.name}
									onChange={(e) => updateField("name", e.target.value)}
									placeholder="John Smith"
									_focus={{ borderColor: "#D90404" }}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									EMAIL ADDRESS
								</FormLabel>
								<Input
									type="email"
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.email}
									onChange={(e) => updateField("email", e.target.value)}
									placeholder="john@company.com"
									_focus={{ borderColor: "#D90404" }}
								/>
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
							<FormControl>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									PHONE
								</FormLabel>
								<Input
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.phone}
									onChange={(e) => updateField("phone", e.target.value)}
									placeholder="+44 7700 100001"
									_focus={{ borderColor: "#D90404" }}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									PRODUCT OF INTEREST
								</FormLabel>
								<Input
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.product}
									onChange={(e) => updateField("product", e.target.value)}
									placeholder="Diesel Generator"
									_focus={{ borderColor: "#D90404" }}
								/>
							</FormControl>
						</SimpleGrid>

						<FormControl>
							<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
								MESSAGE
							</FormLabel>
							<Textarea
								rows={6}
								borderRadius="2xl"
								value={formData.message}
								onChange={(e) => updateField("message", e.target.value)}
								placeholder="Customer inquiry details..."
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
								STATUS
							</FormLabel>
							<Select
								size="lg"
								h="56px"
								borderRadius="2xl"
								value={formData.status}
								onChange={(e) => updateField("status", e.target.value)}
							>
								{STATUS_OPTIONS.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</Select>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter bg="gray.50" py={8} px={10}>
					<HStack spacing={4} w="full" justify="flex-end">
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c00404" }}
							onClick={() => onSave(formData)}
							px={12}
							borderRadius="2xl"
							isDisabled={
								!formData.name || !formData.email || (isSuperAdmin && !formData.website_id)
							}
						>
							{isEditing ? "Update Lead" : "Save Lead"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

function LeadViewModal({ isOpen, onClose, lead }) {
	if (!lead) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
			<ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
				<Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={8} px={8}>
					<HStack spacing={4}>
						<Icon as={UserCheck} boxSize={8} opacity={0.9} />
						<VStack align="flex-start" spacing={0}>
							<ModalHeader fontSize="26px" fontWeight="800" p={0}>
								Lead Details
							</ModalHeader>
							<Text opacity={0.85} fontSize="15px">
								{lead.name}
							</Text>
						</VStack>
					</HStack>
				</Box>
				<ModalCloseButton color="white" top={6} right={6} />
				<ModalBody p={10}>
					<VStack spacing={6} align="stretch">
						<SimpleGrid columns={2} spacing={6}>
							<Box>
								<Text fontSize="13px" fontWeight="700" color="gray.500">
									NAME
								</Text>
								<Text fontSize="18px" fontWeight="600">
									{lead.name}
								</Text>
							</Box>
							<Box>
								<Text fontSize="13px" fontWeight="700" color="gray.500">
									STATUS
								</Text>
								<Badge
									colorScheme={statusColorScheme(lead.status)}
									fontSize="14px"
									px={4}
									py={1}
									borderRadius="full"
								>
									{lead.status}
								</Badge>
							</Box>
						</SimpleGrid>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								EMAIL
							</Text>
							<Text fontSize="17px">{lead.email}</Text>
						</Box>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								PHONE
							</Text>
							<Text fontSize="17px">{lead.phone}</Text>
						</Box>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								PRODUCT
							</Text>
							<Text fontSize="17px" fontWeight="600">
								{lead.product}
							</Text>
						</Box>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								WEBSITE
							</Text>
							<Text fontSize="17px">{lead.websiteName}</Text>
						</Box>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								MESSAGE
							</Text>
							<Text fontSize="16px" whiteSpace="pre-wrap">
								{lead.message || "—"}
							</Text>
						</Box>
					</VStack>
				</ModalBody>
				<ModalFooter bg="gray.50" py={8} px={10}>
					<Button onClick={onClose} size="lg" colorScheme="gray" px={10}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
