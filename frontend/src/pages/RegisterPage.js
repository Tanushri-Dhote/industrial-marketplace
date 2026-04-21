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
  SimpleGrid,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUserPlus, FaBuilding, FaMoneyBillWave } from 'react-icons/fa';
import { MdBusiness, MdTimer, MdEmail, MdPhone } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from "../services/api";

const schema = yup.object({
  businessName: yup.string().required('Business name is required').min(2, 'Must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone1: yup.string().required('Primary phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  phone2: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').optional(),
  warranty: yup.string().required('Warranty period is required'),
  vatNumber: yup.string().optional(),
}).required();

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // ✅ Send FULL backend-compatible data
      const payload = {
        name: data.businessName,          // required
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        business_name: data.businessName, // required
        phone1: data.phone1,
        phone2: data.phone2 || "",
        warranty: data.warranty,
        vat_number: data.vatNumber || "",
        role: "admin", // or "super_admin" if needed
      };

      const res = await API.post("/auth/register", payload);

      toast({
        title: "Registration Successful!",
        description: res.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/login");

    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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

        {/* Header with Industrial Theme */}
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

        {/* Registration Form - Compact Layout */}
        <Box p={6}>
          <VStack spacing={4} align="stretch">
            <VStack spacing={1} textAlign="center">
              <Heading size="sm" color="gray.700" fontSize="18px">
                Create Business Account
              </Heading>
              <Text color="gray.500" fontSize="12px">
                Enter your business details carefully to continue.
              </Text>
            </VStack>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <VStack spacing={3}>
                {/* Business Name */}
                <FormControl isInvalid={!!errors.businessName}>
                  <FormLabel htmlFor="businessName" fontWeight="600" fontSize="12px" mb={1}>
                    Business Name *
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="businessName"
                      placeholder="Business and trading name"
                      size="md"
                      height="40px"
                      fontSize="14px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('businessName')}
                    />
                  </InputGroup>
                  <FormErrorMessage fontSize="11px">{errors.businessName?.message}</FormErrorMessage>
                </FormControl>

                {/* Email */}
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email" fontWeight="600" fontSize="12px" mb={1}>
                    E-mail address * (This will be your username)
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      size="md"
                      height="40px"
                      fontSize="14px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('email')}
                    />
                  </InputGroup>
                  <FormErrorMessage fontSize="11px">{errors.email?.message}</FormErrorMessage>
                </FormControl>

                {/* Password */}
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password" fontWeight="600" fontSize="12px" mb={1}>
                    Password *
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Strong Password"
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

                {/* Confirm Password */}
                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword" fontWeight="600" fontSize="12px" mb={1}>
                    Confirm Password *
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      fontSize="14px"
                      height="40px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('confirmPassword')}
                    />
                    <InputRightElement height="40px">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        _hover={{ bg: 'transparent' }}>
                        {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="11px">{errors.confirmPassword?.message}</FormErrorMessage>
                </FormControl>

                {/* Phone Numbers */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} width="100%">
                  <FormControl isInvalid={!!errors.phone1}>
                    <FormLabel htmlFor="phone1" fontWeight="600" fontSize="12px" mb={1}>
                      Phone 1 *
                    </FormLabel>
                    <Input
                      id="phone1"
                      type="tel"
                      placeholder="Phone Primary"
                      size="md"
                      height="40px"
                      fontSize="14px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('phone1')}
                    />
                    <FormErrorMessage fontSize="11px">{errors.phone1?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.phone2}>
                    <FormLabel htmlFor="phone2" fontWeight="600" fontSize="12px" mb={1}>
                      Phone 2
                    </FormLabel>
                    <Input
                      id="phone2"
                      type="tel"
                      placeholder="Phone Alternate"
                      size="md"
                      height="40px"
                      fontSize="14px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('phone2')}
                    />
                    <FormErrorMessage fontSize="11px">{errors.phone2?.message}</FormErrorMessage>
                    <Text fontSize="10px" color="gray.500" mt={1}>
                      Optional
                    </Text>
                  </FormControl>
                </SimpleGrid>

                {/* Warranty & VAT */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} width="100%">
                  <FormControl isInvalid={!!errors.warranty}>
                    <FormLabel htmlFor="warranty" fontWeight="600" fontSize="12px" mb={1}>
                      Your default warranty *
                    </FormLabel>
                    <Select
                      id="warranty"
                      placeholder="Select warranty period"
                      size="md"
                      height="40px"
                      fontSize="14px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('warranty')}
                    >
                      <option value="3 months">3 Months</option>
                      <option value="6 months">6 Months</option>
                      <option value="12 months">12 Months</option>
                      <option value="1 year">1 Year</option>
                    </Select>
                    <FormErrorMessage fontSize="11px">{errors.warranty?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.vatNumber}>
                    <FormLabel htmlFor="vatNumber" fontWeight="600" fontSize="12px" mb={1}>
                      VAT Number (If applicable)
                    </FormLabel>
                    <Input
                      id="vatNumber"
                      placeholder="VAT Number"
                      size="md"
                      height="40px"
                      fontSize="14px"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      {...register('vatNumber')}
                    />
                    <FormErrorMessage fontSize="11px">{errors.vatNumber?.message}</FormErrorMessage>
                    <Text fontSize="10px" color="gray.500" mt={1}>
                      Optional
                    </Text>
                  </FormControl>
                </SimpleGrid>

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
                  loadingText="Creating account..."
                  mt={2}
                  _hover={{
                    bg: "#c92c34",
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.2s">
                  Create Account
                </Button>
              </VStack>
            </form>

            <Divider my={1} />

            <Text textAlign="center" fontSize="12px">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color={accentColor} fontWeight="bold" fontSize="12px">
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Industrial Trust Badge */}
      <Box mt={4} textAlign="center">
        <HStack justify="center" spacing={4} flexWrap="wrap">
          <Text fontSize="10px" color="gray.500">✓ Trusted Supplier</Text>
          <Text fontSize="10px" color="gray.500">✓ Quality Guaranteed</Text>
          <Text fontSize="10px" color="gray.500">✓ 24/7 Support</Text>
        </HStack>
      </Box>
    </Container>
  );
}