import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  Button,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export default function VehicleSelectorSection({ category }) {
  const accentColor = "#D90404";

  return (
    <Box bg="#F8FAFC" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="center">

          {/* Title */}
          <VStack spacing={2} textAlign="center">
            <Heading fontSize="28px" fontWeight="700" color="gray.800">
              Select Your Vehicle Manually
            </Heading>
            <Text fontSize="16px" color="gray.600">
              Find the right {category.toLowerCase()} for your vehicle in seconds
            </Text>
          </VStack>

          {/* Main Form Card */}
          <Box
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="lg"
            w="full"
            maxW="780px"
          >
            <VStack spacing={6}>
              {/* Row 1: 3 Fields */}
              <HStack spacing={4} w="full" flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <Select 
                  placeholder="Select Make"
                  size="lg"
                  fontSize="15px"
                  h="52px"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor, boxShadow: "0 0 0 3px rgba(255,107,0,0.15)" }}
                />
                <Select 
                  placeholder="Select Model"
                  size="lg"
                  fontSize="15px"
                  h="52px"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor, boxShadow: "0 0 0 3px rgba(255,107,0,0.15)" }}
                />
                <Select 
                  placeholder="Select Year"
                  size="lg"
                  fontSize="15px"
                  h="52px"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor, boxShadow: "0 0 0 3px rgba(255,107,0,0.15)" }}
                />
              </HStack>

              {/* Row 2: 2 Fields + Button */}
              <HStack spacing={4} w="full" flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <Select 
                  placeholder="Select Type"
                  size="lg"
                  fontSize="15px"
                  h="52px"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor, boxShadow: "0 0 0 3px rgba(255,107,0,0.15)" }}
                  flex={1}
                />
                <Select 
                  placeholder="Select Part"
                  size="lg"
                  fontSize="15px"
                  h="52px"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: accentColor }}
                  _focus={{ borderColor: accentColor, boxShadow: "0 0 0 3px rgba(255,107,0,0.15)" }}
                  flex={1}
                />

                <Button
                  bg={accentColor}
                  color="white"
                  fontSize="16px"
                  fontWeight="600"
                  h="52px"
                  px={10}
                  borderRadius="full"
                  _hover={{ 
                    bg: "#e55a00",
                    transform: "translateY(-2px)"
                  }}
                  rightIcon={
                    <Box as="span" fontSize="22px" lineHeight="1">→</Box>
                  }
                  minW="180px"
                >
                  Get Free Quotes
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Features in One Single Row */}
          <List 
            display="flex" 
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="center" 
            alignItems="center"
            gap={{ base: 6, md: 10 }}
            fontSize="16px"
            maxW="720px"
            w="full"
          >
            <ListItem display="flex" alignItems="center" gap={2} whiteSpace="nowrap">
              <ListIcon as={CheckCircleIcon} color={accentColor} boxSize={5} />
              Supply and Fitting Offered
            </ListItem>

            <ListItem display="flex" alignItems="center" gap={2} whiteSpace="nowrap">
              <ListIcon as={CheckCircleIcon} color={accentColor} boxSize={5} />
              6 Months Warranty*
            </ListItem>

            <ListItem display="flex" alignItems="center" gap={2} whiteSpace="nowrap">
              <ListIcon as={CheckCircleIcon} color={accentColor} boxSize={5} />
              It Only Takes a Minute
            </ListItem>
          </List>

        </VStack>
      </Container>
    </Box>
  );
}