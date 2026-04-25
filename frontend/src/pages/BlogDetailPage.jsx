import React, { useEffect } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Image,
	Badge,
	Icon,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Divider,
	Spinner,
	Center,
	Stack,
	Avatar,
} from "@chakra-ui/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	FaCalendarAlt,
	FaUser,
	FaChevronRight,
	FaArrowLeft,
	FaShareAlt,
	FaClock,
} from "react-icons/fa";
import API from "../services/api";
import { useQuery } from "@tanstack/react-query";

const fetchBlogBySlug = async (slug) => {
	const res = await API.get(`/blogs/${slug}`);
	return res.data.data || res.data;
};

export default function BlogDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const accentColor = "#D90404";

	const {
		data: post,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["blog", slug],
		queryFn: () => fetchBlogBySlug(slug),
		enabled: !!slug,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	if (isLoading) {
		return (
			<Center minH="100vh">
				<Spinner size="xl" color={accentColor} thickness="4px" />
			</Center>
		);
	}

	if (isError || !post) {
		return (
			<Container maxW="container.xl" py={20} textAlign="center">
				<Heading mb={4}>Article Not Found</Heading>
				<Text mb={8} color="gray.500">
					The industry insight you're looking for might have been moved.
				</Text>
				<Button as={Link} to="/blog" colorScheme="red" size="lg" borderRadius="full" px={10}>
					Back to Insights
				</Button>
			</Container>
		);
	}

	return (
		<Box bg="white" minH="100vh" pb={20}>
			{/* Immersive Header Section */}
			<Box pt={10} pb={20} bg="gray.50">
				<Container maxW="container.md">
					<VStack align="start" spacing={8}>
						<Breadcrumb
							spacing="8px"
							separator={<Icon as={FaChevronRight} color="gray.400" fontSize="10px" />}
							fontSize="xs"
							fontWeight="bold"
							textTransform="uppercase"
							letterSpacing="widest"
							color="gray.400"
						>
							<BreadcrumbItem>
								<BreadcrumbLink as={Link} to="/">
									Home
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem>
								<BreadcrumbLink as={Link} to="/blog">
									Blog
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink color={accentColor}>{post.category}</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>

						<VStack align="start" spacing={6}>
							<Badge
								px={4}
								py={1.5}
								bg={accentColor}
								color="white"
								borderRadius="full"
								fontSize="xs"
								fontWeight="900"
								letterSpacing="widest"
							>
								{post.category}
							</Badge>
							<Heading
								fontSize={{ base: "3xl", md: "5xl" }}
								fontWeight="900"
								color="gray.900"
								lineHeight="1.1"
							>
								{post.title}
							</Heading>

							<Stack
								direction={{ base: "column", sm: "row" }}
								spacing={8}
								w="full"
								align={{ base: "start", sm: "center" }}
								color="gray.500"
							>
								<HStack spacing={3}>
									<Avatar size="sm" name={post.author} bg="gray.200" />
									<VStack align="start" spacing={0}>
										<Text fontSize="xs" fontWeight="800" color="gray.900">
											{post.author}
										</Text>
										<Text fontSize="xs">Contributor</Text>
									</VStack>
								</HStack>
								<HStack spacing={6}>
									<HStack spacing={2}>
										<Icon as={FaCalendarAlt} color={accentColor} />
										<Text fontSize="xs" fontWeight="700">
											{post.date}
										</Text>
									</HStack>
									<HStack spacing={2}>
										<Icon as={FaClock} color={accentColor} />
										<Text fontSize="xs" fontWeight="700">
											6 min read
										</Text>
									</HStack>
								</HStack>
							</Stack>
						</VStack>
					</VStack>
				</Container>
			</Box>

			{/* Hero Visual */}
			<Container maxW="container.lg" mt="-60px" position="relative" zIndex={2}>
				<Box borderRadius="3xl" overflow="hidden" boxShadow="0 30px 60px -12px rgba(0,0,0,0.25)">
					<Image src={post.image} alt={post.title} w="full" maxH="600px" objectFit="cover" />
				</Box>
			</Container>

			{/* Editorial Content */}
			<Container maxW="container.md" pt={16}>
				<VStack align="start" spacing={10}>
					<Box
						fontSize="18px"
						lineHeight="1.9"
						color="gray.700"
						className="blog-editorial-content"
						dangerouslySetInnerHTML={{ __html: post.content }}
						w="full"
						sx={{
							p: { mb: 6 },
							h3: { fontSize: "2xl", fontWeight: "900", mt: 10, mb: 4, color: "gray.900" },
							ul: { mb: 6, pl: 5 },
							li: { mb: 2 },
							blockquote: {
								borderLeft: "4px solid",
								borderColor: accentColor,
								pl: 6,
								py: 2,
								fontSize: "2xl",
								fontWeight: "700",
								color: "gray.900",
								fontStyle: "italic",
								my: 10,
							},
						}}
					/>

					<Divider />

					{/* Engagement Section */}
					<VStack
						w="full"
						py={12}
						spacing={8}
						bg="blue.50"
						borderRadius="3xl"
						textAlign="center"
						border="1px solid"
						borderColor="blue.100"
					>
						<VStack spacing={2}>
							<Heading size="md" color="blue.900" fontWeight="900">
								Found this guide helpful?
							</Heading>
							<Text color="blue.600">Share it with your colleagues in the industrial trade.</Text>
						</VStack>
						<HStack spacing={4}>
							<Button
								leftIcon={<FaShareAlt />}
								colorScheme="blue"
								borderRadius="full"
								size="lg"
								px={8}
							>
								Share Article
							</Button>
							<Button
								variant="outline"
								borderColor="blue.200"
								color="blue.600"
								borderRadius="full"
								size="lg"
								px={8}
								onClick={() => navigate("/blog")}
							>
								Back to Insights
							</Button>
						</HStack>
					</VStack>

					{/* Prev/Next Navigation (Placeholder Logic) */}
					<HStack w="full" justify="space-between" pt={10}>
						<Button
							variant="link"
							color="gray.500"
							leftIcon={<FaArrowLeft />}
							_hover={{ color: accentColor, textDecoration: "none" }}
						>
							Previous Story
						</Button>
						<Button
							variant="link"
							color="gray.500"
							rightIcon={<FaChevronRight />}
							_hover={{ color: accentColor, textDecoration: "none" }}
						>
							Next Discussion
						</Button>
					</HStack>
				</VStack>
			</Container>
		</Box>
	);
}
