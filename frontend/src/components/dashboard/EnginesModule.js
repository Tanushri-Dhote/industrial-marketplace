import React, { useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
  useDisclosure, useToast, Badge, Box, VStack, SimpleGrid, Text, Icon, Select
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiPackage, FiEngine } from 'react-icons/fi';
import ModuleFrame from './ModuleFrame';

const initialEngines = [
  { id: 1, name: 'Caterpillar C32', type: 'Diesel', power: '1000HP', status: 'In Stock' },
  { id: 2, name: 'Cummins QSK60', type: 'Diesel', power: '2000HP', status: 'In Stock' },
];

export default function EnginesModule() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Super Admin';
  const isViewer = role === 'Viewer';

  const [engines, setEngines] = useState(initialEngines);
  const [editingEngine, setEditingEngine] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSave = (data) => {
    if (editingEngine) {
      setEngines(engines.map(e => e.id === editingEngine.id ? { ...data, id: editingEngine.id } : e));
    } else {
      setEngines([...engines, { ...data, id: Date.now() }]);
    }
    toast({ title: editingEngine ? 'Engine updated' : 'Engine added', status: 'success' });
    onClose();
  };

  const handleDelete = (id) => {
    setEngines(engines.filter(e => e.id !== id));
    toast({ title: 'Engine deleted', status: 'info' });
  };

  return (
    <ModuleFrame
      icon={FiPackage}
      title="Engine Inventory"
      description="Manage your industrial engine catalog. Add new products, update specifications, and track stock levels across your inventory."
    >
      {!isViewer && (
        <HStack justify="flex-end" mb={8}>
          <Button 
            leftIcon={<AddIcon />} 
            bg="#D90404" 
            color="white"
            _hover={{ bg: "#c00404" }}
            onClick={() => { setEditingEngine(null); onOpen(); }}
            fontSize="16px"
            px={6}
            h="45px"
            borderRadius="lg"
          >
            Add Engine
          </Button>
        </HStack>
      )}

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Name</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Type</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Power</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {engines.map((engine) => (
              <Tr key={engine.id}>
                <Td fontSize="16px" fontWeight="600">{engine.name}</Td>
                <Td fontSize="16px">{engine.type}</Td>
                <Td fontSize="16px" fontWeight="600">{engine.power}</Td>
                <Td>
                  <Badge colorScheme="green" fontSize="12px" borderRadius="full" px={3}>
                    {engine.status}
                  </Badge>
                </Td>
                <Td>
                  {!isViewer ? (
                    <>
                      <IconButton 
                        icon={<EditIcon />} 
                        size="sm" 
                        variant="ghost" 
                        mr={2} 
                        onClick={() => { setEditingEngine(engine); onOpen(); }}
                        aria-label="Edit Engine"
                      />
                      <IconButton 
                        icon={<DeleteIcon />} 
                        size="sm" 
                        variant="ghost" 
                        colorScheme="red" 
                        onClick={() => handleDelete(engine.id)}
                        aria-label="Delete Engine"
                      />
                    </>
                  ) : (
                    <Badge colorScheme="gray" fontSize="11px">Read Only</Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <EngineModal isOpen={isOpen} onClose={onClose} onSave={handleSave} engine={editingEngine} />
    </ModuleFrame>
  );
}

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM ENGINE MODAL (Consistent with User & Website)
// ─────────────────────────────────────────────────────────────
function EngineModal({ isOpen, onClose, onSave, engine }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    type: '', 
    power: '', 
    status: 'In Stock' 
  });

  React.useEffect(() => {
    if (engine) {
      setFormData(engine);
    } else {
      setFormData({ name: '', type: '', power: '', status: 'In Stock' });
    }
  }, [engine]);

  const isEditing = !!engine;

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
            <Icon as={FiPackage} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader 
                fontSize="27px" 
                fontWeight="800" 
                p={0}
                letterSpacing="-0.6px"
              >
                {isEditing ? 'Edit Engine' : 'Add New Engine'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing 
                  ? 'Update engine specifications and stock status' 
                  : 'Add a new industrial engine to the catalog'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={8} align="stretch">
            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                ENGINE NAME
              </FormLabel>
              <Input
                size="lg"
                h="56px"
                borderRadius="2xl"
                fontSize="17px"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Caterpillar C32"
                _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
              />
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  ENGINE TYPE
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Diesel / Gas / Electric"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  POWER RATING
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                  placeholder="1000HP"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                STOCK STATUS
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
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-Order">Pre-Order</option>
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
              {isEditing ? 'Update Engine' : 'Add Engine'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}