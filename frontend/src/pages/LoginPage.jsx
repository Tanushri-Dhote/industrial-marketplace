import { EmailIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Badge,
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
	Text,
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
import { FaShieldAlt, FaTruck, FaTools, FaCog } from "react-icons/fa";

const RED = "#E10600";
const DARK = "#111111";

// Validation schema for login
const loginSchema = yup
	.object({
		username: yup.string().required("Username is required"),
		password: yup.string().required("Password is required"),
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
			const payload = { email: data.username, password: data.password };
			const res = await API.post("/auth/login", payload);

			if (res?.data?.token) {
				localStorage.setItem("token", res.data.token);
				if (res.data.data) setUser(res.data.data);
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

	// ───── Email Verification UI ─────
	if (showEmailVerificationUI) {
		return (
			<Flex minH="100vh" align="center" justify="center" bg="#f7f7f7" p={{ base: 4, md: 0 }}>
				<Box
					w="full"
					maxW="440px"
					bg="white"
					borderRadius="2xl"
					boxShadow="xl"
					overflow="hidden"
				>
					{/* Header */}
					<Box bg={DARK} py={5} px={6} textAlign="center">
						<Box h="48px" display="flex" justifyContent="center" mb={2}>
							<img src="/logo.png" alt="Logo" style={{ height: "100%", objectFit: "contain" }} />
						</Box>
						<Text color="whiteAlpha.700" fontSize="11px" fontWeight="500" letterSpacing="2px" textTransform="uppercase">
							Rebuilt • Repair • Replacement • Reconditioned
						</Text>
					</Box>

					<Box p={8}>
						<VStack spacing={5} align="stretch">
							<VStack spacing={2} textAlign="center">
								<Box bg="red.50" borderRadius="full" p={4} display="inline-flex" mx="auto">
									<Icon as={EmailIcon} w={10} h={10} color={RED} />
								</Box>
								<Heading size="md" color={DARK}>Verify Your Email</Heading>
								<Text color="gray.500" fontSize="sm" textAlign="center">
									We've sent a verification link to your email. Please check your inbox and click the link to complete your login.
								</Text>
							</VStack>

							<Box bg="red.50" p={5} borderRadius="xl" border="1px solid" borderColor="red.100">
								<VStack spacing={3} align="stretch">
									{[
										"Check your email inbox",
										"Click the verification link in the email",
										"You'll be automatically redirected to your dashboard",
									].map((step, i) => (
										<HStack key={i} spacing={3}>
											<Box
												flexShrink={0}
												w="22px"
												h="22px"
												borderRadius="full"
												bg={RED}
												color="white"
												fontSize="11px"
												fontWeight="700"
												display="flex"
												alignItems="center"
												justifyContent="center"
											>
												{i + 1}
											</Box>
											<Text fontSize="sm" fontWeight="500" color="gray.700">{step}</Text>
										</HStack>
									))}
								</VStack>
							</Box>

							<Alert status="info" borderRadius="lg" fontSize="sm">
								<AlertIcon />
								Didn't receive the email? Check your spam folder.
							</Alert>

							<VStack spacing={3}>
								<Button
									onClick={() => window.open("https://gmail.com", "_blank")}
									bg={RED}
									color="white"
									width="100%"
									leftIcon={<EmailIcon />}
									_hover={{ bg: "#c40000" }}
									borderRadius="lg"
									h="44px"
								>
									Open Gmail
								</Button>
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
									← Back to Login
								</Button>
							</VStack>

							<Text fontSize="xs" color="gray.400" textAlign="center">
								The verification link expires in 15 minutes for security reasons.
							</Text>
						</VStack>
					</Box>
				</Box>
			</Flex>
		);
	}

	// ───── Main Login Page ─────
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
				{/* Background decorative circles */}
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
						High Performance.{" "}
						<Text as="span" color={RED}>
							Like New.
						</Text>
					</Heading>
					<Text color="whiteAlpha.600" fontSize="15px" maxW="340px" lineHeight="1.7">
						Expertly reconditioned engines with quality parts, built to last and priced right.
					</Text>
				</Box>

				{/* Feature badges */}
				<VStack align="flex-start" spacing={5} mb={8}>
					{[
						{ icon: FaShieldAlt, label: "Quality Tested", sub: "100% Inspected" },
						{ icon: FaTools, label: "12 Months Warranty", sub: "For Peace of Mind" },
						{ icon: FaTruck, label: "Nationwide Delivery", sub: "Fast & Reliable" },
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
						<Text key={t} fontSize="11px" color="whiteAlpha.500">
							✓ {t}
						</Text>
					))}
				</HStack>
			</Flex>

			{/* RIGHT PANEL — form */}
			<Flex
				flex={{ base: "1", lg: "0 0 480px" }}
				direction="column"
				justify="center"
				align="center"
				bg="white"
				p={{ base: 6, md: 12 }}
				minH="100vh"
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

				<Box w="full" maxW="380px">
					{/* Title */}
					<VStack spacing={1} align="flex-start" mb={8}>
						<HStack mb={2}>
							<Box w="4px" h="24px" bg={RED} borderRadius="full" />
							<Text color={RED} fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
								Welcome Back
							</Text>
						</HStack>
						<Heading fontSize="28px" fontWeight="900" color={DARK}>
							Sign in to your account
						</Heading>
						<Text color="gray.500" fontSize="14px">
							Enter your credentials to continue
						</Text>
					</VStack>

					{/* Login Form */}
					<form onSubmit={handleLoginSubmit(onSubmitLogin)} style={{ width: "100%" }}>
						<VStack spacing={4}>
							<FormControl isInvalid={!!loginErrors.username}>
								<FormLabel htmlFor="username" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
									Username / Email
								</FormLabel>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									h="48px"
									fontSize="14px"
									borderRadius="lg"
									borderColor="gray.200"
									bg="#f7f7f7"
									_hover={{ borderColor: RED }}
									_focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
									{...registerLogin("username")}
								/>
								<FormErrorMessage fontSize="12px">{loginErrors.username?.message}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={!!loginErrors.password}>
								<FormLabel htmlFor="password" fontWeight="600" fontSize="13px" color="gray.700" mb={1}>
									Password
								</FormLabel>
								<InputGroup>
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										h="48px"
										fontSize="14px"
										borderRadius="lg"
										borderColor="gray.200"
										bg="#f7f7f7"
										_hover={{ borderColor: RED }}
										_focus={{ borderColor: RED, boxShadow: `0 0 0 1px ${RED}`, bg: "white" }}
										{...registerLogin("password")}
									/>
									<InputRightElement h="48px">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowPassword(!showPassword)}
											_hover={{ bg: "transparent" }}
											color="gray.400"
										>
											{showPassword ? <ViewOffIcon /> : <ViewIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormErrorMessage fontSize="12px">{loginErrors.password?.message}</FormErrorMessage>
							</FormControl>

							{/* Forgot password */}
							<Flex w="full" justify="flex-end">
								<Link
									as={RouterLink}
									to="/forgot-password"
									color={RED}
									fontSize="13px"
									fontWeight="600"
									_hover={{ textDecoration: "underline" }}
								>
									Forgot Password?
								</Link>
							</Flex>

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
								loadingText="Signing in..."
								_hover={{ bg: "#c40000", transform: "translateY(-1px)", boxShadow: "lg" }}
								transition="all 0.2s"
							>
								Sign In
							</Button>
						</VStack>
					</form>

					<Divider my={6} borderColor="gray.100" />

					<Text textAlign="center" fontSize="14px" color="gray.500">
						Not a Member?{" "}
						<Link
							as={RouterLink}
							to="/register"
							color={RED}
							fontWeight="700"
							_hover={{ textDecoration: "underline" }}
						>
							Create Account
						</Link>
					</Text>
				</Box>
			</Flex>
		</Flex>
	);
}
