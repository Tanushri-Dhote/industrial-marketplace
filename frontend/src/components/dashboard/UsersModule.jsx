import { AddIcon, DeleteIcon, EditIcon, EmailIcon, LockIcon, SearchIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Button,
	Center,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Portal,
	Select,
	SimpleGrid,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { Settings, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import API from "../../services/api";
import ModuleFrame from "./ModuleFrame";
import { canModify } from "../../utils/permissions";

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
	const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
	const isSuperAdmin = currentUser.role === "super_admin";

	const [users, setUsers] = useState([]);
	const [websites, setWebsites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingUser, setEditingUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isPwOpen, onOpen: onPwOpen, onClose: onPwClose } = useDisclosure();
	const [resetTarget, setResetTarget] = useState(null);
	const [newPw, setNewPw] = useState("");

	useEffect(() => {
		fetchWebsites();
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [searchTerm, moduleId, statusFilter]);

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

			let filtered = res.data.data.filter((u) => {
				const isAdmin = adminRoles.includes(u.role);
				return moduleId === "admins" ? isAdmin : !isAdmin;
			});

			if (statusFilter !== "All") {
				const targetActive = statusFilter === "Active";
				filtered = filtered.filter((u) => u.isActive === targetActive);
			}

			const mappedData = filtered.map((u) => ({
				id: u._id,
				name: u.name,
				email: u.email,
				phone: u.phone1,
				role: mapRoleToUI(u.role),
				business_name: u.business_name || "—",
				website_id: u.website_id,
				status: u.isActive ? "Active" : "Inactive",
				verified: Boolean(u.loginVerified),
				joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "—",
				lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never",
				lastIp: u.lastIp || "—",
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
				// Use the new invite system
				await API.post("/admin/invite-staff", {
					email: userData.email,
					role: mapRoleToBackend(userData.role),
					website_id: userData.website_id || null,
				});
				toast.success(`Invitation sent to ${userData.email}`);
			}
			fetchUsers();
			onClose();
		} catch (error) {
			toast.error(error.response?.data?.message || "Operation failed");
		}
	};

	const handleResetPassword = async () => {
		if (newPw.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		try {
			await API.post("/admin/reset-password", {
				userId: resetTarget.id,
				newPassword: newPw,
			});
			toast.success(`Password reset for ${resetTarget.name}`);
			setNewPw("");
			onPwClose();
		} catch (error) {
			toast.error(error.response?.data?.message || "Reset failed");
		}
	};

	const handleSendInvite = async (user) => {
		try {
			await API.post("/admin/invite-staff", {
				email: user.email,
				role: mapRoleToBackend(user.role),
			});
			toast.success(`Invite resent to ${user.email}`);
		} catch (error) {
			toast.error("Failed to send invite");
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

	const filteredUsers = users; // Already filtered in fetchUsers now

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
			<HStack justify="space-between" mb={6} spacing={4}>
				<HStack spacing={4} flex="1">
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
					<Select
						maxW="180px"
						h="42px"
						borderRadius="lg"
						fontSize="14px"
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="All">All Status</option>
						<option value="Active">Active</option>
						<option value="Inactive">Inactive</option>
					</Select>
				</HStack>
				{isSuperAdmin && (
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
						{isAdminsMode ? "Invite Staff" : "Add User"}
					</Button>
				)}
			</HStack>

			<Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
				<Table variant="simple" size="sm" layout="fixed" minW="1100px">
					<Thead bg="gray.50">
						<Tr>
							<Th w="220px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px" py={4}>
								User
							</Th>
							<Th w="150px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Role
							</Th>
							<Th w="150px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Tenant/Site
							</Th>
							<Th w="120px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Joined
							</Th>
							<Th w="200px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Last Login & IP
							</Th>
							<Th w="120px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Verified
							</Th>
							<Th w="100px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Status
							</Th>
							<Th w="80px" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
								Actions
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<Tr>
								<Td colSpan={8}>
									<Center py={10}>
										<VStack spacing={3}>
											<Spinner color="#D90404" size="lg" thickness="4px" />
											<Text fontWeight="600" color="gray.500" fontSize="14px">
												Loading records...
											</Text>
										</VStack>
									</Center>
								</Td>
							</Tr>
						) : filteredUsers.length === 0 ? (
							<Tr>
								<Td colSpan={8}>
									<Center py={10}>
										<VStack spacing={2}>
											<Icon as={Users} boxSize={8} color="gray.300" />
											<Text color="gray.500" fontWeight="600">
												No records found
											</Text>
										</VStack>
									</Center>
								</Td>
							</Tr>
						) : (
							filteredUsers.map((user) => (
								<Tr key={user.id} _hover={{ bg: "gray.50" }}>
									<Td>
										<VStack align="start" spacing={0.5} maxW="200px">
											<HStack spacing={2} w="full">
												<Text fontSize="13px" fontWeight="700" isTruncated>
													{user.name}
												</Text>
												{user.role === "Super Admin" && (
													<Icon as={ShieldCheck} color="red.500" boxSize={3} flexShrink={0} />
												)}
											</HStack>
											<Text fontSize="12px" color="gray.600" isTruncated w="full">
												{user.email}
											</Text>
										</VStack>
									</Td>
									<Td>
										<Badge
											variant="subtle"
											colorScheme={roleColorScheme(user.role)}
											fontSize="11px"
											borderRadius="full"
											px={3}
											whiteSpace="nowrap"
										>
											{user.role}
										</Badge>
									</Td>
									<Td>
										<Badge variant="outline" fontSize="10px" borderRadius="full" whiteSpace="nowrap" maxW="130px" isTruncated>
											{(() => {
												const getStrId = (val) => {
													if (!val) return null;
													if (typeof val === "string") return val;
													if (typeof val === "object") return val.$oid || val._id || null;
													return null;
												};
												const userId = getStrId(user.website_id);
												if (!userId) return "—";
												const site = websites.find((w) => getStrId(w._id) === userId);
												return site?.name || "—";
											})()}
										</Badge>
									</Td>
									<Td fontSize="12px" color="gray.500" whiteSpace="nowrap">
										{user.joinDate}
									</Td>
									<Td>
										<VStack align="start" spacing={0.5}>
											<Text fontSize="12px" color="gray.500" whiteSpace="nowrap">
												{user.lastLogin}
											</Text>
											<Text fontSize="11px" color="gray.400" whiteSpace="nowrap">
												IP: {user.lastIp}
											</Text>
										</VStack>
									</Td>
									<Td>
										<Badge
											colorScheme={user.verified ? "green" : "yellow"}
											variant={user.verified ? "subtle" : "outline"}
											fontSize="11px"
											borderRadius="full"
											px={3}
											whiteSpace="nowrap"
										>
											{user.verified ? "Verified" : "Unverified"}
										</Badge>
									</Td>
									<Td>
										<Badge
											colorScheme={user.status === "Active" ? "green" : "red"}
											fontSize="11px"
											borderRadius="full"
											px={3}
											cursor={isSuperAdmin ? "pointer" : "default"}
											onClick={() => isSuperAdmin && handleToggleStatus(user.id)}
											_hover={isSuperAdmin ? { opacity: 0.7 } : {}}
										>
											{user.status}
										</Badge>
									</Td>
									<Td>
										<Menu placement="bottom-end" isLazy>
											<MenuButton
												as={IconButton}
												icon={<Settings size={14} />}
												size="sm"
												variant="ghost"
												aria-label="User actions"
												_hover={{
													bg: "gray.100",
													"& svg": { transform: "rotate(90deg)" },
												}}
												sx={{
													"& svg": {
														transition: "transform 0.2s ease",
													},
												}}
											/>
											<Portal>
												<MenuList fontSize="13px">
													{canModify() && (
														<MenuItem
															icon={<EditIcon />}
															onClick={() => {
																setEditingUser(user);
																onOpen();
															}}
														>
															Edit user
														</MenuItem>
													)}
													{isSuperAdmin && (
														<MenuItem
															icon={<LockIcon />}
															onClick={() => handleToggleStatus(user.id)}
														>
															{user.status === "Active" ? "Deactivate user" : "Activate user"}
														</MenuItem>
													)}
													{isSuperAdmin && isAdminsMode && (
														<MenuItem
															icon={<LockIcon />}
															onClick={() => {
																setResetTarget(user);
																onPwOpen();
															}}
														>
															Reset password
														</MenuItem>
													)}
													{isSuperAdmin && isAdminsMode && (
														<MenuItem icon={<EmailIcon />} onClick={() => handleSendInvite(user)}>
															Resend invite
														</MenuItem>
													)}
													{canModify() && (
														<MenuItem
															icon={<DeleteIcon />}
															color="red.600"
															onClick={() => handleDelete(user.id)}
														>
															Delete user
														</MenuItem>
													)}
												</MenuList>
											</Portal>
										</Menu>
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
				isAdminsMode={isAdminsMode}
			/>

			{/* Password Reset Modal */}
			<Modal isOpen={isPwOpen} onClose={onPwClose} isCentered size="sm">
				<ModalOverlay backdropFilter="blur(5px)" />
				<ModalContent borderRadius="2xl">
					<ModalHeader fontSize="18px">Reset Password</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack align="stretch" spacing={4}>
							<Text fontSize="14px">
								Set a new password for <br />
								<strong>{resetTarget?.name}</strong>
							</Text>
							<FormControl>
								<FormLabel fontSize="12px">New Password</FormLabel>
								<Input
									type="password"
									value={newPw}
									onChange={(e) => setNewPw(e.target.value)}
									placeholder="Min 6 characters"
									borderRadius="xl"
								/>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onPwClose} fontSize="14px">
							Cancel
						</Button>
						<Button
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c74848" }}
							onClick={handleResetPassword}
							fontSize="14px"
						>
							Reset Password
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</ModuleFrame>
	);
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({ isOpen, onClose, onSave, user, websites, isAdminsMode }) {
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
						website_id: user.website_id?.$oid || user.website_id?._id || user.website_id || "",
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
								{user ? "Edit User" : isAdminsMode ? "Invite Staff" : "Add User"}
							</ModalHeader>
							<Text opacity={0.7} fontSize="13px">
								{user
									? "Update user info, role, and site assignment"
									: isAdminsMode
										? "Send an entry invitation to a new staff member"
										: "Manually add a new marketplace customer"}
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
									{isAdminsMode && !user ? "RECIPIENT EMAIL" : "EMAIL ADDRESS"}
								</FormLabel>
								<Input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder="john@company.com"
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									isDisabled={!!user} // Email often shouldn't change easily
									_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
								/>
							</FormControl>

							{(!isAdminsMode || user) && (
								<FormControl isRequired={!isAdminsMode}>
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
							)}

							<FormControl>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									BUSINESS/COMPANY
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
									ASSIGNED ROLE
								</FormLabel>
								<Select
									value={formData.role}
									onChange={(e) => setFormData({ ...formData, role: e.target.value })}
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404" }}
								>
									{isAdminsMode ? (
										<>
											<option value="Super Admin">Super Admin</option>
											<option value="Admin">Admin</option>
											<option value="Website Admin">Website Admin</option>
											<option value="Sales Manager">Sales Manager</option>
										</>
									) : (
										<>
											<option value="Viewer">Customer/Viewer</option>
										</>
									)}
								</Select>
							</FormControl>
							<FormControl>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									ASSIGNED SITE (TENANT)
								</FormLabel>
								<Select
									value={formData.website_id}
									onChange={(e) => setFormData({ ...formData, website_id: e.target.value })}
									h="44px"
									borderRadius="xl"
									fontSize="14px"
									_focus={{ borderColor: "#D90404" }}
								>
									<option value="">— Global / No Site —</option>
									{websites.map((w) => {
										const siteId = w.$oid || w._id || w;
										const siteName = w.name || "Unknown";
										return (
											<option key={siteId} value={siteId}>
												{siteName}
											</option>
										);
									})}
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
									ACCOUNT STATUS
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

				<ModalFooter bg="gray.50" py={6} px={8}>
					<HStack spacing={3} w="full" justify="flex-end">
						<Button variant="ghost" onClick={onClose} h="44px" px={6}>
							Cancel
						</Button>
						<Button
							bg="#D90404"
							color="white"
							_hover={{ bg: "#c74848" }}
							h="44px"
							px={8}
							borderRadius="xl"
							isLoading={isSaving}
							onClick={handleSubmit}
						>
							{user ? "Update User" : isAdminsMode ? "Send Invitation" : "Create User"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
