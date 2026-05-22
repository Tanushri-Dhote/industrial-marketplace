import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { FaArrowLeft, FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import API from '../services/api';

const RED = "#E10600";
const DARK = "#111111";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      setIsLoading(true);
      await API.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success('Reset link sent! Please check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="stretch" bg="#f7f7f7">
      {/* LEFT PANEL — Branding (Same as Login) */}
      <Flex
        display={{ base: "none", lg: "flex" }}
        flex="1"
        direction="column"
        justify="space-between"
        bg={DARK}
        p={12}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg={RED}
          opacity={0.08}
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="-60px"
          w="260px"
          h="260px"
          borderRadius="full"
          border="2px solid"
          borderColor="whiteAlpha.100"
        />

        {/* Logo */}
        <Box>
          <Box h="56px" mb={8}>
            <img src="/logo.png" alt="Logo" style={{ height: "100%", objectFit: "contain" }} />
          </Box>
          <Heading
            fontSize={{ lg: "34px", xl: "42px" }}
            fontWeight="900"
            color="white"
            lineHeight="1.1"
            mb={4}
          >
            High Performance.{" "}
            <Text as="span" color={RED}>
              Like New.
            </Text>
          </Heading>
          <Text color="whiteAlpha.600" fontSize="15px" maxW="340px" lineHeight="1.7">
            Expertly reconditioned engines with quality parts, built to last and priced right.
          </Text>
        </Box>

        <VStack align="flex-start" spacing={5} mb={8}>
          {[
            { icon: FaCheckCircle, label: "Secure Reset", sub: "Encrypted Link" },
            { icon: FaPaperPlane, label: "Instant Delivery", sub: "Check your inbox" },
          ].map(({ icon, label, sub }) => (
            <HStack key={label} spacing={4}>
              <Box
                w="40px"
                h="40px"
                borderRadius="lg"
                bg="whiteAlpha.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon as={icon} color={RED} boxSize={5} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="700" fontSize="14px">{label}</Text>
                <Text color="whiteAlpha.500" fontSize="12px">{sub}</Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Flex>

      {/* RIGHT PANEL — Form */}
      <Flex
        flex={{ base: "1", lg: "0 0 480px" }}
        direction="column"
        justify="center"
        align="center"
        bg="white"
        p={{ base: 6, md: 12 }}
        minH="100vh"
      >
        {/* Mobile Logo */}
        <Box display={{ base: "block", lg: "none" }} mb={6} textAlign="center">
          <Box h="48px" mx="auto" display="flex" justifyContent="center">
            <img src="/logo.png" alt="Logo" style={{ height: "100%", objectFit: "contain" }} />
          </Box>
          <Text color="gray.400" fontSize="11px" letterSpacing="2px" fontWeight="500" mt={1} textTransform="uppercase">
            Rebuilt • Repair • Replacement • Reconditioned
          </Text>
        </Box>

        <Box w="full" maxW="380px">
          {!isSent ? (
            <>
              <VStack spacing={1} align="flex-start" mb={8}>
                <HStack mb={2}>
                  <Box w="4px" h="24px" bg={RED} borderRadius="full" />
                  <Text color={RED} fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                    Account Recovery
                  </Text>
                </HStack>
                <Heading fontSize="28px" fontWeight="900" color={DARK}>
                  Reset Your Password
                </Heading>
                <Text color="gray.500" fontSize="14px">
                  Enter your email to receive a secure recovery link.
                </Text>
              </VStack>

              <form onSubmit={handleForgotPassword} style={{ width: "100%" }}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                      Email Address
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement h="48px" pl={1}>
                        <Icon as={FaEnvelope} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        h="48px"
                        fontSize="14px"
                        borderRadius="lg"
                        borderColor="gray.200"
                        bg="#f7f7f7"
                        pl={10}
                        _hover={{ borderColor: RED }}
                        _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                      />
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    bg={RED}
                    color="white"
                    width="100%"
                    h="48px"
                    fontSize="15px"
                    fontWeight="700"
                    borderRadius="lg"
                    isLoading={isLoading}
                    loadingText="Sending..."
                    rightIcon={<FaPaperPlane />}
                    _hover={{ bg: "#c40000", transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    Send Reset Link
                  </Button>
                </VStack>
              </form>

              <Divider my={6} borderColor="gray.100" />

              <Link
                as={RouterLink}
                to="/login"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="14px"
                color="gray.500"
                fontWeight="600"
                _hover={{ color: RED }}
              >
                <Icon as={FaArrowLeft} mr={2} boxSize={3} /> Back to Sign In
              </Link>
            </>
          ) : (
            /* Success State */
            <VStack spacing={6} textAlign="center">
              <Box bg="red.50" borderRadius="full" p={5} display="inline-flex" mx="auto">
                <Icon as={FaCheckCircle} color={RED} boxSize={12} />
              </Box>

              <VStack spacing={2}>
                <Heading size="md" color={DARK} fontWeight="900">Check Your Email</Heading>
                <Text color="gray.500" fontSize="14px" lineHeight="1.7">
                  We've sent a password recovery link to:
                  <Text as="span" fontWeight="700" color={DARK} display="block" mt={1}>
                    {email}
                  </Text>
                </Text>
              </VStack>

              <Box bg="red.50" p={5} borderRadius="xl" border="1px solid" borderColor="red.100" w="full" textAlign="left">
                <VStack spacing={3} align="start">
                  {[
                    "Check your email inbox (including spam)",
                    "Click the reset link in the email",
                    "Create your new password",
                  ].map((step, i) => (
                    <HStack key={i} spacing={3}>
                      <Box
                        flexShrink={0}
                        w="22px"
                        h="22px"
                        borderRadius="full"
                        bg={RED}
                        color="white"
                        fontSize="11px"
                        fontWeight="700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {i + 1}
                      </Box>
                      <Text fontSize="sm" fontWeight="500" color="gray.700">{step}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              <Button
                variant="outline"
                w="full"
                h="48px"
                borderRadius="lg"
                onClick={() => {
                  setIsSent(false);
                  setEmail('');
                }}
                _hover={{ borderColor: RED, color: RED }}
              >
                Didn't receive email? Try again
              </Button>

              <Link as={RouterLink} to="/login" color={RED} fontWeight="700" fontSize="14px">
                Return to Login
              </Link>
            </VStack>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}