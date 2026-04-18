import React, { useState } from 'react';
import {
  Box, Container, HStack, VStack, Heading, Text,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Button, IconButton,
  Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel,
  useDisclosure, useToast, SimpleGrid, Avatar, Flex,
  InputGroup, InputLeftElement, Tooltip, Switch, FormHelperText,
  useColorModeValue, Icon,
} from '@chakra-ui/react';
import {
  AddIcon, SearchIcon, EditIcon, DeleteIcon, EmailIcon, LockIcon, CheckIcon,
} from '@chakra-ui/icons';
import {
  FiUsers, FiUserCheck, FiShield, FiBriefcase,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const initial = [
  { id: 1, name: 'Alex Turner', email: 'superadmin@hq.com', phone: '+44 7700 100001', role: 'Super Admin', website: 'Global', status: 'Active', joinDate: '2024-01-01', lastLogin: '2026-04-18' },
  { id: 2, name: 'Sarah Chen', email: 'admin@enginecity.com', phone: '+44 7700 100002', role: 'Website Admin', website: 'SITE-101', status: 'Active', joinDate: '2024-03-15', lastLogin: '2026-04-17' },
  { id: 3, name: 'James Okafor', email: 'sales@enginecity.com', phone: '+44 7700 100003', role: 'Sales Manager', website: 'SITE-101', status: 'Active', joinDate: '2024-06-01', lastLogin: '2026-04-16' },
  { id: 4, name: 'Priya Sharma', email: 'viewer@hq.com', phone: '+44 7700 100004', role: 'Viewer', website: 'Global', status: 'Inactive', joinDate: '2024-09-10', lastLogin: '2026-03-01' },
  { id: 5, name: 'David Park', email: 'admin@marineparts.com', phone: '+44 7700 100005', role: 'Website Admin', website: 'SITE-102', status: 'Active', joinDate: '2025-01-20', lastLogin: '2026-04-15' },
];

const ROLES = ['Super Admin', 'Website Admin', 'Sales Manager', 'Viewer'];
const SITES = ['Global', 'SITE-101 (Engine City)', 'SITE-102 (Marine Parts)', 'SITE-103 (Truck Solutions)'];

const roleColor = (r) => ({ 'Super Admin': 'red', 'Website Admin': 'purple', 'Sales Manager': 'blue', 'Viewer': 'gray' }[r] || 'teal');
const roleIcon = (r) => ({ 'Super Admin': FiShield, 'Website Admin': FiBriefcase, 'Sales Manager': FiUserCheck, 'Viewer': FiUsers }[r] || FiUsers);

export default function EmployeePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentRole = currentUser.role || 'Super Admin';
  const isSuperAdmin = currentRole === 'Super Admin';

  const [employees, setEmployees] = useState(initial);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editing, setEditing] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPwOpen, onOpen: onPwOpen, onClose: onPwClose } = useDisclosure();
  const [resetTarget, setResetTarget] = useState(null);
  const [newPw, setNewPw] = useState('');

  const accentColor = '#D90404';

  // Dark/Light Mode Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('#0F172A', 'white');

  const total = employees.length;
  const active = employees.filter(e => e.status === 'Active').length;
  const admins = employees.filter(e => ['Super Admin', 'Website Admin'].includes(e.role)).length;
  const sales = employees.filter(e => e.role === 'Sales Manager').length;

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                       e.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'All' || e.role === filterRole;
    const matchStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleSave = (data) => {
    if (editing) {
      setEmployees(employees.map(e => e.id === editing.id ? { ...data, id: editing.id } : e));
      toast({ title: 'Employee updated', status: 'success', duration: 2000, position: 'top-right' });
    } else {
      setEmployees([...employees, { 
        ...data, 
        id: Date.now(), 
        joinDate: new Date().toISOString().split('T')[0], 
        lastLogin: 'Never' 
      }]);
      toast({ title: 'Employee created & invite sent', status: 'success', duration: 3000, position: 'top-right' });
    }
    onClose();
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
    toast({ title: 'Employee removed', status: 'info', duration: 2000, position: 'top-right' });
  };

  const toggleStatus = (id) => {
    setEmployees(employees.map(e =>
      e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e
    ));
    const emp = employees.find(e => e.id === id);
    toast({ title: `${emp.name} ${emp.status === 'Active' ? 'deactivated' : 'activated'}`, status: 'info', duration: 2000 });
  };

  const handleResetPassword = () => {
    if (newPw.length < 6) {
      toast({ title: 'Password must be at least 6 characters', status: 'warning' });
      return;
    }
    toast({ title: `Password reset for ${resetTarget?.name}`, status: 'success', duration: 2000 });
    setNewPw('');
    onPwClose();
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <HStack justify="space-between" mb={8} flexWrap="wrap" gap={4}>
          <VStack align="flex-start" spacing={0}>
            <HStack spacing={3}>
              <Box w="5px" h="36px" bg={accentColor} borderRadius="full" />
              <Heading fontSize="34px" fontWeight="900" color={headingColor} letterSpacing="-1px">
                Employee Management
              </Heading>
            </HStack>
            <Text color={textColor} fontSize="15px" pl="20px">
              Manage staff, assign roles, set tenant permissions & control access.
            </Text>
          </VStack>

          <HStack spacing={3}>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>← Dashboard</Button>
            {isSuperAdmin && (
              <Button
                leftIcon={<AddIcon />}
                bg={accentColor}
                color="white"
                _hover={{ bg: '#c00404', transform: 'translateY(-2px)' }}
                borderRadius="full"
                px={8}
                h="45px"
                onClick={() => { setEditing(null); onOpen(); }}
              >
                Add Employee
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          {[
            { label: 'Total Staff', value: total, color: headingColor, icon: FiUsers },
            { label: 'Active', value: active, color: 'green.500', icon: FiUserCheck },
            { label: 'Admins', value: admins, color: 'purple.500', icon: FiShield },
            { label: 'Sales', value: sales, color: 'blue.500', icon: FiBriefcase },
          ].map((s, i) => (
            <Box key={i} bg={cardBg} p={5} borderRadius="2xl" boxShadow="md" display="flex" alignItems="center" gap={4} border="1px solid" borderColor={borderColor}>
              <Box p={3} bg={useColorModeValue(`${s.color}.50`, 'gray.700')} borderRadius="xl">
                <Box as={s.icon} fontSize="22px" color={s.color} />
              </Box>
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="26px" fontWeight="900" color={s.color} lineHeight="1">{s.value}</Text>
                <Text fontSize="12px" color={textColor} fontWeight="700" textTransform="uppercase">{s.label}</Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Filters */}
        <Box bg={cardBg} p={5} borderRadius="2xl" boxShadow="md" mb={6} border="1px solid" borderColor={borderColor}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none"><SearchIcon color={useColorModeValue('gray.400', 'gray.500')} /></InputLeftElement>
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                borderRadius="xl"
                h="45px"
                fontSize="15px"
                bg={useColorModeValue('white', 'gray.700')}
              />
            </InputGroup>
            <Select value={filterRole} onChange={e => setFilterRole(e.target.value)} borderRadius="xl" h="45px" bg={useColorModeValue('white', 'gray.700')}>
              <option value="All">All Roles</option>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </Select>
            <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} borderRadius="xl" h="45px" bg={useColorModeValue('white', 'gray.700')}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </Select>
          </SimpleGrid>
        </Box>

        {/* Table */}
        <Box bg={cardBg} borderRadius="2xl" boxShadow="md" overflow="hidden" border="1px solid" borderColor={borderColor}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg={useColorModeValue('#0F172A', 'gray.800')}>
                <Tr>
                  {['Employee', 'Contact', 'Role', 'Assigned Tenant', 'Status', 'Last Login', 'Actions'].map(h => (
                    <Th key={h} color="white" fontSize="11px" fontWeight="800" letterSpacing="1px" textTransform="uppercase" py={4}>{h}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((emp) => {
                  const RoleIcon = roleIcon(emp.role);
                  return (
                    <Tr key={emp.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }} transition="background 0.2s">
                      <Td>
                        <HStack spacing={3}>
                          <Avatar name={emp.name} size="sm" bg={`${roleColor(emp.role)}.500`} color="white" />
                          <VStack align="flex-start" spacing={0}>
                            <Text fontWeight="800" fontSize="15px">{emp.name}</Text>
                            <Text fontSize="12px" color={textColor}>Joined {emp.joinDate}</Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="14px">{emp.email}</Text>
                          <Text fontSize="12px" color={textColor}>{emp.phone}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={roleColor(emp.role)} fontSize="12px" px={3} py={1} borderRadius="full" display="flex" alignItems="center" gap={1}>
                          <Box as={RoleIcon} mr={1} /> {emp.role}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="teal" variant="outline" fontSize="12px" px={3} borderRadius="full">{emp.website}</Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Switch isChecked={emp.status === 'Active'} onChange={() => isSuperAdmin && toggleStatus(emp.id)} colorScheme="green" isDisabled={!isSuperAdmin} size="sm" />
                          <Badge colorScheme={emp.status === 'Active' ? 'green' : 'red'} fontSize="11px" borderRadius="full" px={2}>{emp.status}</Badge>
                        </HStack>
                      </Td>
                      <Td fontSize="13px" color={textColor}>{emp.lastLogin}</Td>
                      <Td>
                        <HStack spacing={1}>
                          {isSuperAdmin && (
                            <>
                              <Tooltip label="Edit" hasArrow><IconButton icon={<EditIcon />} size="sm" variant="ghost" colorScheme="blue" onClick={() => { setEditing(emp); onOpen(); }} /></Tooltip>
                              <Tooltip label="Reset Password" hasArrow><IconButton icon={<LockIcon />} size="sm" variant="ghost" colorScheme="orange" onClick={() => { setResetTarget(emp); setNewPw(''); onPwOpen(); }} /></Tooltip>
                              <Tooltip label="Send Invite" hasArrow><IconButton icon={<EmailIcon />} size="sm" variant="ghost" colorScheme="green" onClick={() => toast({ title: `Invite sent to ${emp.email}`, status: 'success' })} /></Tooltip>
                              <Tooltip label="Delete" hasArrow><IconButton icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(emp.id)} /></Tooltip>
                            </>
                          )}
                          {!isSuperAdmin && <Badge colorScheme="gray" fontSize="11px">Read Only</Badge>}
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Container>

      {/* Modern Employee Modal */}
      <EmployeeModal isOpen={isOpen} onClose={onClose} onSave={handleSave} employee={editing} />

      {/* Password Reset Modal */}
      <Modal isOpen={isPwOpen} onClose={onPwClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Setting new password for <strong>{resetTarget?.name}</strong></Text>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPwClose}>Cancel</Button>
            <Button bg="#D90404" color="white" onClick={handleResetPassword}>Reset Password</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// ==================== MODERN EMPLOYEE MODAL ====================
function EmployeeModal({ isOpen, onClose, onSave, employee }) {
  const empty = { name: '', email: '', phone: '', role: 'Viewer', website: 'Global', status: 'Active' };
  const [form, setForm] = useState(empty);

  React.useEffect(() => {
    setForm(employee ? { ...employee } : empty);
  }, [employee, isOpen]);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const isEditing = !!employee;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
        {/* Red Gradient Header */}
        <Box bgGradient="linear(to-r, #D90404, #f56565)" color="white" py={8} px={8}>
          <HStack spacing={4}>
            <Icon as={FiUsers} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader fontSize="27px" fontWeight="800" p={0} letterSpacing="-0.6px">
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing ? 'Update staff information and permissions' : 'Invite a new team member to the platform'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={8}>
            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600">FULL NAME</FormLabel>
              <Input size="lg" h="56px" borderRadius="2xl" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Alex Turner" _focus={{ borderColor: "#D90404" }} />
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">EMAIL ADDRESS</FormLabel>
                <Input type="email" size="lg" h="56px" borderRadius="2xl" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="alex@hq.com" _focus={{ borderColor: "#D90404" }} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">PHONE NUMBER</FormLabel>
                <Input size="lg" h="56px" borderRadius="2xl" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+44 7700 100001" _focus={{ borderColor: "#D90404" }} />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">ROLE</FormLabel>
                <Select size="lg" h="56px" borderRadius="2xl" value={form.role} onChange={(e) => updateField('role', e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">ASSIGNED WEBSITE</FormLabel>
                <Select size="lg" h="56px" borderRadius="2xl" value={form.website} onChange={(e) => updateField('website', e.target.value)}>
                  {SITES.map(s => <option key={s} value={s.split(' ')[0]}>{s}</option>)}
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600">STATUS</FormLabel>
              <Select size="lg" h="56px" borderRadius="2xl" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" py={8} px={10}>
          <HStack spacing={4} w="full" justify="flex-end">
            <Button variant="ghost" size="lg" onClick={onClose}>Cancel</Button>
            <Button
              size="lg"
              bg="#D90404"
              color="white"
              _hover={{ bg: "#c00404" }}
              onClick={() => onSave(form)}
              px={12}
              fontWeight="700"
              borderRadius="2xl"
              isDisabled={!form.name || !form.email}
            >
              {isEditing ? 'Save Changes' : 'Create & Send Invite'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}