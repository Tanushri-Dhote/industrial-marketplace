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
  Spinner,
  Center,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt, FaUser, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import API from '../services/api';

const MotionBox = motion(Box);

const fetchBlogs = async (page, category) => {
  const params = { page, limit: 6 };
  if (category) params.category = category;
  const { data } = await API.get('/blogs', { params });
  return data;
};

export default function BlogPage() {
  const accentColor = "#D90404";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, isLoading, isError } = useQuery(
    ['blogs', currentPage, selectedCategory],
    () => fetchBlogs(currentPage, selectedCategory),
    { keepPreviousData: true }
  );

  const categories = ["Maintenance", "Repair Guides", "Technical", "Industry News"];

  if (isLoading) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="4px" />
          <Text fontWeight="bold" color="gray.500">Loading Latest Insights...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="white" minH="100vh">
      {/* Premium Hero Section */}
      <Box 
        bg="#0F172A" 
        pt={20} 
        pb={32} 
        position="relative" 
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(circle at 20% 50%, rgba(217, 4, 4, 0.15), transparent)"
          zIndex={1}
        />
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <VStack align="center" spacing={6} textAlign="center">
            <Breadcrumb
              spacing="8px"
              separator={<Icon as={FaChevronRight} color="gray.600" fontSize="10px" />}
              color="gray.400"
              fontSize="sm"
            >
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color={accentColor} fontWeight="bold">Blog</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            
            <Heading color="white" fontSize={{ base: "4xl", md: "6xl" }} fontWeight="900" letterSpacing="tight">
              Industrial <Text as="span" color={accentColor}>Intelligence</Text>
            </Heading>
            <Text color="gray.400" fontSize="xl" maxW="700px" lineHeight="tall">
              Your definitive resource for engine maintenance, gearbox troubleshooting, and high-performance industrial equipment guides.
            </Text>

            {/* Category Filter Pills */}
            <HStack spacing={4} pt={6} overflowX="auto" w="full" justify="center">
              <Button
                size="sm"
                borderRadius="full"
                variant={!selectedCategory ? "solid" : "outline"}
                colorScheme={!selectedCategory ? "red" : "whiteAlpha"}
                onClick={() => setSelectedCategory(null)}
              >
                All Articles
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  size="sm"
                  borderRadius="full"
                  variant={selectedCategory === cat ? "solid" : "outline"}
                  colorScheme={selectedCategory === cat ? "red" : "whiteAlpha"}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Magazine Grid */}
      <Container maxW="container.xl" mt="-60px" position="relative" zIndex={3} pb={20}>
        <AnimatePresence mode="wait">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {data?.blogs?.map((post, idx) => (
              <MotionBox
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12 }}
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="0 20px 40px -15px rgba(0,0,0,0.1)"
                border="1px solid"
                borderColor="gray.100"
                display="flex"
                flexDirection="column"
              >
                {/* Visual Area */}
                <Box position="relative" h="260px" overflow="hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    objectFit="cover"
                    w="full"
                    h="full"
                    transition="transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: "scale(1.1)" }}
                  />
                  <Badge
                    position="absolute"
                    bottom={4}
                    left={4}
                    bg="white"
                    color="gray.900"
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="800"
                    boxShadow="xl"
                  >
                    {post.category}
                  </Badge>
                </Box>

                {/* Narrative Area */}
                <VStack p={8} align="start" spacing={5} flex="1">
                  <HStack spacing={4} fontSize="xs" color="gray.400" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    <HStack spacing={1}>
                      <Icon as={FaCalendarAlt} color={accentColor} />
                      <Text>{post.date}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FaUser} color={accentColor} />
                      <Text>{post.author}</Text>
                    </HStack>
                  </HStack>

                  <Heading
                    as="h3"
                    fontSize="24px"
                    fontWeight="900"
                    lineHeight="1.2"
                    color="gray.800"
                    _hover={{ color: accentColor }}
                    transition="color 0.2s"
                  >
                    <ChakraLink as={Link} to={`/blog/${post.slug}`} _hover={{ textDecoration: 'none' }}>
                      {post.title}
                    </ChakraLink>
                  </Heading>

                  <Text fontSize="md" color="gray.500" lineHeight="1.6" noOfLines={3}>
                    {post.excerpt}
                  </Text>

                  <ChakraLink
                    as={Link}
                    to={`/blog/${post.slug}`}
                    fontSize="sm"
                    fontWeight="900"
                    color={accentColor}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mt="auto"
                    pt={4}
                    _hover={{ gap: 4, textDecoration: "none" }}
                    transition="all 0.3s"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    View Article <Icon as={FaArrowRight} fontSize="10px" />
                  </ChakraLink>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </AnimatePresence>

        {/* Premium Pagination */}
        {data?.totalPages > 1 && (
          <HStack justify="center" mt={20} spacing={4}>
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
              variant="ghost"
              leftIcon={<FaChevronRight style={{ transform: 'rotate(180deg)' }} />}
              fontWeight="900"
            >
              Previous
            </Button>
            
            {[...Array(data.totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "solid" : "ghost"}
                colorScheme={currentPage === i + 1 ? "red" : "gray"}
                borderRadius="full"
                boxSize="45px"
                fontWeight="900"
              >
                {i + 1}
              </Button>
            ))}

            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.totalPages))}
              isDisabled={currentPage === data.totalPages}
              variant="ghost"
              rightIcon={<FaChevronRight />}
              fontWeight="900"
            >
              Next
            </Button>
          </HStack>
        )}
      </Container>
    </Box>
  );
}
