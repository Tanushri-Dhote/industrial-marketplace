import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  useColorModeValue,
  useToast,
  Icon,
  Badge,
  Textarea,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, CheckIcon, DownloadIcon, EmailIcon, SearchIcon } from '@chakra-ui/icons';
import { FiFileText, FiUser, FiPackage, FiInfo, FiTruck, FiShield, FiBriefcase, FiFlag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ModuleFrame from '../components/dashboard/ModuleFrame';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock Data for integration (In a real app, these would come from an API/Context)
const mockLeads = [
  { id: 101, name: 'John Smith', email: 'john@smith-engineering.com', phone: '+44 7700 900077', company: 'Smith Engineering', address: '12 Industrial Park, Manchester, UK' },
  { id: 102, name: 'Sarah Johnson', email: 'sarah.j@globalbuild.com', phone: '+44 7700 900088', company: 'Global Build Ltd', address: '88 Construction Way, London, UK' },
];

const mockInventory = [
  { id: 501, name: 'Caterpillar C32 Diesel Engine', price: 45000, category: 'Marine' },
  { id: 502, name: 'Cummins QSK60 Generator', price: 120000, category: 'Industrial' },
  { id: 503, name: 'Perkins 1106D-E70TA', price: 15500, category: 'Agriculture' },
];

export default function CreateQuotePage() {
  const quoteRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: isLeadOpen, onOpen: onLeadOpen, onClose: onLeadClose } = useDisclosure();
  const { isOpen: isInventoryOpen, onOpen: onInventoryOpen, onClose: onInventoryClose } = useDisclosure();
  
  const accentColor = "#D90404";
  const darkBlue = "#0F172A";
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState(null);
  
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });

  const [items, setItems] = useState([
    { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }
  ]);

  const [details, setDetails] = useState({
    warranty: '12 Months',
    leadTime: '3-5 Working Days',
    shippingMethod: 'Express Freight',
    taxRate: 20,
    shippingCost: 0,
    notes: '',
    refNumber: `SITE-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    grandTotal: 0
  });

  // Load User context for multi-tenancy
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Redirect if role is Viewer (Read-only security)
      if (userData.role === 'Viewer') {
        toast({ title: "Access Denied", description: "Viewers cannot create quotes.", status: "error" });
        navigate('/dashboard');
      }
    }
  }, [navigate, toast]);

  useEffect(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * details.taxRate) / 100;
    const grandTotal = subtotal + taxAmount + Number(details.shippingCost);
    
    setTotals({
      subtotal,
      taxAmount,
      grandTotal
    });
  }, [items, details]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const importLead = (lead) => {
    setCustomer({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      address: lead.address
    });
    onLeadClose();
    toast({ title: "Lead Imported", status: "success", duration: 2000 });
  };

  const importProduct = (product) => {
    // If first item is empty, replace it, otherwise add new
    if (items.length === 1 && !items[0].description) {
      setItems([{ id: Date.now(), description: product.name, quantity: 1, unitPrice: product.price }]);
    } else {
      setItems([...items, { id: Date.now(), description: product.name, quantity: 1, unitPrice: product.price }]);
    }
    onInventoryClose();
    toast({ title: "Product Added", status: "success", duration: 2000 });
  };

  const handleDownloadPDF = async () => {
    if (!customer.name) {
      toast({ title: "Customer Name Required", status: "warning" });
      return;
    }

    setIsGenerating(true);
    const element = quoteRef.current;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Quote_${details.refNumber}_${customer.name.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "PDF Generated Successfully",
        description: `Ref: ${details.refNumber}`,
        status: "success",
        duration: 3000,
        position: 'top-right'
      });
    } catch (error) {
      console.error('PDF Error:', error);
      toast({ title: "Error generating PDF", status: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Quote Saved to Database",
      description: `Reference: ${details.refNumber} | Website ID: ${user?.websiteId || 'DEFAULT'}`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    });
    // Record Audit Log (Mock)
    console.log("Audit Log: Quote created", { 
      user: user?.name, 
      websiteId: user?.websiteId, 
      ref: details.refNumber,
      total: totals.grandTotal 
    });
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <HStack mb={8} justify="space-between">
          <VStack align="flex-start" spacing={0}>
            <Heading fontSize="32px" fontWeight="900" letterSpacing="-1px" color={darkBlue}>
              Create Own Quote
            </Heading>
            <HStack color="gray.500" fontSize="16px" mt={1}>
              <Icon as={FiFlag} color={accentColor} />
              <Text fontWeight="700">Multi-Tenant System:</Text>
              <Text>{user?.businessName || 'Industrial Marketplace'}</Text>
            </HStack>
          </VStack>
          <HStack spacing={4}>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button 
               bg={accentColor} 
               color="white" 
               px={8} 
               h="45px" 
               borderRadius="full" 
               _hover={{ bg: "#c74848", transform: "translateY(-2px)" }}
               onClick={handleSave}
               leftIcon={<CheckIcon />}
            >
              Save Quote
            </Button>
          </HStack>
        </HStack>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 380px" }} gap={8} align={ "start" }>
          <GridItem ref={quoteRef} bg="white" p={8} borderRadius="xl" border="1px solid" borderColor={borderColor}>
            <VStack spacing={8} w="full" align="stretch">
              
              {/* Tenant Branding Section (PDF Vision) */}
              <Flex justify="space-between" align="center" pb={6} borderBottom="2px solid" borderColor="gray.100">
                <HStack spacing={4}>
                  <Avatar name={user?.businessName} size="lg" bg={accentColor} color="white" icon={<FiBriefcase fontSize="1.5rem" />} />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="24px" fontWeight="900" color={darkBlue} lineHeight="1">{user?.businessName || 'INDUSTRIAL CORP'}</Text>
                    <Text fontSize="12px" color="gray.500" fontWeight="700" letterSpacing="1px">TENANT ID: {user?.websiteId || 'GEN-IND-001'}</Text>
                  </VStack>
                </HStack>
                <VStack align="flex-end" spacing={0}>
                  <Text fontWeight="800" fontSize="18px" color={accentColor}>QUOTATION</Text>
                  <Text fontSize="14px" fontWeight="700">Ref: {details.refNumber}</Text>
                  <Text fontSize="12px" color="gray.500">{new Date().toLocaleDateString()}</Text>
                </VStack>
              </Flex>

              {/* Customer Information */}
              <Box position="relative">
                <Button 
                  position="absolute" 
                  top="0" 
                  right="0" 
                  size="sm" 
                  leftIcon={<SearchIcon />} 
                  colorScheme="blue" 
                  variant="ghost" 
                  onClick={onLeadOpen}
                  zIndex={1}
                >
                  Import from Leads
                </Button>
                <ModuleFrame 
                  icon={FiUser} 
                  title="Customer Information" 
                  description="Pre-fill from Leads module or enter manually."
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="700">Customer Name</FormLabel>
                      <Input placeholder="e.g. John Smith" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="700">Company Name</FormLabel>
                      <Input placeholder="e.g. ABC Ltd" value={customer.company} onChange={(e) => setCustomer({...customer, company: e.target.value})} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontWeight="700">Email Address</FormLabel>
                      <Input type="email" placeholder="john@example.com" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="700">Phone Number</FormLabel>
                      <Input placeholder="+44 77..." value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
                    </FormControl>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                      <FormControl>
                        <FormLabel fontWeight="700">Billing Address</FormLabel>
                        <Textarea placeholder="Full address..." value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
                      </FormControl>
                    </GridItem>
                  </SimpleGrid>
                </ModuleFrame>
              </Box>

              {/* Quote Items */}
              <Box position="relative">
                <Button 
                  position="absolute" 
                  top="0" 
                  right="0" 
                  size="sm" 
                  leftIcon={<SearchIcon />} 
                  colorScheme="blue" 
                  variant="ghost" 
                  onClick={onInventoryOpen}
                  zIndex={1}
                >
                  Add from Inventory
                </Button>
                <ModuleFrame 
                  icon={FiPackage} 
                  title="Quote Items" 
                  description="Select products from your tenant engine inventory."
                >
                  <Table variant="simple" mb={4}>
                    <Thead bg="gray.50">
                      <Tr>
                        <Th w="40%">Description</Th>
                        <Th w="15%">Qty</Th>
                        <Th w="20%">Unit Price ($)</Th>
                        <Th w="20%" isNumeric>Total</Th>
                        <Th w="5%"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {items.map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            <Input size="sm" placeholder="Search engines..." value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                          </Td>
                          <Td>
                             <NumberInput size="sm" min={1} value={item.quantity} onChange={(_, val) => updateItem(item.id, 'quantity', val)}>
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td>
                            <NumberInput size="sm" min={0} value={item.unitPrice} onChange={(_, val) => updateItem(item.id, 'unitPrice', val)}>
                              <NumberInputField />
                            </NumberInput>
                          </Td>
                          <Td isNumeric fontWeight="700">${(item.quantity * item.unitPrice).toLocaleString()}</Td>
                          <Td>
                            <IconButton icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => removeItem(item.id)} isDisabled={items.length === 1} aria-label="Remove item" />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  <Button leftIcon={<AddIcon />} variant="outline" size="sm" onClick={addItem} colorScheme="blue">Add Custom Item</Button>
                </ModuleFrame>
              </Box>

              {/* Terms & Conditions (PDF Ready) */}
              <ModuleFrame icon={FiInfo} title="Terms & Details" description="Tenant-specific terms and lead time settings.">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                   <FormControl>
                    <FormLabel fontWeight="700"><Icon as={FiShield} mr={1} color={accentColor}/> Warranty</FormLabel>
                    <Select value={details.warranty} onChange={(e) => setDetails({...details, warranty: e.target.value})}>
                      <option>None</option>
                      <option>12 Months</option>
                      <option>24 Months</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="700"><Icon as={FiTruck} mr={1} color={accentColor}/> Lead Time</FormLabel>
                    <Input value={details.leadTime} onChange={(e) => setDetails({...details, leadTime: e.target.value})} />
                  </FormControl>
                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <FormControl>
                      <FormLabel fontWeight="700">Internal Notes / Quotation Terms</FormLabel>
                      <Textarea rows={3} placeholder="Standard terms apply..." value={details.notes} onChange={(e) => setDetails({...details, notes: e.target.value})} />
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
              </ModuleFrame>

              {/* Totals Section for PDF */}
              <Flex justify="flex-end" pt={4}>
                 <VStack align="stretch" spacing={2} minW="250px" p={4} bg="gray.50" borderRadius="lg">
                    <HStack justify="space-between"><Text fontWeight="700">Subtotal:</Text><Text fontSize="18px">${totals.subtotal.toLocaleString()}</Text></HStack>
                    <HStack justify="space-between"><Text fontWeight="700">Tax ({details.taxRate}%):</Text><Text fontSize="18px">${totals.taxAmount.toLocaleString()}</Text></HStack>
                    <HStack justify="space-between" color={accentColor}><Text fontWeight="900" fontSize="20px">Total Cost:</Text><Text fontWeight="900" fontSize="22px">${totals.grandTotal.toLocaleString()}</Text></HStack>
                 </VStack>
              </Flex>
            </VStack>
          </GridItem>

          {/* Sidebar Tools */}
          <GridItem>
            <Box position="sticky" top="100px" bg={cardBg} p={6} borderRadius="2xl" boxShadow="2xl" border="1px solid" borderColor={borderColor}>
              <Heading fontSize="20px" mb={6} display="flex" alignItems="center">
                <Icon as={FiFileText} mr={3} color={accentColor} /> Project Actions
              </Heading>
              
              <VStack spacing={4} align="stretch">
                <Badge colorScheme={user?.role === 'Admin' ? 'purple' : 'blue'} p={2} borderRadius="md" textAlign="center">
                  USER ROLE: {user?.role || 'SALES MANAGER'}
                </Badge>
                
                <Divider />
                
                <VStack spacing={3} mt={2}>
                  <Button w="full" h="50px" borderRadius="xl" bg="#0F172A" color="white" _hover={{ bg: "#1e293b" }} leftIcon={<DownloadIcon />} onClick={handleDownloadPDF} isLoading={isGenerating}>Download PDF</Button>
                  <Button w="full" h="50px" borderRadius="xl" variant="outline" borderColor={darkBlue} color={darkBlue} _hover={{ bg: "gray.50" }} leftIcon={<EmailIcon />}>Email Customer</Button>
                  <Text fontSize="11px" color="gray.500" textAlign="center">All actions are logged in the audit trail for tenant: {user?.websiteId}</Text>
                </VStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>

      {/* Leads Selector Modal */}
      <Modal isOpen={isLeadOpen} onClose={onLeadClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Select Lead to Import</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              {mockLeads.map(lead => (
                <Box key={lead.id} p={4} borderWidth="1px" borderRadius="xl" cursor="pointer" _hover={{ bg: "gray.50", borderColor: accentColor }} onClick={() => importLead(lead)}>
                  <HStack justify="space-between">
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="800" fontSize="16px">{lead.name}</Text>
                      <Text color="gray.500" fontSize="13px">{lead.company}</Text>
                    </VStack>
                    <Badge colorScheme="blue">SELECT</Badge>
                  </HStack>
                </Box>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Inventory Selector Modal */}
      <Modal isOpen={isInventoryOpen} onClose={onInventoryClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Select Engine from Inventory</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              {mockInventory.map(product => (
                <Box key={product.id} p={4} borderWidth="1px" borderRadius="xl" cursor="pointer" _hover={{ bg: "gray.50", borderColor: accentColor }} onClick={() => importProduct(product)}>
                  <HStack justify="space-between">
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="800" fontSize="16px">{product.name}</Text>
                      <Text color="gray.500" fontSize="13px">Category: {product.category}</Text>
                    </VStack>
                    <Text fontWeight="900" color={accentColor}>${product.price.toLocaleString()}</Text>
                  </HStack>
                </Box>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
