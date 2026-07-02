import React from "react";
import {
	Badge,
	Box,
	Center,
	Container,
	Flex,
	Heading,
	HStack,
	Divider,
	Icon,
	Image,
	SimpleGrid,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import API from "../services/api";

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(72, 187, 120, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
`;

const PulsingDot = () => (
	<Box
		w="6px"
		h="6px"
		borderRadius="full"
		bg="green.500"
		animation={`${pulse} 2s infinite`}
	/>
);

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
	hidden: { opacity: 0, scale: 0.95, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.215, 0.61, 0.355, 1],
		},
	},
};

export default function CuratedListingsSection({ category }) {
	const accentColor = "#D90404";
	const surfaceColor = "#F3F5F8";

	const { data: engines = [], isLoading: loading } = useQuery({
		queryKey: ['products-curated', { category, limit: 10 }],
		queryFn: async () => {
			const res = await API.get("/products", {
				params: {
					limit: 10,
					category: category !== "Engines" ? category : undefined,
				},
			});
			return res.data.data || res.data || [];
		},
		staleTime: 1000 * 60 * 5,
	});

	const EngineCard = ({ engine }) => (
		<MotionBox
			as={RouterLink}
			to={`/products/${engine._id}`}
			variants={cardVariants}
			align="stretch"
			display="flex"
			flexDirection="column"
			bg="white"
			borderRadius="xl"
			boxShadow="0 8px 16px rgba(8, 15, 31, 0.06)"
			border="1px solid"
			borderColor="gray.200"
			_hover={{
				transform: "translateY(-6px)",
				boxShadow: "0 20px 30px rgba(217, 4, 4, 0.08)",
				borderColor: "rgba(217, 4, 4, 0.3)",
				textDecoration: "none",
			}}
			transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
			cursor="pointer"
			role="group"
			w="full"
			overflow="hidden"
		>
			<Box
				w="full"
				h={{ base: "132px", md: "140px" }}
				overflow="hidden"
				bg="gray.100"
				position="relative"
			>
				<Image
					src={
						engine.images?.[0] ||
						"https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
					}
					alt={engine.name}
					w="full"
					h="full"
					objectFit="cover"
					transition="transform 0.4s ease"
					_groupHover={{ transform: "scale(1.08)" }}
				/>

				<Badge
					position="absolute"
					top={2}
					left={2}
					fontSize="8px"
					px={2}
					py={0.5}
					borderRadius="full"
					bg="rgba(10, 19, 36, 0.85)"
					color="white"
					textTransform="uppercase"
					letterSpacing="0.05em"
				>
					{engine.condition || "Used"}
				</Badge>
			</Box>

			<VStack
				align="start"
				spacing={1.5}
				px={{ base: 3, md: 3.5 }}
				py={{ base: 2.5, md: 3 }}
				w="full"
				flex="1"
			>
				<Text
					fontSize={{ base: "13px", md: "14px" }}
					fontWeight="800"
					color="gray.800"
					noOfLines={2}
					lineHeight="1.3"
					minH="36px"
				>
					{engine.name}
				</Text>

				<HStack spacing={1} fontSize="11px" color="gray.600" align="center" w="full" overflow="hidden">
					<Text fontWeight="700" flexShrink={0} whiteSpace="nowrap">Fits:</Text>
					<Text noOfLines={1} flexGrow={1}>{engine.model || "Universal Fit"}</Text>
					<Box w="3px" h="3px" borderRadius="full" bg="gray.400" flexShrink={0} />
					<HStack spacing={1} align="center" flexShrink={0} whiteSpace="nowrap">
						<PulsingDot />
						<Text color="green.700" fontWeight="700" noOfLines={1}>
							Stock
						</Text>
					</HStack>
				</HStack>

				<Divider borderColor="gray.100" />

				<Flex
					w="full"
					justify="space-between"
					align="center"
					pt={0}
					color="gray.700"
					fontWeight="600"
					fontSize="11px"
				>
					<Text>Shipping available</Text>
					<HStack spacing={1} color={accentColor} fontWeight="700">
						<Text>View</Text>
						<Icon 
							as={FaArrowRight} 
							boxSize={2.5} 
							transition="transform 0.2s"
							_groupHover={{ transform: "translateX(3px)" }}
						/>
					</HStack>
				</Flex>
			</VStack>
		</MotionBox>
	);

	if (loading) {
		return (
			<Center py={20}>
				<Spinner color={accentColor} size="xl" />
			</Center>
		);
	}

	return (
		<Box bg={surfaceColor} pt={{ base: 4, md: 4 }} pb={{ base: 8, md: 10 }} position="relative" overflow="hidden">
			<MotionBox
				position="absolute"
				top="-120px"
				right="-80px"
				w="320px"
				h="320px"
				borderRadius="full"
				bg="linear-gradient(180deg, rgba(217,4,4,0.14), rgba(217,4,4,0))"
				animate={{ 
					scale: [1, 1.1, 1],
					opacity: [0.6, 0.8, 0.6]
				}}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
			/>

			<Container maxW="container.xl" position="relative" zIndex={1}>
				<VStack spacing={8} align="start">
					<MotionBox
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<VStack align="start" spacing={2}>
							<Text
								textTransform="uppercase"
								letterSpacing="1.5px"
								fontSize="13px"
								fontWeight="800"
								color={accentColor}
							>
								Curated Listings
							</Text>

							<Heading
								as="h2"
								fontSize={{ base: "28px", md: "38px", lg: "42px" }}
								fontWeight="800"
								color="gray.900"
								lineHeight="1.2"
							>
								Top {category?.toLowerCase()} for Sale in the UK
							</Heading>
						</VStack>
					</MotionBox>

					{engines.length > 0 ? (
						<MotionSimpleGrid
							columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 }}
							spacing={{ base: 3, lg: 3.5 }}
							w="full"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-50px" }}
						>
							{engines.map((engine) => (
								<EngineCard key={engine._id} engine={engine} />
							))}
						</MotionSimpleGrid>
					) : (
						<Text color="gray.500">No {category?.toLowerCase()} found in the database.</Text>
					)}
				</VStack>
			</Container>
		</Box>
	);
}
