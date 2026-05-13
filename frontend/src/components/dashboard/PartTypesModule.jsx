import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
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
	Spinner,
	Table,
	Tbody,
	Td,
	Textarea,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { Search, Tags } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import ModuleFrame from "./ModuleFrame";
import { canModify } from "../../utils/permissions";

const DARK = "#0F172A";
const RED = "#D90404";

export default function PartTypesModule() {
	const [partTypes, setPartTypes] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [editingPart, setEditingPart] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	const fetchPartTypes = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await API.get("/part-types");
			setPartTypes(res.data || []);
		} catch (error) {
			toast({
				title: "Failed to load part types",
				status: "error",
				position: "top-right",
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchPartTypes();
	}, [fetchPartTypes]);

	const handleOpenModal = (part = null) => {
		if (part) {
			setEditingPart(part);
			setFormData({ name: part.name, description: part.description || "" });
		} else {
			setEditingPart(null);
			setFormData({ name: "", description: "" });
		}
		onOpen();
	};

	const handleSubmit = async () => {
		if (!formData.name) {
			toast({ title: "Name is required", status: "warning" });
			return;
		}

		try {
			if (editingPart) {
				await API.put(`/part-types/${editingPart._id}`, formData);
				toast({ title: "Part type updated", status: "success" });
			} else {
				await API.post("/part-types", formData);
				toast({ title: "Part type created", status: "success" });
			}
			onClose();
			fetchPartTypes();
		} catch (error) {
			toast({
				title: error.response?.data?.message || "Operation failed",
				status: "error",
			});
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this part type?")) return;
		try {
			await API.delete(`/part-types/${id}`);
			toast({ title: "Part type deleted", status: "info" });
			fetchPartTypes();
		} catch (error) {
			toast({ title: "Delete failed", status: "error" });
		}
	};

	const filteredParts = partTypes.filter((p) =>
		p.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<ModuleFrame
			icon={Tags}
			title="Part Types"
			description="Manage vehicle part categories (e.g., Engines, Gearboxes) used in search and inquiries."
		>
			<Flex mb={6} justify="space-between" align="center" flexWrap="wrap" gap={4}>
				<InputGroup maxW="300px">
					<InputLeftElement pointerEvents="none">
						<Search color="gray.400" size={18} />
					</InputLeftElement>
					<Input
						placeholder="Search parts..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						borderRadius="xl"
						bg="white"
						_focus={{ borderColor: RED, boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
					/>
				</InputGroup>

				<Button
					leftIcon={<AddIcon />}
					bg={RED}
					color="white"
					_hover={{ bg: "#c00404" }}
					borderRadius="xl"
					onClick={() => handleOpenModal()}
				>
					Add Part Type
				</Button>
			</Flex>

			{isLoading ? (
				<Center py={20}>
					<Spinner color={RED} size="xl" />
				</Center>
			) : (
				<Box
					overflowX="auto"
					borderRadius="2xl"
					border="1px solid"
					borderColor="gray.100"
					bg="white"
				>
					<Table variant="simple">
						<Thead bg={DARK}>
							<Tr>
								<Th color="whiteAlpha.700">Name</Th>
								<Th color="whiteAlpha.700">Slug</Th>
								<Th color="whiteAlpha.700">Description</Th>
								<Th color="whiteAlpha.700" textAlign="right">
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{filteredParts.length === 0 ? (
								<Tr>
									<Td colSpan={4} textAlign="center" py={10} color="gray.400">
										No part types found
									</Td>
								</Tr>
							) : (
								filteredParts.map((part) => (
									<Tr key={part._id} _hover={{ bg: "gray.50" }}>
										<Td fontWeight="700" color={DARK}>
											{part.name}
										</Td>
										<Td>
											<Badge colorScheme="blue" variant="subtle">
												{part.slug}
											</Badge>
										</Td>
										<Td color="gray.500" fontSize="13px" maxW="300px" isTruncated>
											{part.description || "—"}
										</Td>
										<Td textAlign="right">
											<HStack spacing={2} justify="flex-end">
												{canModify() && (
													<>
														<IconButton
															icon={<EditIcon />}
															size="sm"
															variant="ghost"
															color="blue.500"
															onClick={() => handleOpenModal(part)}
															aria-label="Edit"
														/>
														<IconButton
															icon={<DeleteIcon />}
															size="sm"
															variant="ghost"
															color="red.500"
															onClick={() => handleDelete(part._id)}
															aria-label="Delete"
														/>
													</>
												)}
											</HStack>
										</Td>
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</Box>
			)}

			{/* Create/Edit Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay backdropFilter="blur(4px)" />
				<ModalContent borderRadius="2xl">
					<ModalHeader borderBottom="1px solid" borderColor="gray.100">
						{editingPart ? "Edit Part Type" : "Add New Part Type"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody py={6}>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel fontWeight="700">Name</FormLabel>
								<Input
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder="e.g. Engines"
									borderRadius="lg"
								/>
							</FormControl>
							<FormControl>
								<FormLabel fontWeight="700">Description</FormLabel>
								<Textarea
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder="Optional description..."
									borderRadius="lg"
									rows={4}
								/>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter bg="gray.50" borderRadius="0 0 2xl 2xl">
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button bg={RED} color="white" _hover={{ bg: "#c00404" }} onClick={handleSubmit}>
							{editingPart ? "Save Changes" : "Create Part Type"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</ModuleFrame>
	);
}
