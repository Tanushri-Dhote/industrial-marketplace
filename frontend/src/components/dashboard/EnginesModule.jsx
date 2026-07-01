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

const parseCSV = (text) => {
	const lines = [];
	let row = [""];
	lines.push(row);
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		const next = text[i+1];

		if (c === '"') {
			if (inQuotes && next === '"') {
				row[row.length - 1] += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (c === ',') {
			if (inQuotes) {
				row[row.length - 1] += ',';
			} else {
				row.push('');
			}
		} else if (c === '\n' || c === '\r') {
			if (c === '\r' && next === '\n') {
				i++;
			}
			if (inQuotes) {
				row[row.length - 1] += '\n';
			} else {
				row = [''];
				lines.push(row);
			}
		} else {
			row[row.length - 1] += c;
		}
	}
	return lines;
};

export default function EnginesModule() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [editingProduct, setEditingProduct] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role || "viewer";
	const isViewer = role === "viewer";

	const handleCSVImport = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (evt) => {
			const text = evt.target.result;
			try {
				const rows = parseCSV(text);
				if (rows.length <= 1) {
					toast.error("CSV file is empty or missing headers");
					return;
				}

				const headers = rows[0].map(h => h.trim().toLowerCase());
				const products = [];

				for (let i = 1; i < rows.length; i++) {
					const row = rows[i];
					if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

					const rowData = {};
					headers.forEach((header, index) => {
						rowData[header] = (row[index] || "").trim();
					});

					if (!rowData.name) {
						continue;
					}

					products.push({
						name: rowData.name,
						make: rowData.make || "",
						model: rowData.model || "",
						price: Number(rowData.price) || 0,
						mileage: rowData.mileage || "",
						condition: rowData.condition || "Used",
						description: rowData.description || "",
						additionalDetails: rowData.additionalDetails || "",
						images: rowData.image ? [rowData.image] : ["https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"],
						isSold: false
					});
				}

				if (products.length === 0) {
					toast.error("No valid products found in CSV file");
					return;
				}

				toast.promise(
					API.post("/products/bulk", { products }),
					{
						loading: `Importing ${products.length} products...`,
						success: () => {
							queryClient.invalidateQueries({ queryKey: ["products"] });
							return `Successfully imported ${products.length} products!`;
						},
						error: (err) => err.response?.data?.message || "Import failed"
					}
				);
			} catch (err) {
				console.error(err);
				toast.error("Error parsing CSV: " + err.message);
			}
		};
		reader.readAsText(file);
		e.target.value = ""; // Reset
	};

	const { data: productsData = {}, isLoading } = useQuery({
		queryKey: ["products", currentPage, searchTerm],
		queryFn: async () => {
			const res = await API.get("/products", {
				params: {
					page: currentPage,
					limit: itemsPerPage,
					search: searchTerm || undefined
				}
			});
			return res.data || {};
		},
	});

	const products = productsData.data || [];
	const pagination = productsData.pagination || { total: 0, pages: 1 };

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

	const totalPages = pagination.pages || 1;
	const totalProducts = pagination.total || 0;
	const startIndex = (currentPage - 1) * itemsPerPage;

	useEffect(() => {
		if (currentPage > 1 && currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [totalPages, currentPage]);

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
					<HStack spacing={3}>
						<Button
							variant="outline"
							borderColor="gray.200"
							bg="white"
							_hover={{ bg: "gray.50" }}
							onClick={() => document.getElementById("csv-file-upload").click()}
							fontSize="14px"
							px={6}
							h="45px"
							borderRadius="xl"
							boxShadow="sm"
						>
							Import CSV
						</Button>
						<input
							id="csv-file-upload"
							type="file"
							accept=".csv"
							style={{ display: "none" }}
							onChange={handleCSVImport}
						/>

						<Button
							leftIcon={<AddIcon />}
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c00404" }}
							onClick={() => {
								setEditingProduct(null);
								onOpen();
							}}
							fontSize="14px"
							px={6}
							h="45px"
							borderRadius="xl"
							boxShadow="md"
						>
							Add Engine
						</Button>
					</HStack>
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
			) : products.length === 0 ? (
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
				<VStack align="stretch" spacing={4}>
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
								{products.map((p) => (
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

					{totalPages > 1 && (
						<HStack justify="space-between" mt={2} px={2}>
							<Text fontSize="sm" color="gray.500" fontWeight="600">
								Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalProducts)} of {totalProducts} entries
							</Text>
							<HStack spacing={2}>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
									isDisabled={currentPage === 1}
								>
									Previous
								</Button>
								{Array.from({ length: totalPages }, (_, i) => i + 1)
									.filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
									.map((page, index, array) => {
										const showEllipsis = index > 0 && page - array[index - 1] > 1;
										return (
											<React.Fragment key={page}>
												{showEllipsis && <Text color="gray.400">...</Text>}
												<Button
													size="sm"
													variant={currentPage === page ? "solid" : "outline"}
													colorScheme={currentPage === page ? "red" : "gray"}
													bg={currentPage === page ? "#D90404" : "transparent"}
													color={currentPage === page ? "white" : "gray.600"}
													_hover={currentPage === page ? { bg: "#c00404" } : undefined}
													onClick={() => setCurrentPage(page)}
												>
													{page}
												</Button>
											</React.Fragment>
										);
									})}
								<Button
									size="sm"
									variant="outline"
									onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
									isDisabled={currentPage === totalPages}
								>
									Next
								</Button>
							</HStack>
						</HStack>
					)}
				</VStack>
			)}

			<EngineModal isOpen={isOpen} onClose={onClose} onSave={handleSave} engine={editingProduct} />
		</ModuleFrame>
	);
}

