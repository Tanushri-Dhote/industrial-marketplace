import React, { useState, useEffect } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
  useDisclosure, useToast, Badge, InputGroup, InputLeftElement,
  Box, Text, Select, VStack, Icon, SimpleGrid, Spinner, Center,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { FiUsers } from 'react-icons/fi';
import ModuleFrame from './ModuleFrame';
import API from '../../services/api';





const mapRoleToUI = (role) => {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "website_manager":
      return "Website Admin";
    case "sales_manager":
      return "Sales Manager";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
};

const mapRoleToBackend = (role) => {
  switch (role) {
    case "Super Admin":
      return "super_admin";
    case "Admin":
      return "admin";
    case "Website Admin":
      return "website_manager";
    case "Sales Manager":
      return "sales_manager";
    case "Viewer":
      return "viewer";
    default:
      return role;
  }
};

export default function UsersModule({ dashboardUser, role }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/employees", {
        params: {
          search: searchTerm,
        }
      });

      const mappedData = res.data.data.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone1,
        role: mapRoleToUI(u.role),
        website: u.business_name,
        status: u.isActive ? "Active" : "Inactive",
        joinDate: new Date(u.createdAt).toISOString().split("T")[0],
        lastLogin: "—",
      }));

      setUsers(mappedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: 'Error fetching users',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // RBAC: get current logged-in user context
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentRole = currentUser.role || 'Super Admin';

  const roleColorScheme = (role) => {
    switch (role) {
      case 'Super Admin': return 'red';
      case 'Website Admin': return 'purple';
      case 'Sales Manager': return 'blue';
      case 'Viewer': return 'gray';
      default: return 'teal';
    }
  };

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        // ✅ CALL UPDATE API
        await API.put(`/employees/${editingUser.id}`, {
          name: userData.name,
          email: userData.email,
          role: mapRoleToBackend(userData.role),
          isActive: userData.status === "Active",
          business_name: userData.website,
        });

        toast({ title: 'User updated', status: 'success', duration: 2000 });
      } else {
        // (Optional) Create API if you have
        toast({ title: 'Create API not implemented', status: 'info' });
      }

      fetchUsers(); // ✅ refresh list
      onClose();

    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error.message);
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || "Server error",
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/employees/${id}`);

      toast({ title: 'User deleted', status: 'success', duration: 2000 });

      fetchUsers(); // ✅ refresh

    } catch (error) {
      toast({
        title: 'Delete failed',
        status: 'error'
      });
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await API.patch(`/employees/${id}/toggle-status`);

      toast({
        title: 'Status updated',
        status: 'success',
        duration: 2000,
      });

      fetchUsers(); // refresh list

    } catch (error) {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleFrame
      icon={FiUsers}
      title="User Management"
      description="Manage administrative access and system users. You can add new team members or update existing roles and permissions."
    >
      <HStack justify="space-between" mb={8}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fontSize="15px"
            h="45px"
            borderRadius="lg"
          />
        </InputGroup>
        <Button
          leftIcon={<AddIcon />}
          bg="#D90404"
          color="white"
          _hover={{ bg: "#c74848" }}
          onClick={() => { setEditingUser(null); onOpen(); }}
          fontSize="16px"
          px={6}
          h="45px"
          borderRadius="lg"
        >
          Add User
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Name</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Email</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Role</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Website</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={6}>
                  <Center py={10}>
                    <VStack spacing={4}>
                      <Spinner color="#D90404" size="xl" thickness="4px" />
                      <Text fontWeight="bold" color="gray.500">Loading team members...</Text>
                    </VStack>
                  </Center>
                </Td>
              </Tr>
            ) : filteredUsers.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Center py={10}>
                    <Text color="gray.500">No users found</Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              filteredUsers.map((user) => (
                <Tr key={user.id}>
                  <Td fontSize="12px" fontWeight="600">{user.name}</Td>
                  <Td fontSize="12px">{user.email}</Td>
                  <Td fontSize="12px">
                    <Badge
                      variant="subtle"
                      colorScheme={roleColorScheme(user.role)}
                      fontSize="12px"
                      borderRadius="full"
                      px={3}
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td fontSize="12px" fontWeight="600" color="gray.600">
                    {user.website || '---'}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.status === 'Active' ? 'green' : 'red'}
                      fontSize="12px"
                      borderRadius="full"
                      px={3}
                      cursor="pointer"
                      onClick={() => handleToggleStatus(user.id)}
                      _hover={{ opacity: 0.8 }}
                    >
                      {user.status}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      mr={2}
                      onClick={() => { setEditingUser(user); onOpen(); }}
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
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <UserModal isOpen={isOpen} onClose={onClose} onSave={handleSave} user={editingUser} />
    </ModuleFrame>
  );
}

function UserModal({ isOpen, onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active',
    website: ''
  });

  React.useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Viewer',
        status: 'Active',
        website: ''
      });
    }
  }, [user]);


  const isEditing = !!user;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />

      <ModalContent
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Header with subtle gradient */}
        <Box
          bgGradient="linear(to-r, #D90404, #f56565)"
          color="white"
          py={8}
          px={8}
        >
          <HStack spacing={4}>
            <Box>
              <Icon as={FiUsers} boxSize={8} opacity={0.9} />
            </Box>
            <VStack align="flex-start" spacing={0}>
              <ModalHeader
                fontSize="28px"
                fontWeight="800"
                p={0}
                letterSpacing="-0.5px"
              >
                {isEditing ? 'Edit User' : 'Add New Team Member'}
              </ModalHeader>
              <Text opacity={0.85} fontSize="15px">
                {isEditing
                  ? 'Update user information and permissions'
                  : 'Invite a new member to your team'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {/* Left Column */}
            <VStack spacing={7} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">FULL NAME</FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">EMAIL ADDRESS</FormLabel>
                <Input
                  type="email"
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.smith@company.com"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.1)" }}
                />
              </FormControl>
            </VStack>

            {/* Right Column */}
            <VStack spacing={7} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">ROLE</FormLabel>
                <Select
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="16px"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  _focus={{ borderColor: "#D90404" }}
                >
                  <option value="Super Admin">Super Admin </option>
                  <option value="Website Admin">Website Admin </option>
                  <option value="Sales Manager">Sales Manager </option>
                  <option value="Viewer">Viewer </option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">ASSIGNED WEBSITE</FormLabel>
                <Select
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="16px"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  _focus={{ borderColor: "#D90404" }}
                >
                  <option value="">Select a Website</option>
                  <option value="SITE-101">SITE-101 - Engine City</option>
                  <option value="SITE-102">SITE-102 - Marine Parts</option>
                  <option value="SITE-103">SITE-103 - Truck Solutions</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">STATUS</FormLabel>
                <Select
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="16px"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  _focus={{ borderColor: "#D90404" }}
                >
                  <option value="Active">Active </option>
                  <option value="Inactive">Inactive </option>
                  <option value="Suspended">Suspended</option>
                </Select>
              </FormControl>
            </VStack>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" py={8} px={10}>
          <HStack spacing={4} width="full" justify="flex-end">
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              fontWeight="500"
              px={8}
            >
              Cancel
            </Button>

            <Button
              size="lg"
              bg="#D90404"
              color="white"
              _hover={{ bg: "#c00404" }}
              _active={{ bg: "#a00404" }}
              onClick={() => onSave(formData)}
              px={12}
              fontWeight="700"
              borderRadius="2xl"
              boxShadow="md"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}