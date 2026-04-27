import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Collapse,
  useDisclosure,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {
  FaUserAlt,
  FaSignOutAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaBuilding,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { useToast } from "@chakra-ui/react";

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const toast = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const accentColor = "#D90404";

  // Scroll Effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;

          setScrolled((prev) => {
            if (!prev && y > 40) return true;   // activate
            if (prev && y < 10) return false;   // deactivate
            return prev;
          });

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserData(user);
        setUserName(user.name || user.email?.split('@')[0] || 'User');
      } catch (e) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/', { replace: true });
  };

  const handleRegSubmit = () => {
    if (!regNumber.trim()) {
      return toast({
        title: "Enter registration number",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    }

    const cleanedVRM = regNumber.replace(/\s+/g, "").toUpperCase();

    const ukVrmRegex =
      /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;

    if (!ukVrmRegex.test(cleanedVRM)) {
      return toast({
        title: "Invalid Registration",
        description: "Enter valid UK number plate",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    // clear input
    setRegNumber("");
    navigate("/call-seller", {
      state: {
        vrm: cleanedVRM,
        category: "",
      },
    });
  };

  if (isLoggedIn) {
    return <AdminHeader user={userData} onLogout={handleLogout} />;
  }

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      transform="translateZ(0)"
      backfaceVisibility="hidden"
    >


      {/* ==================== MAIN HEADER ==================== */}
      <Box
        bg="white"
        boxShadow={scrolled ? "0 4px 25px rgba(0,0,0,0.15)" : "0 2px 15px rgba(0,0,0,0.08)"}
        borderBottom="1px solid"
        borderColor="gray.100"
        py={scrolled ? 2 : 4}
        transition="padding 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease"
        willChange="padding, box-shadow"
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <Flex align="center" justify="space-between" gap={4}>

            {/* Logo with Box */}
            <Link to="/">
              <HStack spacing={2}>
                <Box
                  h={scrolled ? "32px" : "50px"}
                  transition="height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  willChange="height"
                >
                  <img
                    src="/logo_engine.PNG"
                    alt="All Engines Logo"
                    style={{
                      height: "100%",
                      objectFit: "contain",
                      display: "block"
                    }}
                  />
                </Box>

              </HStack>
            </Link>

            {/* Scrolled State: Registration Input + GO Button */}
            {scrolled ? (
              <Flex flex="1" maxW="480px" mx="auto">
                <InputGroup size="md">

                  <Input

                    placeholder="Enter Registration Number (e.g. AB12 CDE)"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                    textTransform="uppercase"
                    bg="gray.50"
                    borderColor="gray.300"
                    height="42px"
                    fontSize="14px"
                    _placeholder={{ textTransform: "none" }}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 3px rgba(255,107,0,0.15)`
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleRegSubmit()}
                  />
                  <InputRightElement width="70px" h="42px" pointerEvents="auto">
                    <Button
                      onClick={handleRegSubmit}
                      bg={accentColor}
                      color="white"
                      h="34px"
                      w="60px"
                      borderLeftRadius="0"
                      _hover={{ bg: "#B70303" }}
                      fontWeight="600"
                      fontSize="13px"
                    >
                      GO
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            ) : (
              /* Normal State: Navigation Links */
              <HStack
                spacing={{ base: 5, lg: 8 }}
                display={{ base: 'none', lg: 'flex' }}
                fontSize="15px"
                fontWeight="500"
              >
                <ChakraLink
                  as={Link}
                  to="/"
                  color={location.pathname === "/" ? accentColor : "inherit"}
                  borderBottom={location.pathname === "/" ? `2px solid ${accentColor}` : "none"}
                  pb={1}
                  _hover={{ color: accentColor, textDecoration: "none" }}
                >
                  Home
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/car-engines"
                  color={location.pathname === "/car-engines" ? accentColor : "inherit"}
                  borderBottom={location.pathname === "/car-engines" ? `2px solid ${accentColor}` : "none"}
                  pb={1}
                  _hover={{ color: accentColor, textDecoration: "none" }}
                >
                  Car Engines
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/used-engines"
                  color={location.pathname === "/used-engines" ? accentColor : "inherit"}
                  borderBottom={location.pathname === "/used-engines" ? `2px solid ${accentColor}` : "none"}
                  pb={1}
                  _hover={{ color: accentColor, textDecoration: "none" }}
                >
                  Used Engines
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/reconditioned-engines"
                  color={location.pathname === "/reconditioned-engines" ? accentColor : "inherit"}
                  borderBottom={location.pathname === "/reconditioned-engines" ? `2px solid ${accentColor}` : "none"}
                  pb={1}
                  _hover={{ color: accentColor, textDecoration: "none" }}
                >
                  Reconditioned Engines
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/gearboxes"
                  color={location.pathname === "/gearboxes" ? accentColor : "inherit"}
                  borderBottom={location.pathname === "/gearboxes" ? `2px solid ${accentColor}` : "none"}
                  pb={1}
                  _hover={{ color: accentColor, textDecoration: "none" }}
                >
                  Gearboxes
                </ChakraLink>
              </HStack>
            )}

            {/* Right Side */}
            <Flex align="center" gap={3}>
              {!scrolled && !isLoggedIn && (
                <Button
                  as={Link}
                  to="/login"
                  bg="#001F3F"
                  color="white"
                  _hover={{ bg: "#003366", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  fontWeight="600"
                  size="md"
                  height="40px"
                  px={6}
                  fontSize="14px"
                  borderRadius="full"
                  display={{ base: 'none', md: 'flex' }}
                >
                  Supplier Login
                </Button>
              )}

              {/* {!scrolled && !isLoggedIn && (
                <Button
                  as={Link}
                  to="/register"
                  variant="outline"
                  borderColor={accentColor}
                  color={accentColor}
                  _hover={{ bg: "orange.50" }}
                  fontWeight="600"
                  size="md"
                  height="40px"
                  fontSize="14px"
                  display={{ base: 'none', md: 'flex' }}
                >
                  Register
                </Button>
              )} */}

              {isLoggedIn && (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    px={2}
                    borderRadius="full"
                    _hover={{ bg: 'orange.50' }}
                  >
                    <HStack spacing={2}>
                      <Avatar size="sm" name={userName} bg={accentColor} color="white" />
                      <Text fontSize="14px" fontWeight="600" display={{ base: 'none', md: 'block' }}>
                        {userName.split(' ')[0]}
                      </Text>
                    </HStack>
                  </MenuButton>
                  <MenuList shadow="xl" borderRadius="xl" py={3} minW="200px">
                    <Box px={4} py={2}>
                      <Text fontWeight="600" fontSize="14px">{userName}</Text>
                    </Box>
                    <MenuDivider />
                    <MenuItem fontSize="14px" onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                    <MenuDivider />
                    <MenuItem fontSize="14px" color="red.500" onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}

              {/* Mobile Hamburger */}
              <IconButton
                display={{ base: 'flex', lg: 'none' }}
                onClick={onToggle}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                variant="ghost"
                aria-label="Toggle Navigation"
                fontSize="20px"
              />
            </Flex>
          </Flex>

          {/* Mobile Navigation - Only show when not scrolled */}
          {!scrolled && (
            <Collapse in={isOpen} animateOpacity>
              <Box pt={4} pb={6} borderTop="1px solid" borderColor="gray.100">
                <Stack spacing={2}>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    as={Link}
                    to="/"
                    onClick={onToggle}
                    fontSize="14px"
                    color={location.pathname === "/" ? accentColor : "inherit"}
                    bg={location.pathname === "/" ? "orange.50" : "transparent"}
                  >
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    as={Link}
                    to="/car-engines"
                    onClick={onToggle}
                    fontSize="14px"
                    color={location.pathname === "/car-engines" ? accentColor : "inherit"}
                    bg={location.pathname === "/car-engines" ? "orange.50" : "transparent"}
                  >
                    Car Engines
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    as={Link}
                    to="/used-engines"
                    onClick={onToggle}
                    fontSize="14px"
                    color={location.pathname === "/used-engines" ? accentColor : "inherit"}
                    bg={location.pathname === "/used-engines" ? "orange.50" : "transparent"}
                  >
                    Used Engines
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    as={Link}
                    to="/reconditioned-engines"
                    onClick={onToggle}
                    fontSize="14px"
                    color={location.pathname === "/reconditioned-engines" ? accentColor : "inherit"}
                    bg={location.pathname === "/reconditioned-engines" ? "orange.50" : "transparent"}
                  >
                    Reconditioned Engines
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    as={Link}
                    to="/gearboxes"
                    onClick={onToggle}
                    fontSize="14px"
                    color={location.pathname === "/gearboxes" ? accentColor : "inherit"}
                    bg={location.pathname === "/gearboxes" ? "orange.50" : "transparent"}
                  >
                    Gearboxes
                  </Button>

                  {!isLoggedIn && (
                    <>
                      <Button
                        as={Link}
                        to="/login"
                        justifyContent="flex-start"
                        leftIcon={<FaUserAlt />}
                        variant="ghost"
                        onClick={onToggle}
                        fontSize="14px">
                        Login
                      </Button>
                      {/* <Button
                        as={Link}
                        to="/register"
                        justifyContent="flex-start"
                        variant="ghost"
                        onClick={onToggle}
                        fontSize="14px">
                        Register
                      </Button> */}
                    </>
                  )}
                </Stack>
              </Box>
            </Collapse>
          )}
        </Container>
      </Box>
    </Box>
  );
}