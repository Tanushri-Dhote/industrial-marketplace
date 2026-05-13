import React, { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Flex,
  SimpleGrid,
  Text,
  Link,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Divider,
  HStack,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { FaArrowRight, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [regNumber, setRegNumber] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const accentColor = "#D90404";

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };


  const handleGetQuotes = () => {
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

    // clear input after success
    setRegNumber("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    navigate("/call-seller", {
      state: {
        vrm: cleanedVRM,
        category: "",
        brand: "",
        model: "",
        year: "",
        type: ""
      }
    });
  };

  return (
    <Box as="footer" bg="#0F172A" color="white" mt="auto">

      {/* ==================== GET ENGINE PRICE QUOTES BAR ==================== */}
      {/* <Box bg="#0A1F3D" py={5}>
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Text
              fontSize={{ base: "16px", md: "18px" }}
              fontWeight="600"
              color="white"
            >
              Get Engine Price Quotes
            </Text>

            <HStack spacing={3} flex="1" maxW={{ base: "100%", md: "520px" }}>
            
              <InputGroup size="lg">

                <Box w="100%">
                  <Flex
                    border="4px solid"
                    borderColor="#FFD700"
                    borderRadius="20px"
                    overflow="hidden"
                    h="60px"
                    bg="white"
                    boxShadow="lg"
                  >
                
                    <VStack
                      bg="#003399"
                      w="70px"
                      justify="center"
                      spacing={0}
                      flexShrink={0}
                    >
                      <Text
                        fontSize="14px"
                        color="white"
                        fontWeight="900"
                        lineHeight="1"
                      >
                        GB
                      </Text>

                      <Text
                        color="#FFD700"
                        fontSize="14px"
                        lineHeight="1"
                      >
                        ★
                      </Text>
                    </VStack>

               
                    <Input
                      flex="1"
                      variant="unstyled"
                      placeholder="ENTER REG"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleGetQuotes()}
                      textAlign="center"
                      fontSize={{ base: "20px", md: "26px" }}
                      fontWeight="900"
                      color="#0F172A"
                      letterSpacing="2px"
                      px={4}
                      textTransform="uppercase"
                      _placeholder={{
                        color: "#BFC7D1",
                        fontWeight: "900",
                      }}
                    />
                  </Flex>
                </Box>
                
              </InputGroup>

         
              <Button
                bg="#E63939"
                color="white"
                px={8}
                py={6}
                borderRadius="full"
                fontWeight="600"
                fontSize="15px"
                _hover={{ bg: "#d62828" }}
                rightIcon={<FaArrowRight />}
                onClick={handleGetQuotes}
              >
                Get Free Quotes
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box> */}

      {/* ==================== MAIN FOOTER ==================== */}
      <Container maxW="container.xl" py={12}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={10}>

          {/* Brand Section */}
          <Stack spacing={5} align={{ base: "center", sm: "start" }} textAlign={{ base: "center", sm: "left" }}>
            <HStack spacing={3}>
              <Box
                h={{ base: "80px", md: "100px" }}
              >
                <img
                  src="/logo.png"
                  alt="All Engines Logo"
                  style={{
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </Box>
            </HStack>

            <Text fontSize={{ base: "14px", md: "16px" }} color="gray.400">
              Your trusted UK marketplace for quality used and reconditioned car engines.
              Fast delivery with professional supply & fitting service available nationwide.
            </Text>
          </Stack>

          {/* Company Links */}
          <Stack spacing={4} align={{ base: "center", sm: "start" }}>
            <Heading size="sm" color="white" textTransform="uppercase" letterSpacing="1px">
              Company
            </Heading>
            <VStack align={{ base: "center", sm: "start" }} spacing={2.5}>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </VStack>
          </Stack>

          {/* Legal Links */}
          <Stack spacing={4} align={{ base: "center", sm: "start" }}>
            <Heading size="sm" color="white" textTransform="uppercase" letterSpacing="1px">
              Legal
            </Heading>
            <VStack align={{ base: "center", sm: "start" }} spacing={2.5}>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms-and-conditions">Terms & Conditions</FooterLink>
            </VStack>
          </Stack>

          {/* Contact Info */}
          <Stack spacing={4} align={{ base: "center", sm: "start" }}>
            <Heading size="sm" color="white" textTransform="uppercase" letterSpacing="1px">
              Get In Touch
            </Heading>
            <VStack align={{ base: "center", sm: "start" }} spacing={4}>
              <HStack spacing={3}>
                <Icon as={MdLocationOn} color={accentColor} boxSize={5} />
                <Text fontSize={{ base: "13px", md: "sm" }} color="gray.400">38 Fowler Rd, Ilford IG6 3UT, UK</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={MdPhone} color={accentColor} boxSize={5} />
                <Text fontSize={{ base: "13px", md: "sm" }} color="gray.400">+44 20 8133 4040</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={MdEmail} color={accentColor} boxSize={5} />
                <Text fontSize={{ base: "13px", md: "sm" }} color="gray.400">info@reconditionedengine.co.uk</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={MdAccessTime} color={accentColor} boxSize={5} />
                <Text fontSize={{ base: "13px", md: "sm" }} color="gray.400">Mon - Sat: 8:00 AM - 6:00 PM</Text>
              </HStack>
            </VStack>
          </Stack>
        </SimpleGrid>

        <Divider my={10} borderColor="gray.700" />

        {/* Bottom Bar */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          spacing={4}
        >
          <Text fontSize="sm" color="gray.500">
            © 2026 info@reconditionedengine.co.uk • All Rights Reserved
          </Text>

          <HStack spacing={2}>
            <Icon as={FaCode} boxSize={3.5} color="gray.500" />
            <Text fontSize="xs" color="gray.500">
              Developed by{' '}
              <Link
                href="https://rssctech.com"
                isExternal
                fontWeight="600"
                color={accentColor}
                _hover={{ textDecoration: 'underline' }}
              >
                RSSC Technologies Pvt Ltd <FaExternalLinkAlt size={10} style={{ display: 'inline', marginLeft: '4px' }} />
              </Link>
            </Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}

// Reusable Footer Link Component
const FooterLink = ({ to, children }) => (
  <Link
    as={RouterLink}
    to={to}
    color="gray.400"
    fontSize="sm"
    _hover={{
      color: "#D90404",
      transform: "translateX(6px)",
    }}
    transition="all 0.2s"
  >
    {children}
  </Link>
);