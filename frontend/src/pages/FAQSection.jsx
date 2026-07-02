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
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaChevronRight } from 'react-icons/fa';

const faqs = [
  {
    question: "How does the engine search work?",
    answer: "Simply enter your vehicle registration number or engine model to instantly find matching engines from our extensive inventory."
  },
  {
    question: "Are the engines original or refurbished?",
    answer: "We offer both original and high-quality refurbished engines. Each engine clearly mentions the condition along with warranty details."
  },
  {
    question: "Do you provide warranty on engines?",
    answer: "Yes, all engines come with a 6-month warranty."
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery usually takes 3-7 working days nationwide. Local pickup or fitting options are also available."
  },
  {
    question: "Can I get the engine fitted locally?",
    answer: "Yes, we offer professional supply & fitting services. You can select this option while requesting your quote."
  },
  {
    question: "What if I receive a wrong or defective engine?",
    answer: "If you receive an incorrect or faulty engine, please contact our support team within 48 hours of delivery so the issue can be reviewed and resolved."
  },
  {
    question: "How do I find the right engine for my vehicle?",
    answer: "Simply submit your vehicle or engine details and our team will help you find the matching engine option from our stock."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we specialize in nationwide collection and delivery across the United Kingdom. Please contact our support team for custom international delivery inquiries."
  },
];

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function FAQSection() {
  const accentColor = "#D90404";

  return (
    <Box bg="linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)" py={6} position="relative" overflow="hidden">
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
          <MotionBox 
            textAlign="center" 
            maxW="700px"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={2}>
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
                fontSize="13px"
                fontWeight="800"
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
                as="h2"
                fontSize={{ base: "28px", md: "38px", lg: "42px" }}
                fontWeight="800"
                color="gray.900"
                lineHeight="1.2"
              >
                Got Questions?
                <Box as="br" display={{ base: "block", md: "none" }} />
                {" "}We've Got Answers
              </Heading>

              <Text fontSize="15px" color="gray.600">
                Everything you need to know about finding and buying quality engines
              </Text>
            </VStack>
          </MotionBox>

          {/* FAQ Accordion - Modern Card Style */}
          <Box w="full" maxW="1000px">
            <Accordion allowMultiple defaultIndex={faqs.map((_, i) => i)}>
              <MotionSimpleGrid 
                columns={{ base: 1, lg: 2 }} 
                spacing={3}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {faqs.map((faq, index) => (
                  <AccordionItem
                    as={motion.div}
                    variants={itemVariants}
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
                          <Text fontSize={{ base: "13px", md: "14px" }} fontWeight="600" color="gray.800" lineHeight="1.4">
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
                        <Text fontSize={{ base: "12px", md: "13px" }} color="gray.600" lineHeight="1.6">
                          {faq.answer}
                        </Text>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </MotionSimpleGrid>
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