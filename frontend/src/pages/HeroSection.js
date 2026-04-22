// src/components/HeroSection.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Input,
  InputGroup,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const SupplierStats = () => {
  const stats = [
    { type: 'Supply Only', delivery: 'Free delivery', warranty: '3-18 months', condition: 'Used & Recon', count: 162 },
    { type: 'Supply & Fitted', recovery: 'Incl. recovery', warranty: '12-60 months', condition: 'Used & Recon', count: 72 },
    { type: 'Rebuild or repair', recovery: 'Incl. Recovery', warranty: '12-24 months', condition: 'Repair', count: 49 },
  ];

  return (
    <VStack w="full" spacing={0} bg="white" borderRadius="md" overflow="hidden" border="1px solid" borderColor="gray.100">
      <Box w="full" py={2} bg="gray.50" textAlign="center" borderBottom="1px solid" borderColor="gray.200">
        <Text fontSize="sm" fontWeight="bold" color="gray.700">Suppliers ready to quote you</Text>
      </Box>
      {stats.map((stat, index) => (
        <Box key={index} w="full" px={4} py={2} borderBottom={index !== stats.length - 1 ? "1px solid" : "none"} borderColor="gray.100">
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="xs" fontWeight="bold" color="gray.800">{stat.type}</Text>
              <Text fontSize="10px" color="gray.500">{stat.delivery || stat.recovery}</Text>
            </VStack>
            <VStack align="center" spacing={0} flex={1}>
              <Text fontSize="10px" fontWeight="600" color="gray.600">{stat.warranty}</Text>
              <Text fontSize="10px" color="gray.400">warranty</Text>
            </VStack>
            <VStack align="center" spacing={0} flex={1}>
              <Text fontSize="10px" fontWeight="600" color="gray.600">{stat.condition}</Text>
            </VStack>
            <HStack spacing={1} flex={1} justify="flex-end">
              <Badge colorScheme="green" borderRadius="full" px={2} fontSize="10px">{stat.count}</Badge>
              <Text fontSize="10px" color="gray.500">Suppliers</Text>
            </HStack>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};

export default function HeroSection({ category }) {
  const isCategoryPage = category && category !== 'Industrial Engines';

  const getDropdownValue = (cat) => {
    if (cat === 'Gearboxes') return 'spareparts';
    if (cat.includes('Engines')) return 'engines';
    return '';
  };

  const ManualSelector = () => (
    <VStack spacing={3} w="full">
      <HStack w="full" spacing={3}>
        <select style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', border: '1px solid #ddd' }}><option>Select Make</option></select>
        <select style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', border: '1px solid #ddd' }}><option>Select Model</option></select>
      </HStack>
      <HStack w="full" spacing={3}>
        <select style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', border: '1px solid #ddd' }}><option>Select Year</option></select>
        <select style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', border: '1px solid #ddd' }}><option>Select Type</option></select>
      </HStack>
      <select style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: '14px', border: '1px solid #ddd' }}><option>Select Part</option></select>
    </VStack>
  );

  return (
    <Box position="relative" minH={{ base: "70vh", lg: "650px" }} overflow="hidden" display="flex" alignItems="center">

      {/* Background Image with stronger overlay */}
      <Box
        position="absolute"
        inset={0}
        bgImage="url('/car-engine-banner.jpg')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)"
        />
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={2} py={{ base: 6, md: 10 }}>
        <VStack spacing={8} align="center" textAlign="center">
          
          {/* Dynamic Headline */}
          <Heading
            color="white"
            fontSize={{ base: "26px", md: "38px", lg: "48px" }}
            fontWeight="800"
            lineHeight="1.2"
            textShadow="0 2px 10px rgba(0,0,0,0.4)"
          >
            {isCategoryPage ? `Find ${category} for Sale in the UK` : "Compare local car & van engine reconditioners & breakers"}
          </Heading>

          {/* Dual/Single Inquiry Card Container */}
          <Flex 
            direction={{ base: "column", lg: "row" }} 
            align="stretch" 
            justify="center" 
            gap={isCategoryPage ? 0 : 8}
            w="full"
            maxW={isCategoryPage ? "1100px" : "550px"}
          >
            {/* Left Card: REG Search */}
            <Box
              bg="#001F3F"
              borderRadius={isCategoryPage ? { base: "2xl", lg: "2xl 0 0 2xl" } : "2xl"}
              boxShadow="xl"
              flex="1"
              p={{ base: 4, md: 6 }}
              position="relative"
            >
              <VStack spacing={5} align="stretch">
                <Box>
                  <Flex bg="#FFD700" borderRadius="md" overflow="hidden" h="54px" align="stretch" border="2px solid" borderColor="#FFD700">
                    <VStack bg="#003399" w="45px" justify="center" spacing={0} px={1}>
                      <Text fontSize="10px" lineHeight="1">🇬🇧</Text>
                      <Text color="white" fontSize="12px" fontWeight="bold">UK</Text>
                    </VStack>
                    <Input placeholder="ENTER YOUR REG" variant="unstyled" bg="transparent" color="#333" _placeholder={{ color: 'rgba(0,0,0,0.3)' }} h="full" fontSize="22px" fontWeight="800" textAlign="center" letterSpacing="1px" textTransform="uppercase" />
                  </Flex>
                </Box>

                <select value={getDropdownValue(category)} onChange={() => {}} style={{ padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }}>
                  <option value="engines">Engine</option>
                  <option value="gearboxes">Gearbox</option>
                </select>

                <Button w="full" size="lg" bg="#D90404" color="white" h="56px" fontSize="18px" fontWeight="bold" rightIcon={<FaArrowRight />} _hover={{ bg: "#B70303" }}>
                  Get Free Quotes
                </Button>

                <VStack align="start" spacing={2} color="white" fontSize="14px">
                  <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Trusted by 1,000s Across the UK</Text></HStack>
                  <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Up to 50% Savings on Used & Recon Engines</Text></HStack>
                  <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">No Upfront Payment - You're In Control</Text></HStack>
                </VStack>
              </VStack>

              {isCategoryPage && (
                <Box 
                  display={{ base: "none", lg: "flex" }} 
                  position="absolute" 
                  right="-15px" 
                  top="50%" 
                  transform="translateY(-50%)" 
                  zIndex={3}
                  bg="transparent"
                  color="white"
                  fontWeight="900"
                  fontSize="20px"
                >
                  OR
                </Box>
              )}
            </Box>

            {/* Right Card: Manual Search (Only for Category Pages) */}
            {isCategoryPage && (
              <Box
                bg="#002D5C" // Slightly different navy for contrast
                borderRadius={{ base: "2xl", lg: "0 2xl 2xl 0" }}
                boxShadow="xl"
                flex="1"
                p={{ base: 4, md: 6 }}
                mt={{ base: 4, lg: 0 }}
              >
                <VStack spacing={5} align="stretch">
                  <ManualSelector />

                  <Button w="full" size="lg" bg="#D90404" color="white" h="56px" fontSize="18px" fontWeight="bold" rightIcon={<FaArrowRight />} _hover={{ bg: "#B70303" }}>
                    Get Free Quotes
                  </Button>

                  <VStack align="start" spacing={2} color="white" fontSize="14px">
                    <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Supply and Fitting Offered</Text></HStack>
                    <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Unlimited Mileage Warranty*</Text></HStack>
                    <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">It Only Takes a Minute</Text></HStack>
                  </VStack>
                </VStack>
              </Box>
            )}
          </Flex>

          {!isCategoryPage && <SupplierStats />}

        </VStack>
      </Container>
    </Box>
  );
}