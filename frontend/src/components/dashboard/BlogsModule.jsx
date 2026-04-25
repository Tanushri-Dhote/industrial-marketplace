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
	Textarea,
	Select,
	useDisclosure,
	Badge,
	Box,
	VStack,
	SimpleGrid,
	Text,
	Icon,
	Spinner,
	Center,
	InputGroup,
	InputLeftElement,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { BookOpen, Edit3, FileText } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";

export default function BlogsModule() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [editingBlog, setEditingBlog] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const role = user.role || "viewer";
	const isViewer = role === "viewer";

	const { data: blogs = [], isLoading } = useQuery({
		queryKey: ["blogs"],
		queryFn: async () => {
			const res = await API.get("/blogs");
			return res.data.data || [];
		},
	});

	const saveMutation = useMutation({
		mutationFn: async (payload) => {
			if (editingBlog) {
				return API.put(`/blogs/${editingBlog._id}`, payload);
			} else {
				return API.post("/blogs", payload);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			toast.success(editingBlog ? "Blog updated successfully" : "Blog published successfully");
			onClose();
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Operation failed");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id) => API.delete(`/blogs/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			toast.success("Blog deleted");
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Delete failed");
		},
	});

	const handleSave = (data) => {
		saveMutation.mutate(data);
	};

	const handleDelete = (id) => {
		if (!window.confirm("Are you sure you want to delete this blog post?")) return;
		deleteMutation.mutate(id);
	};

	const filteredBlogs = blogs.filter(
		(b) =>
			b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase())),
	);

	return (
		<ModuleFrame
			icon={BookOpen}
			title="Blog & Content Management"
			description="Create and manage industrial-themed blog posts to drive traffic and engagement. Edit drafts or publish new articles directly."
		>
			<HStack justify="space-between" mb={8}>
				<InputGroup maxW="350px">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search by title or author..."
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
							setEditingBlog(null);
							onOpen();
						}}
						fontSize="15px"
						px={8}
						h="45px"
						borderRadius="xl"
						boxShadow="md"
					>
						Add Blog Post
					</Button>
				)}
			</HStack>

			{isLoading ? (
				<Center py={20}>
					<VStack spacing={4}>
						<Spinner color="#D90404" size="xl" thickness="4px" />
						<Text color="gray.500" fontWeight="600">
							Fetching articles...
						</Text>
					</VStack>
				</Center>
			) : filteredBlogs.length === 0 ? (
				<Center py={20} bg="gray.50" borderRadius="2xl" border="2px dashed" borderColor="gray.200">
					<VStack spacing={3}>
						<Icon as={FileText} boxSize={12} color="gray.300" />
						<Text color="gray.500" fontWeight="700" fontSize="18px">
							No blog posts found
						</Text>
						<Text color="gray.400" fontSize="14px">
							Start writing your first article to engage your audience.
						</Text>
					</VStack>
				</Center>
			) : (
				<Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
					<Table variant="simple" size="md">
						<Thead bg="gray.50">
							<Tr>
								<Th
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Title & Slug
								</Th>
								<Th
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Author
								</Th>
								<Th
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Status
								</Th>
								<Th
									fontSize="11px"
									fontWeight="800"
									textTransform="uppercase"
									color="gray.500"
									py={4}
								>
									Date
								</Th>
								{!isViewer && (
									<Th
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
							{filteredBlogs.map((b) => (
								<Tr key={b._id} _hover={{ bg: "gray.50/50" }}>
									<Td>
										<VStack align="flex-start" spacing={0}>
											<Text fontWeight="800" color="gray.800" fontSize="14px" noOfLines={1}>
												{b.title}
											</Text>
											<Text fontSize="11px" color="gray.400">
												/{b.slug}
											</Text>
										</VStack>
									</Td>
									<Td>
										<Badge
											variant="subtle"
											colorScheme="blue"
											fontSize="11px"
											px={2}
											borderRadius="md"
										>
											{b.author || "Admin"}
										</Badge>
									</Td>
									<Td>
										<Badge
											colorScheme={b.isPublished ? "green" : "yellow"}
											fontSize="11px"
											borderRadius="full"
											px={3}
											py={1}
											textTransform="uppercase"
											variant="solid"
										>
											{b.isPublished ? "Published" : "Draft"}
										</Badge>
									</Td>
									<Td fontSize="13px" color="gray.600">
										{b.date || new Date(b.createdAt).toLocaleDateString()}
									</Td>
									{!isViewer && (
										<Td>
											<HStack spacing={1}>
												<IconButton
													icon={<EditIcon />}
													size="sm"
													variant="ghost"
													onClick={() => {
														setEditingBlog(b);
														onOpen();
													}}
													aria-label="Edit Blog"
												/>
												<IconButton
													icon={<DeleteIcon />}
													size="sm"
													variant="ghost"
													colorScheme="red"
													onClick={() => handleDelete(b._id)}
													aria-label="Delete Blog"
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

			<BlogModal isOpen={isOpen} onClose={onClose} onSave={handleSave} blog={editingBlog} />
		</ModuleFrame>
	);
}

function BlogModal({ isOpen, onClose, onSave, blog }) {
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		author: "",
		category: "General",
		content: "",
		isPublished: true,
	});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (blog) {
			setFormData({
				title: blog.title || "",
				slug: blog.slug || "",
				author: blog.author || "",
				category: blog.category || "General",
				content: blog.content || "",
				isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
			});
		} else {
			setFormData({
				title: "",
				slug: "",
				author: "",
				category: "General",
				content: "",
				isPublished: true,
			});
		}
	}, [blog, isOpen]);

	const handleSubmit = async () => {
		if (!formData.title.trim() || !formData.content.trim()) {
			toast.error("Title and Content are required");
			return;
		}
		setIsSaving(true);
		await onSave(formData);
		setIsSaving(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
			<ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
			<ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
				<ModalHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.100" py={6}>
					<HStack spacing={3}>
						<Icon as={Edit3} color="#D90404" />
						<Text fontSize="18px" fontWeight="800">
							{blog ? "Edit Blog Post" : "Create New Article"}
						</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton top={6} />

				<ModalBody p={8}>
					<VStack spacing={6} align="stretch" py={4}>
						<SimpleGrid columns={2} spacing={6}>
							<FormControl isRequired>
								<FormLabel
									fontSize="12px"
									fontWeight="700"
									color="gray.500"
									textTransform="uppercase"
								>
									TITLE
								</FormLabel>
								<Input
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="The Future of Electric Engines"
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
								/>
							</FormControl>
							<FormControl>
								<FormLabel
									fontSize="12px"
									fontWeight="700"
									color="gray.500"
									textTransform="uppercase"
								>
									SLUG (URL PATH)
								</FormLabel>
								<Input
									value={formData.slug}
									onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
									placeholder="future-electric-engines"
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
								/>
							</FormControl>
						</SimpleGrid>

						<SimpleGrid columns={3} spacing={6}>
							<FormControl>
								<FormLabel
									fontSize="12px"
									fontWeight="700"
									color="gray.500"
									textTransform="uppercase"
								>
									AUTHOR NAME
								</FormLabel>
								<Input
									value={formData.author}
									onChange={(e) => setFormData({ ...formData, author: e.target.value })}
									placeholder="Admin"
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
								/>
							</FormControl>
							<FormControl>
								<FormLabel
									fontSize="12px"
									fontWeight="700"
									color="gray.500"
									textTransform="uppercase"
								>
									CATEGORY
								</FormLabel>
								<Select
									value={formData.category}
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
								>
									<option value="General">General</option>
									<option value="Maintenance">Maintenance</option>
									<option value="News">News</option>
									<option value="Review">Review</option>
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel
									fontSize="12px"
									fontWeight="700"
									color="gray.500"
									textTransform="uppercase"
								>
									STATUS
								</FormLabel>
								<Select
									value={formData.isPublished ? "Published" : "Draft"}
									onChange={(e) =>
										setFormData({ ...formData, isPublished: e.target.value === "Published" })
									}
									size="lg"
									borderRadius="xl"
									focusBorderColor="#D90404"
								>
									<option value="Published">Published</option>
									<option value="Draft">Draft</option>
								</Select>
							</FormControl>
						</SimpleGrid>

						<FormControl isRequired>
							<FormLabel
								fontSize="12px"
								fontWeight="700"
								color="gray.500"
								textTransform="uppercase"
							>
								ARTICLE CONTENT
							</FormLabel>
							<Textarea
								value={formData.content}
								onChange={(e) => setFormData({ ...formData, content: e.target.value })}
								placeholder="Write your article content here..."
								borderRadius="xl"
								focusBorderColor="#D90404"
								p={4}
								minH="300px"
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
							onClick={handleSubmit}
							isLoading={isSaving}
							px={10}
							borderRadius="lg"
						>
							{blog ? "Update Article" : "Publish Article"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
