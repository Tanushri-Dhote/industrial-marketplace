import React from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  Badge,
  useColorModeValue,
  Icon,
  HStack,
  Circle,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import {
  FaShieldAlt,
  FaLock,
  FaCookie,
  FaEye,
  FaUserSecret,
  FaCheckCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaDatabase,
  FaUserLock,
  FaTrashAlt,
  FaClock,
  FaGavel,
  FaGlobe,
  FaChevronDown,
} from 'react-icons/fa';
import { MdPrivacyTip } from 'react-icons/md';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionSimpleGrid = motion(SimpleGrid);

const RED = "#E10600";
const DARK = "#0F172A";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sections = [
  {
    id: 1,
    title: "Our Privacy Commitment",
    icon: FaShieldAlt,
    content: "At Re-Conditioned Engine, your privacy is our priority. We are committed to protecting your personal information and being transparent about how we handle your data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our engine reconditioning services."
  },
  {
    id: 2,
    title: "Who We Are",
    icon: FaUserSecret,
    content: [
      "Re-Conditioned Engine is a professional engine reconditioning service provider based in the UK.",
      "We specialize in high-quality engine rebuilding, testing, and delivery services.",
      "Company registration number: 12345678 (Registered in England and Wales)",
      "Registered address: 44 Fowler Road, Hainault Business Park, Ilford London, IG6 3UT",
      "Contact email: info@reconditionedengine.co.uk",
      "Contact phone: +44 2071129397"
    ]
  },
  {
    id: 3,
    title: "Information We Collect",
    icon: FaDatabase,
    content: [
      "When you use our services, we may collect the following information:",
      "• Your name and contact information (email address, phone number)",
      "• Your postcode for delivery calculations",
      "• Vehicle details (make, model, year, registration number)",
      "• Engine specifications and requirements",
      "• Communication preferences and service history"
    ]
  },
  {
    id: 4,
    title: "Information We DO NOT Collect",
    icon: FaUserLock,
    content: [
      "We want you to feel secure when using our services. We DO NOT collect:",
      "• Bank account details or payment card information",
      "• Sensitive personal data (health information, biometric data)",
      "• Government identification numbers (passport, driving license)",
      "• Credit history or financial information",
      "• Any information from children under 16 years of age"
    ]
  },
  {
    id: 5,
    title: "How We Collect Your Information",
    icon: FaEye,
    content: [
      "We collect information in the following ways:",
      "• When you request a quote through our website",
      "• When you contact us via phone, email, or contact forms",
      "• When you place an order for our engine reconditioning services",
      "• When you communicate with our customer support team",
      "• Through cookies and similar technologies (with your consent)"
    ]
  },
  {
    id: 6,
    title: "How We Use Your Information",
    icon: FaCheckCircle,
    content: [
      "We use your personal information for the following legitimate purposes:",
      "• To provide accurate quotes for our engine reconditioning services",
      "• To process your orders and deliver your reconditioned engine",
      "• To communicate with you about your order status",
      "• To provide customer support and handle warranty claims",
      "• To improve our services and website experience",
      "• To comply with legal obligations and regulations"
    ]
  },
  {
    id: 7,
    title: "Legal Basis for Processing",
    icon: FaGavel,
    content: [
      "We process your personal information under the following legal bases:",
      "",
      "Contract Performance: Processing necessary to fulfill our service agreement with you.",
      "",
      "Legitimate Interests: Using your information to improve our services and communicate with you.",
      "",
      "Consent: When you voluntarily provide information for specific purposes.",
      "",
      "Legal Obligation: When required to comply with UK laws and regulations."
    ]
  },

  {
    id: 9,
    title: "Data Security Measures",
    icon: FaLock,
    content: [
      "We take data security seriously and implement the following measures:",
      "• HTTPS encryption for all website communications",
      "• Secure servers with firewall protection",
      "• Regular security audits and vulnerability assessments",
      "• Staff training on data protection and privacy",
      "• Access controls and authentication protocols",
      "• No financial transactions processed on our website"
    ]
  },
  {
    id: 10,
    title: "How Long We Keep Your Data",
    icon: FaClock,
    content: [
      "We retain your personal information only as long as necessary:",
      "• Quote requests: Retained for 90 days",
      "• Customer orders: Retained for 6 years (for warranty and legal purposes)",
      "• Communication records: Retained for 2 years",
      "• Inactive accounts: Automatically deleted after 24 months",
      "• You may request deletion of your data at any time"
    ]
  },
  {
    id: 11,
    title: "Your Privacy Rights (GDPR)",
    icon: FaUserSecret,
    content: [
      "Under UK GDPR, you have the following rights regarding your personal data:",
      "",
      "✓ Right to Access: Request a copy of the data we hold about you",
      "✓ Right to Rectification: Correct inaccurate or incomplete information",
      "✓ Right to Erasure: Request deletion of your data (Right to be forgotten)",
      "✓ Right to Restrict Processing: Limit how we use your information",
      "✓ Right to Data Portability: Receive your data in a portable format",
      "✓ Right to Object: Object to certain types of processing",
      "✓ Rights Related to Automated Decisions: Not be subject to automated decision-making"
    ]
  },
  {
    id: 12,
    title: "How to Exercise Your Rights",
    icon: FaEnvelope,
    content: [
      "To exercise any of your privacy rights, please contact us:",
      "",
      "Email: privacy@reconditionedengine.co.uk",
      "Phone: +44 2071129397",
      "Post: Data Protection Officer, 44 Fowler Road, Hainault Business Park, Ilford London, IG6 3UT",
      "",
      "We will respond to all requests within 30 days. For complex requests, we may extend this period by an additional 60 days and will notify you accordingly.",
      "",
      "If you are unsatisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO): www.ico.org.uk"
    ]
  },

  {
    id: 14,
    title: "Children's Privacy",
    icon: FaUserSecret,
    content: [
      "Our services are not directed to individuals under the age of 16.",
      "We do not knowingly collect personal information from children.",
      "If you believe a child has provided us with personal information, please contact us immediately.",
      "We will take steps to delete such information promptly upon discovery."
    ]
  },
  {
    id: 15,
    title: "International Data Transfers",
    icon: FaGlobe,
    content: [
      "We primarily store and process your data within the United Kingdom.",
      "If data is transferred outside the UK, we ensure adequate safeguards are in place.",
      "We only work with partners who comply with UK data protection laws.",
      "You may request information about international data transfer safeguards."
    ]
  },
  {
    id: 16,
    title: "Updates to This Privacy Policy",
    icon: FaClock,
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.",
      "Significant changes will be notified via:",
      "• A prominent notice on our website",
      "• Email notification (if you have provided your email address)",
      "• Updates to the 'Last Updated' date at the top of this policy",
      "",
      "We encourage you to review this policy periodically to stay informed about how we protect your privacy."
    ]
  }
];

