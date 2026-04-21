import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    useToast,
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Spinner,
    Icon,
    Flex,
    Button,
    Center,
    CircularProgress,
    CircularProgressLabel,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, LockIcon, EmailIcon } from "@chakra-ui/icons";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function VerifyLoginPage() {
    const { setUser } = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [status, setStatus] = useState('idle');
    // idle | verifying | success | error
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            // 👉 This is NOT an error — user just opened page manually
            setStatus('idle'); // new state
            return;
        }
        setStatus('verifying');

        // Simulate progress for better UX
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return 90;
                return prev + 10;
            });
        }, 200);

        const verifyLogin = async () => {
            try {
                const res = await API.post("/auth/verify-login", { token });

                localStorage.setItem("token", res.data.token);
                setUser(res.data.data);

                setProgress(100);
                setStatus('success');

                toast({
                    title: "Login Successful",
                    description: "Welcome back! Redirecting to dashboard...",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);

            }
            catch (error) {
                clearInterval(interval);

                const msg =
                    error.response?.data?.message ||
                    "Verification failed. Please try again.";

                // 🔥 KEY CHANGE
                if (msg.includes("expired") || msg.includes("Invalid")) {
                    setStatus("idle"); // 👈 go back to email check UI
                } else {
                    setStatus("error"); // real error
                }

                setErrorMessage(msg);

                toast({
                    title: "Verification Failed",
                    description: msg,
                    status: "error",
                });
            }
        };

        verifyLogin();

        return () => clearInterval(interval);
    }, [searchParams, navigate, toast]);

    // Verifying State
    if (status === 'verifying') {
        return (
            <Center minH="100vh" bgGradient="linear(to-br, blue.50, purple.50)" position="relative" overflow="hidden">
                {/* Animated Background using sx prop */}
                <Box
                    position="absolute"
                    w="300px"
                    h="300px"
                    borderRadius="full"
                    bg="blue.200"
                    opacity="0.3"
                    top="-100px"
                    left="-100px"
                    sx={{
                        animation: 'pulse 3s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%': { opacity: 0.6, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.05)' },
                            '100%': { opacity: 0.6, transform: 'scale(1)' },
                        }
                    }}
                />
                <Box
                    position="absolute"
                    w="400px"
                    h="400px"
                    borderRadius="full"
                    bg="purple.200"
                    opacity="0.3"
                    bottom="-150px"
                    right="-150px"
                    sx={{
                        animation: 'pulse 4s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%': { opacity: 0.6, transform: 'scale(1)' },
                            '50%': { opacity: 1, transform: 'scale(1.05)' },
                            '100%': { opacity: 0.6, transform: 'scale(1)' },
                        }
                    }}
                />

                <Container maxW="md">
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        p={8}
                        textAlign="center"
                        sx={{
                            animation: 'fadeInUp 0.5s ease-out',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            }
                        }}
                    >
                        <VStack spacing={6}>
                            {/* Lock Icon with Spinner Overlay */}
                            <Box position="relative" display="inline-block">
                                <Icon as={LockIcon} w={16} h={16} color="blue.500" />
                                <Box
                                    position="absolute"
                                    top="-8px"
                                    right="-8px"
                                    bottom="-8px"
                                    left="-8px"
                                    borderRadius="full"
                                    border="2px solid"
                                    borderColor="blue.200"
                                    borderTopColor="blue.500"
                                    sx={{
                                        animation: 'spin 1s linear infinite',
                                        '@keyframes spin': {
                                            '0%': { transform: 'rotate(0deg)' },
                                            '100%': { transform: 'rotate(360deg)' },
                                        }
                                    }}
                                />
                            </Box>

                            <Heading size="lg" color="gray.800">
                                Verifying Login
                            </Heading>

                            <Text color="gray.600" fontSize="md">
                                Please wait while we verify your credentials...
                            </Text>

                            {/* Progress Indicator */}
                            <Box w="100%">
                                <CircularProgress value={progress} size="60px" thickness="8px" color="blue.500">
                                    <CircularProgressLabel>{progress}%</CircularProgressLabel>
                                </CircularProgress>
                            </Box>

                            {/* Loading Bar */}
                            <Box w="100%" h="2px" bg="gray.100" borderRadius="full" overflow="hidden">
                                <Box
                                    w={`${progress}%`}
                                    h="100%"
                                    bgGradient="linear(to-r, blue.400, purple.500)"
                                    borderRadius="full"
                                    transition="width 0.3s ease"
                                />
                            </Box>

                            <Text fontSize="sm" color="gray.400">
                                This will only take a moment
                            </Text>
                        </VStack>
                    </Box>
                </Container>
            </Center>
        );
    }

    // Success State
    if (status === 'success') {
        return (
            <Center minH="100vh" bgGradient="linear(to-br, green.50, teal.50)">
                <Container maxW="md">
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="2xl"
                        p={8}
                        textAlign="center"
                        sx={{
                            animation: 'fadeInUp 0.5s ease-out',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            }
                        }}
                    >
                        <VStack spacing={5}>
                            <Box
                                bg="green.100"
                                borderRadius="full"
                                p={3}
                                sx={{
                                    animation: 'pulse 1s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.1)' },
                                        '100%': { transform: 'scale(1)' },
                                    }
                                }}
                            >
                                <Icon as={CheckCircleIcon} w={16} h={16} color="green.500" />
                            </Box>

                            <Heading size="lg" color="gray.800">
                                Login Successful!
                            </Heading>

                            <Text color="gray.600" fontSize="md">
                                Welcome back! Redirecting you to your dashboard...
                            </Text>

                            <Flex gap={2} align="center" justify="center">
                                <Spinner size="sm" color="green.500" thickness="3px" />
                                <Text fontSize="sm" color="gray.500">
                                    Redirecting in 2 seconds
                                </Text>
                            </Flex>

                            <Button
                                onClick={() => navigate("/dashboard")}
                                colorScheme="green"
                                variant="ghost"
                                size="sm"
                            >
                                Go now
                            </Button>
                        </VStack>
                    </Box>
                </Container>
            </Center>
        );
    }

    // Error State - Updated to prompt Gmail check
    return (
        <Center minH="100vh" bgGradient="linear(to-br, yellow.50, orange.50)">
            <Container maxW="md">
                <Box
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="2xl"
                    p={8}
                    sx={{
                        animation: 'fadeInUp 0.5s ease-out',
                        '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        }
                    }}
                >
                    <VStack spacing={5}>
                        <Box bg="blue.100" borderRadius="full" p={3}>
                            <Icon as={EmailIcon} w={16} h={16} color="blue.500" />
                        </Box>

                        <Heading size="lg" color="gray.800">
                            Verification Required
                        </Heading>

                        <Box
                            bg="blue.50"
                            p={5}
                            borderRadius="lg"
                            textAlign="center"
                            w="100%"
                        >
                            <VStack spacing={3}>
                                <Text color="blue.800" fontSize="md" fontWeight="semibold">
                                    Please check your Gmail account
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    We've sent a verification link to your email address.
                                    Please click the link in the email to complete your login.
                                </Text>
                                <Flex gap={2} mt={2}>
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        variant="link"
                                        onClick={() => window.open('https://gmail.com', '_blank')}
                                    >
                                        Open Gmail
                                    </Button>
                                    {/* <Text color="gray.400">•</Text> */}
                                    {/* <Button
                                        size="xs"
                                        colorScheme="blue"
                                        variant="link"
                                        onClick={() => window.location.reload()}
                                    >
                                        Resend Email
                                    </Button> */}
                                </Flex>
                            </VStack>
                        </Box>

                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            Didn't receive the email? Check your spam folder"
                        </Text>

                        <Flex gap={4} pt={4} w="100%">
                            <Button
                                onClick={() => navigate("/login")}
                                colorScheme="blue"
                                flex={1}
                                _hover={{ transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                Back to Login
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                colorScheme="blue"
                                flex={1}
                                _hover={{ transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                Try Again
                            </Button>
                        </Flex>
                    </VStack>
                </Box>
            </Container>
        </Center>
    );
}