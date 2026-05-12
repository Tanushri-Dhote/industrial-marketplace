import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  HStack,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

export default function MembershipExpiredCard() {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box 
      bg={cardBg} 
      borderRadius="2xl" 
      boxShadow="0 10px 40px rgba(0,0,0,0.12)" 
      p={10} 
      maxW="600px" 
      mx="auto" 
      mt={8}
      textAlign="center"
      position="relative"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={6}>
        <Heading fontSize="28px" fontWeight="800" color={textColor}>
          Membership Renewal
        </Heading>

        <Box>
          <Text fontSize="36px" fontWeight="900" color="red.600" letterSpacing="-1px" lineHeight="1">
            EXPIRED
          </Text>
        </Box>

        <VStack spacing={3}>
          <Text fontSize="16px" color={subTextColor} fontWeight="500">
            Your Re-Conditioned Engine membership was expired on
          </Text>
          <Box bg="black" color="white" px={4} py={1} borderRadius="sm" fontWeight="800" fontSize="18px">
            16 Apr 2026.
          </Box>
          <Text fontSize="16px" color={subTextColor} maxW="450px" lineHeight="1.6">
            Renew your membership to continue receiving live engine quotes and customers for another <span style={{ fontWeight: '800', color: useColorModeValue('#1A202C', 'white') }}>30 days</span>. Click <span style={{ fontWeight: '800', color: useColorModeValue('#1A202C', 'white') }}>Renew Now</span> to extend your access instantly.
          </Text>
        </VStack>

        <VStack spacing={0}>
          <Text fontSize="15px" color={useColorModeValue("gray.500", "gray.400")} fontWeight="600">
            Renewal Amount:
          </Text>
          <Text fontSize="20px" fontWeight="900" color={textColor}>
            £750.00
          </Text>
        </VStack>

        <Button
          bg="#F6AD55"
          _hover={{ bg: "#ED8936" }}
          color="white"
          size="lg"
          h="50px"
          w="full"
          maxW="300px"
          fontSize="16px"
          fontWeight="800"
          borderRadius="lg"
          boxShadow="0 4px 14px rgba(246, 173, 85, 0.4)"
        >
          Renew Now
        </Button>

        <Text color={subTextColor} fontSize="14px" fontWeight="600">
          All payments are securely processed by <span style={{ fontWeight: '800' }}>Stripe.</span>
        </Text>

        <HStack spacing={4} pt={2}>
          <Box h="40px" display="flex" alignItems="center">
             <Text fontWeight="800" fontSize="14px" color="gray.400" mr={2}>Powered by stripe</Text>
             <Divider orientation="vertical" h="20px" />
             <HStack spacing={2} ml={2}>
                <Box bg="cyan.400" color="white" px={2} py={0.5} borderRadius="md" fontSize="12px" fontWeight="800">link</Box>
                <Text fontSize="12px" fontWeight="800" color="gray.500">Pay faster</Text>
             </HStack>
          </Box>
        </HStack>
        
        <HStack spacing={2} opacity={0.6}>
           <Text fontSize="12px" fontWeight="800" color="blue.700">VISA</Text>
           <Text fontSize="12px" fontWeight="800" color="red.700">MasterCard</Text>
           <Text fontSize="12px" fontWeight="800" color="blue.400">Pay</Text>
           <Text fontSize="12px" fontWeight="800" color="gray.800">G Pay</Text>
        </HStack>
      </VStack>
    </Box>
  );
}