const PrivacyCard = ({ section }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <MotionBox
      variants={fadeInUp}
      bg={bgColor}
      borderRadius="20px"
      overflow="hidden"
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Box
        p={5}
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        bg={isExpanded ? "red.50" : "transparent"}
        transition="all 0.3s"
      >
        <HStack spacing={3} align="center">
          <Circle
            size="45px"
            bg={isExpanded ? RED : "red.100"}
            color={isExpanded ? "white" : RED}
            transition="all 0.3s"
          >
            <Icon as={section.icon} boxSize={5} />
          </Circle>
          <Box flex={1}>
            <HStack justify="space-between">
              <Heading fontSize="18px" fontWeight="800" color="#1A1A1A">
                {section.title}
              </Heading>
              <Icon
                as={FaChevronDown}
                color={RED}
                transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
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
        <Box p={5} pt={0} borderTop="1px solid" borderColor="gray.100">
          {Array.isArray(section.content) ? (
            <VStack align="stretch" spacing={2}>
              {section.content.map((item, idx) => (
                item.startsWith("•") || item.startsWith("✓") ? (
                  <HStack key={idx} spacing={2} align="start">
                    <Icon as={FaCheckCircle} color={RED} boxSize={3.5} mt={1} />
                    <Text color="gray.600" fontSize="14px" lineHeight="1.6">
                      {item.substring(1)}
                    </Text>
                  </HStack>
                ) : item === "" ? (
                  <Box key={idx} h={2} />
                ) : (
                  <Text key={idx} color="gray.700" fontSize="14px" lineHeight="1.6" fontWeight={item.includes(":") ? "600" : "normal"}>
                    {item}
                  </Text>
                )
              ))}
            </VStack>
          ) : (
            <Text color="gray.600" fontSize="14px" lineHeight="1.7">
              {section.content}
            </Text>
          )}
        </Box>
      </MotionBox>
    </MotionBox>
  );
};

