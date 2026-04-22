import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  Circle,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaHandshake, 
  FaTruck 
} from 'react-icons/fa';

const steps = [
  {
    number: "01",
    icon: FaSearch,
    title: "Enter Your Engine Details",
    description: "Simply enter your engine registration or model number to instantly find compatible engines from verified sellers.",
  },
  {
    number: "02",
    icon: FaHandshake,
    title: "Receive Competitive Quotes",
    description: "Submit your requirement once and get multiple price quotes from trusted suppliers across India.",
  },
  {
    number: "03",
    icon: FaTruck,
    title: "Choose the Best Deal & Get Delivered",
    description: "Compare offers, select the best one, and enjoy fast delivery or local fitting with warranty support.",
  },
];

export default function EasyStepsSection() {
  const accentColor = "#D90404";
  const cardBg = useColorModeValue("white", "gray.800");
  const lineColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box bg="white" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={4} textAlign="center" maxW="800px" mx="auto">
            <Text 
              fontSize="14px" 
              fontWeight="700" 
              color={accentColor} 
              letterSpacing="2px"
              textTransform="uppercase"
            >
              SUPER SIMPLE PROCESS
            </Text>
            
            <Heading 
              fontSize="28px" 
              fontWeight="700"
              lineHeight="1.2"
              color="gray.800"
            >
              Get Your Perfect Engine in Just{" "}
              <Text as="span" color={accentColor}>3 Easy Steps</Text>
            </Heading>

            <Text fontSize="16px" color="gray.600" maxW="620px">
              From searching to delivery — we’ve made buying the right engine faster, transparent, and hassle-free.
            </Text>
          </VStack>

          {/* Steps Grid */}
          <Box w="full" maxW="1100px" mx="auto" position="relative">
            <SimpleGrid 
              columns={{ base: 1, md: 3 }} 
              spacing={{ base: 12, md: 10 }}
              position="relative"
            >
              {steps.map((step, index) => (
                <VStack 
                  key={index} 
                  spacing={6} 
                  align="center" 
                  textAlign="center"
                  position="relative"
                  zIndex={2}
                  _hover={{ transform: "translateY(-6px)", transition: "all 0.3s ease" }}
                >
                  {/* Step Circle */}
                  <Box position="relative">
                    <Circle 
                      size="88px" 
                      bg={accentColor} 
                      color="white" 
                      fontSize="28px" 
                      fontWeight="700"
                      boxShadow="0 10px 25px -5px rgba(255, 107, 0, 0.4)"
                    >
                      {step.number}
                    </Circle>

                    {/* Icon Circle */}
                    <Circle 
                      size="48px" 
                      bg="white" 
                      position="absolute" 
                      bottom="-8px" 
                      right="-8px" 
                      boxShadow="md"
                      border="4px solid white"
                    >
                      <Icon as={step.icon} boxSize={6} color={accentColor} />
                    </Circle>
                  </Box>

                  {/* Content Card - Reduced Padding */}
                  <Box 
                    bg={cardBg}
                    p={6}                    // Reduced padding
                    borderRadius="xl"
                    boxShadow="md"
                    w="full"
                    minH={{ md: "180px" }}
                    border="1px solid"
                    borderColor={useColorModeValue("gray.100", "gray.700")}
                    _hover={{
                      boxShadow: "lg",
                      borderColor: accentColor,
                    }}
                  >
                    <VStack spacing={3}>
                      <Heading 
                        fontSize="18px" 
                        fontWeight="700" 
                        color="gray.800"
                        lineHeight="1.3"
                      >
                        {step.title}
                      </Heading>
                      
                      <Text 
                        fontSize="14px" 
                        color="gray.600" 
                        lineHeight="1.7"
                      >
                        {step.description}
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              ))}

              {/* Connecting Line */}
              <Box 
                display={{ base: "none", md: "block" }}
                position="absolute" 
                top="44px" 
                left="18%" 
                right="18%" 
                h="4px" 
                bg={lineColor}
                zIndex={1}
                borderRadius="full"
              />
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}