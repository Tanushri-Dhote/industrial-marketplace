import React, { useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Select,
  useDisclosure, useToast, Badge, Box, VStack, SimpleGrid, Text, Icon
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { FiTrendingUp, FiUserCheck } from 'react-icons/fi';
import ModuleFrame from './ModuleFrame';

const initialLeads = [
  { id: 1, name: 'John Smith', email: 'john@company.com', product: 'Diesel Generator', status: 'New', date: '2024-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@firm.com', product: 'Hydraulic Excavator', status: 'Contacted', date: '2024-01-14' },
];

export default function LeadsModule() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Super Admin';
  const isViewer = role === 'Viewer';

  const [leads, setLeads] = useState(initialLeads);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const toast = useToast();

  const handleSave = (data) => {
    if (editingLead) {
      setLeads(leads.map(l => l.id === editingLead.id ? { ...data, id: editingLead.id } : l));
    } else {
      setLeads([...leads, { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    toast({ title: editingLead ? 'Lead updated' : 'Lead added', status: 'success' });
    onClose();
  };

  const handleDelete = (id) => {
    setLeads(leads.filter(l => l.id !== id));
    toast({ title: 'Lead deleted', status: 'info' });
  };

  const handleStatusChange = (id, newStatus) => {
    if (isViewer) return;
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    toast({ title: `Lead marked as ${newStatus}`, status: 'info' });
  };

  return (
    <ModuleFrame
      icon={FiTrendingUp}
      title="Sales Leads"
      description="Track and nurture incoming business inquiries. Manage customer communication, qualify prospects, and convert opportunities into sales."
    >
      {!isViewer && (
        <HStack justify="flex-end" mb={8}>
          <Button 
            leftIcon={<AddIcon />} 
            bg="#D90404" 
            color="white"
            _hover={{ bg: "#c00404" }}
            onClick={() => { setEditingLead(null); onOpen(); }}
            fontSize="16px"
            px={6}
            h="45px"
            borderRadius="lg"
          >
            Add Lead
          </Button>
        </HStack>
      )}

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Name</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Email</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Product</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Date</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leads.map((lead) => (
              <Tr key={lead.id}>
                <Td fontSize="12px" fontWeight="600">{lead.name}</Td>
                <Td fontSize="12px">{lead.email}</Td>
                <Td fontSize="12px">{lead.product}</Td>
                <Td>
                  <Select 
                    value={lead.status} 
                    size="sm" 
                    width="80px" 
                    fontSize="12px"
                    borderRadius="md"
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    isDisabled={isViewer}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                    <option value="Won">Won</option>
                  </Select>
                </Td>
                <Td fontSize="12px">{lead.date}</Td>
                <Td>
                  <IconButton 
                    icon={<ViewIcon />} 
                    size="sm" 
                    variant="ghost" 
                    mr={2} 
                    onClick={() => { setViewingLead(lead); onViewOpen(); }}
                    aria-label="View Lead"
                  />
                  {!isViewer && (
                    <>
                      <IconButton 
                        icon={<EditIcon />} 
                        size="sm" 
                        variant="ghost" 
                        mr={2} 
                        onClick={() => { setEditingLead(lead); onOpen(); }}
                        aria-label="Edit Lead"
                      />
                      <IconButton 
                        icon={<DeleteIcon />} 
                        size="sm" 
                        variant="ghost" 
                        colorScheme="red" 
                        onClick={() => handleDelete(lead.id)}
                        aria-label="Delete Lead"
                      />
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <LeadModal isOpen={isOpen} onClose={onClose} onSave={handleSave} lead={editingLead} />
      <LeadViewModal isOpen={isViewOpen} onClose={onViewClose} lead={viewingLead} />
    </ModuleFrame>
  );
}

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM LEAD EDIT MODAL
// ─────────────────────────────────────────────────────────────
function LeadModal({ isOpen, onClose, onSave, lead }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    product: '', 
    message: '', 
    status: 'New' 
  });

  React.useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({ name: '', email: '', phone: '', product: '', message: '', status: 'New' });
    }
  }, [lead]);

  const isEditing = !!lead;

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
        {/* Premium Red Gradient Header */}
        <Box 
          bgGradient="linear(to-r, #D90404, #f56565)" 
          color="white" 
          py={8} 
          px={8}
        >
          <HStack spacing={4}>
            <Icon as={FiUserCheck} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader 
                fontSize="27px" 
                fontWeight="800" 
                p={0}
                letterSpacing="-0.6px"
              >
                {isEditing ? 'Edit Lead' : 'Add New Lead'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing 
                  ? 'Update lead information and status' 
                  : 'Capture a new sales inquiry'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={8} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  FULL NAME
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  EMAIL ADDRESS
                </FormLabel>
                <Input
                  type="email"
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  PHONE NUMBER
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  INTERESTED PRODUCT
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="Diesel Generator"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                CUSTOMER MESSAGE
              </FormLabel>
              <Textarea
                rows={6}
                size="lg"
                fontSize="16px"
                borderRadius="2xl"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write any additional notes or inquiry details..."
                _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                LEAD STATUS
              </FormLabel>
              <Select
                size="lg"
                h="56px"
                borderRadius="2xl"
                fontSize="16px"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                _focus={{ borderColor: "#D90404" }}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
                <option value="Won">Won</option>
              </Select>
            </FormControl>
          </VStack>
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
              {isEditing ? 'Update Lead' : 'Save Lead'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM LEAD VIEW MODAL
// ─────────────────────────────────────────────────────────────
function LeadViewModal({ isOpen, onClose, lead }) {
  if (!lead) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      size="lg"
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />

      <ModalContent 
        borderRadius="3xl" 
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Premium Red Gradient Header */}
        <Box 
          bgGradient="linear(to-r, #D90404, #f56565)" 
          color="white" 
          py={8} 
          px={8}
        >
          <HStack spacing={4}>
            <Icon as={FiUserCheck} boxSize={8} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader 
                fontSize="26px" 
                fontWeight="800" 
                p={0}
                letterSpacing="-0.5px"
              >
                Lead Details
              </ModalHeader>
              <Text opacity={0.85} fontSize="15px">
                {lead.name} • {lead.date}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={2} spacing={6}>
              <Box>
                <Text fontSize="13px" fontWeight="700" color="gray.500" mb={1}>NAME</Text>
                <Text fontSize="18px" fontWeight="600">{lead.name}</Text>
              </Box>
              <Box>
                <Text fontSize="13px" fontWeight="700" color="gray.500" mb={1}>STATUS</Text>
                <Badge 
                  colorScheme={
                    lead.status === 'Won' ? 'green' : 
                    lead.status === 'Lost' ? 'red' : 
                    lead.status === 'Qualified' ? 'purple' : 'blue'
                  } 
                  fontSize="14px" 
                  px={4} 
                  py={1} 
                  borderRadius="full"
                >
                  {lead.status}
                </Badge>
              </Box>
            </SimpleGrid>

            <Box>
              <Text fontSize="13px" fontWeight="700" color="gray.500" mb={1}>EMAIL</Text>
              <Text fontSize="17px">{lead.email}</Text>
            </Box>

            <Box>
              <Text fontSize="13px" fontWeight="700" color="gray.500" mb={1}>PHONE</Text>
              <Text fontSize="17px">{lead.phone || 'Not provided'}</Text>
            </Box>

            <Box>
              <Text fontSize="13px" fontWeight="700" color="gray.500" mb={1}>INTERESTED PRODUCT</Text>
              <Text fontSize="17px" fontWeight="600">{lead.product}</Text>
            </Box>

            {lead.message && (
              <Box>
                <Text fontSize="13px" fontWeight="700" color="gray.500" mb={2}>CUSTOMER MESSAGE</Text>
                <Box 
                  bg="gray.50" 
                  p={5} 
                  borderRadius="2xl" 
                  border="1px solid" 
                  borderColor="gray.100"
                >
                  <Text fontSize="16px" lineHeight="1.7">{lead.message}</Text>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" py={8} px={10}>
          <Button 
            onClick={onClose} 
            size="lg"
            variant="solid"
            colorScheme="gray"
            px={10}
            fontWeight="600"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}