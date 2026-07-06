import React, { useState, useRef, useEffect } from "react";
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
	useDisclosure,
	Badge,
	Box,
	VStack,
	Flex,
	Text,
	Spinner,
	Center,
	InputGroup,
	InputLeftElement,
	Select,
	Image,
	Switch,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Car } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";
import { canModify } from "../../utils/permissions";

const ACCENT = "#D90404";

export default function ModelsModule() {
	const queryClient = useQueryClient();
	const modelInputRef = useRef(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingModel, setEditingModel] = useState(null);
	const [formData, setFormData] = useState({
		brandId: "",
		name: "",
		slug: "",
		imageUrl: "",
		year: "",
		type: "",
		isActive: true,
		spritePosition: { x: 0, y: 0 },
	});
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Fetch all brands
	const { data: brands = [] } = useQuery({
		queryKey: ["brands-admin"],
		queryFn: async () => {
			const res = await API.get("/brands/admin/all");
			return res.data?.data || [];
		},
	});

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);

	// Fetch all models with pagination and search
	const { data, isLoading } = useQuery({
		queryKey: ["models-admin", page, limit, searchTerm],
		queryFn: async () => {
			const skip = (page - 1) * limit;
			const res = await API.get("/models/admin/all", {
				params: { skip, limit, search: searchTerm }
			});
			return res.data || { data: [], total: 0 };
		},
		placeholderData: (prev) => prev
	});

	const models = data?.data || [];
	const total = data?.total || 0;
	const totalPages = Math.ceil(total / limit);

	// Reset page to 1 when search term changes
	useEffect(() => {
		setPage(1);
	}, [searchTerm]);

	// Create/Update mutation
	const saveMutation = useMutation({
		mutationFn: async (payload) => {
			const { _id, createdAt, updatedAt, __v, ...cleanPayload } = payload;
			if (editingModel) {
				return API.put(`/models/admin/${editingModel._id}`, cleanPayload);
			} else {
				return API.post("/models/admin/create", cleanPayload);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["models-admin"] });
			toast.success(editingModel ? "Model updated" : "Model created");
			resetForm();
			onClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Operation failed");
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (id) => API.delete(`/models/admin/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["models-admin"] });
			toast.success("Model deleted");
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Delete failed");
		},
	});

	const resetForm = () => {
		setFormData({
			brandId: "",
			name: "",
			slug: "",
			imageUrl: "",
			year: "",
			type: "",
			isActive: true,
			spritePosition: { x: 0, y: 0 },
		});
		setEditingModel(null);
	};

	const handleEdit = (model) => {
		setEditingModel(model);
		setFormData({
			...model,
			brandId: model.brandId?._id || model.brandId,
		});
		onOpen();
	};

	const handleSave = () => {
		if (!formData.brandId || !formData.name || !formData.slug) {
			toast.error("Please fill in all required fields");
			return;
		}
		saveMutation.mutate(formData);
	};

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this model?")) return;
		deleteMutation.mutate(id);
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const uploadFormData = new FormData();
		uploadFormData.append("file", file);

		try {
			toast.loading("Uploading image...");
			const res = await API.post("/upload", uploadFormData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setFormData({ ...formData, imageUrl: res.data?.url || res.data?.data?.url });
			toast.dismiss();
			toast.success("Image uploaded");
		} catch (err) {
			toast.dismiss();
			toast.error("Upload failed - paste image URL directly in the field");
		}
	};

	const handleCSVUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const uploadFormData = new FormData();
		uploadFormData.append("file", file);

		try {
			toast.loading("Importing CSV...");
			const res = await API.post("/models/admin/specs/upload-csv", uploadFormData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			toast.dismiss();
			toast.success(res.data?.message || "CSV imported successfully!");
			queryClient.invalidateQueries({ queryKey: ["models-admin"] });
		} catch (err) {
			toast.dismiss();
			toast.error(err.response?.data?.message || "CSV import failed");
		}
		e.target.value = "";
	};

	const filteredModels = models;

	return (
		<ModuleFrame
			icon={Car}
			title="Model Management"
			description="Manage car models for each brand. Add model images for the brand selector."
		>
			<Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4} mb={8}>
				<InputGroup maxW={{ base: "full", md: "350px" }}>
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search models..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						borderRadius="xl"
						h="45px"
						bg="white"
						fontSize="14px"
					/>
				</InputGroup>

				<Flex direction={{ base: "column", sm: "row" }} gap={4} w={{ base: "full", md: "auto" }}>
					<input
						type="file"
						id="csv-file-input"
						accept=".csv"
						style={{ display: "none" }}
						onChange={handleCSVUpload}
					/>
					<Button
						variant="outline"
						borderColor={ACCENT}
						color={ACCENT}
						_hover={{ bg: "red.50" }}
						onClick={() => document.getElementById("csv-file-input")?.click()}
						fontSize="15px"
						px={6}
						h="45px"
						borderRadius="xl"
						boxShadow="sm"
						w={{ base: "full", sm: "auto" }}
					>
						Import Specs CSV
					</Button>
					<Button
						leftIcon={<AddIcon />}
						bg={ACCENT}
						color="white"
						_hover={{ bg: "#c00404" }}
						onClick={() => {
							resetForm();
							onOpen();
						}}
						fontSize="15px"
						px={8}
						h="45px"
						borderRadius="xl"
						boxShadow="md"
						w={{ base: "full", sm: "auto" }}
					>
						Add Model
					</Button>
				</Flex>
			</Flex>

			{isLoading ? (
				<Center py={20}>
					<Spinner color={ACCENT} size="lg" thickness="4px" />
				</Center>
			) : (
				<Box
					overflowX="auto"
					bg="white"
					borderRadius="xl"
					boxShadow="sm"
					border="1px solid"
					borderColor="gray.100"
				>
					<Table variant="simple" size="sm" layout="fixed" minW="1000px">
						<Thead bg="gray.50" borderBottom="2px solid" borderColor="gray.100">
							<Tr>
								<Th w="80px" fontSize="12px" fontWeight="700" color="gray.600" py={4}>
									Image
								</Th>
								<Th w="150px" fontSize="12px" fontWeight="700" color="gray.600">
									Name
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="700" color="gray.600">
									Year
								</Th>
								<Th w="150px" fontSize="12px" fontWeight="700" color="gray.600">
									Type
								</Th>
								<Th w="150px" fontSize="12px" fontWeight="700" color="gray.600">
									Slug
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="700" color="gray.600">
									Brand
								</Th>
								<Th w="100px" fontSize="12px" fontWeight="700" color="gray.600">
									Status
								</Th>
								<Th w="100px" fontSize="12px" fontWeight="700" color="gray.600" textAlign="center">
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{filteredModels.length === 0 ? (
								<Tr>
									<Td colSpan={8}>
										<Center py={8}>
											<Text color="gray.400" fontSize="14px">
												No models found
											</Text>
										</Center>
									</Td>
								</Tr>
							) : (
								filteredModels.map((model) => (
									<Tr
										key={model._id}
										_hover={{ bg: "gray.50" }}
										borderBottom="1px solid"
										borderColor="gray.100"
									>
										<Td>
											{model.imageUrl ? (
												<Image src={model.imageUrl} alt={model.name} h="40px" objectFit="contain" />
											) : model.spritePosition ? (
												<Box
													w="60px"
													h="40px"
													backgroundImage="url(/images/car_sprites.png)"
													backgroundPosition={`${model.spritePosition.x || 0}px ${model.spritePosition.y || 0}px`}
													backgroundRepeat="no-repeat"
													backgroundSize="auto"
													border="1px solid"
													borderColor="gray.200"
													borderRadius="md"
												/>
											) : (
												<Text fontSize="12px" color="gray.400">
													No image
												</Text>
											)}
										</Td>
										<Td>
											<Text fontSize="14px" fontWeight="600" color="gray.900" isTruncated>
												{model.name}
											</Text>
										</Td>
										<Td>
											<Text fontSize="13px" color="gray.600" isTruncated>
												{model.year || "-"}
											</Text>
										</Td>
										<Td>
											<Text fontSize="13px" color="gray.600" isTruncated>
												{model.type || "-"}
											</Text>
										</Td>
										<Td>
											<Text fontSize="13px" color="gray.600" fontFamily="mono" isTruncated>
												{model.slug}
											</Text>
										</Td>
										<Td>
											<Text fontSize="13px" color="gray.600" isTruncated>
												{model.brandId?.name || "Unknown"}
											</Text>
										</Td>
										<Td>
											<Badge
												colorScheme={model.isActive ? "green" : "red"}
												fontSize="11px"
												px={2}
												py={1}
												borderRadius="md"
												whiteSpace="nowrap"
											>
												{model.isActive ? "Active" : "Inactive"}
											</Badge>
										</Td>
										<Td>
											<HStack justify="center" spacing={1}>
												{canModify() && (
													<>
														<IconButton
															icon={<EditIcon />}
															size="sm"
															variant="ghost"
															colorScheme="blue"
															onClick={() => handleEdit(model)}
															aria-label="Edit"
														/>
														<IconButton
															icon={<DeleteIcon />}
															size="sm"
															variant="ghost"
															colorScheme="red"
															onClick={() => handleDelete(model._id)}
															isLoading={deleteMutation.isPending}
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

			{!isLoading && totalPages > 1 && (
				<HStack justify="space-between" mt={6} px={2} align="center">
					<Text fontSize="13px" color="gray.500" fontWeight="600">
						Showing {models.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
						{Math.min(page * limit, total)} of {total} models
					</Text>
					<HStack spacing={2}>
						<Button
							size="sm"
							variant="outline"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							isDisabled={page === 1}
							fontSize="13px"
							borderRadius="lg"
						>
							Previous
						</Button>
						
						{/* Page Buttons */}
						{[...Array(totalPages)].map((_, idx) => {
							const pNum = idx + 1;
							// Only show page numbers around current page
							if (pNum === 1 || pNum === totalPages || Math.abs(pNum - page) <= 1) {
								return (
									<Button
										key={pNum}
										size="sm"
										variant={pNum === page ? "solid" : "outline"}
										bg={pNum === page ? ACCENT : "transparent"}
										color={pNum === page ? "white" : "gray.600"}
										_hover={pNum === page ? { bg: "#c00404" } : { bg: "gray.50" }}
										onClick={() => setPage(pNum)}
										fontSize="13px"
										borderRadius="lg"
										minW="32px"
									>
										{pNum}
									</Button>
								);
							}
							if (pNum === 2 || pNum === totalPages - 1) {
								return <Text key={pNum} color="gray.400" fontSize="13px">...</Text>;
							}
							return null;
						})}

						<Button
							size="sm"
							variant="outline"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							isDisabled={page === totalPages || totalPages === 0}
							fontSize="13px"
							borderRadius="lg"
						>
							Next
						</Button>
					</HStack>
				</HStack>
			)}

			{/* Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="18px" fontWeight="700">
						{editingModel ? "Edit Model" : "Add New Model"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel fontSize="13px" fontWeight="700">
									Brand
								</FormLabel>
								<Select
									placeholder="Select a brand"
									value={formData.brandId}
									onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								>
									{brands.map((brand) => (
										<option key={brand._id} value={brand._id}>
											{brand.name}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel fontSize="13px" fontWeight="700">
									Model Name
								</FormLabel>
								<Input
									placeholder="e.g., A1"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Year / Range (Optional)
								</FormLabel>
								<Input
									placeholder="e.g., 2010 - 2018 or 2018 - Present"
									value={formData.year}
									onChange={(e) => setFormData({ ...formData, year: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Body Type (Optional)
								</FormLabel>
								<Input
									placeholder="e.g., Hatchback; Sportback"
									value={formData.type}
									onChange={(e) => setFormData({ ...formData, type: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel fontSize="13px" fontWeight="700">
									URL Slug
								</FormLabel>
								<Input
									placeholder="e.g., 3-series"
									value={formData.slug}
									onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Model Image URL
								</FormLabel>
								<Input
									placeholder="https://example.com/model.png"
									value={formData.imageUrl}
									onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
								<input
									type="file"
									ref={modelInputRef}
									style={{ display: "none" }}
									accept="image/*"
									onChange={handleImageUpload}
								/>
								<Button mt={2} size="sm" variant="outline" onClick={() => modelInputRef.current?.click()}>
									Upload Image
								</Button>
								{formData.imageUrl && (
									<Image
										src={formData.imageUrl}
										alt="Model preview"
										maxH="100px"
										mt={2}
										borderRadius="md"
									/>
								)}
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Sprite Position X (pixels)
								</FormLabel>
								<Input
									type="number"
									placeholder="0"
									value={formData.spritePosition?.x || 0}
									onChange={(e) =>
										setFormData({
											...formData,
											spritePosition: {
												...formData.spritePosition,
												x: parseInt(e.target.value) || 0,
											},
										})
									}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Sprite Position Y (pixels)
								</FormLabel>
								<Input
									type="number"
									placeholder="0"
									value={formData.spritePosition?.y || 0}
									onChange={(e) =>
										setFormData({
											...formData,
											spritePosition: {
												...formData.spritePosition,
												y: parseInt(e.target.value) || 0,
											},
										})
									}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl display="flex" alignItems="center">
								<FormLabel fontSize="13px" fontWeight="700" mb={0}>
									Active
								</FormLabel>
								<Switch
									isChecked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
									colorScheme="green"
									ml={3}
								/>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button
							bg={ACCENT}
							color="white"
							_hover={{ bg: "#c00404" }}
							onClick={handleSave}
							isLoading={saveMutation.isPending}
						>
							{editingModel ? "Update" : "Create"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</ModuleFrame>
	);
}