function HtmlTextarea({ label, value, onChange, placeholder, isRequired }) {
	const textareaRef = React.useRef(null);
	const [previewMode, setPreviewMode] = useState(false);

	const insertTag = (openTag, closeTag) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const text = textarea.value;
		const selectedText = text.substring(start, end);
		const replacement = openTag + selectedText + closeTag;

		const newValue = text.substring(0, start) + replacement + text.substring(end);
		onChange(newValue);

		setTimeout(() => {
			if (textarea) {
				textarea.focus();
				textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
			}
		}, 0);
	};

	return (
		<FormControl isRequired={isRequired}>
			<HStack justify="space-between" align="center" mb={2}>
				<FormLabel fontWeight="700" fontSize="12px" color="gray.500" textTransform="uppercase" m={0}>
					{label}
				</FormLabel>
				<HStack bg="gray.100" p={1} borderRadius="lg" spacing={1}>
					<Button 
						size="xs" 
						variant={previewMode ? "ghost" : "solid"} 
						colorScheme={previewMode ? "gray" : "red"} 
						onClick={() => setPreviewMode(false)}
						borderRadius="md"
					>
						Edit
					</Button>
					<Button 
						size="xs" 
						variant={previewMode ? "solid" : "ghost"} 
						colorScheme={previewMode ? "red" : "gray"} 
						onClick={() => setPreviewMode(true)}
						borderRadius="md"
					>
						Preview
					</Button>
				</HStack>
			</HStack>
			
			{!previewMode ? (
				<>
					<HStack spacing={1} mb={2} bg="gray.50" p={1.5} borderRadius="lg" border="1px solid" borderColor="gray.200" flexWrap="wrap">
						<Button size="xs" variant="ghost" fontWeight="bold" onClick={() => insertTag("<b>", "</b>")}>Bold</Button>
						<Button size="xs" variant="ghost" fontStyle="italic" onClick={() => insertTag("<i>", "</i>")}>Italic</Button>
						<Button size="xs" variant="ghost" onClick={() => insertTag("<h3>", "</h3>")}>H3</Button>
						<Button size="xs" variant="ghost" onClick={() => insertTag("<p>", "</p>")}>Paragraph</Button>
						<Button size="xs" variant="ghost" onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}>List</Button>
						<Button size="xs" variant="ghost" onClick={() => insertTag("<li>", "</li>")}>Item</Button>
						<Button size="xs" variant="ghost" onClick={() => insertTag('<a href="" target="_blank">', "</a>")}>Link</Button>
						<Button size="xs" variant="ghost" colorScheme="red" onClick={() => onChange("")}>Clear</Button>
					</HStack>
					<Textarea
						ref={textareaRef}
						borderRadius="xl"
						focusBorderColor="#D90404"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						minH="150px"
						fontFamily="monospace"
						fontSize="13px"
					/>
				</>
			) : (
				<Box 
					p={4} 
					minH="205px" 
					bg="gray.50" 
					borderRadius="xl" 
					border="1px solid" 
					borderColor="gray.200"
					dangerouslySetInnerHTML={{ __html: value || "<i>Nothing to preview</i>" }}
					sx={{
						"ul, ol": { paddingLeft: "20px", marginY: "10px" },
						"li": { marginY: "5px" },
						"p": { marginY: "10px" },
						"h3": { fontSize: "16px", fontWeight: "bold", marginY: "12px", color: "gray.800" },
						"a": { color: "#D90404", textDecoration: "underline" }
					}}
				/>
			)}
		</FormControl>
	);
}

