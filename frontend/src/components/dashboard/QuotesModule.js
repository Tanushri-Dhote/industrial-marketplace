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
import { FiFileText } from 'react-icons/fi';
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

  // Dark Mode Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const inputBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.100', 'gray.700');

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
      icon={FiFileText}
      title="Quotation History"
      description="Generate and manage price quotes for industrial machinery. Track approval status, maintain customer records, and review transaction history."
    >
      <HStack justify="flex-end" mb={8}>
        <Button 
          leftIcon={<AddIcon />} 
          bg="#D90404" 
          color="white"
          _hover={{ bg: "#c00404" }}
          onClick={() => navigate('/create-quote')}
          fontSize="16px"
          px={6}
          h="45px"
          borderRadius="lg"
        >
          Create Quote
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Customer</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Product</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Amount</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Created By</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Date</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {quotes.map((quote) => (
              <Tr key={quote.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                <Td fontSize="12px" fontWeight="600">{quote.customer}</Td>
                <Td fontSize="12px">{quote.product}</Td>
                <Td fontSize="12px" fontWeight="700">${quote.amount.toLocaleString()}</Td>
                <Td>
                  <Select 
                    value={quote.status} 
                    size="sm" 
                    width="95px" 
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
                <Td>
                  <Badge colorScheme="purple" fontSize="11px">SITE ADMIN</Badge>
                </Td>
                <Td fontSize="12px" color={textMuted}>{quote.date}</Td>
                <Td>
                  <IconButton 
                    icon={<ViewIcon />} 
                    size="sm" 
                    variant="ghost" 
                    mr={2} 
                    onClick={() => { setViewingQuote(quote); onViewOpen(); }}
                    aria-label="View Quote"
                  />
                  <IconButton 
                    icon={<EditIcon />} 
                    size="sm" 
                    variant="ghost" 
                    mr={2} 
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

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM QUOTE EDIT MODAL (Dark Mode Optimized)
// ─────────────────────────────────────────────────────────────
function QuoteModal({ isOpen, onClose, onSave, quote }) {
  const [formData, setFormData] = useState({ 
    customer: '', 
    product: '', 
    amount: '', 
    notes: '', 
    status: 'Pending' 
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  React.useEffect(() => {
    if (quote) {
      setFormData(quote);
    } else {
      setFormData({ customer: '', product: '', amount: '', notes: '', status: 'Pending' });
    }
  }, [quote]);

  const isEditing = !!quote;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      size="xl"
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />

      <ModalContent 
        bg={cardBg}
        borderRadius="3xl" 
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Premium Red Gradient Header - Works in both modes */}
        <Box 
          bgGradient="linear(to-r, #D90404, #f56565)" 
          color="white" 
          py={8} 
          px={8}
        >
          <HStack spacing={4}>
            <Icon as={FiFileText} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader 
                fontSize="27px" 
                fontWeight="800" 
                p={0}
                letterSpacing="-0.6px"
              >
                {isEditing ? 'Edit Quote' : 'Create New Quote'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing 
                  ? 'Update quote details and status' 
                  : 'Generate a new quotation for a customer'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={8} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color={textMuted} mb={2}>
                  CUSTOMER NAME
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  bg={inputBg}
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="ABC Corporation"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.2)" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color={textMuted} mb={2}>
                  PRODUCT / SERVICE
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  bg={inputBg}
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="500kW Industrial Generator"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.2)" }}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color={textMuted} mb={2}>
                  QUOTE AMOUNT ($)
                </FormLabel>
                <Input
                  type="number"
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  bg={inputBg}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="25000"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.2)" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color={textMuted} mb={2}>
                  STATUS
                </FormLabel>
                <Select
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="16px"
                  bg={inputBg}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  _focus={{ borderColor: "#D90404" }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="700" fontSize="14px" color={textMuted} mb={2}>
                ADDITIONAL NOTES
              </FormLabel>
              <Textarea
                rows={6}
                size="lg"
                fontSize="16px"
                borderRadius="2xl"
                bg={inputBg}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Include any special terms, delivery timeline, or validity period..."
                _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.2)" }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter 
          bg={useColorModeValue('gray.50', 'gray.700')} 
          borderTop="1px solid" 
          borderColor={borderColor} 
          py={8} 
          px={10}
        >
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
              {isEditing ? 'Update Quote' : 'Save Quote'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM QUOTE VIEW MODAL (Dark Mode Optimized)
// ─────────────────────────────────────────────────────────────
function QuoteViewModal({ isOpen, onClose, quote }) {
  if (!quote) return null;

  const cardBg = useColorModeValue('white', 'gray.800');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const notesBg = useColorModeValue('gray.50', 'gray.700');
  const notesBorder = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      size="lg"
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />

      <ModalContent 
        bg={cardBg}
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
            <Icon as={FiFileText} boxSize={8} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader 
                fontSize="26px" 
                fontWeight="800" 
                p={0}
                letterSpacing="-0.5px"
              >
                Quote Details
              </ModalHeader>
              <Text opacity={0.85} fontSize="15px">
                #{quote.id} • {quote.date}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={7} align="stretch">
            <SimpleGrid columns={2} spacing={6}>
              <Box>
                <Text fontSize="13px" fontWeight="700" color={textMuted} mb={1}>CUSTOMER</Text>
                <Text fontSize="18px" fontWeight="600">{quote.customer}</Text>
              </Box>
              <Box>
                <Text fontSize="13px" fontWeight="700" color={textMuted} mb={1}>STATUS</Text>
                <Badge 
                  colorScheme={
                    quote.status === 'Approved' ? 'green' : 
                    quote.status === 'Rejected' ? 'red' : 'orange'
                  } 
                  fontSize="14px" 
                  px={5} 
                  py={1.5} 
                  borderRadius="full"
                >
                  {quote.status}
                </Badge>
              </Box>
            </SimpleGrid>

            <Box>
              <Text fontSize="13px" fontWeight="700" color={textMuted} mb={1}>PRODUCT</Text>
              <Text fontSize="17px" fontWeight="600">{quote.product}</Text>
            </Box>

            <Box>
              <Text fontSize="13px" fontWeight="700" color={textMuted} mb={1}>QUOTE AMOUNT</Text>
              <Text fontSize="28px" fontWeight="800" color="#D90404">
                ${quote.amount?.toLocaleString()}
              </Text>
            </Box>

            {quote.notes && (
              <Box>
                <Text fontSize="13px" fontWeight="700" color={textMuted} mb={2}>NOTES</Text>
                <Box 
                  bg={notesBg} 
                  p={6} 
                  borderRadius="2xl" 
                  border="1px solid" 
                  borderColor={notesBorder}
                >
                  <Text fontSize="16px" lineHeight="1.7" whiteSpace="pre-wrap">
                    {quote.notes}
                  </Text>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter 
          bg={useColorModeValue('gray.50', 'gray.700')} 
          borderTop="1px solid" 
          borderColor={borderColor} 
          py={8} 
          px={10}
        >
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