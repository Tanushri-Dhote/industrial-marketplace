import React, { useState } from "react";
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
	const [searchTerm, setSearchTerm] = useState("");
	const [editingModel, setEditingModel] = useState(null);
	const [formData, setFormData] = useState({
		brandId: "",
		name: "",
		slug: "",
		imageUrl: "",
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

	// Fetch all models
	const { data: models = [], isLoading } = useQuery({
		queryKey: ["models-admin"],
		queryFn: async () => {
			const res = await API.get("/models/admin/all");
			return res.data?.data || [];
		},
	});

	// Create/Update mutation
	const saveMutation = useMutation({
		mutationFn: async (payload) => {
			if (editingModel) {
				return API.put(`/models/admin/${editingModel._id}`, payload);
			} else {
				return API.post("/models/admin/create", payload);
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

	const filteredModels = models.filter(
		(m) =>
			m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			m.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(m.brandId?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<ModuleFrame
			icon={Car}
			title="Model Management"
			description="Manage car models for each brand. Add model images for the brand selector."
		>
			<HStack justify="space-between" mb={8}>
				<InputGroup maxW="350px">
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
				>
					Add Model
				</Button>
			</HStack>

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
					<Table variant="simple" size="sm" layout="fixed" minW="900px">
						<Thead bg="gray.50" borderBottom="2px solid" borderColor="gray.100">
							<Tr>
								<Th w="100px" fontSize="12px" fontWeight="700" color="gray.600" py={4}>
									Image
								</Th>
								<Th w="200px" fontSize="12px" fontWeight="700" color="gray.600">
									Name
								</Th>
								<Th w="180px" fontSize="12px" fontWeight="700" color="gray.600">
									Slug
								</Th>
								<Th w="150px" fontSize="12px" fontWeight="700" color="gray.600">
									Brand
								</Th>
								<Th w="120px" fontSize="12px" fontWeight="700" color="gray.600">
									Status
								</Th>
								<Th w="130px" fontSize="12px" fontWeight="700" color="gray.600" textAlign="center">
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{filteredModels.length === 0 ? (
								<Tr>
									<Td colSpan={6}>
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
											{model.spritePosition ? (
												<Box
													w="60px"
													h="40px"
													backgroundImage="url(/images/car_sprites.png)"
													backgroundPosition={`${model.spritePosition.x}px ${model.spritePosition.y}px`}
													backgroundRepeat="no-repeat"
													backgroundSize="auto"
													border="1px solid"
													borderColor="gray.200"
													borderRadius="md"
												/>
											) : model.imageUrl ? (
												<Image src={model.imageUrl} alt={model.name} h="40px" objectFit="contain" />
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
									placeholder="e.g., BMW 3 Series"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
								<Button mt={2} size="sm" variant="outline" onClick={handleImageUpload}>
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
