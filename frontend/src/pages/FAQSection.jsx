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
} from '@chakra-ui/react';

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
    <Box bg="#F8FAFC" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="center">

          {/* Header */}
          <VStack spacing={3} textAlign="center" maxW="680px">
            <Text 
              fontSize="14px" 
              fontWeight="700" 
              color={accentColor} 
              letterSpacing="1.5px"
              textTransform="uppercase"
            >
              HAVE QUESTIONS?
            </Text>
            
            <Heading 
              fontSize="28px" 
              fontWeight="700" 
              color="gray.800"
              lineHeight="1.2"
            >
              Frequently Asked Questions
            </Heading>

            <Text fontSize="16px" color="gray.600">
              Find answers to the most common questions
            </Text>
          </VStack>

          {/* FAQ Accordion - Full width with 10px left/right padding + All Open by Default */}
          <Box w="full" maxW="1200px" px={2.5}>   {/* 10px padding from left & right */}
            <Accordion allowMultiple defaultIndex={faqs.map((_, index) => index)}>
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  mb={3}
                  bg="white"
                  overflow="hidden"
                >
                  <AccordionButton 
                    p={5}
                    _hover={{ bg: "gray.50" }}
                    _expanded={{ bg: "orange.50" }}
                  >
                    <Box flex="1" textAlign="left" fontSize="16px" fontWeight="600" color="gray.800">
                      {faq.question}
                    </Box>
                    <AccordionIcon color={accentColor} fontSize="18px" />
                  </AccordionButton>

                  <AccordionPanel pb={5} px={5} fontSize="15px" color="gray.600" lineHeight="1.75">
                    {faq.answer}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}