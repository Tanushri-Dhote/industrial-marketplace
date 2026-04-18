// src/components/HeroSection.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaArrowRight, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function HeroSection({ category }) {
  // Map display category to dropdown values if needed
  const getDropdownValue = (cat) => {
    if (cat === 'Gearboxes') return 'spareparts';
    if (cat.includes('Engines')) return 'engines';
    return '';
  };

  return (
    <Box position="relative" minH={{ base: "85vh", lg: "720px" }} overflow="hidden">

      {/* Background Image */}
      <Box
        position="absolute"
        inset={0}
        bgImage="url('https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      />

      {/* Dark Overlay */}
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 100%)"
      />

      <Container maxW="container.xl" position="relative" zIndex={2} h="full" py={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} alignItems="center" h="full">

          {/* Left Content */}
          <VStack align="flex-start" spacing={6} color="white" maxW="lg">
            <Text
              fontSize="14px"
              bg="#D90404"
              color="white"
              px={5}
              py={1.5}
              borderRadius="full"
              fontWeight="600"
            >
              TRUSTED  All Engine 4 YouPLACE
            </Text>

            <Heading
              fontSize={{ base: "36px", md: "48px", lg: "52px" }}
              fontWeight="700"
              lineHeight="1.15"
            >
              Quality {category},<br />
              Generators & Machinery
            </Heading>

            <Text fontSize="18px" color="whiteAlpha.900">
              New • Used • Reconditioned equipment from verified suppliers across India.
            </Text>

            <HStack spacing={8}>
              <HStack spacing={2}>
                <Icon as={FaCheckCircle} color="#D90404" boxSize={5} />
                <Text>500+ Listings</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaCheckCircle} color="#D90404" boxSize={5} />
                <Text>120+ Suppliers</Text>
              </HStack>
            </HStack>
          </VStack>

          {/* Right Side - Inquiry Card */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="2xl"
            p={{ base: 6, md: 8 }}
            maxW={{ base: "100%", lg: "460px" }}
            ml={{ lg: "auto" }}
          >
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading size="lg" mb={1} color="gray.800">Get Best Prices Today</Heading>
                <Text color="gray.600">Multiple suppliers will quote you directly</Text>
              </Box>

              {/* Search Form */}
              <VStack spacing={4}>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" h="full" pl={4}>
                    <FaSearch color="#D90404" />
                  </InputLeftElement>
                  <Input
                    placeholder="Engine model, kVA, part number or keyword"
                    fontSize="16px"
                    borderColor="gray.300"
                    _focus={{ borderColor: "#D90404", boxShadow: "0 0 0 3px rgba(255,107,0,0.15)" }}
                  />
                </InputGroup>

                <Box w="full">
                  <select
                    value={getDropdownValue(category)}
                    onChange={() => {}}
                    style={{
                      width: '100%',
                      padding: '16px 16px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E0',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="generators">Diesel Generators</option>
                    <option value="engines">Industrial Engines</option>
                    <option value="compressors">Air Compressors</option>
                    <option value="machinery">Heavy Machinery</option>
                    <option value="spareparts">Spare Parts</option>
                  </select>
                </Box>

                <Button
                  w="full"
                  size="lg"
                  bg="#D90404"
                  color="white"
                  py={7}
                  fontSize="16px"
                  fontWeight="600"
                  rightIcon={<FaArrowRight />}
                  _hover={{ bg: "#e55a00" }}
                >
                  Get Free Quotes Now
                </Button>
              </VStack>

              {/* Don't have reg? Click here */}
              <Text textAlign="center" fontSize="14px" color="gray.500">
                Don't have a specific model number?{' '}
                <Text
                  as="span"
                  color="#D90404"
                  fontWeight="600"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => window.location.href = '/products'}
                >
                  Click here
                </Text>{' '}
                to browse all listings
              </Text>

              {/* Trust Points */}
              <VStack align="flex-start" spacing={3} fontSize="14px">
                <HStack><Icon as={FaCheckCircle} color="green.500" /><Text>Trusted by 1000+ Industries</Text></HStack>
                <HStack><Icon as={FaCheckCircle} color="green.500" /><Text>Up to 40% savings on reconditioned units</Text></HStack>
                <HStack><Icon as={FaCheckCircle} color="green.500" /><Text>Warranty on most equipment</Text></HStack>
              </VStack>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}