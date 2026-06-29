import React from "react";
import {
    Box,
    Button,
    Center,
    Container,
    Heading,
    Image,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import API from "../services/api";

const MotionBox = motion(Box);
const MotionGrid = motion(SimpleGrid);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
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
        },
    },
};

export default function AllEnginesPage({ category }) {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand") || "";
    const model = searchParams.get("model") || "";
    const accentColor = "#D90404";

    const { data: engines = [], isLoading: loading } = useQuery({
        queryKey: ["all-products", { category, search, brand, model }],
        queryFn: async () => {
            // Fetch brands to resolve slug to name/make mappings
            const brandsRes = await API.get("/brands");
            const brands = brandsRes.data?.data || brandsRes.data || [];

            const res = await API.get("/products");
            const products = res.data.data || res.data || [];

            let filtered = [...products];

            // Search by model / make / engine code / reg
            if (search) {
                const query = search.toLowerCase();

                filtered = filtered.filter((p) => {
                    return (
                        p.name?.toLowerCase().includes(query) ||
                        p.make?.toLowerCase().includes(query) ||
                        p.model?.toLowerCase().includes(query) ||
                        p.engineCode?.toLowerCase().includes(query) ||
                        p.registrationNumber?.toLowerCase().includes(query)
                    );
                });
            }

            // Brand filter
            if (brand) {
                const brandObj = brands.find((b) => b.slug === brand);
                const possibleMakes = [
                    brand.toLowerCase(),
                    brandObj?.name?.toLowerCase(),
                    brandObj?.productMake?.toLowerCase(),
                ].filter(Boolean);

                filtered = filtered.filter((p) => {
                    if (!p.make) return false;
                    const pm = p.make.toLowerCase();
                    return (
                        p.brand?.slug === brand ||
                        p.brand === brand ||
                        possibleMakes.some(
                            (make) =>
                                pm === make ||
                                pm.includes(make) ||
                                make.includes(pm) ||
                                (pm === "vw" && make === "volkswagen") ||
                                (pm === "volkswagen" && make === "vw") ||
                                (pm === "mercedes" && make === "mercedes-benz") ||
                                (pm === "mercedes-benz" && make === "mercedes")
                        )
                    );
                });
            }

            // Model filter
            if (model) {
                const targetModelSlug = model.toLowerCase().replace(/[\s_-]+/g, "-");
                filtered = filtered.filter(
                    (p) =>
                        p.model?.toLowerCase().replace(/[\s_-]+/g, "-") === targetModelSlug ||
                        p.model?.toLowerCase() === model.toLowerCase()
                );
            }

            // Category filter
            if (category && category !== "Engines") {
                filtered = filtered.filter(
                    (p) =>
                        p.category?.name === category ||
                        (category === "Used Engines" &&
                            p.condition?.toLowerCase() === "used") ||
                        (category === "Reconditioned Engines" &&
                            p.condition?.toLowerCase() === "reconditioned")
                );
            }

            return filtered;
        },
        staleTime: 1000 * 60 * 5,
    });

    if (loading) {
        return (
            <Center py={20}>
                <Spinner size="xl" color={accentColor} />
            </Center>
        );
    }

    return (
        <Box bg="#F7F8FA" minH="100vh" py={{ base: 14, md: 20 }}>
            <Container maxW="container.xl">
                <VStack spacing={10}>
                    {/* Header */}
                    <VStack spacing={3} textAlign="center">
                        <Text
                            fontSize="13px"
                            fontWeight="800"
                            color={accentColor}
                            textTransform="uppercase"
                            letterSpacing="1.5px"
                        >
                            OUR ENGINES
                        </Text>

                        <Heading
                            fontSize={{ base: "28px", md: "42px" }}
                            fontWeight="800"
                            color="gray.900"
                        >
                            All {category || "Engine Listings"}
                        </Heading>

                        <Text
                            fontSize={{ base: "14px", md: "16px" }}
                            color="gray.600"
                            maxW="700px"
                        >
                            Browse our full range of high quality engines for different
                            makes and models.
                        </Text>
                    </VStack>

                    {/* Cards */}
                    {engines.length > 0 ? (
                        <MotionGrid
                            columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                            spacing={5}
                            w="full"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {engines.map((engine) => (
                                <MotionBox
                                    key={engine._id}
                                    as={RouterLink}
                                    to={`/products/${engine._id}`}
                                    variants={cardVariants}
                                    bg="white"
                                    borderRadius="xl"
                                    p={4}
                                    boxShadow="sm"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    textAlign="center"
                                    cursor="pointer"
                                    transition="all 0.3s ease"
                                    _hover={{
                                        transform: "translateY(-6px)",
                                        boxShadow: "lg",
                                        textDecoration: "none",
                                    }}
                                >
                                    {/* Image */}
                                    <Box
                                        h="100px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        mb={3}
                                    >
                                        <Image
                                            src={
                                                engine.images?.[0] ||
                                                "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
                                            }
                                            alt={engine.name}
                                            maxH="100%"
                                            objectFit="contain"
                                        />
                                    </Box>

                                    {/* Name */}
                                    <Text
                                        fontWeight="800"
                                        fontSize="15px"
                                        color="gray.900"
                                        noOfLines={1}
                                    >
                                        {engine.name}
                                    </Text>

                                    {/* Model */}
                                    <Text
                                        fontSize="12px"
                                        color="gray.500"
                                        mt={1}
                                        noOfLines={1}
                                    >
                                        {engine.model || "Universal Fit"}
                                    </Text>

                                    {/* Button */}
                                    <Button
                                        size="sm"
                                        mt={4}
                                        w="full"
                                        bg="gray.100"
                                        color="gray.800"
                                        fontSize="12px"
                                        fontWeight="700"
                                        _hover={{
                                            bg: accentColor,
                                            color: "white",
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </MotionBox>
                            ))}
                        </MotionGrid>
                    ) : (
                        <Text color="gray.500">
                            No engines found.
                        </Text>
                    )}
                </VStack>
            </Container>
        </Box>
    );
}