import React, { useState } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Select,
  useDisclosure, useToast, Badge, Box, VStack, SimpleGrid, Text, Icon
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiBookOpen, FiEdit3 } from 'react-icons/fi';
import ModuleFrame from './ModuleFrame';

const initialBlogs = [
  { id: 1, title: 'Top 10 Industrial Generators 2024', author: 'Admin', status: 'Published', date: '2024-01-15' },
  { id: 2, title: 'Maintenance Tips for Heavy Machinery', author: 'Admin', status: 'Draft', date: '2024-01-10' },
];

export default function BlogsModule() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Super Admin';
  const isViewer = role === 'Viewer';

  const [blogs, setBlogs] = useState(initialBlogs);
  const [editingBlog, setEditingBlog] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSave = (data) => {
    if (editingBlog) {
      setBlogs(blogs.map(b => b.id === editingBlog.id ? { ...data, id: editingBlog.id } : b));
    } else {
      setBlogs([...blogs, { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
    }
    toast({ title: editingBlog ? 'Blog updated' : 'Blog added', status: 'success' });
    onClose();
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter(b => b.id !== id));
    toast({ title: 'Blog deleted', status: 'info' });
  };

  return (
    <ModuleFrame
      icon={FiBookOpen}
      title="Blog & Content Management"
      description="Create and manage industrial-themed blog posts to drive traffic and engagement. Edit drafts or publish new articles directly to your marketplace."
    >
      {!isViewer && (
        <HStack justify="flex-end" mb={8}>
          <Button 
            leftIcon={<AddIcon />} 
            bg="#D90404" 
            color="white"
            _hover={{ bg: "#c00404" }}
            onClick={() => { setEditingBlog(null); onOpen(); }}
            fontSize="16px"
            px={6}
            h="45px"
            borderRadius="lg"
          >
            Add Blog Post
          </Button>
        </HStack>
      )}

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Title</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Author</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Status</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Date</Th>
              <Th fontSize="12px" fontWeight="800" textTransform="uppercase" letterSpacing="1px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {blogs.map((blog) => (
              <Tr key={blog.id}>
                <Td fontSize="12px" fontWeight="600">{blog.title}</Td>
                <Td fontSize="12px">{blog.author}</Td>
                <Td>
                  <Badge 
                    colorScheme={blog.status === 'Published' ? 'green' : 'yellow'} 
                    fontSize="12px" 
                    borderRadius="full" 
                    px={3}
                  >
                    {blog.status}
                  </Badge>
                </Td>
                <Td fontSize="12px">{blog.date}</Td>
                <Td>
                  {!isViewer ? (
                    <>
                      <IconButton 
                        icon={<EditIcon />} 
                        size="sm" 
                        variant="ghost" 
                        mr={2} 
                        onClick={() => { setEditingBlog(blog); onOpen(); }}
                        aria-label="Edit Blog"
                      />
                      <IconButton 
                        icon={<DeleteIcon />} 
                        size="sm" 
                        variant="ghost" 
                        colorScheme="red" 
                        onClick={() => handleDelete(blog.id)}
                        aria-label="Delete Blog"
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

      <BlogModal isOpen={isOpen} onClose={onClose} onSave={handleSave} blog={editingBlog} />
    </ModuleFrame>
  );
}

// ─────────────────────────────────────────────────────────────
// MODERN PREMIUM BLOG MODAL (Consistent Design)
// ─────────────────────────────────────────────────────────────
function BlogModal({ isOpen, onClose, onSave, blog }) {
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    content: '', 
    status: 'Draft' 
  });

  React.useEffect(() => {
    if (blog) {
      setFormData(blog);
    } else {
      setFormData({ title: '', author: '', content: '', status: 'Draft' });
    }
  }, [blog]);

  const isEditing = !!blog;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered 
      size="xl"   // Larger size for content-heavy modal
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
            <Icon as={FiEdit3} boxSize={9} opacity={0.9} />
            <VStack align="flex-start" spacing={0}>
              <ModalHeader 
                fontSize="27px" 
                fontWeight="800" 
                p={0}
                letterSpacing="-0.6px"
              >
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </ModalHeader>
              <Text opacity={0.9} fontSize="15px">
                {isEditing 
                  ? 'Update your article content and publishing settings' 
                  : 'Write and publish a new industrial blog post'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <ModalCloseButton color="white" top={6} right={6} />

        <ModalBody p={10}>
          <VStack spacing={8} align="stretch">
            {/* Title */}
            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                BLOG TITLE
              </FormLabel>
              <Input
                size="lg"
                h="56px"
                borderRadius="2xl"
                fontSize="17px"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Top 10 Industrial Generators 2025"
                _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
              />
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {/* Author */}
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                  AUTHOR
                </FormLabel>
                <Input
                  size="lg"
                  h="56px"
                  borderRadius="2xl"
                  fontSize="17px"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="John Doe"
                  _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
                />
              </FormControl>

              {/* Status */}
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
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            {/* Content */}
            <FormControl isRequired>
              <FormLabel fontWeight="700" fontSize="14px" color="gray.600" mb={2}>
                CONTENT
              </FormLabel>
              <Textarea
                rows={10}
                size="lg"
                fontSize="16px"
                borderRadius="2xl"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(217, 4, 4, 0.12)" }}
              />
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
              {isEditing ? 'Update Blog' : 'Publish Blog'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}