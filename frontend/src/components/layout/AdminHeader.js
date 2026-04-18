import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  IconButton,
  Container,
  Icon,
  useColorMode,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPowerOff, FaMoon, FaSun } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Clock from '../common/Clock';

export default function AdminHeader({ user, onLogout }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const accentColor = "#D90404";

  const headerBg = useColorModeValue("#E2E8F0", "gray.800");
  const subNavBg = useColorModeValue("#F1F5F9", "gray.900");
  const textColor = useColorModeValue("blue.900", "white");
  const linkColor = useColorModeValue("blue.900", "blue.200");

  return (
    <Box as="nav" width="100%">
      {/* ==================== MAIN ADMIN HEADER ==================== */}
      <Box bg={headerBg} borderBottom="1px solid" borderColor={useColorModeValue("gray.300", "gray.700")} py={1} px={4}>
        <Flex align="center" justify="space-between">
          
          {/* Left Area: Logo & Clock */}
          <HStack spacing={4}>
            <Link to="/dashboard">
              <HStack spacing={3}>
                <Box h="40px">
                  <img
                    src="/logo_engine.PNG"
                    alt="All Engine 4 You Logo"
                    style={{
                      height: "100%",
                      objectFit: "contain"
                    }}
                  />
                </Box>
                <VStack align="flex-start" spacing={0}>
                  <Text 
                    fontSize="20px" 
                    fontWeight="900" 
                    color={useColorModeValue("blue.900", "white")} 
                    lineHeight="1"
                    letterSpacing="-0.5px"
                  >
                    All Engine <span style={{ color: '#D90404', fontWeight: '800' }}>4 You</span>
                  </Text>
                  <Text fontSize="12px" color="gray.500" fontWeight="700" mt="1px" textTransform="uppercase">
                    {user?.businessName || 'Industrial Marketplace'}
                  </Text>
                </VStack>
              </HStack>
            </Link>

            {/* Clock Section */}
            <Box pl={4}>
              <Clock />
            </Box>
          </HStack>

          {/* Middle: User Info */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <HStack bg={useColorModeValue("white", "gray.700")} px={3} py={1} borderRadius="full" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>
              <Text fontSize="12px" fontWeight="700" color="green.600">
                {user?.name || 'User'}
              </Text>
              <IconButton
                icon={<FaPowerOff />}
                aria-label="Logout"
                size="xs"
                variant="ghost"
                color="red.500"
                onClick={onLogout}
                _hover={{ bg: 'red.50' }}
              />
              <Text fontSize="12px" fontWeight="800" color="red.600" ml={1}>
                (0) Days Left
              </Text>
            </HStack>
          </HStack>

          {/* Right: Tools & Profile */}
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              borderRadius="full"
              aria-label="Toggle Dark Mode"
            />
            
            <HStack spacing={4} fontSize="16px" fontWeight="700" color={textColor}>
              <Link to="/employee">Employee</Link>
              <Link to="/create-quote" style={{ color: '#D90404' }}>Create Own Quote</Link>
              <Link to="/account">My Account</Link>
            </HStack>
          </HStack>
        </Flex>
      </Box>

      {/* ==================== QUICK ACTIONS SUB-NAV ==================== */}
      {/* <Box bg={subNavBg} py={3} borderBottom="1px solid" borderColor={useColorModeValue("gray.200", "gray.700")}>
        <Container maxW="container.xl">
          <HStack spacing={3} justify="center" wrap="wrap">
            <Button 
              size="sm" 
              variant="outline" 
              bg={useColorModeValue("white", "gray.800")} 
              color={useColorModeValue("gray.800", "white")}
              fontWeight="600"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              onClick={() => navigate('/dashboard?tab=edit')}
              fontSize="16px"
            >
              Edit Account
            </Button>
            <Button 
              size="sm" 
              bg="#A7F3D0" 
              color="gray.800" 
              fontWeight="700"
              _hover={{ bg: '#6EE7B7' }}
              onClick={() => navigate('/dashboard?tab=payments')}
              fontSize="16px"
            >
              Payments
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              bg={useColorModeValue("white", "gray.800")} 
              color={useColorModeValue("gray.800", "white")}
              fontWeight="600"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              onClick={() => navigate('/dashboard?tab=settings')}
              fontSize="16px"
            >
              Quote Settings
            </Button>
            <Button 
              size="sm" 
              bg="#FEF08A" 
              color="gray.800" 
              fontWeight="700"
              _hover={{ bg: '#FDE047' }}
              onClick={() => navigate('/dashboard?tab=quotes')}
              fontSize="16px"
            >
              My Quotes
            </Button>
          </HStack>
        </Container>
      </Box> */}
    </Box>
  );
}
