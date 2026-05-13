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
  IconButton,
} from '@chakra-ui/react';
import { FaCode, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { motion } from 'framer-motion';

export default function Footer() {
  const navigate = useNavigate();
  const accentColor = "#D90404";
  const darkBlue = "#0F172A";

  return (
    <Box as="footer" bg={darkBlue} color="white" pt={16} pb={8} position="relative" overflow="hidden">
      {/* Decorative Blur */}
      <Box position="absolute" bottom="-10%" left="-5%" w="400px" h="400px" bg={accentColor} filter="blur(150px)" opacity={0.05} />

      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={10} mb={12}>
          
          {/* Brand Section */}
          <Stack spacing={6} align={{ base: "center", sm: "start" }} textAlign={{ base: "center", sm: "left" }}>
            <Link as={RouterLink} to="/" _hover={{ opacity: 0.8 }} transition="all 0.3s">
              <Box h={{ base: "80px", md: "100px" }}>
                <img src="/logo.png" alt="All Engines Logo" style={{ height: "100%", objectFit: "contain" }} />
              </Box>
            </Link>
            <Text fontSize="14px" color="gray.400" lineHeight="1.8">
              Your trusted UK marketplace for quality used and reconditioned car engines.
              Fast delivery with professional supply & fitting service available nationwide.
            </Text>
            <HStack spacing={4}>
              <SocialIcon icon={FaFacebookF} />
              <SocialIcon icon={FaTwitter} />
              <SocialIcon icon={FaInstagram} />
              <SocialIcon icon={FaLinkedinIn} />
            </HStack>
          </Stack>

          {/* Company Links */}
          <Stack spacing={6} align={{ base: "center", sm: "start" }}>
            <Heading size="xs" letterSpacing="1px" color="white" textTransform="uppercase">
              Company
            </Heading>
            <VStack align={{ base: "center", sm: "start" }} spacing={3}>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </VStack>
          </Stack>

          {/* Legal Links */}
          <Stack spacing={6} align={{ base: "center", sm: "start" }}>
            <Heading size="xs" letterSpacing="1px" color="white" textTransform="uppercase">
              Legal
            </Heading>
            <VStack align={{ base: "center", sm: "start" }} spacing={3}>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms-and-conditions">Terms & Conditions</FooterLink>
            </VStack>
          </Stack>

          {/* Contact Info */}
          <Stack spacing={6} align={{ base: "center", sm: "start" }}>
            <Heading size="xs" letterSpacing="1px" color="white" textTransform="uppercase">
              Get In Touch
            </Heading>
            <VStack align={{ base: "center", sm: "start" }} spacing={4}>
              <HStack spacing={3}>
                <Icon as={MdLocationOn} color={accentColor} boxSize={5} />
                <Text fontSize="13px" color="gray.400">38 Fowler Rd, Ilford IG6 3UT, UK</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={MdPhone} color={accentColor} boxSize={5} />
                <Text fontSize="13px" color="gray.400">+44 20 8133 4040</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={MdEmail} color={accentColor} boxSize={5} />
                <Text fontSize="13px" color="gray.400">info@reconditionedengine.co.uk</Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={MdAccessTime} color={accentColor} boxSize={5} />
                <Text fontSize="13px" color="gray.400">Mon - Sat: 8:00 AM - 6:00 PM</Text>
              </HStack>
            </VStack>
          </Stack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" />

        {/* Bottom Bar */}
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align="center" 
          pt={8} 
          gap={4}
        >
          <Text fontSize="13px" color="gray.500">
            © 2026 info@reconditionedengine.co.uk • All Rights Reserved
          </Text>
          <HStack spacing={2} opacity={0.6}>
            <Icon as={FaCode} boxSize={3} />
            <Text fontSize="xs">
              Developed by{' '}
              <Link href="https://rssctech.com" isExternal fontWeight="600" color={accentColor}>
                RSSC Technologies Pvt Ltd
              </Link>
            </Text>
          </HStack>
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
    variant="ghost"
    color="gray.400"
    _hover={{ color: 'white', bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
    transition="all 0.3s"
    size="sm"
    borderRadius="lg"
    aria-label="Social Link"
  />
);

const FooterLink = ({ to, children }) => (
  <Link
    as={RouterLink}
    to={to}
    fontSize="14px"
    color="gray.400"
    transition="all 0.3s"
    _hover={{ color: '#D90404', transform: 'translateX(4px)' }}
    display="inline-block"
  >
    {children}
  </Link>
);