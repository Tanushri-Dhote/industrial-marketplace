import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { blogPosts } from '../utils/blogData';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accentColor = "#D90404";

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <Container maxW="container.xl" py={20} textAlign="center">
        <Heading mb={4}>Article Not Found</Heading>
        <Button as={Link} to="/blog" colorScheme="brand">Back to Blog</Button>
      </Container>
    );
  }

  return (
    <Box bg="white" minH="100vh">
      {/* Top Breadcrumb & Navigation */}
      <Box borderBottom="1px solid" borderColor="gray.100" py={4}>
        <Container maxW="container.md">
          <HStack justify="space-between">
            <Breadcrumb
              spacing="8px"
              separator={<Icon as={FaChevronRight} color="gray.400" fontSize="10px" />}
              fontSize="sm"
            >
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="gray.500">{post.category}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<FaArrowLeft />}
              onClick={() => navigate('/blog')}
              _hover={{ bg: 'gray.50', color: accentColor }}
            >
              Back to List
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Article Content */}
      <Container maxW="container.md" py={12}>
        <VStack align="start" spacing={8}>
          {/* Header Info */}
          <VStack align="start" spacing={4} w="full">
            <Badge
              bg={accentColor}
              color="white"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
              textTransform="uppercase"
            >
              {post.category}
            </Badge>
            <Heading fontSize={{ base: "30px", md: "42px" }} fontWeight="800" color="gray.800" lineHeight="1.2">
              {post.title}
            </Heading>
            <HStack spacing={6} fontSize="14px" color="gray.500">
              <HStack spacing={2}>
                <Icon as={FaCalendarAlt} color={accentColor} />
                <Text>{post.date}</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaUser} color={accentColor} />
                <Text>By {post.author}</Text>
              </HStack>
            </HStack>
          </VStack>

          {/* Hero Image */}
          <Box w="full" borderRadius="2xl" overflow="hidden" boxShadow="xl">
            <Image
              src={post.image}
              alt={post.title}
              w="full"
              maxH="450px"
              objectFit="cover"
            />
          </Box>

          {/* Body Text */}
          <Box
            fontSize="18px"
            lineHeight="1.8"
            color="gray.700"
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            w="full"
          />

          <Divider pt={10} />

          {/* Share / Footer Area */}
          <VStack w="full" align="center" py={10} spacing={6} bg="gray.50" borderRadius="xl">
            <Text fontWeight="700" fontSize="lg">Was this article helpful?</Text>
            <HStack spacing={4}>
              <Button colorScheme="green" variant="outline" size="lg" px={10}>Yes</Button>
              <Button colorScheme="red" variant="outline" size="lg" px={10}>No</Button>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
