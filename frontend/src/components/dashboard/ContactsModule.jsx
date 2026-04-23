import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	Badge,
	Box,
	Button,
	Center,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
import { Mail } from "lucide-react";
import API from "../../services/api";
import ModuleFrame from "./ModuleFrame";

const STATUS_OPTIONS = ["All", "New", "Reviewed", "Replied", "Closed"];

const statusColorScheme = (status) => {
	switch ((status || "").toLowerCase()) {
		case "reviewed":
			return "blue";
		case "replied":
			return "green";
		case "closed":
			return "gray";
		default:
			return "orange";
	}
};

const mapContactFromApi = (contact) => ({
	id: contact._id,
	name: contact.name,
	email: contact.email,
	subject: contact.subject,
	message: contact.message,
	status: contact.status || "New",
	date: contact.createdAt ? new Date(contact.createdAt).toLocaleString() : "—",
	websiteName: contact.website_id?.name || "—",
	ipAddress: contact.ipAddress || "—",
	sourcePath: contact.sourcePath || "—",
});

export default function ContactsModule() {
	const toast = useToast();
	const [contacts, setContacts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [isLoading, setIsLoading] = useState(true);
	const [selectedContact, setSelectedContact] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const fetchContacts = useCallback(async () => {
		setIsLoading(true);
		try {
			const params = {};
			if (statusFilter !== "All") {
				params.status = statusFilter;
			}

			const res = await API.get("/contacts", { params });
			setContacts((res.data?.data || []).map(mapContactFromApi));
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Failed to load contacts",
				status: "error",
				position: "top-right",
			});
		} finally {
			setIsLoading(false);
		}
	}, [statusFilter, toast]);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	const filteredContacts = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return contacts;

		return contacts.filter((contact) => {
			return [contact.name, contact.email, contact.subject, contact.message, contact.websiteName]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(query));
		});
	}, [contacts, searchTerm]);

	const handleStatusChange = async (id, status) => {
		try {
			await API.patch(`/contacts/${id}/status`, { status });
			toast({ title: "Contact updated", status: "success", position: "top-right" });
			fetchContacts();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Failed to update contact",
				status: "error",
				position: "top-right",
			});
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this contact submission?")) return;

		try {
			await API.delete(`/contacts/${id}`);
			toast({ title: "Contact deleted", status: "info", position: "top-right" });
			fetchContacts();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Failed to delete contact",
				status: "error",
				position: "top-right",
			});
		}
	};

	return (
		<ModuleFrame
			icon={Mail}
			title="Contact Inbox"
			description="Review messages submitted from the public contact page and manage their status."
		>
			<HStack justify="space-between" mb={6} flexWrap="wrap" gap={4}>
				<InputGroup maxW="320px">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search submissions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						fontSize="14px"
						h="42px"
						borderRadius="lg"
					/>
				</InputGroup>

				<Select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					fontSize="14px"
					h="42px"
					borderRadius="lg"
					maxW="180px"
				>
					{STATUS_OPTIONS.map((status) => (
						<option key={status} value={status}>
							{status === "All" ? "All Statuses" : status}
						</option>
					))}
				</Select>
			</HStack>

			<Box overflowX="auto">
				<Table variant="simple" size="sm">
					<Thead>
						<Tr>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Name
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Email
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Subject
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Message
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Received
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Status
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Actions
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<Tr>
								<Td colSpan={7}>
									<Center py={10}>
										<VStack spacing={3}>
											<Spinner color="#D90404" size="lg" thickness="4px" />
											<Text fontWeight="600" color="gray.500" fontSize="14px">
												Loading submissions...
											</Text>
										</VStack>
									</Center>
								</Td>
							</Tr>
						) : filteredContacts.length === 0 ? (
							<Tr>
								<Td colSpan={7}>
									<Center py={10}>
										<VStack spacing={2}>
											<Text color="gray.500" fontWeight="600">
												No contact submissions found
											</Text>
										</VStack>
									</Center>
								</Td>
							</Tr>
						) : (
							filteredContacts.map((contact) => (
								<Tr key={contact.id} _hover={{ bg: "gray.50" }}>
									<Td fontSize="13px" fontWeight="700">
										{contact.name}
									</Td>
									<Td fontSize="12px" color="gray.600">
										{contact.email}
									</Td>
									<Td fontSize="12px" fontWeight="600" color="gray.700">
										{contact.subject}
									</Td>
									<Td fontSize="12px" color="gray.500">
										<Text noOfLines={2} maxW="360px">
											{contact.message}
										</Text>
									</Td>
									<Td fontSize="12px" color="gray.500">
										{contact.date}
									</Td>
									<Td>
										<Badge
											colorScheme={statusColorScheme(contact.status)}
											variant="subtle"
											borderRadius="full"
											px={3}
										>
											{contact.status}
										</Badge>
									</Td>
									<Td>
										<HStack spacing={1}>
											<IconButton
												icon={<ViewIcon />}
												size="sm"
												variant="ghost"
												aria-label="View contact"
												onClick={() => {
													setSelectedContact(contact);
													onOpen();
												}}
											/>
											<Select
												size="sm"
												maxW="140px"
												value={contact.status}
												onChange={(e) => handleStatusChange(contact.id, e.target.value)}
											>
												<option value="New">New</option>
												<option value="Reviewed">Reviewed</option>
												<option value="Replied">Replied</option>
												<option value="Closed">Closed</option>
											</Select>
											<IconButton
												icon={<DeleteIcon />}
												size="sm"
												variant="ghost"
												colorScheme="red"
												aria-label="Delete contact"
												onClick={() => handleDelete(contact.id)}
											/>
										</HStack>
									</Td>
								</Tr>
							))
						)}
					</Tbody>
				</Table>
			</Box>

			<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
				<ModalOverlay />
				<ModalContent borderRadius="2xl">
					<ModalHeader>{selectedContact?.subject || "Contact Message"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack align="stretch" spacing={3}>
							<Text fontWeight="700">{selectedContact?.name}</Text>
							<Text fontSize="14px" color="gray.600">
								{selectedContact?.email}
							</Text>
							<Text fontSize="13px" color="gray.500">
								Received: {selectedContact?.date}
							</Text>
							<Text fontSize="13px" color="gray.500">
								IP: {selectedContact?.ipAddress}
							</Text>
							<Text whiteSpace="pre-wrap" fontSize="14px" lineHeight="1.7">
								{selectedContact?.message}
							</Text>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose} bg="#D90404" color="white" _hover={{ bg: "#c00404" }}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</ModuleFrame>
	);
}
