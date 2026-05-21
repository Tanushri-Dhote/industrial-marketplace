import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Badge,
  Circle,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import {
  FaCheckCircle,
  FaShieldAlt,
  FaGavel,
  FaFileContract,
  FaUserShield,
  FaHandshake,
  FaBalanceScale,
  FaArrowRight,
  FaEnvelope,
  FaClock,
  FaGlobe,
  FaCogs,
  FaTruck,
} from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHStack = motion(HStack);
const MotionSimpleGrid = motion(SimpleGrid);

const RED = "#E10600";
const DARK = "#0F172A";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const sections = [
  {
    id: 1,
    title: "Before You Proceed",
    icon: FaGavel,
    content: "By accessing or using Re-Conditioned Engine, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website. These terms form a legally binding agreement between you and Re-Conditioned Engine regarding your use of our services.",
  },
  {
    id: 2,
    title: "Definitions",
    icon: FaFileContract,
    content: [
      { term: "We, Us, Our", definition: "Refers to Re-Conditioned Engine and its operators." },
      { term: "You, Your", definition: "Refers to the user or customer of our services." },
      { term: "Website", definition: "Means https://reconditionedengine.co.uk/ and all its subdomains and pages." },
      { term: "Service", definition: "The engine reconditioning services provided by Re-Conditioned Engine." },
      { term: "Engine", definition: "The reconditioned engine unit provided to the customer." }
    ]
  },
  {
    id: 3,
    title: "Our Service",
    icon: FaCogs,
    content: [
      "We provide professional engine reconditioning services with the highest quality standards.",
      "All engines are carefully rebuilt and tested by experienced technicians.",
      "We offer comprehensive warranty coverage on all our reconditioned engines.",
      "Our service includes nationwide delivery across the UK.",
      "We provide free quotes for all engine reconditioning services."
    ]
  },
  {
    id: 4,
    title: "Use of This Website",
    icon: FaGlobe,
    content: [
      "No automated scraping or data extraction without permission",
      "No reproduction of content for commercial purposes",
      "No interference with website security or functionality",
      "No submission of false or misleading information",
      "Use the website only for legitimate engine service inquiries"
    ]
  },
  {
    id: 5,
    title: "Your Responsibilities",
    icon: FaUserShield,
    content: [
      "You are responsible for providing accurate and complete information when requesting quotes.",
      "Incorrect vehicle or engine information may result in inaccurate quotes.",
      "You must verify all service details before confirming any work.",
      "You agree to use our services in compliance with all applicable laws.",
      "You are responsible for ensuring proper engine installation by qualified mechanics."
    ]
  },
  {
    id: 6,
    title: "Engine Reconditioning Process",
    icon: FaHandshake,
    content: [
      "We specialize in high-quality reconditioned engines for all major makes and models.",
      "Every engine undergoes rigorous testing to ensure reliability and performance.",
      "We use premium OEM-quality components in all our reconditioning work.",
      "Our team of experienced technicians follows strict quality control procedures.",
      "We provide detailed documentation and test reports for all reconditioned engines.",
      "Typical reconditioning time is 5-10 business days depending on engine complexity."
    ]
  },
  {
    id: 7,
    title: "Quotes & Pricing",
    icon: FaClock,
    content: [

      "We reserve the right to adjust quotes based on parts availability or market conditions.",
      "Final pricing will be confirmed before any work begins.",
      "Additional services requested after the initial quote may incur extra charges.",
      "All quotes are provided in GBP (£) and include VAT where applicable.",
      "A deposit may be required before work commences on your engine."
    ]
  },
  {
    id: 8,
    title: "Warranty Terms",
    icon: FaShieldAlt,
    content: [
      "All our reconditioned engines come with a comprehensive 12-month warranty.",
      "Warranty covers manufacturing defects and workmanship issues.",
      "Regular maintenance as specified in the vehicle manual must be followed.",
      "Warranty may be voided if the engine is modified or improperly installed.",
      "Full warranty terms and conditions are provided with each engine purchase.",
      "Warranty claims must be submitted within 7 days of discovering the issue."
    ]
  },
  {
    id: 9,
    title: "Delivery Policy",
    icon: FaTruck,
    content: [
      "We offer nationwide delivery across the UK mainland.",
      "Delivery times are estimated and typically range from 2-5 business days.",
      "Shipping costs will be calculated and confirmed before dispatch.",
      "Customers are responsible for providing accurate delivery addresses.",
      "We are not liable for delays caused by courier services or adverse weather.",
      "International delivery is available upon request with additional charges."
    ]
  },

  {
    id: 11,
    title: "Intellectual Property Rights",
    icon: FaBalanceScale,
    content: [
      "All content, logos, images, and materials on this website are the intellectual property of Re-Conditioned Engine.",
      "You may not copy, reproduce, distribute, or create derivative works without written permission.",
      "Unauthorized use of our intellectual property may result in legal action.",
      "All engine specifications and data remain the property of their respective manufacturers."
    ]
  },
  {
    id: 12,
    title: "Limitation of Liability",
    icon: FaShieldAlt,
    content: [
      "We shall not be liable for any indirect or consequential damages.",
      "Our maximum liability is limited to the total value of services provided.",
      "We do not warrant that our website will be error-free or uninterrupted.",
      "We are not responsible for delays caused by circumstances beyond our control.",
      "Customers are advised to ensure proper installation by qualified professionals.",
      "We are not liable for vehicle downtime or loss of use during service."
    ]
  },
  {
    id: 13,
    title: "Privacy & Data Protection",
    icon: FaUserShield,
    content: [
      "We collect and process personal data in accordance with our Privacy Policy.",
      "Your information is used solely to provide and improve our services.",
      "We do not sell or share your personal data with third parties without consent.",
      "You have the right to access, correct, or delete your personal data.",
      "All data is stored securely in compliance with UK data protection laws."
    ]
  },
  {
    id: 14,
    title: "Jurisdiction",
    icon: FaGavel,
    content: [
      "These Terms and Conditions are governed by the laws of the United Kingdom.",
      "Any disputes shall be subject to the exclusive jurisdiction of the UK courts.",
      "If any provision is found to be unenforceable, the remaining provisions remain in effect.",
      "Failure to enforce any right does not constitute a waiver of that right."
    ]
  },
  {
    id: 15,
    title: "Complaints Procedure",
    icon: FaEnvelope,
    content: [
      "If you have a complaint about our service, please contact us at support@reconditionedengine.co.uk",
      "We aim to respond to all complaints within 5 business days.",
      "Please provide as much detail as possible to help us resolve your issue quickly.",
      "For serious complaints, we may request additional documentation or inspection.",
      "We are committed to resolving all issues fairly and promptly.",
      "If unsatisfied with our response, you may escalate to an approved arbitration service."
    ]
  },
  {
    id: 16,
    title: "Changes to These Terms",
    icon: FaClock,
    content: [
      "We reserve the right to update these Terms and Conditions at any time.",
      "Changes become effective immediately upon posting to the website.",
      "Continued use of the website after changes constitutes acceptance of the new terms.",
      "We encourage you to review these terms periodically for any updates.",
      "Material changes will be notified via email or website notice."
    ]
  }
];

