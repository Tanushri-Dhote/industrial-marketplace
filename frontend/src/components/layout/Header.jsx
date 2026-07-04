import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Link as ChakraLink,
  Collapse,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  FaCar,
  FaFileContract,
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaShieldAlt,
  FaUserAlt
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CallSellerPage from '../../pages/CallSellerPage';
import AdminHeader from './AdminHeader';

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isCallSellerOpen, onOpen: onCallSellerOpen, onClose: onCallSellerClose } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const accentColor = "#D90404";
  const darkColor = "#0A1927";

  // Scroll Effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;

          setScrolled((prev) => {
            if (!prev && y > 120) return true;
            if (prev && y < 80) return false;
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

  // Navigation items configuration
  const navItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/all-engines", label: "All Engines", icon: FaCar },
    { path: "/about", label: "About Us", icon: FaInfoCircle },
    { path: "/terms-and-conditions", label: "Terms & Conditions", icon: FaFileContract },
    { path: "/privacy-policy", label: "Privacy Policy", icon: FaShieldAlt },
  ];

  if (isLoggedIn) {
    return <AdminHeader user={userData} onLogout={handleLogout} />;
  }

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="white"
      willChange="transform"
    >
      {/* Top Bar - Contact Info (Only visible when not scrolled) */}
      {/* <Box
        bg={darkColor}
        color="white"
        py={2}
        overflow="hidden"
        maxH={!scrolled ? { base: "80px", sm: "50px" } : "0px"}
        opacity={!scrolled ? 1 : 0}
        transform={!scrolled ? "translateY(0)" : "translateY(-10px)"}
        transition="all 0.35s ease"
        pointerEvents={!scrolled ? "auto" : "none"}
      >
        <Container maxW="container.xl" px={{ base: 2, md: 6 }}>
          <Flex
            justify={{ base: "center", md: "space-between" }}
            align="center"
            fontSize={{ base: "10px", sm: "12px" }}
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 1, sm: 0 }}
          >
            <HStack spacing={{ base: 2, sm: 4 }} wrap="wrap" justify="center">
              <HStack spacing={1.5} as="a" href="tel:02071129397" _hover={{ color: "brand.100" }} cursor="pointer">
                <FaPhone size="10px" />
                <Text>02071129397</Text>
              </HStack>
              <HStack spacing={1.5} as="a" href="mailto:info@reconditionedengine.co.uk" _hover={{ color: "brand.100" }} cursor="pointer">
                <FaEnvelope size="10px" />
                <Text>info@reconditionedengine.co.uk</Text>
              </HStack>
            </HStack>
            <HStack spacing={3} display={{ base: "none", md: "flex" }}>
              <IconButton
                icon={<FaFacebookF />}
                variant="ghost"
                size="xs"
                color="white"
                _hover={{ color: accentColor }}
                aria-label="Facebook"
              />
              <IconButton
                icon={<FaTwitter />}
                variant="ghost"
                size="xs"
                color="white"
                _hover={{ color: accentColor }}
                aria-label="Twitter"
              />
              <IconButton
                icon={<FaLinkedin />}
                variant="ghost"
                size="xs"
                color="white"
                _hover={{ color: accentColor }}
                aria-label="LinkedIn"
              />
            </HStack>
          </Flex>
        </Container>
      </Box> */}

      {/* Main Header */}
      <Box
        bg="white"
        boxShadow={scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "0 1px 0 rgba(0,0,0,0.05)"}
        transition="background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease"
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <Flex align="center" justify="space-between" gap={6} py={scrolled ? 2 : 3}>
            {/* Logo */}
            <Link to="/">
              <HStack spacing={2}>
                <Box
                  h={{ base: scrolled ? "45px" : "55px", md: scrolled ? "55px" : "70px" }}
                  transition="all 0.3s ease"
                  display="flex"
                  alignItems="center"
                >
                  <img
                    src="/logo.png"
                    alt="Re-Conditioned Engine Logo"
                    style={{
                      height: "100%",
                      width: "auto",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>
              </HStack>
            </Link>

            {/* Navigation Links - Desktop */}
            <HStack
              spacing={6}
              display={{ base: 'none', lg: 'flex' }}
              fontSize="14px"
              fontWeight="500"
              transition="all 0.25s ease"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ChakraLink
                    key={item.path}
                    as={Link}
                    to={item.path}
                    position="relative"
                    color={isActive ? accentColor : "gray.700"}
                    _hover={{ color: accentColor, textDecoration: "none" }}
                    pb={1}
                    fontWeight={isActive ? "600" : "500"}
                  >
                    {item.label}
                    {isActive && (
                      <Box
                        position="absolute"
                        bottom="-1px"
                        left="0"
                        right="0"
                        height="2px"
                        bg={accentColor}
                        borderRadius="full"
                      />
                    )}
                  </ChakraLink>
                );
              })}
            </HStack>

            {/* Buttons - Desktop (Always visible) */}
            <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
              {/* Phone Button */}
              <Button
                as="a"
                href="tel:02071129397"
                cursor="pointer"
                bg="gray.100"
                color="gray.800"
                px={4}
                height="46px"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ bg: "gray.200", borderColor: "gray.300", textDecoration: "none" }}
                transition="all 0.2s"
                display="inline-flex"
                alignItems="center"
                fontWeight="700"
              >
                <HStack spacing={2} align="center">
                  <Box
                    bg="#c40000"
                    color="white"
                    boxSize="26px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FaPhoneAlt size={10} />
                  </Box>

                  <Text fontSize="14px" color="gray.800">
                    02071129397
                  </Text>
                </HStack>
              </Button>

              <Button
                onClick={onCallSellerOpen}
                bg={accentColor}
                color="white"
                _hover={{ bg: "#c40000", transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                fontWeight="700"
                size="md"
                height="46px"
                px={6}
                fontSize="14px"
                borderRadius="md"
              >
                Get Quote
              </Button>
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', lg: 'none' }}
              onClick={onToggle}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              variant="ghost"
              aria-label="Toggle Navigation"
              fontSize="20px"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation */}
      <Collapse in={isOpen} animateOpacity>
        <Box bg="white" borderTop="1px solid" borderColor="gray.100" shadow="lg">
          <Container maxW="container.xl" px={4}>
            <VStack spacing={1} py={4} align="stretch">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    justifyContent="flex-start"
                    as={Link}
                    to={item.path}
                    onClick={onToggle}
                    fontSize="14px"
                    fontWeight={location.pathname === item.path ? "600" : "500"}
                    color={location.pathname === item.path ? accentColor : "gray.700"}
                    bg={location.pathname === item.path ? `${accentColor}10` : "transparent"}
                    leftIcon={<Icon />}
                    _hover={{ bg: `${accentColor}10`, color: accentColor }}
                  >
                    {item.label}
                  </Button>
                );
              })}

              <Divider my={2} />

              <Box
                as="a"
                href="tel:02071129397"
                cursor="pointer"
                bg="gray.100"
                px={4}
                py={2}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ bg: "gray.200", borderColor: "gray.300", textDecoration: "none" }}
                transition="all 0.2s"
              >
                <HStack spacing={3} align="center">
                  <Box
                    bg="#c40000"
                    color="white"
                    boxSize="34px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FaPhoneAlt size={14} />
                  </Box>

                  <Text fontWeight="700" fontSize="14px" color="gray.800">
                    02071129397
                  </Text>
                </HStack>
              </Box>

              <Button
                onClick={() => {
                  onToggle();
                  onCallSellerOpen();
                }}
                justifyContent="flex-start"
                leftIcon={<FaFileContract />}
                variant="ghost"
                fontSize="14px"
                fontWeight="500"
                color={accentColor}
                _hover={{ bg: `${accentColor}10` }}
              >
                Get Quote
              </Button>
            </VStack>
          </Container>
        </Box>
      </Collapse>

      {/* Call Seller Modal */}
      <Modal isOpen={isCallSellerOpen} onClose={onCallSellerClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
          <ModalCloseButton zIndex={10} top={4} right={4} bg="white" rounded="full" shadow="sm" _hover={{ bg: "gray.100" }} />
          <ModalBody p={0} bg="#F8FAFC">
            <CallSellerPage isModal={true} onCloseModal={onCallSellerClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}