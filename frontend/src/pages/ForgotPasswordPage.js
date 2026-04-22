import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { FaArrowLeft, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import API from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = "#D90404";

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
    <Container maxW="lg" py={20}>
      <Box
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
      >
        <Box bg="#0F172A" py={6} px={8} textAlign="center">
          <Heading as="h1" fontSize="24px" fontWeight="800" color="white">
            Reset Password
          </Heading>
          <Text color="whiteAlpha.700" fontSize="sm" mt={2}>
            Enter your email to receive a recovery link
          </Text>
        </Box>

        <Box p={8}>
          {!isSent ? (
            <VStack as="form" spacing={6} onSubmit={handleForgotPassword}>
              <FormControl>
                <FormLabel fontWeight="600" fontSize="sm" color="gray.700">Email Address</FormLabel>
                <HStack 
                  bg="gray.50" 
                  px={4} 
                  py={2} 
                  borderRadius="lg" 
                  border="1px solid" 
                  borderColor="gray.200"
                  _focusWithin={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                  transition="all 0.2s"
                >
                  <Icon as={FaEnvelope} color="gray.400" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    variant="unstyled"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fontSize="md"
                    h="40px"
                  />
                </HStack>
              </FormControl>

              <Button
                type="submit"
                bg={accentColor}
                color="white"
                w="full"
                h="56px"
                fontSize="md"
                fontWeight="800"
                isLoading={isLoading}
                rightIcon={<FaPaperPlane />}
                _hover={{ bg: "#b80303", transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Send Reset Link
              </Button>

              <Link as={RouterLink} to="/login" display="flex" alignItems="center" fontSize="sm" color="gray.500" fontWeight="600" _hover={{ color: accentColor }}>
                <Icon as={FaArrowLeft} mr={2} /> Back to Sign In
              </Link>
            </VStack>
          ) : (
            <VStack spacing={6} textAlign="center">
              <Box bg="green.50" p={4} borderRadius="full">
                <Icon as={FaPaperPlane} color="green.500" boxSize={10} />
              </Box>
              <VStack spacing={2}>
                <Heading size="md" color="gray.800">Check Your Email</Heading>
                <Text color="gray.500" fontSize="sm">
                  We've sent a password recovery link to:
                  <Text as="span" fontWeight="bold" color="gray.700" display="block">{email}</Text>
                </Text>
              </VStack>
              <Button
                variant="outline"
                w="full"
                h="56px"
                onClick={() => setIsSent(false)}
                _hover={{ bg: "gray.50" }}
              >
                Didn't receive email? Try again
              </Button>
              <Link as={RouterLink} to="/login" fontSize="sm" color={accentColor} fontWeight="bold">
                Return to Login
              </Link>
            </VStack>
          )}
        </Box>
      </Box>
    </Container>
  );
}
