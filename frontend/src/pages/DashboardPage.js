import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Box,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Icon,
  Flex,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUsers, FiPackage, FiServer, FiBookOpen, FiMessageSquare, FiDollarSign } from 'react-icons/fi';
import UsersModule from '../components/dashboard/UsersModule';
import WebsitesModule from '../components/dashboard/WebsitesModule';
import EnginesModule from '../components/dashboard/EnginesModule';
import BlogsModule from '../components/dashboard/BlogsModule';
import LeadsModule from '../components/dashboard/LeadsModule';
import QuotesModule from '../components/dashboard/QuotesModule';
import MembershipExpiredCard from '../components/dashboard/MembershipExpiredCard';
import ModuleFrame from '../components/dashboard/ModuleFrame';

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState('overview');
  const [showExpiredNotice, setShowExpiredNotice] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const validRoles = ['Super Admin', 'Website Admin', 'Sales Manager', 'Viewer'];
  const role = validRoles.includes(user.role) ? user.role : 'Super Admin';
  
  const accentColor = "#D90404";
  const darkBlue = "#0F172A";

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue(darkBlue, "white");
  const secTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const allModules = [
    { id: 'overview', name: 'Overview', icon: FiServer, component: () => (
      <VStack spacing={6} w="full">
        {showExpiredNotice && <MembershipExpiredCard />}
        {!showExpiredNotice && (
          <ModuleFrame 
            icon={FiServer}
            title={`Welcome ${user.name || 'Admin'}`}
            description={`System Role: ${role} | Business: ${user.businessName || 'N/A'}`}
          >
            <Box textAlign="center" py={10}>
              <Text color={secTextColor} fontSize="18px" fontWeight="600">
                You are currently viewing the system overview as a {role}. 
                {role === 'Super Admin' ? ' You have full diagnostic access across all tenants.' : ' You are managing access for your assigned website.'}
              </Text>
            </Box>
          </ModuleFrame>
        )}
      </VStack>
    ) },
    { id: 'users', name: 'Users / Admins', icon: FiUsers, component: UsersModule, roles: ['Super Admin'] },
    { id: 'websites', name: 'Websites / Tenants', icon: FiServer, component: WebsitesModule, roles: ['Super Admin'] },
    { id: 'engines', name: 'Products / Engines', icon: FiPackage, component: EnginesModule, roles: ['Super Admin', 'Website Admin', 'Viewer'] },
    { id: 'blogs', name: 'Blogs / Content', icon: FiBookOpen, component: BlogsModule, roles: ['Super Admin', 'Website Admin', 'Viewer'] },
    { id: 'leads', name: 'Leads / Routing', icon: FiMessageSquare, component: LeadsModule, roles: ['Super Admin', 'Website Admin', 'Sales Manager', 'Viewer'] },
    { id: 'quotes', name: 'Quotes / Sales', icon: FiDollarSign, component: QuotesModule, roles: ['Super Admin', 'Website Admin', 'Sales Manager', 'Viewer'] },
  ];

  const filteredModules = allModules.filter(m => !m.roles || m.roles.includes(role));
  
  const ActiveModule = filteredModules.find(m => m.id === activeModule) || filteredModules[0];
  const ActiveComponent = ActiveModule.component;

  const stats = [
    { label: 'Total Websites', value: '12', change: '+2', color: "blue.500" },
    { label: 'Total Products', value: '4,567', change: '+5%', color: "orange.500" },
    { label: 'Total Leads', value: '890', change: '+18%', color: "purple.500" },
    { label: 'Active Admins', value: '24', change: '+1', color: "green.500" },
    { label: 'Revenue', value: '$840K', change: '+22%', color: accentColor },
  ];

  // Blinking Animation Keyframes
  const blinkStyles = `
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.4; transform: scale(1.02); }
      100% { opacity: 1; }
    }
  `;

  return (
    <Box bg={bgColor} minH="100vh">
      <style>{blinkStyles}</style>
      <Container maxW="container.xl" py={8}>
        <Flex justify="space-between" align="center" mb={8} direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack spacing={4}>
            <Box bg={accentColor} w="4px" h="32px" borderRadius="full" />
            <Heading fontSize="36px" color={textColor} letterSpacing="-0.5px">Dashboard Overview</Heading>
          </HStack>
          <Button
            bg={accentColor}
            color="white"
            variant="solid"
            size="md"
            onClick={() => {
              setActiveModule('overview');
              setShowExpiredNotice(!showExpiredNotice);
            }}
            animation="blink 1.5s infinite"
            boxShadow={`0 10px 20px ${accentColor}40`}
            fontWeight="800"
            borderRadius="full"
            px={8}
            fontSize="16px"
            _hover={{ bg: "#c74848", transform: "translateY(-2px)" }}
            _active={{ bg: "#a53a3a" }}
          >
            {showExpiredNotice ? '✕ CLOSE ALERT' : '⚠️ MEMBERSHIP EXPIRED'}
          </Button>
        </Flex>

        {/* Role Context Banner */}
        <Flex
          mb={6}
          p={3}
          bg={cardBg}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={3}
        >
          <HStack spacing={3}>
            <Badge colorScheme={role === 'Super Admin' ? 'red' : role === 'Website Admin' ? 'purple' : role === 'Sales Manager' ? 'blue' : 'gray'} fontSize="13px" px={3} py={1} borderRadius="full">
              {role}
            </Badge>
            <Text fontSize="14px" fontWeight="700" color={textColor}>{user.name || 'User'}</Text>
            <Text fontSize="13px" color="gray.500">·</Text>
            <Text fontSize="13px" color="gray.500">{user.businessName || 'N/A'}</Text>
          </HStack>
          <HStack spacing={2}>
            <Badge colorScheme="teal" fontSize="12px" px={3} borderRadius="full">Tenant: {user.websiteId || 'N/A'}</Badge>
            <Badge colorScheme="orange" fontSize="12px" px={3} borderRadius="full">Session Active</Badge>
          </HStack>
        </Flex>
        
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={4} mb={10}>
          {stats.map((stat, index) => (
            <Card key={index} bg={cardBg} border="none" borderRadius="xl" overflow="hidden" boxShadow="md" transition="all 0.3s" _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}>
              <CardBody py={4} px={5}>
                <Stat>
                  <StatLabel fontSize="12px" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="1px">{stat.label}</StatLabel>
                  <StatNumber fontSize="20px" fontWeight="900" color={textColor} mt={1}>{stat.value}</StatNumber>
                  <Box mt={1} display="flex" alignItems="center">
                    <Badge colorScheme="green" fontSize="12px" borderRadius="full" px={2}>{stat.change}</Badge>
                    <Text as="span" fontSize="12px" color="gray.400" ml={2}>growth</Text>
                  </Box>
                  <Box position="absolute" top="-15px" right="-15px" bg={stat.color} opacity={0.05} w="50px" h="50px" borderRadius="full" />
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Modules Navigation */}
        <Grid templateColumns={{ base: '1fr', lg: '280px 1fr' }} gap={8}>
          <GridItem>
            <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="lg" border="1px solid" borderColor={borderColor}>
              <VStack align="stretch" spacing={1}>
                <Text fontSize="12px" fontWeight="900" color="gray.400" mb={3} px={3} textTransform="uppercase" letterSpacing="2px">
                  SYSTEM MODULES
                </Text>
                {filteredModules.map((module) => {
                  const isActive = activeModule === module.id;
                  return (
                    <Button
                      key={module.id}
                      variant={isActive ? 'solid' : 'ghost'}
                      bg={isActive ? (isActive && bgColor === "gray.900" ? "blue.700" : darkBlue) : "transparent"}
                      color={isActive ? "white" : secTextColor}
                      justifyContent="flex-start"
                      leftIcon={<Icon as={module.icon} />}
                      onClick={() => {
                        setActiveModule(module.id);
                        if (module.id !== 'overview') setShowExpiredNotice(false);
                      }}
                      fontSize="14px"
                      fontWeight="700"
                      h="48px"
                      borderRadius="lg"
                      px={4}
                      _hover={{ 
                        bg: isActive ? (isActive && bgColor === "gray.900" ? "blue.800" : darkBlue) : "gray.50",
                        color: isActive ? "white" : accentColor,
                        transform: "translateX(3px)"
                      }}
                      transition="all 0.2s"
                    >
                      {module.name}
                    </Button>
                  );
                })}
              </VStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box minH="600px" transition="all 0.4s">
              <ActiveComponent />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}