function EngineModal({ isOpen, onClose, onSave, engine }) {
	const [formData, setFormData] = useState({
		name: "",
		make: "",
		model: "",
		price: "",
		description: "",
		additionalDetails: "",
		year: "",
		condition: "Used",
		isSold: false,
		images: [],
		mileage: "",
		compatibility: [],
	});
	const [isManualMakeModel, setIsManualMakeModel] = useState(false);
	const [compMake, setCompMake] = useState("");
	const [compModel, setCompModel] = useState("");

	// Fetch all brands
	const { data: brands = [] } = useQuery({
		queryKey: ["brands", "all"],
		queryFn: async () => {
			const res = await API.get("/brands?all=true");
			return res.data?.data || res.data || [];
		},
		enabled: isOpen,
	});

	// Find the selected brand object
	const selectedBrandObj = brands.find(
		(b) =>
			(b.name || "").toLowerCase() === (formData.make || "").toLowerCase() ||
			(b.slug || "").toLowerCase() === (formData.make || "").toLowerCase()
	);

	// Fetch models for the selected brand
	const { data: models = [], isLoading: loadingModels } = useQuery({
		queryKey: ["models", selectedBrandObj?._id, "all"],
		queryFn: async () => {
			if (!selectedBrandObj?._id) return [];
			const res = await API.get(`/models/${selectedBrandObj._id}?all=true`);
			return res.data?.data || res.data || [];
		},
		enabled: isOpen && !!selectedBrandObj?._id,
	});

	// Fetch models for compatible brand
	const compBrandObj = brands.find(
		(b) =>
			(b.name || "").toLowerCase() === compMake.toLowerCase() ||
			(b.slug || "").toLowerCase() === compMake.toLowerCase()
	);

	const { data: compModels = [], isLoading: loadingCompModels } = useQuery({
		queryKey: ["compModels", compBrandObj?._id, "all"],
		queryFn: async () => {
			if (!compBrandObj?._id) return [];
			const res = await API.get(`/models/${compBrandObj._id}?all=true`);
			return res.data?.data || res.data || [];
		},
		enabled: isOpen && !!compBrandObj?._id,
	});

	useEffect(() => {
		if (engine) {
			setFormData({
				name: engine.name || "",
				make: engine.make || "",
				model: engine.model || "",
				price: engine.price || "",
				description: engine.description || "",
				additionalDetails: engine.additionalDetails || "",
				year: engine.year || "",
				condition: engine.condition || "Used",
				isSold: engine.isSold || false,
				images: engine.images || [],
				mileage: engine.mileage || "",
				compatibility: engine.compatibility || [],
			});
			setIsManualMakeModel(!brands.some(b => b.name.toLowerCase() === (engine.make || "").toLowerCase()));
		} else {
			setFormData({
				name: "",
				make: "",
				model: "",
				price: "",
				description: "",
				additionalDetails: "",
				year: "",
				condition: "Used",
				isSold: false,
				images: [],
				mileage: "",
				compatibility: [],
			});
			setIsManualMakeModel(false);
		}
	}, [engine, isOpen, brands]);

	const updateField = (f, v) => setFormData((p) => ({ ...p, [f]: v }));

	const handleAddCompatibility = () => {
		if (!compMake || !compModel) return;
		const exists = (formData.compatibility || []).some(
			(c) => c.make?.toLowerCase() === compMake.toLowerCase() && c.model?.toLowerCase() === compModel.toLowerCase()
		);
		if (!exists) {
			updateField("compatibility", [...(formData.compatibility || []), { make: compMake, model: compModel }]);
		}
		setCompMake("");
		setCompModel("");
	};

	const handleRemoveCompatibility = (idx) => {
		updateField("compatibility", (formData.compatibility || []).filter((_, i) => i !== idx));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
			<ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
			<ModalContent borderRadius="2xl" overflow="hidden" maxW="1200px">
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
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
						{/* Left Column — Core Details */}
						<VStack spacing={6} align="stretch">
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

							{/* Brand and Model Flow */}
							<Box p={5} bg="gray.50" borderRadius="2xl" border="1px solid" borderColor="gray.200">
								<HStack justify="space-between" mb={4}>
									<Text fontSize="12px" fontWeight="800" color="gray.500" textTransform="uppercase">
										Brand & Model Selection
									</Text>
									<Button
										size="xs"
										variant="link"
										colorScheme="red"
										onClick={() => setIsManualMakeModel(!isManualMakeModel)}
										fontWeight="bold"
									>
										{isManualMakeModel ? "Select from list" : "Enter manually"}
									</Button>
								</HStack>

								{isManualMakeModel ? (
									<SimpleGrid columns={2} spacing={4}>
										<FormControl>
											<FormLabel fontSize="11px" fontWeight="700" color="gray.600">MAKE</FormLabel>
											<Input
												bg="white"
												size="md"
												borderRadius="lg"
												focusBorderColor="#D90404"
												value={formData.make}
												onChange={(e) => {
													updateField("make", e.target.value);
													updateField("model", "");
												}}
												placeholder="Ford, Perkins..."
											/>
										</FormControl>
										<FormControl>
											<FormLabel fontSize="11px" fontWeight="700" color="gray.600">MODEL</FormLabel>
											<Input
												bg="white"
												size="md"
												borderRadius="lg"
												focusBorderColor="#D90404"
												value={formData.model}
												onChange={(e) => updateField("model", e.target.value)}
												placeholder="Transit, V8..."
											/>
										</FormControl>
									</SimpleGrid>
								) : (
									<SimpleGrid columns={2} spacing={4}>
										<FormControl isRequired>
											<FormLabel fontSize="11px" fontWeight="700" color="gray.600">SELECT BRAND</FormLabel>
											<Select
												bg="white"
												size="md"
												borderRadius="lg"
												focusBorderColor="#D90404"
												value={formData.make}
												onChange={(e) => {
													updateField("make", e.target.value);
													updateField("model", "");
												}}
												placeholder="Select Brand"
											>
												{brands.map((b) => (
													<option key={b._id} value={b.name}>
														{b.name}
													</option>
												))}
											</Select>
										</FormControl>
										<FormControl isRequired>
											<FormLabel fontSize="11px" fontWeight="700" color="gray.600">SELECT MODEL</FormLabel>
											<Select
												bg="white"
												size="md"
												borderRadius="lg"
												focusBorderColor="#D90404"
												value={formData.model}
												onChange={(e) => updateField("model", e.target.value)}
												isDisabled={!formData.make || loadingModels}
												placeholder={loadingModels ? "Loading models..." : "Select Model"}
											>
												{(() => {
													const uniqueModels = [];
													const modelNamesSeen = new Set();
													for (const m of models) {
														if (!modelNamesSeen.has(m.name)) {
															modelNamesSeen.add(m.name);
															uniqueModels.push(m);
														}
													}
													return uniqueModels.map((m) => (
														<option key={m._id} value={m.name}>
															{m.name}
														</option>
													));
												})()}
											</Select>
										</FormControl>
									</SimpleGrid>
								)}
							</Box>

							{/* Compatibility Tagging */}
							<Box p={5} bg="gray.50" borderRadius="2xl" border="1px solid" borderColor="gray.200">
								<Text fontSize="12px" fontWeight="800" color="gray.500" textTransform="uppercase" mb={3}>
									Vehicle Compatibility Fitments
								</Text>

								{/* Add Compatibility Form */}
								<SimpleGrid columns={3} spacing={3} mb={4} alignItems="end">
									<FormControl>
										<FormLabel fontSize="11px" fontWeight="700" color="gray.600">COMPATIBLE BRAND</FormLabel>
										<Select
											bg="white"
											size="sm"
											borderRadius="md"
											focusBorderColor="#D90404"
											value={compMake}
											onChange={(e) => {
												setCompMake(e.target.value);
												setCompModel("");
											}}
											placeholder="Brand"
										>
											{brands.map((b) => (
												<option key={b._id} value={b.name}>
													{b.name}
												</option>
											))}
										</Select>
									</FormControl>

									<FormControl>
										<FormLabel fontSize="11px" fontWeight="700" color="gray.600">COMPATIBLE MODEL</FormLabel>
										<Select
											bg="white"
											size="sm"
											borderRadius="md"
											focusBorderColor="#D90404"
											value={compModel}
											onChange={(e) => setCompModel(e.target.value)}
											isDisabled={!compMake || loadingCompModels}
											placeholder={loadingCompModels ? "Loading..." : "Model"}
										>
											{(() => {
												const uniqueCompModels = [];
												const compNamesSeen = new Set();
												for (const m of compModels) {
													if (!compNamesSeen.has(m.name)) {
														compNamesSeen.add(m.name);
														uniqueCompModels.push(m);
													}
												}
												return uniqueCompModels.map((m) => (
													<option key={m._id} value={m.name}>
														{m.name}
													</option>
												));
											})()}
										</Select>
									</FormControl>

									<Button
										size="sm"
										bg="#D90404"
										color="white"
										_hover={{ bg: "#c00404" }}
										onClick={handleAddCompatibility}
										isDisabled={!compMake || !compModel}
									>
										Add Tag
									</Button>
								</SimpleGrid>

								{/* Current Compatibility Tags List */}
								{formData.compatibility && formData.compatibility.length > 0 ? (
									<Flex wrap="wrap" gap={2}>
										{formData.compatibility.map((c, idx) => (
											<Badge
												key={idx}
												colorScheme="red"
												variant="subtle"
												px={2.5}
												py={1}
												borderRadius="md"
												display="flex"
												alignItems="center"
												gap={1}
											>
												<Text fontSize="11px" fontWeight="700">
													{c.make} {c.model}
												</Text>
												<IconButton
													icon={<DeleteIcon />}
													size="2xs"
													variant="ghost"
													colorScheme="red"
													onClick={() => handleRemoveCompatibility(idx)}
													aria-label="Remove compatibility"
													minW="auto"
													h="auto"
													p={0.5}
												/>
											</Badge>
										))}
									</Flex>
								) : (
									<Text fontSize="12px" color="gray.400" fontStyle="italic">
										No specific compatibilities defined yet.
									</Text>
								)}
							</Box>

							<SimpleGrid columns={2} spacing={4}>
								<FormControl>
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
								<FormControl isRequired>
									<FormLabel
										fontWeight="700"
										fontSize="12px"
										color="gray.500"
										textTransform="uppercase"
									>
										MILEAGE
									</FormLabel>
									<Input
										size="lg"
										borderRadius="xl"
										focusBorderColor="#D90404"
										value={formData.mileage}
										onChange={(e) => updateField("mileage", e.target.value)}
										placeholder="e.g. 45,000 miles"
									/>
								</FormControl>
							</SimpleGrid>

							<SimpleGrid columns={2} spacing={4}>
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
								<FormControl>
									<FormLabel
										fontWeight="700"
										fontSize="12px"
										color="gray.500"
										textTransform="uppercase"
									>
										STATUS
									</FormLabel>
									<Select
										size="lg"
										borderRadius="xl"
										focusBorderColor="#D90404"
										value={formData.isSold ? "sold" : "available"}
										onChange={(e) => updateField("isSold", e.target.value === "sold")}
									>
										<option value="available">Available</option>
										<option value="sold">Sold</option>
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
						</VStack>

						{/* Right Column — Rich Text Editors */}
						<VStack spacing={6} align="stretch">
							<HtmlTextarea
								label="Description"
								value={formData.description}
								onChange={(val) => updateField("description", val)}
								placeholder="Enter HTML description (warranty details, history, technical features...)"
								isRequired={true}
							/>

							<HtmlTextarea
								label="Additional Details (Optional Custom Details)"
								value={formData.additionalDetails}
								onChange={(val) => updateField("additionalDetails", val)}
								placeholder="Enter HTML additional details (e.g. customized delivery options, special compatibility notes...)"
								isRequired={false}
							/>
						</VStack>
					</SimpleGrid>
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
							isDisabled={
								!formData.name?.trim() ||
								!formData.description?.trim() ||
								!formData.mileage?.trim() ||
								!formData.images ||
								formData.images.length === 0
							}
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
