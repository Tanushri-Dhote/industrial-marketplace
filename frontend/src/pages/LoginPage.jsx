import { EmailIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Badge,
	Box,
	Button,
	Container,
	Divider,
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
	Text,
	useColorModeValue,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { toast } from "sonner";
import API from "../services/api";
import { useUser } from "../context/UserContext";

// Validation schema for login
const loginSchema = yup
	.object({
		username: yup.string().required("Username is required"),
		password: yup.string().required("Password is required"),
	})
	.required();

// Validation schema for reset password
const resetPasswordSchema = yup
	.object({
		newPassword: yup
			.string()
			.min(8, "Password must be at least 8 characters")
			.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
			.matches(/[a-z]/, "Password must contain at least one lowercase letter")
			.matches(/[0-9]/, "Password must contain at least one number")
			.matches(/[@$!%*?&#]/, "Password must contain at least one special character")
			.required("New password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("newPassword"), null], "Passwords must match")
			.required("Please confirm your password"),
	})
	.required();

export default function LoginPage() {
	const { setUser } = useUser();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showEmailVerificationUI, setShowEmailVerificationUI] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const resetToken = searchParams.get("token");

	// If there's a reset token, redirect to the dedicated reset page
	useEffect(() => {
		if (resetToken) {
			navigate(`/reset-password?token=${resetToken}`);
		}
	}, [resetToken, navigate]);

	const {
		register: registerLogin,
		handleSubmit: handleLoginSubmit,
		formState: { errors: loginErrors },
		reset: resetLoginForm,
	} = useForm({
		resolver: yupResolver(loginSchema),
		mode: "onChange",
	});

	const onSubmitLogin = async (data) => {
		try {
			setIsLoading(true);

			const payload = {
				email: data.username,
				password: data.password,
			};

			const res = await API.post("/auth/login", payload);

			if (res?.data?.token) {
				localStorage.setItem("token", res.data.token);
				if (res.data.data) {
					setUser(res.data.data);
				}
				sessionStorage.removeItem("pendingLoginUsername");
				toast.success("Login successful");
				navigate("/dashboard");
				return;
			}

			setShowEmailVerificationUI(true);
			toast.info("Verification Email Sent. Please check your email to complete login.");

			sessionStorage.setItem("pendingLoginUsername", data.username);
		} catch (error) {
			toast.error(error.response?.data?.message || "Invalid username or password");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendVerification = async () => {
		try {
			const username = sessionStorage.getItem("pendingLoginUsername");
			if (!username) {
				toast.error("Please try logging in again");
				setShowEmailVerificationUI(false);
				resetLoginForm();
				return;
			}

			setIsLoading(true);
			await API.post("/auth/resend-verification", { username });
			toast.success("Verification email resent!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to resend verification email");
		} finally {
			setIsLoading(false);
		}
	};

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
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
					borderColor={borderColor}
				>
					{/* Header */}
					<Box bg="#0F172A" py={4} px={6} textAlign="center">
						<HStack spacing={3} justify="center">
							<Box h="50px">
								<img
									src="/logo_engine.PNG"
									alt="All Engines Logo"
									style={{
										height: "100%",
										objectFit: "contain",
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
								<Text as="span" color={accentColor} ml={1}>
									4 You
								</Text>
							</Heading>
						</HStack>
					</Box>

					{/* Email Verification UI */}
					<Box p={6}>
						<VStack spacing={5} align="stretch">
							<VStack spacing={2} textAlign="center">
								<Box bg="blue.100" borderRadius="full" p={3} display="inline-block">
									<Icon as={EmailIcon} w={12} h={12} color="blue.500" />
								</Box>
								<Heading size="md" color="gray.800">
									Verify Your Email
								</Heading>
								<Text color="gray.600" fontSize="sm" textAlign="center">
									We've sent a verification code to your email address. Please check your inbox and
									click the verification link to complete your login.
								</Text>
							</VStack>

							<Box bg="blue.50" p={5} borderRadius="lg" border="1px solid" borderColor="blue.200">
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
									onClick={() => window.open("https://gmail.com", "_blank")}
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
				borderColor={borderColor}
			>
				{/* Header with Industrial Theme */}
				<Box bg="#0F172A" py={4} px={6} textAlign="center">
					<HStack spacing={3} justify="center">
						<Box h="50px">
							<img
								src="/logo_engine.png"
								alt="All Engines Logo"
								style={{
									height: "100%",
									objectFit: "contain",
								}}
							/>
						</Box>
						<Heading as="h1" fontSize="24px" fontWeight="800" letterSpacing="-0.5px" color="white">
							All Engine
							<Text as="span" color={accentColor} ml={1}>
								4 You
							</Text>
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
								Sign in to your account
							</Heading>
							<Text color="gray.500" fontSize="12px">
								Enter your credentials to continue
							</Text>
						</VStack>

						{/* Login Form */}
						<form onSubmit={handleLoginSubmit(onSubmitLogin)} style={{ width: "100%" }}>
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
										{...registerLogin("username")}
									/>
									<FormErrorMessage fontSize="11px">
										{loginErrors.username?.message}
									</FormErrorMessage>
								</FormControl>

								<FormControl isInvalid={!!loginErrors.password}>
									<FormLabel htmlFor="password" fontWeight="600" fontSize="12px" mb={1}>
										Password
									</FormLabel>
									<InputGroup size="md">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											fontSize="14px"
											height="40px"
											borderRadius="md"
											borderColor="gray.300"
											_hover={{ borderColor: accentColor }}
											_focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
											{...registerLogin("password")}
										/>
										<InputRightElement height="40px">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setShowPassword(!showPassword)}
												_hover={{ bg: "transparent" }}
											>
												{showPassword ? <ViewOffIcon /> : <ViewIcon />}
											</Button>
										</InputRightElement>
									</InputGroup>
									<FormErrorMessage fontSize="11px">
										{loginErrors.password?.message}
									</FormErrorMessage>
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
										transform: "translateY(-1px)",
										boxShadow: "md",
									}}
									transition="all 0.2s"
								>
									Sign in
								</Button>
							</VStack>
						</form>

						{/* Links Section */}
						<HStack justify="center" spacing={3} mt={2}>
							<Link
								as={RouterLink}
								to="/forgot-password"
								color={accentColor}
								fontSize="12px"
								fontWeight="500"
								cursor="pointer"
							>
								Forgot Password?
							</Link>
						</HStack>

						<Divider my={1} />

						<Text textAlign="center" fontSize="12px">
							Not a Member?{" "}
							<Link
								as={RouterLink}
								to="/register"
								color={accentColor}
								fontWeight="bold"
								fontSize="12px"
							>
								Create Account
							</Link>
						</Text>
					</VStack>
				</Box>
			</Box>

			{/* Industrial Trust Badge */}
			<Box mt={4} textAlign="center">
				<HStack justify="center" spacing={4} flexWrap="wrap">
					<Text fontSize="10px" color="gray.500">
						✓ Trusted Supplier
					</Text>
					<Text fontSize="10px" color="gray.500">
						✓ Quality Guaranteed
					</Text>
					<Text fontSize="10px" color="gray.500">
						✓ 24/7 Support
					</Text>
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
