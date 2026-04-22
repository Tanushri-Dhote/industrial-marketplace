import React, { useState, useEffect } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, WarningIcon, EmailIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from "../services/api";

// Validation schema for login
const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

// Validation schema for reset password
const resetPasswordSchema = yup.object({
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
}).required();

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showEmailVerificationUI, setShowEmailVerificationUI] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const { isOpen: isResetModalOpen, onOpen: onOpenResetModal, onClose: onCloseResetModal } = useDisclosure();

  // Password strength checker
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Check for reset token on component mount
  useEffect(() => {
    if (resetToken) {
      setMode("reset");
    }
  }, [resetToken]);

  const { 
    register: registerLogin, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const { 
    register: registerReset, 
    handleSubmit: handleResetSubmit, 
    formState: { errors: resetErrors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const newPasswordValue = watch('newPassword', '');

  // Check password strength
  useEffect(() => {
    const checks = {
      length: newPasswordValue.length >= 8,
      uppercase: /[A-Z]/.test(newPasswordValue),
      lowercase: /[a-z]/.test(newPasswordValue),
      number: /[0-9]/.test(newPasswordValue),
      special: /[@$!%*?&#]/.test(newPasswordValue),
    };
    
    setPasswordChecks(checks);
    
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [newPasswordValue]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'red';
    if (passwordStrength <= 3) return 'orange';
    if (passwordStrength <= 4) return 'yellow';
    return 'green';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const onSubmitLogin = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        email: data.username,
        password: data.password,
      };

      const res = await API.post("/auth/login", payload);

      // Show email verification UI instead of navigating immediately
      setShowEmailVerificationUI(true);
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification code",
        status: "info",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      // Store username for reference (optional)
      sessionStorage.setItem("pendingLoginUsername", data.username);

    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      await API.post("/auth/forgot-password", { email });

      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions",
        status: "success",
        duration: 5000,
      });

      // After successful password reset request, navigate to login directly
      setMode("login");
      setEmail("");
      
      // Show additional message
      toast({
        title: "Check Your Email",
        description: "Password reset link has been sent. After resetting, please login with your new password.",
        status: "info",
        duration: 6000,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset link",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitResetPassword = async (data) => {
    try {
      setIsResetting(true);

      await API.post("/auth/reset-password", {
        token: resetToken,
        newPassword: data.newPassword,
      });

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. Please login with your new password.",
        status: "success",
        duration: 5000,
      });

      // Navigate directly to login page after successful reset
      navigate("/login");
      
      // Clear the reset token from URL
      window.history.replaceState({}, document.title, "/login");

    } catch (error) {
      toast({
        title: "Reset Failed",
        description: error.response?.data?.message || "Unable to reset password",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const username = sessionStorage.getItem("pendingLoginUsername");
      if (!username) {
        toast({
          title: "Error",
          description: "Please try logging in again",
          status: "error",
          duration: 3000,
        });
        setShowEmailVerificationUI(false);
        resetLoginForm();
        return;
      }

      setIsLoading(true);
      await API.post("/auth/resend-verification", { username });
      
      toast({
        title: "Verification Email Resent",
        description: "Please check your email for the verification code",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend verification email",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = "#D90404";

  // Email Verification UI
  if (showEmailVerificationUI) {
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
          
          {/* Header */}
          <Box bg="#0F172A" py={4} px={6} textAlign="center">
            <HStack spacing={3} justify="center">
              <Box h="50px">
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
          </Box>

          {/* Email Verification UI */}
          <Box p={6}>
            <VStack spacing={5} align="stretch">
              <VStack spacing={2} textAlign="center">
                <Box
                  bg="blue.100"
                  borderRadius="full"
                  p={3}
                  display="inline-block"
                >
                  <Icon as={EmailIcon} w={12} h={12} color="blue.500" />
                </Box>
                <Heading size="md" color="gray.800">
                  Verify Your Email
                </Heading>
                <Text color="gray.600" fontSize="sm" textAlign="center">
                  We've sent a verification code to your email address.
                  Please check your inbox and click the verification link to complete your login.
                </Text>
              </VStack>

              <Box
                bg="blue.50"
                p={5}
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
              >
                <VStack spacing={3}>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" fontSize="xs" p={1}>
                      Step 1
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      Check your email inbox
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" fontSize="xs" p={1}>
                      Step 2
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      Click the verification link in the email
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" fontSize="xs" p={1}>
                      Step 3
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      You'll be automatically redirected to your dashboard
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Alert status="info" borderRadius="md" fontSize="sm">
                <AlertIcon />
                Didn't receive the email? Check your spam folder.
              </Alert>

              <VStack spacing={3}>
                <Button
                  onClick={() => window.open('https://gmail.com', '_blank')}
                  colorScheme="blue"
                  width="100%"
                  leftIcon={<EmailIcon />}
                >
                  Open Gmail
                </Button>
                
                {/* <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  Resend Verification Email
                </Button> */}

                <Button
                  onClick={() => {
                    setShowEmailVerificationUI(false);
                    resetLoginForm();
                    sessionStorage.removeItem("pendingLoginUsername");
                  }}
                  variant="ghost"
                  colorScheme="gray"
                  width="100%"
                  size="sm"
                >
                  Back to Login
                </Button>
              </VStack>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                The verification link expires in 15 minutes for security reasons.
              </Text>
            </VStack>
          </Box>
        </Box>
      </Container>
    );
  }

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
            <Box h="50px">
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

        {/* Form Section */}
        <Box p={6}>
          <VStack spacing={4} align="stretch">
            <VStack spacing={1} textAlign="center">
              <Heading size="sm" color="gray.700" fontSize="18px">
                {mode === "login" && "Sign in to your account"}
                {mode === "forgot" && "Reset Your Password"}
                {mode === "reset" && "Create New Password"}
              </Heading>
              <Text color="gray.500" fontSize="12px">
                {mode === "login" && "Enter your credentials to continue"}
                {mode === "forgot" && "We'll send you a reset link"}
                {mode === "reset" && "Enter your new password below"}
              </Text>
            </VStack>

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit(onSubmitLogin)} style={{ width: '100%' }}>
                <VStack spacing={3}>
                  <FormControl isInvalid={!!loginErrors.username}>
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
                      {...registerLogin('username')}
                    />
                    <FormErrorMessage fontSize="11px">{loginErrors.username?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!loginErrors.password}>
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
                        {...registerLogin('password')}
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
                    <FormErrorMessage fontSize="11px">{loginErrors.password?.message}</FormErrorMessage>
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
                      bg: "#b80303",
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s">
                    Sign in
                  </Button>
                </VStack>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === "forgot" && (
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel fontSize="12px" mb={1}>Email Address</FormLabel>
                  <Input
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="md"
                    height="40px"
                    fontSize="14px"
                  />
                </FormControl>

                <Button
                  onClick={handleForgotPassword}
                  isLoading={isLoading}
                  width="100%"
                  bg={accentColor}
                  _hover={{ bg: "#b80303" }}
                  mt={2}>
                  Send Reset Link
                </Button>

                <Button 
                  variant="link" 
                  onClick={() => setMode("login")}
                  color={accentColor}
                  fontSize="12px"
                  mt={2}>
                  ← Back to Login
                </Button>
              </VStack>
            )}

            {/* Reset Password Form */}
            {mode === "reset" && (
              <form onSubmit={handleResetSubmit(onSubmitResetPassword)} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!resetErrors.newPassword}>
                    <FormLabel fontSize="12px" mb={1}>New Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        fontSize="14px"
                        height="40px"
                        {...registerReset('newPassword')}
                      />
                      <InputRightElement height="40px">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontSize="11px">{resetErrors.newPassword?.message}</FormErrorMessage>
                  </FormControl>

                  {/* Password Strength Indicator */}
                  {newPasswordValue && (
                    <Box w="100%">
                      <Progress 
                        value={(passwordStrength / 5) * 100} 
                        size="xs" 
                        colorScheme={getPasswordStrengthColor()}
                        borderRadius="full"
                        mb={2}
                      />
                      <HStack justify="space-between" fontSize="11px">
                        <Text color={`${getPasswordStrengthColor()}.500`} fontWeight="bold">
                          Strength: {getPasswordStrengthText()}
                        </Text>
                        <Text color="gray.500">
                          {passwordStrength}/5 requirements met
                        </Text>
                      </HStack>
                      
                      {/* Password Requirements Checklist */}
                      <VStack align="start" spacing={1} mt={2}>
                        <HStack spacing={2}>
                          {passwordChecks.length ? <CheckIcon boxSize={2.5} color="green.500" /> : <WarningIcon boxSize={2.5} color="gray.400" />}
                          <Text fontSize="10px" color={passwordChecks.length ? "green.600" : "gray.500"}>
                            At least 8 characters
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          {passwordChecks.uppercase ? <CheckIcon boxSize={2.5} color="green.500" /> : <WarningIcon boxSize={2.5} color="gray.400" />}
                          <Text fontSize="10px" color={passwordChecks.uppercase ? "green.600" : "gray.500"}>
                            One uppercase letter
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          {passwordChecks.lowercase ? <CheckIcon boxSize={2.5} color="green.500" /> : <WarningIcon boxSize={2.5} color="gray.400" />}
                          <Text fontSize="10px" color={passwordChecks.lowercase ? "green.600" : "gray.500"}>
                            One lowercase letter
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          {passwordChecks.number ? <CheckIcon boxSize={2.5} color="green.500" /> : <WarningIcon boxSize={2.5} color="gray.400" />}
                          <Text fontSize="10px" color={passwordChecks.number ? "green.600" : "gray.500"}>
                            One number
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          {passwordChecks.special ? <CheckIcon boxSize={2.5} color="green.500" /> : <WarningIcon boxSize={2.5} color="gray.400" />}
                          <Text fontSize="10px" color={passwordChecks.special ? "green.600" : "gray.500"}>
                            One special character (@$!%*?&#)
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  )}

                  <FormControl isInvalid={!!resetErrors.confirmPassword}>
                    <FormLabel fontSize="12px" mb={1}>Confirm Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        fontSize="14px"
                        height="40px"
                        {...registerReset('confirmPassword')}
                      />
                      <InputRightElement height="40px">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontSize="11px">{resetErrors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={isResetting}
                    loadingText="Resetting Password..."
                    width="100%"
                    bg={accentColor}
                    _hover={{ bg: "#b80303" }}
                    mt={2}
                    isDisabled={passwordStrength < 4}>
                    Reset Password
                  </Button>

                  <Button 
                    variant="link" 
                    onClick={() => setMode("login")}
                    color={accentColor}
                    fontSize="12px">
                    ← Back to Login
                  </Button>
                </VStack>
              </form>
            )}

            {/* Links Section (Only for login mode) */}
            {mode === "login" && (
              <>
                <HStack justify="center" spacing={3} mt={2}>
                  <Link
                    color={accentColor}
                    fontSize="12px"
                    fontWeight="500"
                    onClick={() => setMode("forgot")}
                    cursor="pointer">
                    Forgot Password?
                  </Link>
                 
                </HStack>

                <Divider my={1} />

                <Text textAlign="center" fontSize="12px">
                  Not a Member?{' '}
                  <Link as={RouterLink} to="/register" color={accentColor} fontWeight="bold" fontSize="12px">
                    Create Account
                  </Link>
                </Text>
              </>
            )}
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

      {/* Demo Credentials (Only for login mode) */}
      {/* {mode === "login" && (
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
            <Text fontSize="10px"><strong>Demo Credentials:</strong></Text>
            <Text fontSize="10px">Username: superadmin | Password: Admin@123</Text>
            <Text fontSize="10px">Username: webadmin | Password: Admin@123</Text>
            <Text fontSize="10px">Username: sales | Password: Sales@123</Text>
          </VStack>
        </Alert>
      )} */}
    </Container>
  );
}