import React, { useState, useEffect } from 'react';
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
  InputGroup,
  InputRightElement,
  Icon,
  useColorModeValue,
  Progress,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import API from '../services/api';

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

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = "#D90404";

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
            New Password
          </Heading>
          <Text color="whiteAlpha.700" fontSize="sm" mt={2}>
            Secure your account with a strong password
          </Text>
        </Box>

        <Box p={8}>
          <VStack as="form" spacing={6} onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.newPassword}>
              <FormLabel fontSize="sm" fontWeight="600">New Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  bg="gray.50"
                  h="50px"
                  borderRadius="lg"
                  {...register('newPassword')}
                />
                <InputRightElement h="50px">
                  <Button variant="ghost" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">{errors.newPassword?.message}</FormErrorMessage>
            </FormControl>

            {newPasswordValue && (
              <Box w="full" bg="gray.50" p={4} borderRadius="lg" border="1px solid" borderColor="gray.100">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" fontWeight="bold">Strength</Text>
                  <Text fontSize="xs" color={strength < 3 ? "red.500" : strength < 5 ? "orange.500" : "green.500"}>
                    {strength < 3 ? "Weak" : strength < 5 ? "Good" : "Excellent"}
                  </Text>
                </HStack>
                <Progress value={(strength / 5) * 100} size="xs" colorScheme={strength < 3 ? "red" : strength < 5 ? "orange" : "green"} borderRadius="full" mb={4} />
                <VStack align="start" spacing={1}>
                  {Object.entries({
                    "At least 8 chars": checks.length,
                    "Uppercase letter": checks.uppercase,
                    "Lowercase letter": checks.lowercase,
                    "Number": checks.number,
                    "Special character": checks.special
                  }).map(([label, met]) => (
                    <HStack key={label} spacing={2} color={met ? "green.600" : "gray.400"}>
                      <Icon as={met ? CheckIcon : WarningIcon} boxSize={2.5} />
                      <Text fontSize="10px" fontWeight={met ? "700" : "500"}>{label}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel fontSize="sm" fontWeight="600">Confirm Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  bg="gray.50"
                  h="50px"
                  borderRadius="lg"
                  {...register('confirmPassword')}
                />
                <InputRightElement h="50px">
                  <Button variant="ghost" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">{errors.confirmPassword?.message}</FormErrorMessage>
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
              isDisabled={strength < 5}
              _hover={{ bg: "#b80303", transform: "translateY(-2px)", boxShadow: "lg" }}
            >
              Update Password
            </Button>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
}
