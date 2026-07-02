import React from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	SimpleGrid,
	Image,
	Badge,
	Link as ChakraLink,
	Icon,
	Button,
	Spinner,
	Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaArrowRight, FaCalendarAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

export default function LatestBlogsSection() {
	const accentColor = "#D90404";

	const { data, isLoading } = useQuery({
		queryKey: ["latest-blogs"],
		queryFn: async () => {
			const { data } = await API.get("/blogs", { params: { page: 1, limit: 3 } });
			return data;
		},
		staleTime: 1000 * 60 * 15,
	});

	if (isLoading) {
		return (
			<Center py={16}>
				<VStack spacing={4}>
					<Spinner size="lg" color={accentColor} thickness="4px" />
					<Text fontWeight="bold" color="gray.500">
						Loading Latest Insights...
					</Text>
				</VStack>
			</Center>
		);
	}

	const posts = data?.blogs || [];

	if (posts.length === 0) return null;

	return (
		<Box bg="white" py={{ base: 8, md: 10 }} position="relative" overflow="hidden">
			<Container maxW="container.xl">
				<VStack spacing={10} align="center">
					{/* Header */}
					<VStack spacing={3} textAlign="center" maxW="700px">
						<Text
							fontSize="13px"
							fontWeight="800"
							color={accentColor}
							textTransform="uppercase"
							letterSpacing="1.5px"
						>
							LATEST INSIGHTS
						</Text>
						<Heading
							fontSize={{ base: "28px", md: "38px", lg: "42px" }}
							fontWeight="800"
							color="gray.900"
							lineHeight="1.2"
						>
							News, Guides & Tips
						</Heading>
						<Text fontSize="15px" color="gray.600">
							Stay up to date with the latest engine maintenance tips, reconditioning guides, and industry updates.
						</Text>
					</VStack>

					{/* Blog Grid */}
					<MotionSimpleGrid
						columns={{ base: 1, md: 2, lg: 3 }}
						spacing={8}
						w="full"
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-50px" }}
					>
						{posts.map((post) => (
							<MotionBox
								key={post._id}
								variants={cardVariants}
								bg="white"
								borderRadius="2xl"
								overflow="hidden"
								boxShadow="0 10px 30px rgba(0,0,0,0.05)"
								border="1px solid"
								borderColor="gray.100"
								display="flex"
								flexDirection="column"
								transition="all 0.3s"
								_hover={{
									transform: "translateY(-8px)",
									boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
								}}
							>
								{/* Image */}
								<Box h="220px" overflow="hidden" position="relative">
									<Image
										src={post.image}
										alt={post.title}
										objectFit="cover"
										w="full"
										h="full"
									/>
									<Badge
										position="absolute"
										bottom={4}
										left={4}
										bg="white"
										color="gray.900"
										px={3}
										py={1}
										borderRadius="full"
										fontSize="xs"
										fontWeight="700"
										boxShadow="md"
									>
										{post.category}
									</Badge>
								</Box>

								{/* Content */}
								<VStack p={6} align="start" spacing={4} flex="1">
									<HStack spacing={4} fontSize="xs" color="gray.400" fontWeight="600">
										<HStack spacing={1}>
											<Icon as={FaCalendarAlt} color={accentColor} />
											<Text>{post.date}</Text>
										</HStack>
										<HStack spacing={1}>
											<Icon as={FaUser} color={accentColor} />
											<Text>{post.author}</Text>
										</HStack>
									</HStack>

									<Heading
										as="h3"
										fontSize="20px"
										fontWeight="800"
										color="gray.800"
										lineHeight="1.3"
										noOfLines={2}
										_hover={{ color: accentColor }}
									>
										<ChakraLink
											as={Link}
											to={`/blog/${post.slug}`}
											_hover={{ textDecoration: "none" }}
										>
											{post.title}
										</ChakraLink>
									</Heading>

									<Text fontSize="14px" color="gray.500" noOfLines={3} lineHeight="1.6">
										{post.excerpt}
									</Text>

									<ChakraLink
										as={Link}
										to={`/blog/${post.slug}`}
										fontSize="xs"
										fontWeight="800"
										color={accentColor}
										display="flex"
										alignItems="center"
										gap={2}
										mt="auto"
										pt={2}
										_hover={{ gap: 3, textDecoration: "none" }}
										textTransform="uppercase"
										letterSpacing="wider"
									>
										Read Full Article <Icon as={FaArrowRight} fontSize="9px" />
									</ChakraLink>
								</VStack>
							</MotionBox>
						))}
					</MotionSimpleGrid>

					{/* View All Button */}
					<Button
						as={Link}
						to="/blog"
						variant="outline"
						borderColor={accentColor}
						color={accentColor}
						size="lg"
						px={8}
						fontWeight="700"
						_hover={{ bg: accentColor, color: "white" }}
					>
						View All Articles
					</Button>
				</VStack>
			</Container>
		</Box>
	);
}
