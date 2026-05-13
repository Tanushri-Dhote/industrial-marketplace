import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Icon,
  Link,
  UnorderedList,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaCheckCircle, FaGavel, FaShieldAlt } from 'react-icons/fa';
import { MdGavel } from 'react-icons/md';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TermsPage() {
  const accentColor = "#D90404";
  const darkBg = "#0F172A";

  const sections = [
    { id: 1, title: "Before you proceed" },
    { id: 2, title: "Definitions" },
    { id: 3, title: "1. General" },
    { id: 4, title: "2. Use of this Website" },
    { id: 5, title: "3. Your Responsibilities" },
    { id: 6, title: "4. Our Service" },
    { id: 7, title: "5. Validity of Price Quotes" },
    { id: 8, title: "6. Delivery of Price Quotes" },
    { id: 9, title: "7. Intellectual Property Rights" },
    { id: 10, title: "8. Limitation of Liability" },
    { id: 11, title: "9. Jurisdiction and Enforceability" },
    { id: 12, title: "10. Complaints Procedure" },
    { id: 13, title: "Changes to these Terms" },
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Re-Conditioned Engine</title>
        <meta name="description" content="Read our Terms and Conditions to understand the rules and guidelines for using Re-Conditioned Engine engine price comparison platform." />
      </Helmet>

      {/* Hero Section */}
      <Box bg={darkBg} color="white" py={12} mb={8}>
        <Container maxW="container.xl">
          <MotionVStack spacing={3} textAlign="center" initial="initial" animate="animate" variants={staggerContainer}>
            <MotionBox
              bg={accentColor}
              color="white"
              px={4}
              py={1}
              borderRadius="full"
              fontSize="12px"
              fontWeight="600"
              variants={fadeInUp}
            >
              LEGAL
            </MotionBox>
            <MotionBox variants={fadeInUp}>
              <Heading fontSize="36px" fontWeight="800">
                Terms &amp; Conditions
              </Heading>
            </MotionBox>
            <MotionBox variants={fadeInUp}>
              <Text fontSize="16px" maxW="2xl" opacity={0.9}>
                Please read these terms carefully before using Re-Conditioned Engine
              </Text>
            </MotionBox>
            <MotionBox variants={fadeInUp}>
              <Text fontSize="14px" opacity={0.7}>Last updated: April 17, 2026</Text>
            </MotionBox>
          </MotionVStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={4} mb={12}>
        <MotionVStack align="stretch" spacing={8} initial="initial" whileInView="animate" viewport={{ once: true }} variants={staggerContainer}>

          {/* Warning Banner */}
          <MotionBox
            bg="red.50"
            p={6}
            borderRadius="lg"
            borderLeft="5px solid #D90404"
            variants={fadeInUp}
          >
            <HStack spacing={4} align="start">
              <Icon as={MdGavel} boxSize={7} color="#D90404" mt={1} />
              <Text fontSize="15px" color="red.800" lineHeight="1.7" fontWeight="500">
                Before you proceed, please read these Terms and Conditions carefully.
                If you do not agree with these terms, you must immediately exit and not use this website.
              </Text>
            </HStack>
          </MotionBox>

          {/* Main Content - Accordion Style */}
          <MotionBox variants={fadeInUp}>
            {sections.map((section) => (
              <Accordion key={section.id} allowToggle mb={4}>
                <AccordionItem
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <AccordionButton
                    _expanded={{ bg: accentColor, color: 'white' }}
                    _hover={{ bg: 'orange.50' }}
                    py={5}
                  >
                    <Box flex="1" textAlign="left">
                      <Heading size="md" fontSize="19px">
                        {section.title}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={6} pt={4} fontSize="15.5px" lineHeight="1.8" color="gray.700">

                    {section.id === 1 && (
                      <Text>
                        By accessing or using Re-Conditioned Engine, you agree to be bound by these Terms and Conditions.
                        If you do not agree, please do not use our website.
                      </Text>
                    )}

                    {section.id === 2 && (
                      <VStack align="stretch" spacing={3}>
                        <Text><strong>“We”, “Us”, “Our”</strong> – refers to Re-Conditioned Engine.</Text>
                        <Text><strong>“You”, “Your”</strong> – refers to the user of this website.</Text>
                        <Text>
                          <strong>“Website”</strong> – means{" "}
                          <Link
                            href="https://reconditionedengine.co.uk/"
                            color="#D90404"
                            isExternal
                            fontWeight="600"
                          >
                            https://reconditionedengine.co.uk/
                          </Link>{" "}
                          and all its pages.
                        </Text>
                      </VStack>
                    )}

                    {section.id === 3 && (
                      <VStack align="stretch" spacing={3}>
                        <Text>1.1 We operate as an online marketplace platform only. We do not supply engines or parts directly.</Text>
                        <Text>1.2 We have no control over the quality, safety, or legality of products supplied by third-party providers.</Text>
                        <Text>1.3 We do not verify or endorse any quotes provided by suppliers.</Text>
                        <Text>1.4 All transactions and agreements are made directly between you and the supplier.</Text>
                      </VStack>
                    )}

                    {section.id === 4 && (
                      <VStack align="stretch" spacing={3}>
                        <Text>By using this website you agree not to:</Text>
                        <List spacing={2} pl={2}>
                          <ListItem><ListIcon as={FaCheckCircle} color={accentColor} />Use automated tools to scrape or extract data</ListItem>
                          <ListItem><ListIcon as={FaCheckCircle} color={accentColor} />Reproduce content for commercial purposes</ListItem>
                          <ListItem><ListIcon as={FaCheckCircle} color={accentColor} />Interfere with the security or functionality of the site</ListItem>
                        </List>
                      </VStack>
                    )}

                    {section.id === 5 && (
                      <Text>
                        You are responsible for ensuring that all information you provide is accurate and complete.
                        Incorrect information may result in inaccurate quotes and may affect any warranty from the supplier.
                      </Text>
                    )}

                    {section.id === 6 && (
                      <Text>
                        Re-Conditioned Engine connects customers with verified engine suppliers.
                        We do not handle payments, delivery, or any financial transactions. All purchases are made
                        directly with the supplier.
                      </Text>
                    )}

                    {section.id === 7 && (
                      <Text>
                       Quotes are provided by third-party suppliers. We do not guarantee the availability or final price.
                        All final terms are set by the supplier. You must contact the supplier directly to confirm the quote.
                      </Text>
                    )}

                    {section.id === 8 && (
                      <Text>
                        Quotes are delivered via email or on the website. We rely on third-party services and cannot guarantee delivery in all cases due to technical issues.
                      </Text>
                    )}

                    {section.id === 9 && (
                      <Text>
                        All content, logos, images, and materials on this website are the intellectual property of Re-Conditioned Engine or its licensors.
                        You may not copy, reproduce, or use them without written permission.
                      </Text>
                    )}

                    {section.id === 10 && (
                      <Text>
                        Re-Conditioned Engine shall not be liable for any loss, damage, fraud, or disputes arising from transactions between you and any third-party supplier.
                      </Text>
                    )}

                    {section.id === 11 && (
                      <Text>
                        These Terms and Conditions are governed by the laws of the United Kingdom. Any disputes shall be subject to the exclusive jurisdiction of the UK courts.
                      </Text>
                    )}

                    {section.id === 12 && (
                      <VStack align="stretch" spacing={3}>
                        <Text>If you have a complaint about our service, please contact us at support @reconditionedengine.co.uk</Text>
                        <Text fontSize="14px" color="gray.600">
                          Note: For complaints regarding engines or services from suppliers, you must contact the supplier directly.
                        </Text>
                      </VStack>
                    )}

                    {section.id === 13 && (
                      <Text>
                        We reserve the right to update these Terms and Conditions at any time. Continued use of the website after changes constitutes acceptance of the new terms.
                      </Text>
                    )}

                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ))}
          </MotionBox>

          {/* Final Note */}
          <MotionBox
            bg={darkBg}
            color="white"
            p={8}
            borderRadius="xl"
            textAlign="center"
            variants={fadeInUp}
          >
            <VStack spacing={4}>
              <Icon as={FaShieldAlt} boxSize={10} color={accentColor} />
              <Heading fontSize="22px">By using Re-Conditioned Engine, you agree to these Terms &amp; Conditions</Heading>
              <Text fontSize="14px" opacity={0.8}>
                If you have any questions, please contact us at{' '}
                <Text as="span" color={accentColor} fontWeight="600">
                  support@reconditionedengine.co.uk
                </Text>
              </Text>
            </VStack>
          </MotionBox>

        </MotionVStack>
      </Container>
    </>
  );
}