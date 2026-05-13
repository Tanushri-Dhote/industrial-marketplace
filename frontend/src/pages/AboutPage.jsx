import { Box, Container, Flex, Heading, Icon, Text, SimpleGrid, VStack, Grid, GridItem, Badge, useColorModeValue, HStack, Divider, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaIndustry, FaHandshake, FaUsers, FaClock, FaShieldAlt, FaChartLine, FaUserCheck, FaThumbsUp, FaPoundSign, FaTruck } from 'react-icons/fa';
import { StarIcon } from '@chakra-ui/icons';
import { MdMoneyOff, MdCompareArrows } from 'react-icons/md';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionSimpleGrid = motion(SimpleGrid);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  viewport: { once: true }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

export default function AboutPage() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = "#D90404";
  const navigate = useNavigate();

  const features = [
    { icon: MdMoneyOff, title: 'Free Price Quotes', description: 'Our services are completely free for our users. We do not charge a penny for you to search a replacement engine for your vehicle.' },
    { icon: FaChartLine, title: 'Highly Competitive Prices', description: 'Now you can compare engine prices and deals from various engine suppliers that allows you to make an informed decision on your purchase.' },
    { icon: FaUsers, title: 'Thousands of Satisfied Customers', description: 'Thousands of customers have found a replacement engine using our prices comparison services.' },
    { icon: FaUserCheck, title: 'Reliable & Trusted Suppliers', description: 'All the engine suppliers in our network have been selected after strict scrutiny and we regularly get customer feedback on our members.' },
  ];

  const benefits = [
    'Supply & fitting options',
    'Reconditioned engines',
    'New engines available',
    'Recovery service',
    'Delivery across UK',
    'Warranty included',
  ];

  const stats = [
    { number: '500+', label: 'Engines', icon: FaIndustry },
    { number: '100+', label: 'Trusted Suppliers', icon: FaHandshake },
    { number: '50K+', label: 'Happy Customers', icon: FaUsers },
    { number: '24/7', label: 'Customer Support', icon: FaClock },
  ];

  return (
    <>
      <Helmet>
        <title>About  Re-Conditioned Engine - UK's First Engine </title>
        <meta name="description" content="UK's first  website focused on quote service used and reconditioned engines. Get free quotes from trusted suppliers and save money on car parts." />
      </Helmet>

      {/* Hero Section */}
      <Box bg="#0F172A" color="white" py={16} mb={10} position="relative" overflow="hidden">
        <Box position="absolute" top="-10%" right="-5%" w="400px" h="400px" bg={accentColor} filter="blur(150px)" opacity={0.1} />
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
            <GridItem>
              <MotionVStack align="start" spacing={5} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Badge bg={accentColor} color="white" px={3} py={1} borderRadius="full" fontSize="10px" fontWeight="800" letterSpacing="1px">
                  UK'S FIRST WEBSITE focused on premium reconditioned
                </Badge>
                <Heading fontSize={{ base: "36px", md: "48px" }} lineHeight="1.1" fontWeight="900">
                  Precision Engine, <br />
                  <Text as="span" color={accentColor}>Trusted</Text> Delivery.
                </Heading>
                <Text fontSize="16px" opacity={0.8} lineHeight="1.6" maxW="lg">
                  We are UK's first website focused on premium reconditioned engines.
                  Get the cheapest online quotes in just a few clicks.
                </Text>
                <HStack spacing={6} pt={2}>
                  <HStack>
                    <Icon as={StarIcon} boxSize={4} color="yellow.400" />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="800" fontSize="14px">4.9/5</Text>
                      <Text fontSize="11px" opacity={0.6}>User Rating</Text>
                    </VStack>
                  </HStack>
                  <Divider orientation="vertical" h="30px" borderColor="whiteAlpha.300" />
                  <HStack>
                    <Icon as={FaThumbsUp} boxSize={4} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="800" fontSize="14px">Trusted</Text>
                      <Text fontSize="11px" opacity={0.6}>By Thousands</Text>
                    </VStack>
                  </HStack>
                </HStack>
              </MotionVStack>
            </GridItem>
            <GridItem display={{ base: 'none', lg: 'block' }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                bg="whiteAlpha.100"
                backdropFilter="blur(10px)"
                borderRadius="3xl"
                p={12}
                border="1px solid"
                borderColor="whiteAlpha.200"
                textAlign="center">
                <Icon as={MdCompareArrows} boxSize={20} color={accentColor} mb={6} />
                <Heading fontSize="28px" mb={3}>Quote & Save</Heading>
                <Text fontSize="16px" opacity={0.7}>Get the best deals on car engines instantly</Text>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* How we work? */}
        <Box mb={20}>
          <VStack spacing={3} mb={12} textAlign="center">
            <Badge bg="orange.100" color={accentColor} px={3} py={1} borderRadius="full" fontSize="10px" fontWeight="800">
              SIMPLE PROCESS
            </Badge>
            <Heading fontSize={{ base: "28px", md: "36px" }} fontWeight="900">How we work?</Heading>
            <Text fontSize="16px" color="gray.600" maxW="2xl">
              Get the best deal from trusted engine suppliers in minutes.
            </Text>
          </VStack>

          <MotionSimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} variants={staggerContainer} initial="initial" whileInView="whileInView">
            {[
              { icon: SearchIcon, title: 'Enter Reg', desc: 'Enter your vehicle registration' },
              { icon: MdCompareArrows, title: 'Quotes', desc: 'Get multiple quotes instantly' },
              { icon: FaPoundSign, title: 'Best Price', desc: 'Choose the deal that suits you' },
              { icon: FaTruck, title: 'Delivery', desc: 'Fast delivery across the UK' },
            ].map((step, idx) => (
              <MotionVStack key={idx} spacing={4} variants={fadeInUp} whileHover={{ y: -10 }}>
                <Box
                  w="64px"
                  h="64px"
                  bg="white"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="lg"
                  mb={2}>
                  <Icon as={step.icon} boxSize={6} color={accentColor} />
                </Box>
                <Heading fontSize="18px" fontWeight="800">{step.title}</Heading>
                <Text fontSize="14px" color="gray.500" textAlign="center">{step.desc}</Text>
              </MotionVStack>
            ))}
          </MotionSimpleGrid>
        </Box>

        {/* Features Section */}
        <Box mb={20}>
          <MotionSimpleGrid columns={{ base: 1, md: 2 }} spacing={6} variants={staggerContainer} initial="initial" whileInView="whileInView">
            {features.map((feature, index) => (
              <MotionFlex
                key={index}
                bg={bgColor}
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
                variants={fadeInUp}
                whileHover={{ y: -6, borderColor: accentColor, boxShadow: 'xl' }}
                transition="all 0.3s">
                <Box
                  bg="orange.50"
                  p={3.5}
                  borderRadius="lg"
                  mr={5}
                  h="fit-content">
                  <Icon as={feature.icon} boxSize={6} color={accentColor} />
                </Box>
                <Box>
                  <Heading fontSize="18px" mb={2} fontWeight="800">{feature.title}</Heading>
                  <Text fontSize="14px" color="gray.600" lineHeight="1.6">{feature.description}</Text>
                </Box>
              </MotionFlex>
            ))}
          </MotionSimpleGrid>
        </Box>

        {/* Statistics Section */}
        <Box mb={20}>
          <MotionSimpleGrid columns={{ base: 2, md: 4 }} spacing={6} variants={staggerContainer} initial="initial" whileInView="whileInView">
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                bg="white"
                p={8}
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: 'xl' }}>
                <Icon as={stat.icon} boxSize={8} color={accentColor} mb={4} />
                <Heading fontSize="36px" fontWeight="900" color={accentColor} mb={1}>
                  {stat.number}
                </Heading>
                <Text fontSize="14px" fontWeight="700" color="gray.500" letterSpacing="1px">{stat.label}</Text>
              </MotionBox>
            ))}
          </MotionSimpleGrid>
        </Box>

        {/* CTA Section */}
        <MotionBox
          mb={12}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          bg="linear-gradient(135deg, #0F172A 0%, #1E2A45 100%)"
          color="white"
          p={{ base: 8, md: 12 }}
          borderRadius="2xl"
          textAlign="center"
          position="relative"
          overflow="hidden">
          <Box position="absolute" bottom="-20%" left="-10%" w="300px" h="300px" bg={accentColor} filter="blur(100px)" opacity={0.1} />
          <VStack spacing={6}>
            <Icon as={FaHandshake} boxSize={12} color={accentColor} />
            <Heading fontSize={{ base: "28px", md: "40px" }} fontWeight="900">Why  Re-Conditioned Engine is the best?</Heading>
            <Text fontSize="16px" maxW="3xl" lineHeight="1.8" opacity={0.8}>
              Re-Conditioned Engine is the name of Trust. We find quality reconditioned and used engines
              from verified suppliers. Save time, money and get the right engine for your car today.
            </Text>
            <Button
              onClick={() => navigate("/call-seller", { state: { vrm: "" } })}
              bg={accentColor}
              color="white"
              size="lg"
              px={10}
              h="56px"
              fontSize="16px"
              fontWeight="800"
              borderRadius="lg"
              _hover={{
                bg: "#B70303",
                transform: "translateY(-4px)",
                boxShadow: "0 20px 40px rgba(217, 4, 4, 0.3)",
              }}
              transition="all 0.3s"
            >
              Get Free Quote Now
            </Button>
          </VStack>
        </MotionBox>
      </Container>
    </>
  );
}
