import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  Progress,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import API from '../services/api';
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const RED = "#E10600";
const DARK = "#111111";

const resetPasswordSchema = yup.object({
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'One uppercase letter')
    .matches(/[a-z]/, 'One lowercase letter')
    .matches(/[0-9]/, 'One number')
    .matches(/[@$!%*?&#]/, 'One special character')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
}).required();

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const newPasswordValue = watch('newPassword', '');
  const [strength, setStrength] = useState(0);
  const [checks, setChecks] = useState({
    length: false, uppercase: false, lowercase: false, number: false, special: false
  });

  useEffect(() => {
    const newChecks = {
      length: newPasswordValue.length >= 8,
      uppercase: /[A-Z]/.test(newPasswordValue),
      lowercase: /[a-z]/.test(newPasswordValue),
      number: /[0-9]/.test(newPasswordValue),
      special: /[@$!%*?&#]/.test(newPasswordValue),
    };
    setChecks(newChecks);
    setStrength(Object.values(newChecks).filter(Boolean).length);
  }, [newPasswordValue]);

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error('Invalid or expired reset token');
      return;
    }
    try {
      setIsLoading(true);
      await API.post('/auth/reset-password', {
        token: resetToken,
        newPassword: data.newPassword,
      });
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColor = strength < 3 ? "red" : strength < 5 ? "orange" : "green";
  const strengthLabel = strength < 3 ? "Weak" : strength < 5 ? "Good" : "Strong";

  return (
    <Flex minH="100vh" align="stretch" bg="#f7f7f7">
      {/* LEFT PANEL — Branding */}
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
            { icon: FaShieldAlt, label: "Bank-Level Security", sub: "Encrypted Reset" },
            { icon: FaCheckCircle, label: "Strong Password Policy", sub: "Protected Account" },
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
          <VStack spacing={1} align="flex-start" mb={8}>
            <HStack mb={2}>
              <Box w="4px" h="24px" bg={RED} borderRadius="full" />
              <Text color={RED} fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                SECURITY UPDATE
              </Text>
            </HStack>
            <Heading fontSize="28px" fontWeight="900" color={DARK}>
              Set New Password
            </Heading>
            <Text color="gray.500" fontSize="14px">
              Create a strong password for your account
            </Text>
          </VStack>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <VStack spacing={5}>
              {/* New Password */}
              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                  New Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    h="48px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('newPassword')}
                  />
                  <InputRightElement h="48px">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      _hover={{ bg: 'transparent' }}
                      color="gray.400"
                    >
                      {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="12px">{errors.newPassword?.message}</FormErrorMessage>
              </FormControl>

              {/* Password Strength Meter */}
              {newPasswordValue && (
                <Box bg="#f7f7f7" p={5} borderRadius="xl" border="1px solid" borderColor="gray.100">
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="13px" fontWeight="700" color="gray.600">Password Strength</Text>
                    <Text
                      fontSize="13px"
                      fontWeight="700"
                      color={strength < 3 ? "red.500" : strength < 5 ? "orange.500" : "green.500"}
                    >
                      {strengthLabel}
                    </Text>
                  </HStack>
                  <Progress
                    value={(strength / 5) * 100}
                    size="sm"
                    colorScheme={strengthColor}
                    borderRadius="full"
                    mb={4}
                  />
                  <VStack align="start" spacing={2}>
                    {Object.entries({
                      "At least 8 characters": checks.length,
                      "One uppercase letter": checks.uppercase,
                      "One lowercase letter": checks.lowercase,
                      "One number": checks.number,
                      "One special character": checks.special,
                    }).map(([label, met]) => (
                      <HStack key={label} spacing={2} color={met ? "green.600" : "gray.400"}>
                        <Icon as={met ? CheckIcon : WarningIcon} boxSize={3.5} />
                        <Text fontSize="13px" fontWeight={met ? "600" : "500"}>{label}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Confirm Password */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
                  Confirm New Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    h="48px"
                    fontSize="14px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="#f7f7f7"
                    _hover={{ borderColor: RED }}
                    _focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
                    {...register('confirmPassword')}
                  />
                  <InputRightElement h="48px">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      _hover={{ bg: 'transparent' }}
                      color="gray.400"
                    >
                      {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="12px">{errors.confirmPassword?.message}</FormErrorMessage>
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
                loadingText="Updating Password..."
                isDisabled={strength < 5}
                _hover={{ bg: "#c40000", transform: "translateY(-1px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Update Password
              </Button>
            </VStack>
          </form>

          <Divider my={6} borderColor="gray.100" />

          <HStack justify="center">
            <Button
              as="a"
              href="/login"
              variant="ghost"
              color="gray.500"
              fontSize="14px"
              fontWeight="600"
              _hover={{ color: RED }}
            >
              ← Back to Login
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Flex>
  );
}