const TermsCard = ({ section }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <MotionBox
      variants={fadeInUp}
      bg={bgColor}
      borderRadius="24px"
      overflow="hidden"
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Box
        p={6}
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        bg={isExpanded ? "red.50" : "transparent"}
        transition="all 0.3s"
      >
        <HStack spacing={4} align="start">
          <Circle
            size="50px"
            bg={isExpanded ? RED : "red.100"}
            color={isExpanded ? "white" : RED}
            transition="all 0.3s"
          >
            <Icon as={section.icon} boxSize={6} />
          </Circle>
          <Box flex={1}>
            <HStack justify="space-between">
              <Heading fontSize="20px" fontWeight="800" color="#1A1A1A">
                {section.title}
              </Heading>
              <Icon
                as={FaArrowRight}
                color={RED}
                transform={isExpanded ? "rotate(90deg)" : "rotate(0deg)"}
                transition="transform 0.3s"
              />
            </HStack>
          </Box>
        </HStack>
      </Box>

      <MotionBox
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        overflow="hidden"
      >
        <Box p={6} pt={0} borderTop="1px solid" borderColor="gray.100">
          {section.id === 2 ? (
            <VStack align="stretch" spacing={3}>
              {section.content.map((item, idx) => (
                <Box key={idx}>
                  <Text fontWeight="800" color={RED} mb={1}>
                    {item.term}
                  </Text>
                  <Text color="gray.600" pl={2}>
                    {item.definition}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : Array.isArray(section.content) ? (
            <VStack align="stretch" spacing={2}>
              {section.content.map((item, idx) => (
                <HStack key={idx} spacing={3} align="start">
                  <Icon as={FaCheckCircle} color={RED} boxSize={4} mt={1} />
                  <Text color="gray.600" lineHeight="1.6">
                    {item}
                  </Text>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Text color="gray.600" lineHeight="1.7">
              {section.content}
            </Text>
          )}
        </Box>
      </MotionBox>
    </MotionBox>
  );
};

export default function TermsPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Re-Conditioned Engine</title>
        <meta name="description" content="Read our Terms and Conditions to understand the rules and guidelines for using our professional engine reconditioning services." />
      </Helmet>

      {/* Hero Section with Parallax Effect */}
      <MotionBox
        bg={`linear-gradient(135deg, ${DARK} 0%, #1E293B 100%)`}
        color="white"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
        style={{ opacity, scale }}
      >
        {/* Animated Background Elements */}
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          w="400px"
          h="400px"
          bg="radial-gradient(circle, rgba(225,6,0,0.15) 0%, rgba(225,6,0,0) 70%)"
          borderRadius="full"
        />
        <Box
          position="absolute"
          bottom="-150px"
          left="-100px"
          w="350px"
          h="350px"
          bg="radial-gradient(circle, rgba(225,6,0,0.1) 0%, rgba(225,6,0,0) 70%)"
          borderRadius="full"
        />

        <Container maxW="container.xl" position="relative" zIndex={2}>
          <MotionVStack
            spacing={{ base: 4, md: 6 }}
            textAlign="center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <MotionBox variants={fadeInUp}>
              <Badge
                bg={RED}
                color="white"
                px={5}
                py={2}
                borderRadius="full"
                fontSize="12px"
                fontWeight="800"
                letterSpacing="1px"
                textTransform="uppercase"
              >
                ✦ Legal Information ✦
              </Badge>
            </MotionBox>

            <MotionBox variants={fadeInUp}>
              <Heading
                fontSize={{ base: "36px", md: "52px", lg: "64px" }}
                fontWeight="900"
                lineHeight="1.1"
              >
                Terms &amp; Conditions
              </Heading>
            </MotionBox>

            <MotionBox variants={fadeInUp}>
              <Text
                fontSize={{ base: "16px", md: "18px" }}
                maxW="700px"
                mx="auto"
                opacity={0.9}
              >
                Please read these terms carefully before using our engine reconditioning services
              </Text>
            </MotionBox>

            <MotionBox variants={fadeInUp}>
              <HStack spacing={2} justify="center">
                <Icon as={FaClock} boxSize={4} opacity={0.7} />
                <Text fontSize="14px" opacity={0.7}>
                  Last updated: May 21, 2026
                </Text>
              </HStack>
            </MotionBox>
          </MotionVStack>
        </Container>
      </MotionBox>

      <Container maxW="container.lg" py={{ base: 8, md: 16 }}>
        <MotionVStack
          align="stretch"
          spacing={8}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Warning Alert */}
          <MotionBox variants={fadeInLeft}>
            <Box
              bg="linear-gradient(135deg, #FFF5F5 0%, #FEF2F0 100%)"
              p={6}
              borderRadius="24px"
              borderLeft="5px solid"
              borderLeftColor={RED}
              position="relative"
              overflow="hidden"
            >
              <HStack spacing={4} align="start" wrap={{ base: "wrap", md: "nowrap" }}>
                <Circle size="50px" bg={RED} color="white" flexShrink={0}>
                  <Icon as={FaGavel} boxSize={6} />
                </Circle>
                <Box>
                  <Text fontWeight="800" color={RED} mb={2} fontSize="18px">
                    Important Legal Notice
                  </Text>
                  <Text fontSize="15px" color="gray.700" lineHeight="1.7">
                    Before you proceed, please read these Terms and Conditions carefully.
                    If you do not agree with these terms, you must immediately exit and not use this website.
                    By continuing to use our platform, you acknowledge that you have read, understood,
                    and agree to be bound by these terms.
                  </Text>
                </Box>
              </HStack>
            </Box>
          </MotionBox>

          {/* Terms Cards Grid */}
          <MotionSimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={6}
            variants={staggerContainer}
          >
            {sections.map((section) => (
              <MotionBox key={section.id} variants={fadeInUp}>
                <TermsCard section={section} />
              </MotionBox>
            ))}
          </MotionSimpleGrid>

          {/* Contact Section */}
          <MotionBox variants={fadeInUp}>
            <Box
              bg="linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)"
              borderRadius="32px"
              p={8}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-50px"
                right="-50px"
                w="200px"
                h="200px"
                bg="radial-gradient(circle, rgba(225,6,0,0.1) 0%, rgba(225,6,0,0) 70%)"
                borderRadius="full"
              />

              <VStack spacing={5} position="relative" zIndex={2}>
                <Circle size="80px" bg="rgba(225,6,0,0.15)">
                  <Icon as={FaShieldAlt} color={RED} boxSize={10} />
                </Circle>

                <Heading color="white" fontSize={{ base: "24px", md: "28px" }} fontWeight="800">
                  By using Re-Conditioned Engine,
                  <Text as="span" color={RED} display="block">
                    you agree to these Terms &amp; Conditions
                  </Text>
                </Heading>

                <Text color="gray.300" fontSize="15px" maxW="600px">
                  If you have any questions about these terms, please don't hesitate to contact us.
                  Our team is here to help clarify any concerns you may have.
                </Text>

                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <Button
                    as="a"
                    href="mailto:support@reconditionedengine.co.uk"
                    bg={RED}
                    color="white"
                    size="lg"
                    px={8}
                    h="52px"
                    fontWeight="700"
                    borderRadius="full"
                    leftIcon={<FaEnvelope />}
                    _hover={{
                      bg: "#c40000",
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    transition="all 0.3s"
                  >
                    Contact Support
                  </Button>

                  <Button
                    as={RouterLink}
                    to="/"
                    variant="outline"
                    color="white"
                    size="lg"
                    px={8}
                    h="52px"
                    fontWeight="700"
                    borderRadius="full"
                    border="2px solid"
                    borderColor="white"
                    _hover={{
                      bg: "white",
                      color: RED,
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                  >
                    Return to Home
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </MotionBox>

        </MotionVStack>
      </Container>
    </>
  );
}