export default function PrivacyPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  const features = [
    { icon: FaLock, title: "Secure Encryption", description: "HTTPS Protected" },
    { icon: FaTrashAlt, title: "Data Deletion", description: "Right to be Forgotten" },
    { icon: FaUserLock, title: "No Sensitive Data", description: "We don't collect payments" },
    { icon: FaClock, title: "GDPR Compliant", description: "Your Rights Protected" },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Re-Conditioned Engine | Professional Engine Reconditioning Services</title>
        <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your personal information when using our professional engine reconditioning services." />
      </Helmet>

      {/* Hero Section */}
      <MotionBox
        bg={`linear-gradient(135deg, ${DARK} 0%, #1E293B 100%)`}
        color="white"
        py={{ base: 16, md: 20 }}
        position="relative"
        overflow="hidden"
        style={{ opacity, scale }}
      >
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          w="300px"
          h="300px"
          bg="radial-gradient(circle, rgba(225,6,0,0.15) 0%, rgba(225,6,0,0) 70%)"
          borderRadius="full"
        />
        <Box
          position="absolute"
          bottom="-120px"
          left="-80px"
          w="280px"
          h="280px"
          bg="radial-gradient(circle, rgba(225,6,0,0.1) 0%, rgba(225,6,0,0) 70%)"
          borderRadius="full"
        />

        <Container maxW="container.xl" position="relative" zIndex={2}>
          <MotionVStack spacing={4} textAlign="center" initial="initial" animate="animate" variants={staggerContainer}>
            <MotionBox variants={fadeInUp}>
              <Badge bg={RED} color="white" px={4} py={1.5} borderRadius="full" fontSize="11px" fontWeight="800">
                ✦ Your Privacy Matters ✦
              </Badge>
            </MotionBox>
            <MotionBox variants={fadeInUp}>
              <Heading fontSize={{ base: "36px", md: "52px" }} fontWeight="900" lineHeight="1.2">
                Privacy Policy
              </Heading>
            </MotionBox>
            <MotionBox variants={fadeInUp}>
              <Text fontSize={{ base: "15px", md: "16px" }} maxW="600px" mx="auto" opacity={0.9}>
                How we protect and manage your personal information
              </Text>
            </MotionBox>
            <MotionBox variants={fadeInUp}>
              <HStack spacing={2} justify="center">
                <Icon as={FaClock} boxSize={3.5} opacity={0.7} />
                <Text fontSize="13px" opacity={0.7}>Last updated: May 21, 2026</Text>
              </HStack>
            </MotionBox>
          </MotionVStack>
        </Container>
      </MotionBox>

      <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
        <MotionVStack align="stretch" spacing={8} initial="initial" whileInView="animate" viewport={{ once: true }} variants={staggerContainer}>

          {/* Key Privacy Features - Responsive Grid */}
          <MotionSimpleGrid
            columns={{ base: 2, md: 4 }}
            spacing={{ base: 3, md: 4 }}
            variants={fadeInUp}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                textAlign="center"
                p={{ base: 3, md: 4 }}
                bg="white"
                borderRadius="16px"
                boxShadow="0 2px 8px rgba(0,0,0,0.04)"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(225,6,0,0.1)",
                  borderBottom: `2px solid ${RED}`
                }}
              >
                <Circle
                  size={{ base: "45px", md: "50px" }}
                  bg="red.50"
                  mx="auto"
                  mb={{ base: 2, md: 3 }}
                >
                  <Icon as={feature.icon} color={RED} boxSize={{ base: 4, md: 5 }} />
                </Circle>
                <Text fontWeight="700" fontSize={{ base: "13px", md: "14px" }} color="#1A1A1A">
                  {feature.title}
                </Text>
                <Text fontSize={{ base: "11px", md: "12px" }} color="gray.500" mt={1}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </MotionSimpleGrid>

          {/* Privacy Cards Grid */}
          <MotionSimpleGrid columns={{ base: 1, md: 2 }} spacing={5} variants={staggerContainer}>
            {sections.map((section) => (
              <MotionBox key={section.id} variants={fadeInUp}>
                <PrivacyCard section={section} />
              </MotionBox>
            ))}
          </MotionSimpleGrid>

          {/* Contact Section */}
          <MotionBox variants={fadeInUp}>
            <Box
              bg="linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)"
              borderRadius="28px"
              p={{ base: 6, md: 8 }}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-40px"
                right="-40px"
                w="150px"
                h="150px"
                bg="radial-gradient(circle, rgba(225,6,0,0.1) 0%, rgba(225,6,0,0) 70%)"
                borderRadius="full"
              />

              <VStack spacing={4} position="relative" zIndex={2}>
                <Circle size={{ base: "60px", md: "70px" }} bg="rgba(225,6,0,0.15)">
                  <Icon as={MdPrivacyTip} color={RED} boxSize={{ base: 7, md: 8 }} />
                </Circle>

                <Heading color="white" fontSize={{ base: "20px", md: "26px" }} fontWeight="800">
                  Questions About Your Privacy?
                </Heading>

                <Text color="gray.300" fontSize={{ base: "13px", md: "14px" }} maxW="500px">
                  Contact our Data Protection Officer for any privacy-related concerns or to exercise your data rights.
                </Text>

                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <Button
                    as="a"
                    href="mailto:privacy@reconditionedengine.co.uk"
                    bg={RED}
                    color="white"
                    size="lg"
                    px={{ base: 5, md: 6 }}
                    h={{ base: "44px", md: "48px" }}
                    fontWeight="700"
                    borderRadius="full"
                    fontSize={{ base: "13px", md: "14px" }}
                    leftIcon={<FaEnvelope />}
                    _hover={{
                      bg: "#c40000",
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    transition="all 0.3s"
                  >
                    Email DPO
                  </Button>

                  <Button
                    as="a"
                    href="tel:+442081334040"
                    variant="outline"
                    color="white"
                    size="lg"
                    px={{ base: 5, md: 6 }}
                    h={{ base: "44px", md: "48px" }}
                    fontWeight="700"
                    borderRadius="full"
                    border="2px solid"
                    borderColor="white"
                    leftIcon={<FaPhoneAlt />}
                    _hover={{
                      bg: "white",
                      color: RED,
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                  >
                    Call Us
                  </Button>
                </HStack>

                <Text color="gray.400" fontSize="12px" pt={2}>
                  Response time: 48-72 hours on working days
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        </MotionVStack>
      </Container>
    </>
  );
}