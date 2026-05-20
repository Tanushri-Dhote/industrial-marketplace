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
    <Box as="footer" bg={darkBlue} color="white" pt={14} pb={6}>
      <Container maxW="container.xl">

        {/* Top Footer */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 2, lg: 4 }}
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
              Your trusted UK marketplace for quality used and reconditioned
              car engines with fast delivery and nationwide fitting service.
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
              size="sm"
              color={accentColor}
              textTransform="uppercase"
            >
              Quick Links
            </Heading>

            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/all-engines">All Engines</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </Stack>

          {/* Legal */}
          <Stack spacing={5}>
            <Heading
              size="sm"
              color={accentColor}
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
              size="sm"
              color={accentColor}
              textTransform="uppercase"
            >
              Contact Info
            </Heading>

            <HStack align="start">
              <Icon as={MdLocationOn} color={accentColor} mt={1} />
              <Text fontSize="14px" color="gray.400">
                38 Fowler Rd, Ilford IG6 3UT, UK
              </Text>
            </HStack>

            <HStack>
              <Icon as={MdPhone} color={accentColor} />
              <Text fontSize="14px" color="gray.400">
                +44 20 8133 4040
              </Text>
            </HStack>

            <HStack>
              <Icon as={MdEmail} color={accentColor} />
              <Text fontSize="14px" color="gray.400">
                info@reconditionedengine.co.uk
              </Text>
            </HStack>

            <HStack>
              <Icon as={MdAccessTime} color={accentColor} />
              <Text fontSize="14px" color="gray.400">
                Mon - Sat: 8:00 AM - 6:00 PM
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
              color={accentColor}
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
      bg: "#D90404",
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
    _hover={{
      color: "#D90404",
      textDecoration: "none",
    }}
  >
    {children}
  </Link>
);