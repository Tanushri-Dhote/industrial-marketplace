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
	InputGroup,
	InputLeftElement,
	Box,
	Text,
	Select,
	VStack,
	Icon,
	SimpleGrid,
	Spinner,
	Center,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Users } from "lucide-react";
import { toast } from "sonner";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";

// ─── Role mapping ─────────────────────────────────────────────────────────────
const mapRoleToUI = (role) =>
	({
		super_admin: "Super Admin",
		admin: "Admin",
		website_manager: "Website Admin",
		sales_manager: "Sales Manager",
		viewer: "Viewer",
	})[role] || role;

const mapRoleToBackend = (role) =>
	({
		"Super Admin": "super_admin",
		Admin: "admin",
		"Website Admin": "website_manager",
		"Sales Manager": "sales_manager",
		Viewer: "viewer",
	})[role] || role;

const roleColorScheme = (role) =>
	({
		"Super Admin": "red",
		Admin: "orange",
		"Website Admin": "purple",
		"Sales Manager": "blue",
		Viewer: "gray",
	})[role] || "teal";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UsersModule({ moduleId }) {
	const [users, setUsers] = useState([]);
	const [websites, setWebsites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingUser, setEditingUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		fetchWebsites();
	}, []);
	useEffect(() => {
		fetchUsers();
	}, [searchTerm, moduleId]);

	const fetchWebsites = async () => {
		try {
			const res = await API.get("/websites");
			setWebsites(res.data.data || []);
		} catch (e) {
			/* silent — supplementary data */
		}
	};

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const res = await API.get("/employees", { params: { search: searchTerm } });
			const adminRoles = ["super_admin", "admin", "website_manager", "sales_manager"];

			const filtered = res.data.data.filter((u) => {
				const isAdmin = adminRoles.includes(u.role);
				return moduleId === "admins" ? isAdmin : !isAdmin;
			});

			const mappedData = filtered.map((u) => ({
				id: u._id,
				name: u.name,
				email: u.email,
				phone: u.phone1,
				role: mapRoleToUI(u.role),
				business_name: u.business_name || "—",
				website_id: u.website_id?._id || u.website_id || "",
				websiteName: u.website_id?.name || "—",
				status: u.isActive ? "Active" : "Inactive",
				joinDate: new Date(u.createdAt).toISOString().split("T")[0],
			}));
			setUsers(mappedData);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load users");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async (userData) => {
		try {
			if (editingUser) {
				await API.put(`/employees/${editingUser.id}`, {
					name: userData.name,
					email: userData.email,
					role: mapRoleToBackend(userData.role),
					isActive: userData.status === "Active",
					business_name: userData.business_name,
					website_id: userData.website_id || null,
				});
				toast.success("User updated successfully");
			} else {
				toast.info("Use the registration page to add new users.");
			}
			fetchUsers();
			onClose();
		} catch (error) {
			toast.error(error.response?.data?.message || "Update failed");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this user? This cannot be undone.")) return;
		try {
			await API.delete(`/employees/${id}`);
			toast.success("User deleted");
			fetchUsers();
		} catch (error) {
			toast.error("Delete failed");
		}
	};

	const handleToggleStatus = async (id) => {
		try {
			await API.patch(`/employees/${id}/status`);
			toast.success("Status updated");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to update status");
		}
	};

	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const isAdminsMode = moduleId === "admins";

	return (
		<ModuleFrame
			icon={Users}
			title={isAdminsMode ? "Admins & Staff" : "Customers & Users"}
			description={
				isAdminsMode
					? "Manage administrative staff, assign site roles, and control access permissions across all tenants."
					: "View and manage registered customers and marketplace members assigned to specific sites."
			}
		>
			<HStack justify="space-between" mb={6}>
				<InputGroup maxW="300px">
					<InputLeftElement pointerEvents="none">
						<SearchIcon color="gray.300" />
					</InputLeftElement>
					<Input
						placeholder="Search users..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						fontSize="14px"
						h="42px"
						borderRadius="lg"
					/>
				</InputGroup>
				<Button
					leftIcon={<AddIcon />}
					bg="#D90404"
					color="white"
					_hover={{ bg: "#c74848" }}
					onClick={() => {
						setEditingUser(null);
						onOpen();
					}}
					fontSize="14px"
					px={6}
					h="42px"
					borderRadius="lg"
				>
					Add User
				</Button>
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
								Role
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Business
							</Th>
							<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Site
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
												Loading users...
											</Text>
										</VStack>
									</Center>
								</Td>
							</Tr>
						) : filteredUsers.length === 0 ? (
							<Tr>
								<Td colSpan={7}>
									<Center py={10}>
										<VStack spacing={2}>
											<Icon as={Users} boxSize={8} color="gray.300" />
											<Text color="gray.500" fontWeight="600">
												No users found
											</Text>
										</VStack>
									</Center>
								</Td>
							</Tr>
						) : (
							filteredUsers.map((user) => (
								<Tr key={user.id} _hover={{ bg: "gray.50" }}>
									<Td fontSize="13px" fontWeight="700">
										{user.name}
									</Td>
									<Td fontSize="12px" color="gray.600">
										{user.email}
									</Td>
									<Td>
										<Badge
											variant="subtle"
											colorScheme={roleColorScheme(user.role)}
											fontSize="11px"
											borderRadius="full"
											px={3}
										>
											{user.role}
										</Badge>
									</Td>
									<Td fontSize="12px" color="gray.500">
										{user.business_name}
									</Td>
									<Td fontSize="12px" fontWeight="600" color="gray.700">
										{user.websiteName}
									</Td>
									<Td>
										<Badge
											colorScheme={user.status === "Active" ? "green" : "red"}
											fontSize="11px"
											borderRadius="full"
											px={3}
											cursor="pointer"
											onClick={() => handleToggleStatus(user.id)}
											_hover={{ opacity: 0.7 }}
										>
											{user.status}
										</Badge>
									</Td>
									<Td>
										<HStack spacing={1}>
											<IconButton
												icon={<EditIcon />}
												size="sm"
												variant="ghost"
												onClick={() => {
													setEditingUser(user);
													onOpen();
												}}
												aria-label="Edit User"
											/>
											<IconButton
												icon={<DeleteIcon />}
												size="sm"
												variant="ghost"
												colorScheme="red"
												onClick={() => handleDelete(user.id)}
												aria-label="Delete User"
											/>
										</HStack>
									</Td>
								</Tr>
							))
						)}
					</Tbody>
				</Table>
			</Box>

			<UserModal
				isOpen={isOpen}
				onClose={onClose}
				onSave={handleSave}
				user={editingUser}
				websites={websites}
			/>
		</ModuleFrame>
	);
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({ isOpen, onClose, onSave, user, websites }) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "Viewer",
		status: "Active",
		business_name: "",
		website_id: "",
	});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setFormData(
			user
				? {
						name: user.name,
						email: user.email,
						role: user.role,
						status: user.status,
						business_name: user.business_name || "",
						website_id: user.website_id || "",
					}
				: {
						name: "",
						email: "",
						role: "Viewer",
						status: "Active",
						business_name: "",
						website_id: "",
					},
		);
	}, [user]);

	const handleSubmit = async () => {
		setIsSaving(true);
		await onSave(formData);
		setIsSaving(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
			<ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.500" />
			<ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
				{/* Header */}
				<Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={6} px={8}>
					<HStack spacing={4}>
						<Icon as={Users} boxSize={7} />
						<VStack align="flex-start" spacing={0}>
							<ModalHeader fontSize="22px" fontWeight="800" p={0}>
								{user ? "Edit User" : "Add Team Member"}
							</ModalHeader>
							<Text opacity={0.7} fontSize="13px">
								{user ? "Update user info, role, and site assignment" : "Create a new user account"}
							</Text>
						</VStack>
					</HStack>
				</Box>
				<ModalCloseButton color="white" top={5} right={5} />

				<ModalBody p={8}>
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						{/* Left */}
						<VStack spacing={5} align="stretch">
							<FormControl isRequired>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									FULL NAME
								</FormLabel>
								<Input
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder="John Smith"
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									EMAIL ADDRESS
								</FormLabel>
								<Input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder="john@company.com"
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
								/>
							</FormControl>
							<FormControl>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									BUSINESS NAME
								</FormLabel>
								<Input
									value={formData.business_name}
									onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
									placeholder="Smith Engine Repairs"
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
								/>
							</FormControl>
						</VStack>

						{/* Right */}
						<VStack spacing={5} align="stretch">
							<FormControl isRequired>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									ROLE
								</FormLabel>
								<Select
									value={formData.role}
									onChange={(e) => setFormData({ ...formData, role: e.target.value })}
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404" }}
								>
									<option value="Super Admin">Super Admin</option>
									<option value="Admin">Admin</option>
									<option value="Website Admin">Website Admin</option>
									<option value="Sales Manager">Sales Manager</option>
									<option value="Viewer">Viewer</option>
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									ASSIGNED SITE
								</FormLabel>
								<Select
									value={formData.website_id}
									onChange={(e) => setFormData({ ...formData, website_id: e.target.value })}
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404" }}
								>
									<option value="">— No site assigned —</option>
									{websites.map((w) => (
										<option key={w._id} value={w._id}>
											{w.name}
										</option>
									))}
								</Select>
							</FormControl>
							<FormControl isRequired>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									STATUS
								</FormLabel>
								<Select
									value={formData.status}
									onChange={(e) => setFormData({ ...formData, status: e.target.value })}
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404" }}
								>
									<option value="Active">Active</option>
									<option value="Inactive">Inactive</option>
								</Select>
							</FormControl>
						</VStack>
					</SimpleGrid>
				</ModalBody>

				<ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" px={8} py={5}>
					<HStack spacing={3} w="full" justify="flex-end">
						<Button variant="ghost" onClick={onClose} fontWeight="500">
							Cancel
						</Button>
						<Button
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c00404" }}
							onClick={handleSubmit}
							isLoading={isSaving}
							loadingText="Saving..."
							px={8}
							fontWeight="700"
							borderRadius="xl"
						>
							{user ? "Update User" : "Create User"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
