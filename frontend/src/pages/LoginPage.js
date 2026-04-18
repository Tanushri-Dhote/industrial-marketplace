import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
  Link,
  useToast,
  Divider,
  HStack,
  Icon,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    setTimeout(() => {
      const roleMap = {
        'superadmin': { role: 'Super Admin', business: 'Global Marketplace HQ', websiteId: 'all' },
        'demo':       { role: 'Super Admin', business: 'All Engine Global', websiteId: 'all' },
        'admin':      { role: 'Super Admin', business: 'Global Marketplace HQ', websiteId: 'all' },
        'webadmin':   { role: 'Website Admin', business: 'Engine City Tenant', websiteId: 'SITE-101' },
        'sales':      { role: 'Sales Manager', business: 'Engine City Tenant', websiteId: 'SITE-101' },
        'viewer':     { role: 'Viewer', business: 'Audit Services', websiteId: 'all' }
      };

      const lookupKey = data.username.trim().toLowerCase();
      const roleInfo = roleMap[lookupKey] || { role: 'Super Admin', business: 'All Engine Global', websiteId: 'all' };

      const user = {
        username: data.username,
        email: `${data.username}@industrialmarket.com`,
        name: data.username.charAt(0).toUpperCase() + data.username.slice(1),
        businessName: roleInfo.business,
        role: roleInfo.role,
        websiteId: roleInfo.websiteId,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('token', 'dummy-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(user));

      sessionStorage.removeItem('registeredEmail');

      toast({
        title: 'Login Successful!',
        description: `Welcome back, ${user.username}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'left-accent',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 100);

      setIsLoading(false);
    }, 1500);
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = "#D90404";

  return (
    <Container maxW="lg" py={8}>
      <Box
        bg={bgColor}
        p={0}
        borderRadius="xl"
        boxShadow="xl"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}>

        {/* Header with Industrial Theme - Reduced Height */}
        <Box bg="#0F172A" py={4} px={6} textAlign="center">
          <HStack spacing={3} justify="center">
            <Box
              h="50px"
            >
              <img
                src="/logo_engine.PNG"
                alt="All Engines Logo"
                style={{
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </Box>
            <Heading
              as="h1"
              fontSize="24px"
              fontWeight="800"
              letterSpacing="-0.5px"
              color="white"
            >
              All Engine
              <Text as="span" color={accentColor} ml={1}>4 You</Text>
            </Heading>
          </HStack>
          <Text color="whiteAlpha.800" fontSize="11px" fontWeight="500" letterSpacing="1px" mt={1}>
            Rebuilt • Repair • Replacement • Reconditioned
          </Text>
        </Box>

        {/* Login Form - Compact Layout */}
        <Box p={6}>
          <VStack spacing={4} align="stretch">
            <VStack spacing={1} textAlign="center">
              <Heading size="sm" color="gray.700" fontSize="18px">
                Sign in to your account
              </Heading>
              <Text color="gray.500" fontSize="12px">
                Enter your details carefully to continue.
              </Text>
            </VStack>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={3}>
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel htmlFor="username" fontWeight="600" fontSize="12px" mb={1}>
                    Username
                  </FormLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    size="md"
                    height="40px"
                    fontSize="14px"
                    borderRadius="md"
                    borderColor="gray.300"
                    _hover={{ borderColor: accentColor }}
                    _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                    {...register('username')}
                  />
                  <FormErrorMessage fontSize="11px">{errors.username?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password" fontWeight="600" fontSize="12px" mb={1}>
                    Password
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      fontSize="14px"
                      height="40px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('password')}
                    />
                    <InputRightElement height="40px">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        _hover={{ bg: 'transparent' }}>
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="11px">{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  bg={accentColor}
                  width="100%"
                  size="md"
                  height="40px"
                  fontSize="14px"
                  fontWeight="600"
                  borderRadius="md"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  mt={2}
                  _hover={{
                    bg: "#c74848",
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.2s">
                  Sign in
                </Button>
              </VStack>
            </form>

            <HStack justify="center" spacing={3} mt={2}>
              <Link href="#" color={accentColor} fontSize="12px" fontWeight="500">
                Forgot Password
              </Link>
              <Text color="gray.400" fontSize="12px">/</Text>
              <Link href="#" color={accentColor} fontSize="12px" fontWeight="500">
                Forgot Username
              </Link>
            </HStack>

            <Divider my={1} />

            <Text textAlign="center" fontSize="12px">
              Not a Member?{' '}
              <Link as={RouterLink} to="/register" color={accentColor} fontWeight="bold" fontSize="12px">
                Signup
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Industrial Trust Badge - Compact */}
      <Box mt={4} textAlign="center">
        <HStack justify="center" spacing={4} flexWrap="wrap">
          <Text fontSize="10px" color="gray.500">✓ Trusted Supplier</Text>
          <Text fontSize="10px" color="gray.500">✓ Quality Guaranteed</Text>
          <Text fontSize="10px" color="gray.500">✓ 24/7 Support</Text>
        </HStack>
      </Box>

      {/* Demo Credentials - Compact */}
      <Alert
        mt={4}
        status="info"
        borderRadius="md"
        bg="blue.50"
        border="1px solid"
        borderColor="blue.200"
        py={2}>
        <AlertIcon boxSize={3} />
        <VStack align="flex-start" spacing={0}>
          <Text fontSize="10px"><strong>Demo Password:</strong> admin123</Text>
          <Text fontSize="10px"><strong>Users:</strong> superadmin | webadmin | sales | viewer</Text>
        </VStack>
      </Alert>
    </Container>
  );
}