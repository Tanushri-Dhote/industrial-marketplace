import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Center,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Spinner,
    Text,
    VStack,
    CircularProgress,
    CircularProgressLabel,
} from "@chakra-ui/react";
import { CheckCircleIcon, LockIcon, EmailIcon } from "@chakra-ui/icons";
import { toast } from 'sonner';
import API from "../services/api";
import { useUser } from "../context/UserContext";

const RED = "#E10600";
const DARK = "#111111";

export default function VerifyLoginPage() {
    const { setUser } = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle | verifying | success | error
    const [errorMessage, setErrorMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const hasVerified = useRef(false);

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus('idle');
            return;
        }

        if (hasVerified.current) return;
        hasVerified.current = true;

        setStatus('verifying');

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

                toast.success("Login Successful. Welcome back!");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);

            } catch (error) {
                clearInterval(interval);

                const msg =
                    error.response?.data?.message ||
                    "Verification failed. Please try again.";

                setErrorMessage(msg);
                toast.error(msg);
            }
        };

        verifyLogin();

        return () => clearInterval(interval);
    }, [searchParams, navigate, setUser]);

    // Verifying State
    if (status === 'verifying') {
        return (
            <Center minH="100vh" bg="#f7f7f7">
                <Container maxW="md">
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="xl"
                        p={10}
                        textAlign="center"
                    >
                        <VStack spacing={6}>
                            <Box position="relative" display="inline-block">
                                <Icon as={LockIcon} w={16} h={16} color={RED} />
                                <Box
                                    position="absolute"
                                    top="-8px"
                                    right="-8px"
                                    bottom="-8px"
                                    left="-8px"
                                    borderRadius="full"
                                    border="3px solid"
                                    borderColor="gray.100"
                                    borderTopColor={RED}
                                    sx={{
                                        animation: 'spin 1s linear infinite',
                                        '@keyframes spin': {
                                            '0%': { transform: 'rotate(0deg)' },
                                            '100%': { transform: 'rotate(360deg)' },
                                        }
                                    }}
                                />
                            </Box>

                            <Heading size="lg" color={DARK}>
                                Verifying Login
                            </Heading>

                            <Text color="gray.600" fontSize="md">
                                Please wait while we verify your credentials...
                            </Text>

                            <CircularProgress value={progress} size="70px" thickness="8px" color={RED}>
                                <CircularProgressLabel fontWeight="700" color={DARK}>
                                    {progress}%
                                </CircularProgressLabel>
                            </CircularProgress>

                            <Box w="100%" h="3px" bg="gray.100" borderRadius="full" overflow="hidden">
                                <Box
                                    w={`${progress}%`}
                                    h="100%"
                                    bg={RED}
                                    borderRadius="full"
                                    transition="width 0.3s ease"
                                />
                            </Box>

                            <Text fontSize="sm" color="gray.500">
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
            <Center minH="100vh" bg="#f7f7f7">
                <Container maxW="md">
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="xl"
                        p={10}
                        textAlign="center"
                    >
                        <VStack spacing={5}>
                            <Box bg="red.50" borderRadius="full" p={4}>
                                <Icon as={CheckCircleIcon} w={16} h={16} color={RED} />
                            </Box>

                            <Heading size="lg" color={DARK}>
                                Login Successful!
                            </Heading>

                            <Text color="gray.600" fontSize="md">
                                Welcome back! Redirecting you to your dashboard...
                            </Text>

                            <Flex gap={2} align="center" justify="center">
                                <Spinner size="sm" color={RED} thickness="3px" />
                                <Text fontSize="sm" color="gray.500">
                                    Redirecting in 2 seconds
                                </Text>
                            </Flex>

                            <Button
                                onClick={() => navigate("/dashboard")}
                                bg={RED}
                                color="white"
                                w="full"
                                h="48px"
                                _hover={{ bg: "#c40000" }}
                            >
                                Go to Dashboard Now
                            </Button>
                        </VStack>
                    </Box>
                </Container>
            </Center>
        );
    }

    // Error / Verification Required State
    return (
        <Center minH="100vh" bg="#f7f7f7">
            <Container maxW="md">
                <Box
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="xl"
                    p={10}
                >
                    <VStack spacing={6} textAlign="center">
                        <Box bg="red.50" borderRadius="full" p={4}>
                            <Icon as={EmailIcon} w={16} h={16} color={RED} />
                        </Box>

                        <Heading size="lg" color={DARK}>
                            Verify Your Email
                        </Heading>

                        <Box
                            bg="red.50"
                            p={6}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="red.100"
                            w="100%"
                        >
                            <VStack spacing={3} align="stretch">
                                <Text color="gray.700" fontSize="md" fontWeight="500">
                                    We've sent a verification link to your email.
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    Please check your inbox (and spam folder) and click the link to complete login.
                                </Text>
                            </VStack>
                        </Box>

                        <Button
                            onClick={() => window.open("https://gmail.com", "_blank")}
                            bg={RED}
                            color="white"
                            w="full"
                            h="48px"
                            leftIcon={<EmailIcon />}
                            _hover={{ bg: "#c40000" }}
                        >
                            Open Gmail
                        </Button>

                        <HStack spacing={4} w="full">
                            <Button
                                onClick={() => navigate("/login")}
                                variant="ghost"
                                colorScheme="gray"
                                flex={1}
                                h="44px"
                            >
                                Back to Login
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                borderColor={RED}
                                color={RED}
                                flex={1}
                                h="44px"
                            >
                                Try Again
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Container>
        </Center>
    );
}