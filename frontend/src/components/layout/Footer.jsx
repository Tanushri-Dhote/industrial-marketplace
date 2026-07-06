import React from "react";
import {
  Box,
  Container,
  Stack,
  Flex,
  SimpleGrid,
  Text,
  Link,
  Icon,
  Divider,
  HStack,
  VStack,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCar,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccessTime,
} from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  const accentColor = "#D90404";
  const darkBlue = "#0A1927";

  return (
    <Box 
      as="footer" 
      bgGradient="linear-gradient(180deg, #090D16 0%, #111827 100%)" 
      borderTop="4px solid #D90404"
      color="white" 
      pt={14} 
      pb={6}
    >
      <Container maxW="container.xl">

        {/* Top Footer */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={10}
          mb={10}
        >
          {/* Brand */}
          <Stack spacing={5}>
            <Link as={RouterLink} to="/">
              <Box h="80px">
                <img
                  src="/logo.png"
                  alt="Reconditioned Engine Logo"
                  style={{ height: "100%", objectFit: "contain" }}
                />
              </Box>
            </Link>

            <Text fontSize="14px" color="gray.400" lineHeight="1.8">
              Your trusted UK specialist for professional engine rebuilding,
              local vehicle collection, and fitting services.
            </Text>

            <HStack spacing={2}>
              <SocialIcon icon={FaFacebookF} />
              <SocialIcon icon={FaTwitter} />
              <SocialIcon icon={FaInstagram} />
              <SocialIcon icon={FaLinkedinIn} />
            </HStack>
          </Stack>

          {/* Quick Links */}
          <Stack spacing={5}>
            <Heading
              fontSize="13px"
              fontWeight="700"
              color="white"
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Quick Links
            </Heading>

            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/#brand-section">All Engines</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </Stack>

          {/* Legal */}
          <Stack spacing={5}>
            <Heading
              fontSize="13px"
              fontWeight="700"
              color="white"
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Legal
            </Heading>

            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms-and-conditions">
              Terms & Conditions
            </FooterLink>
          </Stack>

          {/* Contact */}
          <Stack spacing={5}>
            <Heading
              fontSize="13px"
              fontWeight="700"
              color="white"
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Contact Info
            </Heading>

            <HStack 
              as="a" 
              href="https://maps.google.com/?q=44+Fowler+Road,+Hainault+Business+Park,+Ilford+London,+IG6+3UT" 
              target="_blank" 
              rel="noopener noreferrer"
              align="start"
              _hover={{ color: "brand.500", textDecoration: "none" }}
              cursor="pointer"
            >
              <Icon as={MdLocationOn} color="gray.400" mt={1} />
              <Text fontSize="14px" color="gray.400" _hover={{ color: "white" }}>
                44 Fowler Road, Hainault Business Park, Ilford London, IG6 3UT
              </Text>
            </HStack>

            <HStack 
              as="a" 
              href="tel:02071129397"
              align="center"
              _hover={{ color: "brand.500", textDecoration: "none" }}
              cursor="pointer"
            >
              <Icon as={MdPhone} color="gray.400" />
              <Text fontSize="14px" color="gray.400" _hover={{ color: "white" }}>
                02071129397
              </Text>
            </HStack>

            <HStack 
              as="a" 
              href="mailto:info@reconditionedengine.co.uk"
              align="center"
              _hover={{ color: "brand.500", textDecoration: "none" }}
              cursor="pointer"
            >
              <Icon as={MdEmail} color="gray.400" />
              <Text fontSize="14px" color="gray.400" _hover={{ color: "white" }}>
                info@reconditionedengine.co.uk
              </Text>
            </HStack>


          </Stack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.200" />

        {/* Bottom Footer */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={5}
          gap={3}
        >
          <Text fontSize="13px" color="gray.500">
            © 2026 Reconditioned Engine • All Rights Reserved
          </Text>

          <Text fontSize="13px" color="gray.500">
            Developed by{" "}
            <Link
              href="https://rssctech.com"
              isExternal
              color="gray.400"
              _hover={{ color: "white" }}
              fontWeight="600"
            >
              RSSC Technologies Pvt Ltd
            </Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

const SocialIcon = ({ icon }) => (
  <IconButton
    as={Link}
    href="#"
    icon={<Icon as={icon} />}
    size="sm"
    bg="whiteAlpha.100"
    color="white"
    _hover={{
      bg: "whiteAlpha.300",
    }}
    borderRadius="md"
    aria-label="Social Link"
  />
);

const FooterLink = ({ to, children }) => (
  <Link
    as={RouterLink}
    to={to}
    fontSize="14px"
    color="gray.400"
    display="inline-block"
    transition="all 0.25s ease"
    _hover={{
      color: "white",
      transform: "translateX(4px)",
      textDecoration: "none",
    }}
  >
    {children}
  </Link>
);