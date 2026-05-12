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
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";

export default function TopEnginesSection({ category }) {
	const accentColor = "#B50303";
	const surfaceColor = "#F3F5F8";

	const { data: engines = [], isLoading: loading } = useQuery({
		queryKey: ['products', { category }],
		queryFn: async () => {
			const res = await API.get("/products");
			const products = res.data.data || res.data || [];

			let filtered = products;
			if (category && category !== "Industrial Engines") {
				filtered = products.filter(
					(p) =>
						p.category?.name === category ||
						(category === "Used Engines" && p.condition?.toLowerCase() === "used") ||
						(category === "Reconditioned Engines" &&
							p.condition?.toLowerCase() === "reconditioned"),
				);
			}
			return filtered.slice(0, 10);
		},
		staleTime: 1000 * 60 * 5,
	});

	const EngineCard = ({ engine }) => (
		<VStack
			as={RouterLink}
			to={`/products/${engine._id}`}
			align="stretch"
			spacing={0}
			bg="white"
			borderRadius="xl"
			boxShadow="0 8px 16px rgba(8, 15, 31, 0.06)"
			border="1px solid"
			borderColor="gray.200"
			_hover={{
				transform: "translateY(-3px)",
				boxShadow: "0 14px 24px rgba(8, 15, 31, 0.11)",
				borderColor: "gray.300",
				textDecoration: "none",
			}}
			transition="all 0.24s ease"
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
					transition="transform 0.28s ease"
					_groupHover={{ transform: "scale(1.03)" }}
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

				<HStack spacing={1} fontSize="11px" color="gray.600" align="center" w="full">
					<Text fontWeight="700">Fits:</Text>
					<Text noOfLines={1}>{engine.model || "Universal Fit"}</Text>
					<Box w="3px" h="3px" borderRadius="full" bg="gray.400" />
					<Text color="green.700" fontWeight="600" noOfLines={1}>
						In Stock
					</Text>
				</HStack>

				<Divider borderColor="gray.100" />

				{/* <Text
					fontSize={{ base: "24px", md: "28px" }}
					fontWeight="900"
					color="gray.900"
					letterSpacing="-0.02em"
					lineHeight="1"
				>
					<Text
						as="span"
						fontSize={{ base: "12px", md: "16px" }}
						fontWeight="600"
						color="gray.500"
						mr={2}
						verticalAlign="middle"
					>
						Starting From
					</Text>

					£{Number(engine.price || 0).toLocaleString("en-GB")}
				</Text> */}

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
						<Icon as={FaArrowRight} boxSize={2.5} />
					</HStack>
				</Flex>
			</VStack>
		</VStack>
	);

	if (loading) {
		return (
			<Center py={20}>
				<Spinner color={accentColor} size="xl" />
			</Center>
		);
	}

	return (
		<Box bg={surfaceColor} py={{ base: 14, md: 16 }} position="relative" overflow="hidden">
			<Box
				position="absolute"
				top="-120px"
				right="-80px"
				w="320px"
				h="320px"
				borderRadius="full"
				bg="linear-gradient(180deg, rgba(217,4,4,0.14), rgba(217,4,4,0))"
			/>

			<Container maxW="container.xl" position="relative" zIndex={1}>
				<VStack spacing={8} align="start">
					<VStack align="start" spacing={2}>
						<Text
							textTransform="uppercase"
							letterSpacing="0.1em"
							fontSize="12px"
							fontWeight="700"
							color="gray.600"
						>
							Curated Listings
						</Text>

						<Heading
							fontSize={{ base: "26px", md: "42px" }}
							fontWeight="900"
							color="gray.900"
							lineHeight="1.1"
							letterSpacing="-0.02em"
						>
							Top {category.toLowerCase()} for Sale in the UK
						</Heading>
					</VStack>

					{engines.length > 0 ? (
						<SimpleGrid
							columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 }}
							spacing={{ base: 3, lg: 3.5 }}
							w="full"
						>
							{engines.map((engine) => (
								<EngineCard key={engine._id} engine={engine} />
							))}
						</SimpleGrid>
					) : (
						<Text color="gray.500">No {category.toLowerCase()} found in the database.</Text>
					)}
				</VStack>
			</Container>
		</Box>
	);
}
