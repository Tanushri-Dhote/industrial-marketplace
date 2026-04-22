import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';

export default function ModuleFrame({ icon, title, description, children }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#0F172A", "white");
  const secTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const accentColor = "#D90404";

  return (
    <Box 
      bg={cardBg} 
      borderRadius="2xl" 
      boxShadow="xl" 
      w="full" 
      border="1px solid" 
      borderColor={borderColor}
      overflow="hidden"
    >
      {/* Compact Hero Header Section */}
      <Box p={5} bg={useColorModeValue("gray.50", "gray.700")} borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={4} align="center">
          <Box p={3} bg={useColorModeValue("white", "gray.600")} borderRadius="lg" boxShadow="sm" border="1px solid" borderColor={borderColor}>
            <Icon as={icon} boxSize={6} color={accentColor} display="block" />
          </Box>
          <VStack spacing={0} align="flex-start">
            <Heading fontSize="22px" color={textColor} letterSpacing="-0.5px" fontWeight="800">
              {title}
            </Heading>
            <Text color={secTextColor} fontSize="14px" fontWeight="500">
              {description}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Content Section */}
      <Box p={6}>
        {children}
      </Box>
    </Box>
  );
}
