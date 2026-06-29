import React, { useState, useEffect } from "react";
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
	SimpleGrid,
	Text,
	Icon,
	Select,
	Spinner,
	Center,
	InputGroup,
	InputLeftElement,
	Textarea,
	Image,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";

export default function EnginesModule() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [editingProduct, setEditingProduct] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role || "viewer";
	const isViewer = role === "viewer";

	const { data: products = [], isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const res = await API.get("/products");
			return Array.isArray(res.data) ? res.data : res.data.data || [];
		},
	});

	const saveMutation = useMutation({
		mutationFn: async (payload) => {
			if (editingProduct) {
				return API.put(`/products/${editingProduct._id}`, payload);
			} else {
				return API.post("/products", payload);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success(editingProduct ? "Product updated" : "Product added");
			onClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Operation failed");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id) => API.delete(`/products/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product deleted");
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Delete failed");
		},
	});

	const handleSave = (data) => {
		saveMutation.mutate(data);
	};

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this product?")) return;
		deleteMutation.mutate(id);
	};

	const filteredProducts = products.filter(
		(p) =>
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(p.make && p.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(p.model && p.model.toLowerCase().includes(searchTerm.toLowerCase())),
	);

	return (
		<ModuleFrame
			icon={Package}
			title="Engine Inventory"
			description="Manage your industrial engine catalog. Track stock, specifications, and pricing across all your tenant sites."
		>
			<HStack justify="space-between" mb={8}>
				<InputGroup maxW="350px">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search engines, make, model..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						borderRadius="xl"
						h="45px"
						bg="white"
						fontSize="14px"
					/>
				</InputGroup>

				{!isViewer && (
					<Button
						leftIcon={<AddIcon />}
						bg="#D90404"
						color="white"
						_hover={{ bg: "#c00404" }}
						onClick={() => {
							setEditingProduct(null);
							onOpen();
						}}
						fontSize="15px"
						px={8}
						h="45px"
						borderRadius="xl"
						boxShadow="md"
					>
						Add Engine
					</Button>
				)}
			</HStack>

			{isLoading ? (
				<Center py={20}>
					<VStack spacing={4}>
						<Spinner color="#D90404" size="xl" thickness="4px" />
						<Text color="gray.500" fontWeight="600">
							Fetching inventory...
						</Text>
					</VStack>
				</Center>
			) : filteredProducts.length === 0 ? (
				<Center py={20} bg="gray.50" borderRadius="2xl" border="2px dashed" borderColor="gray.200">
					<VStack spacing={3}>
						<Icon as={Package} boxSize={12} color="gray.300" />
						<Text color="gray.500" fontWeight="700" fontSize="18px">
							No products found
						</Text>
						<Text color="gray.400" fontSize="14px">
							Try adjusting your search or add a new engine.
						</Text>
					</VStack>
				</Center>
			) : (
				<Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
					<Table variant="simple" size="md" layout="fixed" minW="1000px">
						<Thead bg="gray.50">
							<Tr>
								<Th
									w="300px"
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Product Info
								</Th>
								<Th
									w="250px"
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Specifications
								</Th>
								<Th
									w="120px"
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Price
								</Th>
								<Th
									w="150px"
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Status
								</Th>
								{!isViewer && (
									<Th
										w="120px"
										fontSize="11px"
										fontWeight="800"
										textTransform="uppercase"
										color="gray.500"
										py={4}
									>
										Actions
									</Th>
								)}
							</Tr>
						</Thead>
						<Tbody>
							{filteredProducts.map((p) => (
								<Tr key={p._id} _hover={{ bg: "gray.50/50" }}>
									<Td>
										<HStack spacing={3} maxW="280px">
											<Image
												src={p.images?.[0] || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=80&q=80"}
												alt={p.name}
												boxSize="40px"
												borderRadius="lg"
												objectFit="cover"
												bg="gray.50"
												border="1px solid"
												borderColor="gray.100"
												fallback={<Center boxSize="40px" bg="gray.100" borderRadius="lg"><Icon as={Package} color="gray.400" /></Center>}
											/>
											<VStack align="flex-start" spacing={0} isTruncated w="full">
												<Text fontWeight="800" color="gray.800" fontSize="14px" isTruncated w="full">
													{p.name}
												</Text>
												<Text fontSize="12px" color="gray.500">
													ID: {p._id.substring(0, 8)}...
												</Text>
											</VStack>
										</HStack>
									</Td>
									<Td>
										<HStack spacing={2} whiteSpace="nowrap">
											<Badge
												variant="subtle"
												colorScheme="blue"
												fontSize="10px"
												px={2}
												borderRadius="md"
												maxW="110px"
												isTruncated
											>
												{p.make || "Any Make"}
											</Badge>
											<Badge
												variant="subtle"
												colorScheme="purple"
												fontSize="10px"
												px={2}
												borderRadius="md"
												maxW="110px"
												isTruncated
											>
												{p.model || "Any Model"}
											</Badge>
										</HStack>
									</Td>
									<Td>
										<Text fontWeight="900" color="#D90404" fontSize="15px" whiteSpace="nowrap">
											{p.currency || "£"}
											{p.price?.toLocaleString() || "0.00"}
										</Text>
									</Td>
									<Td>
										<Badge
											colorScheme={p.isSold ? "red" : "green"}
											fontSize="11px"
											borderRadius="full"
											px={3}
											py={1}
											textTransform="uppercase"
											variant="solid"
											whiteSpace="nowrap"
										>
											{p.isSold ? "Sold" : "Available"}
										</Badge>
									</Td>
									{!isViewer && (
										<Td>
											<HStack spacing={1} whiteSpace="nowrap">
												<IconButton
													icon={<EditIcon />}
													size="sm"
													variant="ghost"
													onClick={() => {
														setEditingProduct(p);
														onOpen();
													}}
													aria-label="Edit Engine"
												/>
												<IconButton
													icon={<DeleteIcon />}
													size="sm"
													variant="ghost"
													colorScheme="red"
													onClick={() => handleDelete(p._id)}
													aria-label="Delete Engine"
												/>
											</HStack>
										</Td>
									)}
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}

			<EngineModal isOpen={isOpen} onClose={onClose} onSave={handleSave} engine={editingProduct} />
		</ModuleFrame>
	);
}

function EngineModal({ isOpen, onClose, onSave, engine }) {
	const [formData, setFormData] = useState({
		name: "",
		make: "",
		model: "",
		price: "",
		description: "",
		year: "",
		condition: "Used",
		isSold: false,
		images: [],
	});

	useEffect(() => {
		if (engine) {
			setFormData({
				name: engine.name || "",
				make: engine.make || "",
				model: engine.model || "",
				price: engine.price || "",
				description: engine.description || "",
				year: engine.year || "",
				condition: engine.condition || "Used",
				isSold: engine.isSold || false,
				images: engine.images || [],
			});
		} else {
			setFormData({
				name: "",
				make: "",
				model: "",
				price: "",
				description: "",
				year: "",
				condition: "Used",
				isSold: false,
				images: [],
			});
		}
	}, [engine, isOpen]);

	const updateField = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
			<ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
			<ModalContent borderRadius="2xl" overflow="hidden">
				<ModalHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.100" py={6}>
					<HStack spacing={3}>
						<Icon as={Package} color="#D90404" />
						<Text fontSize="18px" fontWeight="800">
							{engine ? "Edit Engine Unit" : "Add New Engine"}
						</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton top={6} />

				<ModalBody p={8}>
					<VStack spacing={6} align="stretch" py={4}>
						<FormControl isRequired>
							<FormLabel
								fontWeight="700"
								fontSize="12px"
								color="gray.500"
								textTransform="uppercase"
							>
								PRODUCT NAME
							</FormLabel>
							<Input
								size="lg"
								borderRadius="xl"
								focusBorderColor="#D90404"
								value={formData.name}
								onChange={(e) => updateField("name", e.target.value)}
								placeholder="e.g. Ford Transit 2.0 EcoBlue Engine"
							/>
						</FormControl>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl>
								<FormLabel
									fontWeight="700"
									fontSize="12px"
									color="gray.500"
									textTransform="uppercase"
								>
									MAKE
								</FormLabel>
								<Input
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
									value={formData.make}
									onChange={(e) => updateField("make", e.target.value)}
									placeholder="Ford, Perkins..."
								/>
							</FormControl>
							<FormControl>
								<FormLabel
									fontWeight="700"
									fontSize="12px"
									color="gray.500"
									textTransform="uppercase"
								>
									MODEL
								</FormLabel>
								<Input
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
									value={formData.model}
									onChange={(e) => updateField("model", e.target.value)}
									placeholder="Transit, V8..."
								/>
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel
									fontWeight="700"
									fontSize="12px"
									color="gray.500"
									textTransform="uppercase"
								>
									PRICE (£)
								</FormLabel>
								<Input
									type="number"
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
									value={formData.price}
									onChange={(e) => updateField("price", e.target.value)}
									placeholder="1500"
								/>
							</FormControl>
							<FormControl>
								<FormLabel
									fontWeight="700"
									fontSize="12px"
									color="gray.500"
									textTransform="uppercase"
								>
									CONDITION
								</FormLabel>
								<Select
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
									value={formData.condition}
									onChange={(e) => updateField("condition", e.target.value)}
								>
									<option value="Used">Used</option>
									<option value="New">New</option>
									<option value="Reconditioned">Reconditioned</option>
								</Select>
							</FormControl>
						</SimpleGrid>

						<FormControl>
							<FormLabel
								fontWeight="700"
								fontSize="12px"
								color="gray.500"
								textTransform="uppercase"
							>
								PRODUCT IMAGES
							</FormLabel>
							<VStack align="stretch" spacing={4}>
								{/* Image Preview Grid */}
								{formData.images && formData.images.length > 0 && (
									<SimpleGrid columns={4} spacing={3}>
										{formData.images.map((img, idx) => (
											<Box
												key={idx}
												position="relative"
												borderRadius="xl"
												overflow="hidden"
												border="1px solid"
												borderColor="gray.200"
												h="80px"
											>
												<Image
													src={img}
													alt={`Product Image ${idx + 1}`}
													w="full"
													h="full"
													objectFit="cover"
												/>
												<IconButton
													icon={<DeleteIcon />}
													size="xs"
													colorScheme="red"
													position="absolute"
													top={1}
													right={1}
													borderRadius="full"
													onClick={() => {
														const updated = formData.images.filter((_, i) => i !== idx);
														updateField("images", updated);
													}}
													aria-label="Remove Image"
												/>
											</Box>
										))}
									</SimpleGrid>
								)}
								
								{/* File Upload Zone */}
								<Box
									border="2px dashed"
									borderColor="gray.200"
									borderRadius="xl"
									p={4}
									textAlign="center"
									cursor="pointer"
									_hover={{ borderColor: "#D90404", bg: "gray.50" }}
									onClick={() => document.getElementById("product-image-upload").click()}
									position="relative"
								>
									<VStack spacing={1}>
										<Text fontSize="14px" fontWeight="600" color="gray.600">
											Click to upload images
										</Text>
										<Text fontSize="11px" color="gray.400">
											PNG, JPG, JPEG (Base64 saved)
										</Text>
									</VStack>
									<input
										id="product-image-upload"
										type="file"
										multiple
										accept="image/*"
										style={{ display: "none" }}
										onChange={(e) => {
											const files = Array.from(e.target.files || []);
											files.forEach((file) => {
												const reader = new FileReader();
												reader.onloadend = () => {
													setFormData((prev) => ({
														...prev,
														images: [...(prev.images || []), reader.result]
													}));
												};
												reader.readAsDataURL(file);
											});
											e.target.value = ""; // Reset
										}}
									/>
								</Box>
							</VStack>
						</FormControl>

						<FormControl>
							<FormLabel
								fontWeight="700"
								fontSize="12px"
								color="gray.500"
								textTransform="uppercase"
							>
								DESCRIPTION
							</FormLabel>
							<Textarea
								borderRadius="xl"
								focusBorderColor="#D90404"
								value={formData.description}
								onChange={(e) => updateField("description", e.target.value)}
								placeholder="Detailed technical specs, warranty info, etc."
								minH="120px"
							/>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" py={6}>
					<HStack spacing={3}>
						<Button variant="ghost" onClick={onClose} borderRadius="lg">
							Cancel
						</Button>
						<Button
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c00404" }}
							onClick={() => onSave(formData)}
							isDisabled={!formData.name || !formData.price}
							borderRadius="lg"
							px={8}
						>
							{engine ? "Update Engine" : "Save Engine"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
