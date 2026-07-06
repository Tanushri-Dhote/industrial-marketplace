import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaShieldAlt, FaTruck, FaTools } from 'react-icons/fa';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import API from "../services/api";

const RED = "#E10600";
const DARK = "#111111";

const schema = yup.object({
  businessName: yup.string().required('Business name is required').min(2, 'Must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone1: yup.string()
    .required('Primary phone number is required')
    .test('is-uk-phone', 'Invalid UK phone number', (value) => {
      if (!value) return false;
      const cleaned = value.replace(/\s+/g, '');
      return /^(?:(?:\+44\s?|0)7\d{3}\s?\d{6}|(?:\+44\s?|0)1\d{2}\s?\d{7}|(?:\+44\s?|0)2\d{1}\s?\d{8})$/.test(cleaned);
    }),
  phone2: yup.string()
    .test('is-uk-phone-optional', 'Invalid UK phone number', (value) => {
      if (!value) return true;
      const cleaned = value.replace(/\s+/g, '');
      return /^(?:(?:\+44\s?|0)7\d{3}\s?\d{6}|(?:\+44\s?|0)1\d{2}\s?\d{7}|(?:\+44\s?|0)2\d{1}\s?\d{8})$/.test(cleaned);
    })
    .optional(),
  warranty: yup.string().required('Warranty period is required'),
  vatNumber: yup.string().optional(),
}).required();

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const siteId = searchParams.get('site') || import.meta.env.VITE_SITE_ID || null;

  useEffect(() => {
    if (!siteId) return;
    API.get(`/websites/${siteId}/public`)
      .then((res) => setSiteInfo(res.data.data))
      .catch(() => setSiteInfo(null));
  }, [siteId]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        name: data.businessName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        business_name: data.businessName,
        phone1: data.phone1,
        phone2: data.phone2 || '',
        warranty: data.warranty,
        vat_number: data.vatNumber || '',
        role: 'admin',
        site_id: siteId || undefined,
      };
      await API.post('/auth/register', payload);
      toast.success('Registration successful! Please Login to continue.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="stretch" bg="#f7f7f7">
      {/* LEFT PANEL — branding */}
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
        {/* Decorative circles */}
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
            Join Our Network.{" "}
            <Text as="span" color={RED}>
              Grow Together.
            </Text>
          </Heading>
          <Text color="whiteAlpha.600" fontSize="15px" maxW="340px" lineHeight="1.7">
            Register your business and get access to premium reconditioned engines at trade prices.
          </Text>
        </Box>

        {/* Feature badges */}
        <VStack align="flex-start" spacing={5} mb={8}>
          {[
            { icon: FaShieldAlt, label: "Quality Tested", sub: "100% Inspected" },
            { icon: FaTools, label: "06 Months Warranty", sub: "For Peace of Mind" },
            { icon: FaTruck, label: "Local collection and delivery available.", sub: "We can arrange the collection of your vehicle locally" },
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

        {/* Trust badges */}
        <HStack spacing={6} flexWrap="wrap">
          {["Trusted Supplier", "Quality Guaranteed", "24/7 Support"].map((t) => (
            <Text key={t} fontSize="11px" color="whiteAlpha.500">✓ {t}</Text>
          ))}
        </HStack>
      </Flex>

      {/* RIGHT PANEL — form */}
      <Flex
        flex={{ base: "1", lg: "0 0 520px" }}
        direction="column"
        justify="center"
        align="center"
        bg="white"
        px={{ base: 6, md: 10 }}
        py={{ base: 8, md: 10 }}
        minH="100vh"
        overflowY="auto"
      >
        {/* Mobile logo */}
        <Box display={{ base: "block", lg: "none" }} mb={6} textAlign="center">
          <Box h="48px" mx="auto" display="flex" justifyContent="center">
            <img src="/logo.png" alt="Logo" style={{ height: "100%", objectFit: "contain" }} />
          </Box>
          <Text color="gray.400" fontSize="11px" letterSpacing="2px" fontWeight="500" mt={1} textTransform="uppercase">
            Rebuilt • Repair • Replacement • Reconditioned
          </Text>
        </Box>

        <Box w="full" maxW="420px">
          {/* Title */}
          <VStack spacing={1} align="flex-start" mb={6}>
            <HStack mb={2}>
              <Box w="4px" h="24px" bg={RED} borderRadius="full" />
              <Text color={RED} fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                New Account
              </Text>
            </HStack>
            <Heading fontSize="26px" fontWeight="900" color={DARK}>
              Create Business Account
            </Heading>
            <Text color="gray.500" fontSize="13px">
              Enter your business details carefully to continue.
            </Text>
          </VStack>

          {/* Site Badge */}
          {siteInfo && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.100"
              borderRadius="lg"
              px={4}
              py={3}
              mb={5}
            >
              <HStack spacing={3}>
                <Text fontSize="16px">📍</Text>
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="12px" fontWeight="700" color={RED}>
                    Registering for: {siteInfo.name}
                  </Text>
                  {siteInfo.domain && (
                    <Text fontSize="11px" color="red.400">{siteInfo.domain}</Text>
                  )}
                </VStack>
              </HStack>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack spacing={4}>
              {/* Business Name */}
              <FormControl isInvalid={!!errors.businessName}>
                <FormLabel htmlFor="businessName" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                  Business Name *
                </FormLabel>
                <Input
                  id="businessName"
                  placeholder="Business and trading name"
                  h="46px"
                  fontSize="14px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  bg="#f7f7f7"
                  _hover={{ borderColor: RED }}
                  _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                  {...register('businessName')}
                />
                <FormErrorMessage fontSize="12px">{errors.businessName?.message}</FormErrorMessage>
              </FormControl>

              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                  E-mail Address * <Text as="span" color="gray.400" fontWeight="400">(This will be your username)</Text>
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  h="46px"
                  fontSize="14px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  bg="#f7f7f7"
                  _hover={{ borderColor: RED }}
                  _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                  {...register('email')}
                />
                <FormErrorMessage fontSize="12px">{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Password */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                  Password *
                </FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Strong Password"
                    h="46px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('password')}
                  />
                  <InputRightElement h="46px">
                    <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} _hover={{ bg: 'transparent' }} color="gray.400">
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="12px">{errors.password?.message}</FormErrorMessage>
              </FormControl>

              {/* Confirm Password */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel htmlFor="confirmPassword" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                  Confirm Password *
                </FormLabel>
                <InputGroup>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    h="46px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('confirmPassword')}
                  />
                  <InputRightElement h="46px">
                    <Button variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} _hover={{ bg: 'transparent' }} color="gray.400">
                      {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="12px">{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>

              {/* Phone Numbers */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} width="100%">
                <FormControl isInvalid={!!errors.phone1}>
                  <FormLabel htmlFor="phone1" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                    Phone 1 *
                  </FormLabel>
                  <Input
                    id="phone1"
                    type="tel"
                    placeholder="Phone Primary"
                    h="46px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('phone1')}
                  />
                  <FormErrorMessage fontSize="12px">{errors.phone1?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.phone2}>
                  <FormLabel htmlFor="phone2" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                    Phone 2{" "}
                    <Text as="span" color="gray.400" fontWeight="400" fontSize="12px">(Optional)</Text>
                  </FormLabel>
                  <Input
                    id="phone2"
                    type="tel"
                    placeholder="Phone Alternate"
                    h="46px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('phone2')}
                  />
                  <FormErrorMessage fontSize="12px">{errors.phone2?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              {/* Warranty & VAT */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} width="100%">
                <FormControl isInvalid={!!errors.warranty}>
                  <FormLabel htmlFor="warranty" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                    Default Warranty *
                  </FormLabel>
                  <Select
                    id="warranty"
                    placeholder="Select warranty period"
                    h="46px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('warranty')}
                  >
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="12 months">12 Months</option>
                    <option value="1 year">1 Year</option>
                  </Select>
                  <FormErrorMessage fontSize="12px">{errors.warranty?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.vatNumber}>
                  <FormLabel htmlFor="vatNumber" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                    VAT Number{" "}
                    <Text as="span" color="gray.400" fontWeight="400" fontSize="12px">(If applicable)</Text>
                  </FormLabel>
                  <Input
                    id="vatNumber"
                    placeholder="VAT Number"
                    h="46px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('vatNumber')}
                  />
                  <FormErrorMessage fontSize="12px">{errors.vatNumber?.message}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

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
                loadingText="Creating account..."
                mt={1}
                _hover={{ bg: "#c40000", transform: 'translateY(-1px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Create Account
              </Button>
            </VStack>
          </form>

          <Divider my={5} borderColor="gray.100" />

          <Text textAlign="center" fontSize="14px" color="gray.500">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color={RED} fontWeight="700" _hover={{ textDecoration: "underline" }}>
              Sign In
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}