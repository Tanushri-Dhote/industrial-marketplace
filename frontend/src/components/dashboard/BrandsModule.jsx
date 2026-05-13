import React, { useState, useCallback } from "react";
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
	Image,
	Textarea,
	Switch,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Tag } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";

const ACCENT = "#D90404";

export default function BrandsModule() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [editingBrand, setEditingBrand] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		productMake: "",
		logoUrl: "",
		spriteSheetUrl: "",
		spriteSize: { width: 105, height: 105 },
		spritePosition: { x: 0, y: 0 },
		heroImage: "",
		description: "",
		isActive: true,
	});
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Fetch all brands
	const { data: brands = [], isLoading } = useQuery({
		queryKey: ["brands-admin"],
		queryFn: async () => {
			const res = await API.get("/brands/admin/all");
			return res.data?.data || [];
		},
	});

	// Create/Update mutation
	const saveMutation = useMutation({
		mutationFn: async (payload) => {
			if (editingBrand) {
				return API.put(`/brands/admin/${editingBrand._id}`, payload);
			} else {
				return API.post("/brands/admin/create", payload);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["brands-admin"] });
			queryClient.invalidateQueries({ queryKey: ["brands"] });
			toast.success(editingBrand ? "Brand updated" : "Brand created");
			resetForm();
			onClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Operation failed");
		},
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: async (id) => API.delete(`/brands/admin/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["brands-admin"] });
			queryClient.invalidateQueries({ queryKey: ["brands"] });
			toast.success("Brand deleted");
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Delete failed");
		},
	});

	const resetForm = () => {
		setFormData({
			name: "",
			slug: "",
			productMake: "",
			logoUrl: "",
			spriteSheetUrl: "",
			spriteSize: { width: 105, height: 105 },
			spritePosition: { x: 0, y: 0 },
			heroImage: "",
			description: "",
			isActive: true,
		});
		setEditingBrand(null);
	};

	const handleEdit = (brand) => {
		setEditingBrand(brand);
		setFormData({
			...brand,
			spriteSize: brand.spriteSize || { width: 105, height: 105 },
			spritePosition: brand.spritePosition || { x: 0, y: 0 },
		});
		onOpen();
	};

	const handleSave = () => {
		if (!formData.name || !formData.slug || !formData.productMake || !formData.logoUrl) {
			toast.error("Please fill in all required fields");
			return;
		}
		saveMutation.mutate(formData);
	};

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this brand?")) return;
		deleteMutation.mutate(id);
	};

	const handleImageUpload = async (e, field) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const uploadFormData = new FormData();
		uploadFormData.append("file", file);

		try {
			// Assuming you have a file upload endpoint, adjust accordingly
			toast.loading("Uploading image...");
			const res = await API.post("/upload", uploadFormData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setFormData({ ...formData, [field]: res.data?.url || res.data?.data?.url });
			toast.dismiss();
			toast.success("Image uploaded");
		} catch (err) {
			toast.dismiss();
			toast.error("Upload failed - check your upload endpoint");
			console.log("For now, paste image URL directly in the field");
		}
	};

	const filteredBrands = brands.filter(
		(b) =>
			b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			b.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
			b.productMake.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<ModuleFrame
			icon={Tag}
			title="Brand Management"
			description="Manage car brands and their details. Add logos and descriptions for the brand selector."
		>
			<HStack justify="space-between" mb={8}>
				<InputGroup maxW="350px">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search brands..."
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
					Add Brand
				</Button>
			</HStack>

			{isLoading ? (
				<Center py={20}>
					<Spinner color={ACCENT} size="lg" thickness="4px" />
				</Center>
			) : (
				<Box overflowX="auto" bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
					<Table variant="simple" size="sm" layout="fixed" minW="900px">
						<Thead bg="gray.50" borderBottom="2px solid" borderColor="gray.100">
							<Tr>
								<Th w="120px" fontSize="12px" fontWeight="700" color="gray.600" py={4}>
									Logo
								</Th>
								<Th w="200px" fontSize="12px" fontWeight="700" color="gray.600">
									Name
								</Th>
								<Th w="180px" fontSize="12px" fontWeight="700" color="gray.600">
									Slug
								</Th>
								<Th w="150px" fontSize="12px" fontWeight="700" color="gray.600">
									Make
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
							{filteredBrands.length === 0 ? (
								<Tr>
									<Td colSpan={6}>
										<Center py={8}>
											<Text color="gray.400" fontSize="14px">
												No brands found
											</Text>
										</Center>
									</Td>
								</Tr>
							) : (
								filteredBrands.map((brand) => (
									<Tr
										key={brand._id}
										_hover={{ bg: "gray.50" }}
										borderBottom="1px solid"
										borderColor="gray.100"
									>
										<Td>
											{brand.spriteSheetUrl ? (
												<Box
													className="make-sprite"
													w={`${brand.spriteSize?.width || 105}px`}
													h={`${brand.spriteSize?.height || 105}px`}
													backgroundImage={`url(${brand.spriteSheetUrl})`}
													backgroundPosition={`${brand.spritePosition?.x || 0}px ${brand.spritePosition?.y || 0}px`}
													transform="scale(0.35)"
													transformOrigin="left center"
												/>
											) : (
												<Image src={brand.logoUrl} alt={brand.name} h="36px" objectFit="contain" />
											)}
										</Td>
										<Td>
											<Text fontSize="14px" fontWeight="600" color="gray.900" isTruncated>
												{brand.name}
											</Text>
										</Td>
										<Td>
											<Text fontSize="13px" color="gray.600" fontFamily="mono" isTruncated>
												{brand.slug}
											</Text>
										</Td>
										<Td>
											<Text fontSize="13px" color="gray.600" isTruncated>
												{brand.productMake}
											</Text>
										</Td>
										<Td>
											<Badge
												colorScheme={brand.isActive ? "green" : "red"}
												fontSize="11px"
												px={2}
												py={1}
												borderRadius="md"
												whiteSpace="nowrap"
											>
												{brand.isActive ? "Active" : "Inactive"}
											</Badge>
										</Td>
										<Td>
											<HStack justify="center" spacing={1} whiteSpace="nowrap">
												<IconButton
													icon={<EditIcon />}
													size="sm"
													variant="ghost"
													colorScheme="blue"
													onClick={() => handleEdit(brand)}
													aria-label="Edit"
												/>
												<IconButton
													icon={<DeleteIcon />}
													size="sm"
													variant="ghost"
													colorScheme="red"
													onClick={() => handleDelete(brand._id)}
													isLoading={deleteMutation.isPending}
													aria-label="Delete"
												/>
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
						{editingBrand ? "Edit Brand" : "Add New Brand"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel fontSize="13px" fontWeight="700">
									Brand Name
								</FormLabel>
								<Input
									placeholder="e.g., BMW"
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
									placeholder="e.g., bmw"
									value={formData.slug}
									onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel fontSize="13px" fontWeight="700">
									Product Make
								</FormLabel>
								<Input
									placeholder="e.g., BMW"
									value={formData.productMake}
									onChange={(e) => setFormData({ ...formData, productMake: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Logo URL (Fallback)
								</FormLabel>
								<Input
									placeholder="https://example.com/logo.png"
									value={formData.logoUrl}
									onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
								<Button
									mt={2}
									size="sm"
									variant="outline"
									onClick={(e) => handleImageUpload(e, "logoUrl")}
								>
									Upload Logo
								</Button>
							</FormControl>

							<Box w="full" p={4} border="1px dashed" borderColor="gray.200" borderRadius="xl">
								<Text fontSize="14px" fontWeight="800" mb={4} color={ACCENT}>
									Sprite Configuration (Preferred)
								</Text>
								<VStack spacing={4}>
									<FormControl>
										<FormLabel fontSize="12px" fontWeight="700">Sprite Sheet URL</FormLabel>
										<Input
											placeholder="https://example.com/sprites.png"
											value={formData.spriteSheetUrl}
											onChange={(e) => setFormData({ ...formData, spriteSheetUrl: e.target.value })}
											borderRadius="lg" fontSize="14px" h="40px"
										/>
									</FormControl>
									<HStack w="full">
										<FormControl>
											<FormLabel fontSize="11px">Width</FormLabel>
											<Input
												type="number"
												value={formData.spriteSize?.width || 0}
												onChange={(e) => setFormData({ ...formData, spriteSize: { ...formData.spriteSize, width: parseInt(e.target.value) || 0 } })}
												borderRadius="lg" fontSize="14px" h="40px"
											/>
										</FormControl>
										<FormControl>
											<FormLabel fontSize="11px">Height</FormLabel>
											<Input
												type="number"
												value={formData.spriteSize?.height || 0}
												onChange={(e) => setFormData({ ...formData, spriteSize: { ...formData.spriteSize, height: parseInt(e.target.value) || 0 } })}
												borderRadius="lg" fontSize="14px" h="40px"
											/>
										</FormControl>
									</HStack>
									<HStack w="full">
										<FormControl>
											<FormLabel fontSize="11px">Pos X</FormLabel>
											<Input
												type="number"
												value={formData.spritePosition?.x || 0}
												onChange={(e) => setFormData({ ...formData, spritePosition: { ...formData.spritePosition, x: parseInt(e.target.value) || 0 } })}
												borderRadius="lg" fontSize="14px" h="40px"
											/>
										</FormControl>
										<FormControl>
											<FormLabel fontSize="11px">Pos Y</FormLabel>
											<Input
												type="number"
												value={formData.spritePosition?.y || 0}
												onChange={(e) => setFormData({ ...formData, spritePosition: { ...formData.spritePosition, y: parseInt(e.target.value) || 0 } })}
												borderRadius="lg" fontSize="14px" h="40px"
											/>
										</FormControl>
									</HStack>
								</VStack>
							</Box>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Hero Image URL
								</FormLabel>
								<Input
									placeholder="https://example.com/hero.png"
									value={formData.heroImage}
									onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									h="40px"
								/>
								<Button
									mt={2}
									size="sm"
									variant="outline"
									onClick={(e) => handleImageUpload(e, "heroImage")}
								>
									Upload Hero Image
								</Button>
								{formData.heroImage && (
									<Image
										src={formData.heroImage}
										alt="Hero preview"
										maxH="120px"
										mt={2}
										borderRadius="md"
									/>
								)}
							</FormControl>

							<FormControl>
								<FormLabel fontSize="13px" fontWeight="700">
									Description
								</FormLabel>
								<Textarea
									placeholder="Brand description..."
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									borderRadius="lg"
									fontSize="14px"
									minH="100px"
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
							{editingBrand ? "Update" : "Create"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</ModuleFrame>
	);
}
