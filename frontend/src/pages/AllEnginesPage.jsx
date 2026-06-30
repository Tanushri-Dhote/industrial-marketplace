import React, { useState } from "react";
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
    Checkbox,
    Flex,
    HStack,
    Input,
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

    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [mileageMax, setMileageMax] = useState("");
    const [selectedConditions, setSelectedConditions] = useState([]);

    const { data: engines = [], isLoading: loading } = useQuery({
        queryKey: ["all-products", { category, search, brand, model, priceMin, priceMax, mileageMax, selectedConditions }],
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

            // Price Min Filter
            if (priceMin) {
                filtered = filtered.filter((p) => p.price && p.price >= Number(priceMin));
            }

            // Price Max Filter
            if (priceMax) {
                filtered = filtered.filter((p) => p.price && p.price <= Number(priceMax));
            }

            // Mileage Max Filter
            if (mileageMax) {
                filtered = filtered.filter((p) => {
                    if (!p.mileage) return false;
                    const miles = Number(p.mileage.replace(/[^\d]/g, ""));
                    return miles && miles <= Number(mileageMax);
                });
            }

            // Condition Filter
            if (selectedConditions.length > 0) {
                filtered = filtered.filter(
                    (p) => p.condition && selectedConditions.some(c => p.condition.toLowerCase() === c.toLowerCase())
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

                    {/* Sidebar and Grid Layout */}
                    <Flex direction={{ base: "column", md: "row" }} gap={8} w="full" align="start">
                        {/* Left Sidebar - Filters */}
                        <Box 
                            w={{ base: "100%", md: "260px" }} 
                            bg="white" 
                            p={6} 
                            borderRadius="2xl" 
                            boxShadow="sm" 
                            border="1px solid" 
                            borderColor="gray.100"
                            position="sticky"
                            top="100px"
                        >
                            <VStack align="stretch" spacing={6}>
                                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.500">
                                    Filters
                                </Heading>

                                {/* Condition Filter */}
                                <VStack align="stretch" spacing={3}>
                                    <Text fontWeight="bold" fontSize="14px" color="gray.700">Condition</Text>
                                    {["New", "Used", "Reconditioned"].map((cond) => {
                                        const isChecked = selectedConditions.includes(cond);
                                        return (
                                            <Checkbox 
                                                key={cond} 
                                                isChecked={isChecked} 
                                                colorScheme="red"
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setSelectedConditions(selectedConditions.filter(c => c !== cond));
                                                    } else {
                                                        setSelectedConditions([...selectedConditions, cond]);
                                                    }
                                                }}
                                            >
                                                <Text fontSize="14px">{cond}</Text>
                                            </Checkbox>
                                        );
                                    })}
                                </VStack>

                                {/* Price Filter */}
                                <VStack align="stretch" spacing={3}>
                                    <Text fontWeight="bold" fontSize="14px" color="gray.700">Price (£)</Text>
                                    <HStack>
                                        <Input 
                                            placeholder="Min" 
                                            type="number" 
                                            size="sm" 
                                            borderRadius="lg"
                                            value={priceMin}
                                            onChange={(e) => setPriceMin(e.target.value)}
                                            bg="gray.50"
                                        />
                                        <Text fontSize="xs" color="gray.400">to</Text>
                                        <Input 
                                            placeholder="Max" 
                                            type="number" 
                                            size="sm" 
                                            borderRadius="lg"
                                            value={priceMax}
                                            onChange={(e) => setPriceMax(e.target.value)}
                                            bg="gray.50"
                                        />
                                    </HStack>
                                </VStack>

                                {/* Mileage Filter */}
                                <VStack align="stretch" spacing={3}>
                                    <Text fontWeight="bold" fontSize="14px" color="gray.700">Max Mileage</Text>
                                    <Input 
                                        placeholder="e.g. 50000" 
                                        type="number" 
                                        size="sm" 
                                        borderRadius="lg"
                                        value={mileageMax}
                                        onChange={(e) => setMileageMax(e.target.value)}
                                        bg="gray.50"
                                    />
                                </VStack>

                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    colorScheme="red" 
                                    borderRadius="lg"
                                    onClick={() => {
                                        setPriceMin("");
                                        setPriceMax("");
                                        setMileageMax("");
                                        setSelectedConditions([]);
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </VStack>
                        </Box>

                        {/* Right Panel - Listings Grid */}
                        <Box flex="1" w="full">
                            {engines.length > 0 ? (
								<MotionGrid
									columns={{ base: 2, md: 2, lg: 3, xl: 4 }}
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
                                <Center py={20} bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" w="full">
                                    <VStack spacing={3}>
                                        <Text fontWeight="800" color="gray.500" fontSize="18px">No engines found</Text>
                                        <Text color="gray.400" fontSize="14px">Try adjusting your filters to find listings.</Text>
                                    </VStack>
                                </Center>
                            )}
                        </Box>
                    </Flex>
                </VStack>
            </Container>
        </Box>
    );
}