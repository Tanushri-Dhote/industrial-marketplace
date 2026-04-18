import React, { useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
  useDisclosure, useToast, Badge, Box, VStack, SimpleGrid, Text, Icon,
  Select,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiServer, FiGlobe } from 'react-icons/fi';
import ModuleFrame from './ModuleFrame';

const initialWebsites = [
  { id: 1, domain: 'industrialmarket.com', status: 'Active', visitors: '1.2K' },
  { id: 2, domain: 'globalengines.com', status: 'Active', visitors: '890' },
];

export default function WebsitesModule() {
  const [websites, setWebsites] = useState(initialWebsites);
  const [editingSite, setEditingSite] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSave = (data) => {
    if (editingSite) {
      setWebsites(websites.map(w => w.id === editingSite.id ? { ...data, id: editingSite.id } : w));
    } else {
      setWebsites([...websites, { ...data, id: Date.now() }]);
    }
    toast({ title: editingSite ? 'Website updated' : 'Website added', status: 'success' });
    onClose();
  };

  const handleDelete = (id) => {
    setWebsites(websites.filter(w => w.id !== id));
    toast({ title: 'Website deleted', status: 'info' });
  };

  return (
    <ModuleFrame
      icon={FiServer}
      title="Website Management"
      description="Monitor and manage the various tenant websites connected to the marketplace. Track status and performance metrics for each business."
    >
      <HStack justify="flex-end" mb={8}>
        <Button
          leftIcon={<AddIcon />}
          bg="#D90404"
          color="white"
          _hover={{ bg: "#c00404" }}
          onClick={() => { setEditingSite(null); onOpen(); }}
          fontSize="16px"
          px={6}
          h="45px"
          borderRadius="lg"
        >
          Add Website
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Domain</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Monthly Visitors</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {websites.map((site) => (
              <Tr key={site.id}>
                <Td fontSize="16px" fontWeight="600">{site.domain}</Td>
                <Td>
                  <Badge colorScheme="green" fontSize="12px" borderRadius="full" px={3}>
                    {site.status}
                  </Badge>
                </Td>
                <Td fontSize="16px" fontWeight="600">{site.visitors}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    mr={2}
                    onClick={() => { setEditingSite(site); onOpen(); }}
                    aria-label="Edit Site"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(site.id)}
                    aria-label="Delete Site"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <WebsiteModal isOpen={isOpen} onClose={onClose} onSave={handleSave} website={editingSite} />
    </ModuleFrame>
  );
}

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM WEBSITE MODAL (Matches Edit User Design)
// ─────────────────────────────────────────────────────────────
function WebsiteModal({ isOpen, onClose, onSave, website }) {
  const [formData, setFormData] = useState({ domain: '', status: 'Active', visitors: '' });

  React.useEffect(() => {
    if (website) {
      setFormData(website);
    } else {
      setFormData({ domain: '', status: 'Active', visitors: '' });
    }
  }, [website]);

  const isEditing = !!website;

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
        {/* Premium Gradient Header */}
        <Box
          bgGradient="linear(to-r, #D90404, #f56565)"
          color="white"
          py={8}
          px={8}
        >
          <HStack spacing={4}>
            <Icon as={FiGlobe} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader
                fontSize="27px"
                fontWeight="800"
                p={0}
                letterSpacing="-0.6px"
              >
                {isEditing ? 'Edit Website' : 'Add New Website'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing
                  ? 'Update domain and performance details'
                  : 'Add a new tenant website to the marketplace'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={8} align="stretch">
            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                DOMAIN NAME
              </FormLabel>
              <Input
                size="lg"
                h="56px"
                borderRadius="2xl"
                fontSize="17px"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
                _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
              />
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  STATUS
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  MONTHLY VISITORS
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.visitors}
                  onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                  placeholder="1.2K"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>
            </SimpleGrid>
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
              {isEditing ? 'Update Website' : 'Add Website'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}