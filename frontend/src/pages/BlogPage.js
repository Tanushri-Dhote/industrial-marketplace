import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Badge,
  Link as ChakraLink,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt, FaUser, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { blogPosts } from '../utils/blogData';

const MotionBox = motion(Box);

export default function BlogPage() {
  const accentColor = "#D90404";
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Header / Hero Area */}
      <Box bg="#0F172A" py={16} position="relative" overflow="hidden">
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-r, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7))"
          zIndex={1}
        />
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <VStack align="flex-start" spacing={4}>
            <Breadcrumb
              spacing="8px"
              separator={<Icon as={FaChevronRight} color="gray.500" fontSize="10px" />}
              color="gray.400"
              fontSize="sm"
            >
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Blog</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            
            <Heading color="white" fontSize={{ base: "32px", md: "48px" }} fontWeight="800">
              Industrial Insights & <Text as="span" color={accentColor}>Experts Hub</Text>
            </Heading>
            <Text color="gray.300" fontSize="lg" maxW="600px">
              Stay ahead with the latest industry trends, maintenance guides, and expert buying advice for industrial machinery.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Blog Grid */}
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {currentPosts.map((post) => (
            <MotionBox
              key={post.id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              bg="white"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="rgba(149, 157, 165, 0.08) 0px 8px 32px"
              border="1px solid"
              borderColor="gray.100"
              display="flex"
              flexDirection="column"
            >
              {/* Image Area */}
              <Box position="relative" h="240px" overflow="hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  objectFit="cover"
                  w="full"
                  h="full"
                  transition="transform 0.6s ease"
                  _hover={{ transform: "scale(1.1)" }}
                />
                <Badge
                  position="absolute"
                  top={5}
                  left={5}
                  bg={accentColor}
                  color="white"
                  px={4}
                  py={1.5}
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                  boxShadow="lg"
                >
                  {post.category}
                </Badge>
              </Box>

              {/* Content Area */}
              <VStack p={8} align="start" spacing={5} flex="1">
                <HStack spacing={5} fontSize="13px" color="gray.500" fontWeight="500">
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} color={accentColor} />
                    <Text>{post.date}</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FaUser} color={accentColor} />
                    <Text>{post.author}</Text>
                  </HStack>
                </HStack>

                <Heading
                  as="h3"
                  fontSize="22px"
                  fontWeight="800"
                  lineHeight="1.3"
                  color="gray.800"
                  _hover={{ color: accentColor }}
                  transition="color 0.2s"
                >
                  <ChakraLink as={Link} to={`/blog/${post.id}`} _hover={{ textDecoration: 'none' }}>
                    {post.title}
                  </ChakraLink>
                </Heading>

                <Text fontSize="15px" color="gray.600" lineHeight="1.6" noOfLines={3}>
                  {post.excerpt}
                </Text>

                <ChakraLink
                  as={Link}
                  to={`/blog/${post.id}`}
                  fontSize="15px"
                  fontWeight="800"
                  color={accentColor}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mt="auto"
                  pt={2}
                  _hover={{ gap: 3, textDecoration: "none", opacity: 0.8 }}
                  transition="all 0.3s"
                >
                  READ MORE <Icon as={FaArrowRight} fontSize="12px" />
                </ChakraLink>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Pagination Controls */}
        <HStack justify="center" mt={16} spacing={4}>
          <Button
            onClick={() => paginate(currentPage - 1)}
            isDisabled={currentPage === 1}
            variant="outline"
            border="2px solid"
            borderColor="gray.200"
            _hover={{ borderColor: accentColor, color: accentColor }}
          >
            Previous
          </Button>
          
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              bg={currentPage === i + 1 ? accentColor : "white"}
              color={currentPage === i + 1 ? "white" : "gray.600"}
              border="2px solid"
              borderColor={currentPage === i + 1 ? accentColor : "gray.100"}
              _hover={{ bg: currentPage === i + 1 ? accentColor : "gray.100" }}
              px={5}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            onClick={() => paginate(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            variant="outline"
            border="2px solid"
            borderColor="gray.200"
            _hover={{ borderColor: accentColor, color: accentColor }}
          >
            Next
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}
