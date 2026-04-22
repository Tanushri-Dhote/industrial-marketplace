import React, { useState, useEffect } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
  useDisclosure, Badge, Box, VStack, SimpleGrid, Text, Icon, Select,
  Spinner, Center, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { Package, Fuel as Engine, Tag, Activity } from 'lucide-react';
import { toast } from 'sonner';
import ModuleFrame from './ModuleFrame';
import API from '../../services/api';

export default function EnginesModule() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'viewer';
  const isViewer = role === 'viewer';

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/products');
      // Axios response body is res.data
      // Our controller returns 'products' directly (which is an array)
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setProducts(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, data);
        toast.success('Product updated');
      } else {
        await API.post('/products', data);
        toast.success('Product added');
      }
      fetchProducts();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.make && p.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.model && p.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ModuleFrame
      icon={Package}
      title="Engine Inventory"
      description="Manage your industrial engine catalog. Track stock, specifications, and pricing across all your tenant sites."
    >
      <HStack justify="space-between" mb={8}>
        <InputGroup maxW="350px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search engines, make, model..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="xl"
            h="45px"
            bg="white"
            fontSize="14px"
          />
        </InputGroup>

        {!isViewer && (
          <Button 
            leftIcon={<AddIcon />} 
            bg="#D90404" 
            color="white"
            _hover={{ bg: "#c00404" }}
            onClick={() => { setEditingProduct(null); onOpen(); }}
            fontSize="15px"
            px={8}
            h="45px"
            borderRadius="xl"
            boxShadow="md"
          >
            Add Engine
          </Button>
        )}
      </HStack>

      {isLoading ? (
        <Center py={20}>
          <VStack spacing={4}>
            <Spinner color="#D90404" size="xl" thickness="4px" />
            <Text color="gray.500" fontWeight="600">Fetching inventory...</Text>
          </VStack>
        </Center>
      ) : filteredProducts.length === 0 ? (
        <Center py={20} bg="gray.50" borderRadius="2xl" border="2px dashed" borderColor="gray.200">
          <VStack spacing={3}>
            <Icon as={Package} boxSize={12} color="gray.300" />
            <Text color="gray.500" fontWeight="700" fontSize="18px">No products found</Text>
            <Text color="gray.400" fontSize="14px">Try adjusting your search or add a new engine.</Text>
          </VStack>
        </Center>
      ) : (
        <Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
          <Table variant="simple" size="md">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="11px" fontWeight="800" textTransform="uppercase" color="gray.500" py={4}>Product Info</Th>
                <Th fontSize="11px" fontWeight="800" textTransform="uppercase" color="gray.500" py={4}>Specifications</Th>
                <Th fontSize="11px" fontWeight="800" textTransform="uppercase" color="gray.500" py={4}>Price</Th>
                <Th fontSize="11px" fontWeight="800" textTransform="uppercase" color="gray.500" py={4}>Status</Th>
                {!isViewer && <Th fontSize="11px" fontWeight="800" textTransform="uppercase" color="gray.500" py={4}>Actions</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((p) => (
                <Tr key={p._id} _hover={{ bg: 'gray.50/50' }}>
                  <Td>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="800" color="gray.800" fontSize="14px">{p.name}</Text>
                      <Text fontSize="12px" color="gray.500">ID: {p._id.substring(0, 8)}...</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Badge variant="subtle" colorScheme="blue" fontSize="10px" px={2} borderRadius="md">
                        {p.make || 'Any Make'}
                      </Badge>
                      <Badge variant="subtle" colorScheme="purple" fontSize="10px" px={2} borderRadius="md">
                        {p.model || 'Any Model'}
                      </Badge>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontWeight="900" color="#D90404" fontSize="15px">
                      {p.currency || '£'}{p.price?.toLocaleString() || '0.00'}
                    </Text>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={p.isSold ? 'red' : 'green'} 
                      fontSize="11px" 
                      borderRadius="full" 
                      px={3} 
                      py={1}
                      textTransform="uppercase"
                      variant="solid"
                    >
                      {p.isSold ? 'Sold' : 'Available'}
                    </Badge>
                  </Td>
                  {!isViewer && (
                    <Td>
                      <HStack spacing={1}>
                        <IconButton 
                          icon={<EditIcon />} 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => { setEditingProduct(p); onOpen(); }}
                          aria-label="Edit Engine"
                        />
                        <IconButton 
                          icon={<DeleteIcon />} 
                          size="sm" 
                          variant="ghost" 
                          colorScheme="red" 
                          onClick={() => handleDelete(p._id)}
                          aria-label="Delete Engine"
                        />
                      </HStack>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <EngineModal isOpen={isOpen} onClose={onClose} onSave={handleSave} engine={editingProduct} />
    </ModuleFrame>
  );
}

function EngineModal({ isOpen, onClose, onSave, engine }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    make: '', 
    model: '', 
    price: '',
    currency: 'GBP',
    condition: 'Used',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (engine) {
      setFormData({
        name: engine.name || '',
        make: engine.make || '',
        model: engine.model || '',
        price: engine.price || '',
        currency: engine.currency || 'GBP',
        condition: engine.condition || 'Used',
        description: engine.description || ''
      });
    } else {
      setFormData({ name: '', make: '', model: '', price: '', currency: 'GBP', condition: 'Used', description: '' });
    }
  }, [engine]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.500" />
      <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <Box bgGradient="linear(to-r, #0F172A, #1E293B)" color="white" py={6} px={8}>
          <HStack spacing={4}>
            <Icon as={Package} boxSize={7} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader p={0} fontSize="22px" fontWeight="800">
                {engine ? 'Edit Engine' : 'Add New Engine'}
              </ModalHeader>
              <Text opacity={0.7} fontSize="13px">
                {engine ? 'Update product specs and pricing' : 'Create a new engine listing'}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <ModalCloseButton color="white" top={5} right={5} />

        <ModalBody p={8}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="12px" fontWeight="700" color="gray.600">PRODUCT NAME</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ford Transit 2.0 EcoBlue Engine"
                h="44px" borderRadius="xl" fontSize="14px"
                _focus={{ borderColor: '#D90404', boxShadow: '0 0 0 3px rgba(217,4,4,0.1)' }}
              />
            </FormControl>

            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color="gray.600">MAKE</FormLabel>
                <Input
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="Ford"
                  h="44px" borderRadius="xl" fontSize="14px"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color="gray.600">MODEL</FormLabel>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Transit"
                  h="44px" borderRadius="xl" fontSize="14px"
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="12px" fontWeight="700" color="gray.600">PRICE</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={formData.currency === 'GBP' ? '£' : '$'} />
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1500"
                    h="44px" borderRadius="xl" fontSize="14px"
                    pl={10}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="12px" fontWeight="700" color="gray.600">CONDITION</FormLabel>
                <Select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  h="44px" borderRadius="xl" fontSize="14px"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Reconditioned">Reconditioned</option>
                  <option value="For Parts">For Parts</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="12px" fontWeight="700" color="gray.600">DESCRIPTION</FormLabel>
              <Input
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed engine specifications..."
                borderRadius="xl" fontSize="14px" p={3} minH="100px"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" px={8} py={5}>
          <HStack spacing={3} w="full" justify="flex-end">
            <Button variant="ghost" onClick={onClose} fontWeight="500">Cancel</Button>
            <Button
              bg="#D90404"
              color="white"
              _hover={{ bg: '#c00404' }}
              onClick={handleSubmit}
              isLoading={isSaving}
              px={8}
              fontWeight="700"
              borderRadius="xl"
            >
              {engine ? 'Update Engine' : 'Add Engine'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}