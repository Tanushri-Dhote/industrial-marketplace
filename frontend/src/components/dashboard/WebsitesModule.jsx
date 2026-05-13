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
	Text,
	Icon,
	Select,
	Spinner,
	Center,
	Textarea,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Server, Globe, Users, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ModuleFrame from "./ModuleFrame";
import API from "../../services/api";
import { canModify } from "../../utils/permissions";

const STATUS_COLORS = { active: "green", inactive: "gray", maintenance: "yellow" };

export default function WebsitesModule() {
	const [websites, setWebsites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingSite, setEditingSite] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const fetchWebsites = async () => {
		setIsLoading(true);
		try {
			const res = await API.get("/websites");
			setWebsites(res.data.data || []);
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to load websites");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchWebsites();
	}, []);

	const handleSave = async (data) => {
		try {
			if (editingSite) {
				await API.put(`/websites/${editingSite._id}`, data);
				toast.success("Website updated");
			} else {
				await API.post("/websites", data);
				toast.success("Website created");
			}
			fetchWebsites();
			onClose();
		} catch (err) {
			toast.error(err.response?.data?.message || "Operation failed");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure? This cannot be undone.")) return;
		try {
			await API.delete(`/websites/${id}`);
			toast.success("Website deleted");
			fetchWebsites();
		} catch (err) {
			toast.error(err.response?.data?.message || "Delete failed");
		}
	};

	return (
		<ModuleFrame
			icon={Server}
			title="Sites & Tenants"
			description="Manage the tenant websites connected to this marketplace. Create sites and assign users to them."
		>
			<HStack justify="flex-end" mb={6}>
				<Button
					leftIcon={<AddIcon />}
					bg="#D90404"
					color="white"
					_hover={{ bg: "#c00404" }}
					onClick={() => {
						setEditingSite(null);
						onOpen();
					}}
					px={6}
					h="42px"
					borderRadius="lg"
					fontSize="14px"
				>
					Add Site
				</Button>
			</HStack>

			{isLoading ? (
				<Center py={16}>
					<VStack spacing={3}>
						<Spinner color="#D90404" size="lg" thickness="4px" />
						<Text color="gray.500" fontSize="14px">
							Loading sites...
						</Text>
					</VStack>
				</Center>
			) : websites.length === 0 ? (
				<Center py={16}>
					<VStack spacing={3}>
						<Icon as={Globe} boxSize={10} color="gray.300" />
						<Text color="gray.500" fontWeight="600">
							No sites found
						</Text>
						<Text color="gray.400" fontSize="13px">
							Create your first tenant site to get started
						</Text>
					</VStack>
				</Center>
			) : (
				<Box overflowX="auto">
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Name
								</Th>
								<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Domain
								</Th>
								<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Status
								</Th>
								<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Users
								</Th>
								<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Owner
								</Th>
								<Th fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
									Actions
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{websites.map((site) => (
								<Tr key={site._id} _hover={{ bg: "gray.50" }}>
									<Td fontSize="13px" fontWeight="700">
										{site.name}
									</Td>
									<Td fontSize="12px" color="gray.500">
										{site.domain || "—"}
									</Td>
									<Td>
										<Badge
											colorScheme={STATUS_COLORS[site.status] || "gray"}
											fontSize="11px"
											borderRadius="full"
											px={3}
											textTransform="capitalize"
										>
											{site.status}
										</Badge>
									</Td>
									<Td>
										<HStack spacing={1}>
											<Icon as={Users} color="gray.400" boxSize={3} />
											<Text fontSize="13px" fontWeight="600">
												{site.userCount ?? "—"}
											</Text>
										</HStack>
									</Td>
									<Td fontSize="12px" color="gray.500">
										{site.owner?.name || "—"}
									</Td>
									<Td>
										<HStack spacing={1}>
											{canModify() && (
												<>
													<IconButton
														icon={<EditIcon />}
														size="sm"
														variant="ghost"
														onClick={() => {
															setEditingSite(site);
															onOpen();
														}}
														aria-label="Edit Site"
													/>
													<IconButton
														icon={<DeleteIcon />}
														size="sm"
														variant="ghost"
														colorScheme="red"
														onClick={() => handleDelete(site._id)}
														aria-label="Delete Site"
													/>
												</>
											)}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			)}

			<WebsiteModal isOpen={isOpen} onClose={onClose} onSave={handleSave} website={editingSite} />
		</ModuleFrame>
	);
}

function WebsiteModal({ isOpen, onClose, onSave, website }) {
	const [formData, setFormData] = useState({
		name: "",
		domain: "",
		description: "",
		status: "active",
	});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setFormData(
			website
				? {
						name: website.name,
						domain: website.domain || "",
						description: website.description || "",
						status: website.status || "active",
					}
				: { name: "", domain: "", description: "", status: "active" },
		);
	}, [website]);

	const handleSubmit = async () => {
		if (!formData.name.trim()) {
			toast.error("Site name is required");
			return;
		}
		setIsSaving(true);
		await onSave(formData);
		setIsSaving(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.500" />
			<ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
				<Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={6} px={8}>
					<HStack spacing={3}>
						<Icon as={Globe} boxSize={7} />
						<VStack align="flex-start" spacing={0}>
							<ModalHeader p={0} fontSize="22px" fontWeight="800">
								{website ? "Edit Site" : "Add New Site"}
							</ModalHeader>
							<Text opacity={0.7} fontSize="13px">
								{website ? "Update tenant site details" : "Create a new tenant website"}
							</Text>
						</VStack>
					</HStack>
				</Box>
				<ModalCloseButton color="white" top={5} right={5} />

				<ModalBody p={8}>
					<VStack spacing={5} align="stretch">
						<FormControl isRequired>
							<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
								SITE NAME
							</FormLabel>
							<Input
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								placeholder="Re-Conditioned Engine"
								h="44px"
								borderRadius="xl"
								fontSize="14px"
								_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
								DOMAIN
							</FormLabel>
							<Input
								value={formData.domain}
								onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
								placeholder="allengine4you.com"
								h="44px"
								borderRadius="xl"
								fontSize="14px"
								_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize="12px" fontWeight="700" color="gray.600">
								DESCRIPTION
							</FormLabel>
							<Textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								placeholder="Brief description of this site..."
								borderRadius="xl"
								fontSize="14px"
								rows={3}
								_focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217,4,4,0.1)" }}
							/>
						</FormControl>
						<FormControl>
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
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
								<option value="maintenance">Maintenance</option>
							</Select>
						</FormControl>
					</VStack>
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
							{website ? "Update Site" : "Create Site"}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
