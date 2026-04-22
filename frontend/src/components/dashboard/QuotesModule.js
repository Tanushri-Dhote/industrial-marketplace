import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Select,
  useDisclosure, useToast, Badge, Box, VStack, SimpleGrid, Text, Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { FileText } from 'lucide-react';
import ModuleFrame from './ModuleFrame';

const initialQuotes = [
  { id: 1, customer: 'ABC Corp', product: '500kW Generator', amount: 25000, status: 'Pending', date: '2024-01-15' },
  { id: 2, customer: 'XYZ Industries', product: 'Hydraulic Excavator', amount: 85000, status: 'Approved', date: '2024-01-14' },
];

export default function QuotesModule() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const inputBg = useColorModeValue('white', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');

  const handleSave = (data) => {
    if (editingQuote) {
      setQuotes(quotes.map(q => q.id === editingQuote.id ? { ...data, id: editingQuote.id } : q));
    } else {
      setQuotes([...quotes, { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    toast({ title: editingQuote ? 'Quote updated' : 'Quote added', status: 'success' });
    onClose();
  };

  const handleDelete = (id) => {
    setQuotes(quotes.filter(q => q.id !== id));
    toast({ title: 'Quote deleted', status: 'info' });
  };

  const handleStatusChange = (id, newStatus) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
    toast({ title: `Quote marked as ${newStatus}`, status: 'info' });
  };

  return (
    <ModuleFrame
      icon={FileText}
      title="Quotation History"
      description="Generate and manage price quotes for industrial machinery. Track approval status and maintain transaction history."
    >
      <HStack justify="flex-end" mb={8}>
        <Button 
          leftIcon={<AddIcon />} 
          bg="#D90404" 
          color="white"
          _hover={{ bg: "#c00404" }}
          onClick={() => navigate('/create-quote')}
          fontSize="15px"
          px={6}
          h="45px"
          borderRadius="xl"
        >
          Create Quote
        </Button>
      </HStack>

      <Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Customer</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Product</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Amount</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Date</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {quotes.map((quote) => (
              <Tr key={quote.id}>
                <Td fontSize="13px" fontWeight="600">{quote.customer}</Td>
                <Td fontSize="13px">{quote.product}</Td>
                <Td fontSize="13px" fontWeight="700">${quote.amount.toLocaleString()}</Td>
                <Td>
                  <Select 
                    value={quote.status} 
                    size="sm" 
                    width="120px" 
                    fontSize="12px"
                    borderRadius="md"
                    onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                    bg={inputBg}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                </Td>
                <Td fontSize="13px" color={textMuted}>{quote.date}</Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton 
                      icon={<ViewIcon />} 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => { setViewingQuote(quote); onViewOpen(); }}
                      aria-label="View Quote"
                    />
                    <IconButton 
                      icon={<EditIcon />} 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => { setEditingQuote(quote); onOpen(); }}
                      aria-label="Edit Quote"
                    />
                    <IconButton 
                      icon={<DeleteIcon />} 
                      size="sm" 
                      variant="ghost" 
                      colorScheme="red" 
                      onClick={() => handleDelete(quote.id)}
                      aria-label="Delete Quote"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <QuoteModal isOpen={isOpen} onClose={onClose} onSave={handleSave} quote={editingQuote} />
      <QuoteViewModal isOpen={isViewOpen} onClose={onViewClose} quote={viewingQuote} />
    </ModuleFrame>
  );
}

function QuoteModal({ isOpen, onClose, onSave, quote }) {
  const [formData, setFormData] = useState({ 
    customer: '', product: '', amount: '', notes: '', status: 'Pending' 
  });

  React.useEffect(() => {
    if (quote) setFormData(quote);
    else setFormData({ customer: '', product: '', amount: '', notes: '', status: 'Pending' });
  }, [quote]);

  const isEditing = !!quote;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
        <Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={8} px={8}>
          <HStack spacing={4}>
            <Icon as={FileText} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader fontSize="27px" fontWeight="800" p={0}>
                {isEditing ? 'Edit Quote' : 'Create New Quote'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing ? 'Update quote details' : 'Generate a new quotation'}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <ModalCloseButton color="white" top={6} right={6} />
        <ModalBody p={10}>
          <VStack spacing={8} align="stretch">
            <SimpleGrid columns={2} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">CUSTOMER</FormLabel>
                <Input size="lg" h="56px" borderRadius="2xl" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">PRODUCT</FormLabel>
                <Input size="lg" h="56px" borderRadius="2xl" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} />
              </FormControl>
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">AMOUNT ($)</FormLabel>
                <Input type="number" size="lg" h="56px" borderRadius="2xl" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600">STATUS</FormLabel>
                <Select size="lg" h="56px" borderRadius="2xl" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </VStack>
        </ModalBody>
        <ModalFooter bg="gray.50" py={8} px={10}>
          <HStack spacing={4} w="full" justify="flex-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button bg="#D90404" color="white" _hover={{ bg: "#c00404" }} onClick={() => onSave(formData)} px={12} borderRadius="2xl">
              {isEditing ? 'Update Quote' : 'Save Quote'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function QuoteViewModal({ isOpen, onClose, quote }) {
  if (!quote) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent borderRadius="3xl" overflow="hidden" boxShadow="2xl">
        <Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={8} px={8}>
          <HStack spacing={4}>
            <Icon as={FileText} boxSize={8} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader fontSize="26px" fontWeight="800" p={0}>Quote Details</ModalHeader>
              <Text opacity={0.85} fontSize="15px">#{quote.id} • {quote.date}</Text>
            </VStack>
          </HStack>
        </Box>
        <ModalCloseButton color="white" top={6} right={6} />
        <ModalBody p={10}>
          <VStack spacing={7} align="stretch">
            <SimpleGrid columns={2} spacing={6}>
              <Box>
                <Text fontSize="13px" fontWeight="700" color="gray.500">CUSTOMER</Text>
                <Text fontSize="18px" fontWeight="600">{quote.customer}</Text>
              </Box>
              <Box>
                <Text fontSize="13px" fontWeight="700" color="gray.500">STATUS</Text>
                <Badge colorScheme={quote.status === 'Approved' ? 'green' : 'orange'} fontSize="14px" px={5} py={1.5} borderRadius="full">{quote.status}</Badge>
              </Box>
            </SimpleGrid>
            <Box>
              <Text fontSize="13px" fontWeight="700" color="gray.500">PRODUCT</Text>
              <Text fontSize="17px" fontWeight="600">{quote.product}</Text>
            </Box>
            <Box>
              <Text fontSize="13px" fontWeight="700" color="gray.500">AMOUNT</Text>
              <Text fontSize="28px" fontWeight="800" color="#D90404">${quote.amount?.toLocaleString()}</Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter bg="gray.50" py={8} px={10}>
          <Button onClick={onClose} size="lg" colorScheme="gray" px={10}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}