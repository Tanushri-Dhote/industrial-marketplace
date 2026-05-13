import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	useColorModeValue,
	Spinner,
	Center,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { FileText } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";

export default function QuotesModule() {
	const [editingQuote, setEditingQuote] = useState(null);
	const [viewingQuote, setViewingQuote] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
	const navigate = useNavigate();
	const toast = useToast();
	const queryClient = useQueryClient();

	const inputBg = useColorModeValue("white", "gray.700");
	const textMuted = useColorModeValue("gray.600", "gray.400");

	const { data: quotes = [], isLoading } = useQuery({
		queryKey: ["quotes"],
		queryFn: async () => {
			const res = await API.get("/quotes");
			return res.data?.data || [];
		},
	});

	const saveMutation = useMutation({
		mutationFn: async (formData) => {
			const payload = {
				refNumber: formData.refNumber || `AE4U-${Date.now()}`,
				customer: {
					name: formData.customer,
				},
				vehicle: {
					vehicleDesc: formData.product,
				},
				pricing: {
					total: Number(formData.amount) || 0,
				},
				notes: formData.notes,
				status: formData.status,
			};

			if (editingQuote?._id) {
				return API.put(`/quotes/${editingQuote._id}`, payload);
			}

			return API.post("/quotes", payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quotes"] });
			toast({ title: editingQuote ? "Quote updated" : "Quote added", status: "success" });
			onClose();
			setEditingQuote(null);
		},
		onError: (error) => {
			toast({
				title: "Quote save failed",
				description: error.response?.data?.message || "Please try again",
				status: "error",
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id) => API.delete(`/quotes/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quotes"] });
			toast({ title: "Quote deleted", status: "info" });
		},
		onError: (error) => {
			toast({
				title: "Delete failed",
				description: error.response?.data?.message || "Please try again",
				status: "error",
			});
		},
	});

	const statusMutation = useMutation({
		mutationFn: async ({ id, status }) => API.put(`/quotes/${id}`, { status }),
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: ["quotes"] });
			toast({ title: `Quote marked as ${vars.status}`, status: "info" });
		},
	});

	const handleSave = (data) => saveMutation.mutate(data);

	const handleDelete = (id) => {
		if (!window.confirm("Delete this quote?")) return;
		deleteMutation.mutate(id);
	};

	const handleStatusChange = (id, newStatus) => {
		statusMutation.mutate({ id, status: newStatus });
	};

	return (
		<ModuleFrame
			icon={FileText}
			title="Quotation History"
			description="Generate and manage price quotes for industrial machinery. Track approval status and maintain transaction history."
		>
			<HStack justify="flex-end" mb={8}>
				<Button
					leftIcon={<AddIcon />}
					bg="#D90404"
					color="white"
					_hover={{ bg: "#c00404" }}
					onClick={() => navigate("/create-quote")}
					fontSize="15px"
					px={6}
					h="45px"
					borderRadius="xl"
				>
					Create Quote
				</Button>
			</HStack>

			{isLoading ? (
				<Center py={12}>
					<Spinner size="xl" color="#D90404" />
				</Center>
			) : (
				<Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
					<Table variant="simple" layout="fixed" minW="1000px">
						<Thead bg="gray.50">
							<Tr>
								<Th w="160px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Customer
								</Th>
								<Th w="180px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Product
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Amount
								</Th>
								<Th w="140px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Status
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Date
								</Th>
								<Th w="180px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Site
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Admin
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{quotes.map((quote) => {
								const productLabel =
									quote.vehicle?.vehicleDesc ||
									quote.vehicle?.engineCode ||
									quote.vehicle?.vrm ||
									"-";
								const amount = quote.pricing?.total || 0;
								return (
									<Tr key={quote._id}>
										<Td fontSize="13px" fontWeight="600" isTruncated>
											{quote.customer?.name || "-"}
										</Td>
										<Td fontSize="13px" isTruncated>{productLabel}</Td>
										<Td fontSize="13px" fontWeight="700" whiteSpace="nowrap">
											£{amount.toLocaleString()}
										</Td>
										<Td>
											<Select
												value={quote.status || "Pending"}
												size="sm"
												width="110px"
												fontSize="12px"
												borderRadius="md"
												onChange={(e) => handleStatusChange(quote._id, e.target.value)}
												bg={inputBg}
											>
												<option value="Pending">Pending</option>
												<option value="Sent">Sent</option>
												<option value="Approved">Approved</option>
												<option value="Rejected">Rejected</option>
											</Select>
										</Td>
										<Td fontSize="13px" color={textMuted} whiteSpace="nowrap">
											{new Date(quote.createdAt).toISOString().slice(0, 10)}
										</Td>
										<Td fontSize="12px">
											<Badge variant="subtle" colorScheme="blue" whiteSpace="nowrap" px={2}>
												{quote.website_id?.name || "Main Site"}
											</Badge>
										</Td>
										<Td fontSize="13px" fontWeight="500" whiteSpace="nowrap">
											{quote.createdBy?.name || "System"}
										</Td>
										<Td>
											<HStack spacing={1} whiteSpace="nowrap">
												<IconButton
													icon={<ViewIcon />}
													size="sm"
													variant="ghost"
													onClick={() => {
														setViewingQuote(quote);
														onViewOpen();
													}}
													aria-label="View Quote"
												/>
												<IconButton
													icon={<EditIcon />}
													size="sm"
													variant="ghost"
													onClick={() => {
														setEditingQuote(quote);
														onOpen();
													}}
													aria-label="Edit Quote"
												/>
												<IconButton
													icon={<DeleteIcon />}
													size="sm"
													variant="ghost"
													colorScheme="red"
													onClick={() => handleDelete(quote._id)}
													aria-label="Delete Quote"
												/>
											</HStack>
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</Box>
			)}

			<QuoteModal isOpen={isOpen} onClose={onClose} onSave={handleSave} quote={editingQuote} />
			<QuoteViewModal isOpen={isViewOpen} onClose={onViewClose} quote={viewingQuote} />
		</ModuleFrame>
	);
}

function QuoteModal({ isOpen, onClose, onSave, quote }) {
	const [formData, setFormData] = useState({
		refNumber: "",
		customer: "",
		product: "",
		amount: "",
		notes: "",
		status: "Pending",
	});

	React.useEffect(() => {
		if (quote) {
			setFormData({
				refNumber: quote.refNumber || "",
				customer: quote.customer?.name || "",
				product:
					quote.vehicle?.vehicleDesc || quote.vehicle?.engineCode || quote.vehicle?.vrm || "",
				amount: String(quote.pricing?.total || 0),
				notes: quote.notes || "",
				status: quote.status || "Pending",
			});
		} else {
			setFormData({
				refNumber: "",
				customer: "",
				product: "",
				amount: "",
				notes: "",
				status: "Pending",
			});
		}
	}, [quote]);

	const isEditing = !!quote;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
			<ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
			<ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
				<Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={8} px={8}>
					<HStack spacing={4}>
						<Icon as={FileText} boxSize={9} opacity={0.9} />
						<VStack align="flex-start" spacing={0}>
							<ModalHeader fontSize="27px" fontWeight="800" p={0}>
								{isEditing ? "Edit Quote" : "Create New Quote"}
							</ModalHeader>
							<Text opacity={0.9} fontSize="15px">
								{isEditing ? "Update quote details" : "Generate a new quotation"}
							</Text>
						</VStack>
					</HStack>
				</Box>
				<ModalCloseButton color="white" top={6} right={6} />
				<ModalBody p={10}>
					<VStack spacing={8} align="stretch">
						<SimpleGrid columns={2} spacing={8}>
							<FormControl>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									REFERENCE
								</FormLabel>
								<Input
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.refNumber}
									onChange={(e) => setFormData({ ...formData, refNumber: e.target.value })}
								/>
							</FormControl>
							<Box />
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									CUSTOMER
								</FormLabel>
								<Input
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.customer}
									onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									PRODUCT
								</FormLabel>
								<Input
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.product}
									onChange={(e) => setFormData({ ...formData, product: e.target.value })}
								/>
							</FormControl>
						</SimpleGrid>
						<SimpleGrid columns={2} spacing={8}>
							<FormControl isRequired>
								<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
									AMOUNT ($)
								</FormLabel>
								<Input
									type="number"
									size="lg"
									h="56px"
									borderRadius="2xl"
									value={formData.amount}
									onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
									onChange={(e) => setFormData({ ...formData, status: e.target.value })}
								>
									<option value="Pending">Pending</option>
									<option value="Sent">Sent</option>
									<option value="Approved">Approved</option>
									<option value="Rejected">Rejected</option>
								</Select>
							</FormControl>
						</SimpleGrid>
						<FormControl>
							<FormLabel fontWeight="700" fontSize="14px" color="gray.600">
								NOTES
							</FormLabel>
							<Textarea
								value={formData.notes}
								onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
								borderRadius="2xl"
								minH="120px"
							/>
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
						>
							{isEditing ? "Update Quote" : "Save Quote"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

function QuoteViewModal({ isOpen, onClose, quote }) {
	if (!quote) return null;
	const productLabel =
		quote.vehicle?.vehicleDesc || quote.vehicle?.engineCode || quote.vehicle?.vrm || "-";
	const amount = quote.pricing?.total || 0;
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
			<ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
				<Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={8} px={8}>
					<HStack spacing={4}>
						<Icon as={FileText} boxSize={8} opacity={0.9} />
						<VStack align="flex-start" spacing={0}>
							<ModalHeader fontSize="26px" fontWeight="800" p={0}>
								Quote Details
							</ModalHeader>
							<Text opacity={0.85} fontSize="15px">
								{quote.refNumber || quote._id} •{" "}
								{new Date(quote.createdAt).toISOString().slice(0, 10)}
							</Text>
						</VStack>
					</HStack>
				</Box>
				<ModalCloseButton color="white" top={6} right={6} />
				<ModalBody p={10}>
					<VStack spacing={7} align="stretch">
						<SimpleGrid columns={2} spacing={6}>
							<Box>
								<Text fontSize="13px" fontWeight="700" color="gray.500">
									CUSTOMER
								</Text>
								<Text fontSize="18px" fontWeight="600">
									{quote.customer?.name || "-"}
								</Text>
							</Box>
							<Box>
								<Text fontSize="13px" fontWeight="700" color="gray.500">
									STATUS
								</Text>
								<Badge
									colorScheme={quote.status === "Approved" ? "green" : "orange"}
									fontSize="14px"
									px={5}
									py={1.5}
									borderRadius="full"
								>
									{quote.status}
								</Badge>
							</Box>
						</SimpleGrid>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								PRODUCT
							</Text>
							<Text fontSize="17px" fontWeight="600">
								{productLabel}
							</Text>
						</Box>
						<Box>
							<Text fontSize="13px" fontWeight="700" color="gray.500">
								AMOUNT
							</Text>
							<Text fontSize="28px" fontWeight="800" color="#D90404">
								£{amount.toLocaleString()}
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
