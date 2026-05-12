import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaQuestionCircle, FaChevronRight } from 'react-icons/fa';

const faqs = [
  {
    question: "How does the engine search work?",
    answer: "Simply enter your vehicle registration number or engine model to instantly find matching engines from verified sellers across India."
  },
  {
    question: "Are the engines original or refurbished?",
    answer: "We offer both original and high-quality refurbished engines. Each listing clearly mentions the condition along with warranty details."
  },
  {
    question: "Do you provide warranty on engines?",
    answer: "Yes, all engines come with a minimum 6 months to 2 years warranty depending on the seller and condition of the engine."
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery usually takes 3-7 working days across India. Local pickup or fitting options are also available in major cities."
  },
  {
    question: "Can I get the engine fitted locally?",
    answer: "Yes, many of our sellers offer supply + fitting service. You can select this option while comparing quotes."
  },
  {
    question: "What if I receive a wrong or defective engine?",
    answer: "We have a clear return and replacement policy. Contact our support within 48 hours of delivery for quick resolution."
  },
  {
    question: "How do I compare prices from different sellers?",
    answer: "After submitting your requirement, you will receive multiple competitive quotes from verified sellers. You can compare them easily on our platform."
  },
];

export default function FAQSection() {
  const accentColor = "#D90404";

  return (
    <Box bg="linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)" py={10} position="relative" overflow="hidden">
      {/* Background Decorative Elements */}
      <Box
        position="absolute"
        top="-50%"
        right="-20%"
        w="300px"
        h="300px"
        bg={`${accentColor}05`}
        borderRadius="full"
        filter="blur(60px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-30%"
        left="-10%"
        w="250px"
        h="250px"
        bg={`${accentColor}08`}
        borderRadius="full"
        filter="blur(50px)"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={6} align="center">

          {/* Header Section with Icon */}
          <VStack spacing={2} textAlign="center" maxW="700px">
            <Flex
              w="48px"
              h="48px"
              bg={`${accentColor}10`}
              borderRadius="full"
              align="center"
              justify="center"
            >
              <Icon as={FaQuestionCircle} w={5} h={5} color={accentColor} />
            </Flex>
            
            <Text 
              fontSize="12px" 
              fontWeight="700" 
              color={accentColor} 
              letterSpacing="1.5px"
              textTransform="uppercase"
              bg={`${accentColor}10`}
              px={2.5}
              py={0.5}
              borderRadius="full"
              display="inline-block"
            >
              FAQ
            </Text>
            
            <Heading 
              fontSize={{ base: "24px", md: "30px" }} 
              fontWeight="800" 
              color="gray.800"
              lineHeight="1.3"
              letterSpacing="-0.5px"
            >
              Got Questions? We've Got Answers
            </Heading>

            <Text fontSize="14px" color="gray.600">
              Everything you need to know about finding and buying quality engines
            </Text>
          </VStack>

          {/* FAQ Accordion - Modern Card Style */}
          <Box w="full" maxW="1000px">
            <Accordion allowMultiple defaultIndex={faqs.map((_, index) => index)}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={3}>
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index}
                    border="none"
                    borderRadius="xl"
                    bg="white"
                    overflow="hidden"
                    transition="all 0.2s ease"
                    _hover={{
                      transform: "translateY(-1px)",
                      boxShadow: "md"
                    }}
                    sx={{
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <AccordionButton 
                      py={3.5}
                      px={4}
                      _hover={{ bg: "gray.50" }}
                      _expanded={{ 
                        bg: `linear-gradient(135deg, ${accentColor}05 0%, white 100%)`,
                        borderBottom: "1px solid",
                        borderColor: `${accentColor}15`
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        <Flex align="center" gap={2.5}>
                          <Box
                            w="28px"
                            h="28px"
                            bg={`${accentColor}10`}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="12px"
                            fontWeight="700"
                            color={accentColor}
                          >
                            {index + 1}
                          </Box>
                          <Text fontSize="14px" fontWeight="600" color="gray.800" lineHeight="1.4">
                            {faq.question}
                          </Text>
                        </Flex>
                      </Box>
                      <AccordionIcon 
                        color={accentColor} 
                        fontSize="16px"
                        bg={`${accentColor}10`}
                        borderRadius="full"
                        p={1}
                        w={5}
                        h={5}
                      />
                    </AccordionButton>

                    <AccordionPanel pb={3.5} px={4} pt={3}>
                      <Flex gap={2}>
                        <Icon as={FaChevronRight} color={accentColor} mt={0.5} boxSize="10px" />
                        <Text fontSize="13px" color="gray.600" lineHeight="1.6">
                          {faq.answer}
                        </Text>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </SimpleGrid>
            </Accordion>
          </Box>

          {/* Help Section Footer */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align="center"
            justify="center"
            gap={3}
            pt={4}
          >
            <Text fontSize="13px" color="gray.600">
              Still have questions?
            </Text>
            <Text 
              fontSize="13px" 
              fontWeight="600" 
              color={accentColor}
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
                   onClick={() => window.location.href = "/contact"}
            >
              Contact our support team →
            </Text>
          </Flex>

        </VStack>
      </Container>
    </Box>
  );
}