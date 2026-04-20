import React, { useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
  useDisclosure, useToast, Badge, InputGroup, InputLeftElement,
  Box, Text, Select, VStack, Icon, SimpleGrid,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { FiUsers } from 'react-icons/fi';
import ModuleFrame from './ModuleFrame';

const initialUsers = [
  { id: 1, name: 'System Root', email: 'super@hq.com', role: 'Super Admin', status: 'Active', website: 'Global' },
  { id: 2, name: 'Main Tenant', email: 'admin@site101.com', role: 'Website Admin', status: 'Active', website: 'SITE-101' },
  { id: 3, name: 'Sales Lead', email: 'sales@site101.com', role: 'Sales Manager', status: 'Active', website: 'SITE-101' },
  { id: 4, name: 'Auditor', email: 'view@hq.com', role: 'Viewer', status: 'Active', website: 'Global' },
];

export default function UsersModule() {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const handleSave = (userData) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...userData, id: editingUser.id } : u));
      toast({ title: 'User updated', status: 'success', duration: 2000 });
    } else {
      setUsers([...users, { ...userData, id: Date.now() }]);
      toast({ title: 'User added', status: 'success', duration: 2000 });
    }
    onClose();
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: 'User deleted', status: 'info', duration: 2000 });
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
            {filteredUsers.map((user) => (
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
                  {user.website || 'Global'}
                </Td>
                <Td>
                  <Badge colorScheme={user.status === 'Active' ? 'green' : 'red'} fontSize="12px" borderRadius="full" px={3}>
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
            ))}
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
    website: 'Global'
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
        website: 'Global'
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
                  <option value="Super Admin">Super Admin — Full Access</option>
                  <option value="Website Admin">Website Admin — Site & User Management</option>
                  <option value="Sales Manager">Sales Manager — Orders & Customers</option>
                  <option value="Viewer">Viewer — Read Only Access</option>
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
                  <option value="Global">Global (All Websites)</option>
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
                  <option value="Active">Active - Can login and access system</option>
                  <option value="Inactive">Inactive - Login disabled</option>
                  <option value="Suspended">Suspended - Temporarily blocked</option>
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