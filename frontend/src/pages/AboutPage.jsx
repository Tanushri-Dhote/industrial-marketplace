import React from 'react';
import { 
  Container, 
  Heading, 
  Text, 
  VStack, 
  SimpleGrid, 
  Box, 
  Image, 
  List, 
  ListItem, 
  ListIcon,
  Flex,
  Badge,
  Divider,
  useColorModeValue,
  Grid,
  GridItem,
  Icon,
  HStack,
  Button,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircleIcon, 
  StarIcon,
  ViewIcon,
  TimeIcon,
  SearchIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import { 
  FaIndustry, 
  FaGlobe, 
  FaUsers, 
  FaTruck, 
  FaShieldAlt,
  FaHandshake,
  FaChartLine,
  FaPoundSign,
  FaClock,
  FaThumbsUp,
  FaUserCheck,
} from 'react-icons/fa';
import { MdCompareArrows, MdMoneyOff, MdSpeed } from 'react-icons/md';

export default function AboutPage() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const accentColor = "#D90404";

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
        <title>About  All Engine 4 You - UK's First Engine Price Comparison</title>
        <meta name="description" content="UK's first price comparison website focused on comparing used and reconditioned engines. Get free quotes from trusted suppliers and save money on car parts." />
      </Helmet>

      {/* Hero Section */}
      <Box bg="#0F172A" color="white" py={16} mb={12}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} alignItems="center">
            <GridItem>
              <VStack align="start" spacing={4}>
                <Badge bg={accentColor} color="white" px={3} py={1} borderRadius="full" fontSize="12px">
                  UK's First Price Comparison
                </Badge>
                <Heading fontSize="36px" lineHeight="1.2">
                  About  All Engine 4 You
                </Heading>
                <Text fontSize="16px" opacity={0.9} lineHeight="1.6">
                  We are UK's first price comparison website that is focused on comparing used 
                  and reconditioned engines and ancillaries. Once you enter your reg number, 
                  we check our database and give you the cheapest online quotes in just a few clicks.
                </Text>
                <HStack spacing={4} pt={2}>
                  <HStack>
                    <Icon as={StarIcon} boxSize={4} />
                    <Text fontSize="14px">4.9 Rating</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaThumbsUp} boxSize={4} />
                    <Text fontSize="14px">Trusted by Thousands</Text>
                  </HStack>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem display={{ base: 'none', lg: 'block' }}>
              <Box
                bg={accentColor}
                borderRadius="lg"
                p={8}
                textAlign="center">
                <Icon as={MdCompareArrows} boxSize={16} color="white" mb={3} />
                <Text fontSize="20px" fontWeight="bold">Compare & Save</Text>
                <Text fontSize="14px" mt={2}>Get the best deals on car engines</Text>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* How  All Engine 4 You Helps */}
        <Box mb={16}>
          <VStack spacing={3} mb={8} textAlign="center">
            <Badge bg="orange.100" color={accentColor} px={3} py={1} borderRadius="full" fontSize="12px">
              Save Money
            </Badge>
            <Heading fontSize="28px">How can  All Engine 4 You help me save on my car parts price comparison?</Heading>
            <Text fontSize="16px" color="gray.600" maxW="3xl" lineHeight="1.6">
              Get multiple quotes from carefully vetted suppliers and get your engines and ancillaries 
              within no time. Choose  All Engine 4 You as we only have trusted suppliers who don't compromise 
              on quality. We offer an unbeatable engine and ancillaries price comparison service where 
              you pay the cheapest price. Get free online quotes in a few clicks. Compare prices and 
              buy with confidence with  All Engine 4 You.
            </Text>
          </VStack>
        </Box>

        {/* How we work? */}
        <Box mb={16}>
          <VStack spacing={3} mb={8} textAlign="center">
            <Badge bg="orange.100" color={accentColor} px={3} py={1} borderRadius="full" fontSize="12px">
              Simple Process
            </Badge>
            <Heading fontSize="28px">How we work?</Heading>
            <Text fontSize="16px" color="gray.600" maxW="2xl">
              Being the UK's first quality engine price comparison website, we always focus on comparing 
              reconditioned, rebuilt and used engine prices for you. In just a matter of minutes or less 
              you get the best deal from trusted engine suppliers.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box textAlign="center" p={6}>
              <Box
                w="60px"
                h="60px"
                bg="orange.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}>
                <Icon as={SearchIcon} boxSize={6} color={accentColor} />
              </Box>
              <Heading fontSize="18px" mb={2}>Enter Reg Number</Heading>
              <Text fontSize="14px" color="gray.600">Enter your vehicle registration number</Text>
            </Box>

            <Box textAlign="center" p={6}>
              <Box
                w="60px"
                h="60px"
                bg="orange.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}>
                <Icon as={MdCompareArrows} boxSize={6} color={accentColor} />
              </Box>
              <Heading fontSize="18px" mb={2}>Compare Quotes</Heading>
              <Text fontSize="14px" color="gray.600">Get multiple quotes from trusted suppliers</Text>
            </Box>

            <Box textAlign="center" p={6}>
              <Box
                w="60px"
                h="60px"
                bg="orange.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}>
                <Icon as={FaPoundSign} boxSize={6} color={accentColor} />
              </Box>
              <Heading fontSize="18px" mb={2}>Best Price</Heading>
              <Text fontSize="14px" color="gray.600">Choose the best deal that suits you</Text>
            </Box>

            <Box textAlign="center" p={6}>
              <Box
                w="60px"
                h="60px"
                bg="orange.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}>
                <Icon as={FaTruck} boxSize={6} color={accentColor} />
              </Box>
              <Heading fontSize="18px" mb={2}>Get Delivery</Heading>
              <Text fontSize="14px" color="gray.600">Fast delivery across the UK</Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Features Section */}
        <Box mb={16}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {features.map((feature, index) => (
              <Flex
                key={index}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg', borderColor: accentColor }}
                transition="all 0.3s">
                <Box
                  bg="orange.100"
                  p={3}
                  borderRadius="full"
                  mr={4}
                  h="fit-content">
                  <Icon as={feature.icon} boxSize={6} color={accentColor} />
                </Box>
                <Box>
                  <Heading fontSize="18px" mb={2}>{feature.title}</Heading>
                  <Text fontSize="14px" color="gray.600">{feature.description}</Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Save Time, Save Money Section */}
        <Box mb={16}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12}>
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Badge bg="orange.100" color={accentColor} px={3} py={1} borderRadius="full" fontSize="12px" width="fit-content">
                  Save Time, Save Money
                </Badge>
                <Heading fontSize="28px">Why Choose  All Engine 4 You?</Heading>
                <Text fontSize="16px" lineHeight="1.6">
                  We always focus on attracting customers by offering an exclusive engine comparison 
                  service at  All Engine 4 You. Our engine enquiry form is simple and highly responsive. 
                  We do not waste your time. In fact, we often provide quotes within a minute.
                </Text>
                <Text fontSize="16px" lineHeight="1.6">
                   All Engine 4 You is famous all across the UK because our engine suppliers always offer 
                  the cheapest rates for all types of engines. You will get a range of options such 
                  as supply, reconditioned, new engine, fitting, recovery and delivery.
                </Text>
                <SimpleGrid columns={2} spacing={3} pt={2}>
                  {benefits.map((benefit, index) => (
                    <HStack key={index}>
                      <CheckCircleIcon color={accentColor} boxSize={4} />
                      <Text fontSize="14px">{benefit}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </GridItem>
            <GridItem>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}>
                <Icon as={MdSpeed} boxSize={10} color={accentColor} mb={4} />
                <Heading fontSize="20px" mb={3}>Quick Quotes Within Minutes</Heading>
                <Text fontSize="15px" mb={4}>
                  Our engine enquiry form is simple and highly responsive. We often provide quotes 
                  within a minute of your request.
                </Text>
                <Divider my={4} />
                <Icon as={FaShieldAlt} boxSize={10} color={accentColor} mb={4} />
                <Heading fontSize="20px" mb={3}>100% Trusted Suppliers</Heading>
                <Text fontSize="15px">
                  All engine suppliers in our network have been selected after strict scrutiny and 
                  we regularly get customer feedback on our members.
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* Statistics Section */}
        <Box mb={16}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {stats.map((stat, index) => (
              <Box
                key={index}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                textAlign="center"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.3s">
                <Icon as={stat.icon} boxSize={8} color={accentColor} mb={3} />
                <Heading fontSize="32px" color={accentColor} mb={2}>
                  {stat.number}
                </Heading>
                <Text fontSize="14px" fontWeight="500">{stat.label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Why  All Engine 4 You is the best */}
        <Box mb={16}>
          <Box
            bg="linear-gradient(135deg, #0F172A 0%, #1E2A45 100%)"
            color="white"
            p={8}
            borderRadius="lg"
            textAlign="center">
            <VStack spacing={4}>
              <Icon as={FaHandshake} boxSize={12} color={accentColor} />
              <Heading fontSize="28px">Why  All Engine 4 You is the best?</Heading>
              <Text fontSize="16px" maxW="3xl" lineHeight="1.6">
                 All Engine 4 You is the name of Trust. We are the first engine price comparison site in UK 
                that helps you find quality reconditioned and used engines from our verified and trusted 
                engine suppliers. With our devotion to work and years of experience, we have optimized 
                the formula to give the best engine price comparisons to our customers. Simply by sitting 
                at home, you can take advantage of our hassle and stress free service. Save time, money 
                and get the right engine for your car.
              </Text>
              <Button
                as="a"
                href="/search"
                bg={accentColor}
                color="white"
                size="lg"
                fontSize="16px"
                mt={4}
                _hover={{ bg: "#e55a00", transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s">
                Get Free Quote Now
              </Button>
            </VStack>
          </Box>
        </Box>
      </Container>
    </>
  );
}