import React, { useState, useEffect } from "react";
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
    Icon,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Skeleton,
    Badge,
    Select,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaFilter, FaCar, FaCogs, FaCalendarAlt, FaTachometerAlt, FaUndo } from "react-icons/fa";
import API from "../services/api";

const MotionBox = motion(Box);
const MotionGrid = motion(SimpleGrid);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
        },
    },
};

const getConditionBadgeStyles = (condition) => {
    switch (condition?.toLowerCase()) {
        case "new":
            return { bg: "green.50", color: "green.700", borderColor: "green.200" };
        case "reconditioned":
            return { bg: "red.50", color: "red.700", borderColor: "red.200" };
        case "used":
            return { bg: "blue.50", color: "blue.700", borderColor: "blue.200" };
        default:
            return { bg: "gray.50", color: "gray.700", borderColor: "gray.200" };
    }
};

const SkeletonCard = () => (
    <Box bg="white" borderRadius="2xl" p={4} border="1px solid" borderColor="gray.100" boxShadow="sm">
        <Skeleton h="120px" borderRadius="xl" mb={4} />
        <Skeleton h="16px" w="75%" mb={2} />
        <Skeleton h="12px" w="45%" mb={4} />
        <SimpleGrid columns={2} spacing={2.5} mb={4}>
            <Skeleton h="10px" />
            <Skeleton h="10px" />
            <Skeleton h="10px" />
            <Skeleton h="10px" />
        </SimpleGrid>
        <Skeleton h="35px" w="full" borderRadius="xl" />
    </Box>
);

export default function AllEnginesPage({ category }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const search = searchParams.get("search") || "";
    const brand = searchParams.get("brand") || "";
    const model = searchParams.get("model") || "";

    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [mileageMax, setMileageMax] = useState("");
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [page, setPage] = useState(1);

    const [selectedBrand, setSelectedBrand] = useState(brand);
    const [selectedModel, setSelectedModel] = useState(model);
    const [selectedCategory, setSelectedCategory] = useState(category || "");

    useEffect(() => {
        setSelectedBrand(brand);
        setSelectedModel(model);
    }, [brand, model]);

    useEffect(() => {
        setSelectedCategory(category || "");
    }, [category]);

    // Load active brands
    const { data: brandsRes } = useQuery({
        queryKey: ["brands-list"],
        queryFn: async () => {
            const res = await API.get("/brands");
            return res.data.data || res.data || [];
        },
        staleTime: 1000 * 60 * 10,
    });
    const brandsList = brandsRes || [];

    // Load models for selected brand
    const { data: modelsRes } = useQuery({
        queryKey: ["models-list", selectedBrand],
        queryFn: async () => {
            if (!selectedBrand) return [];
            const currentBrandObj = brandsList.find(b => b.slug === selectedBrand || b.name === selectedBrand);
            if (!currentBrandObj) return [];
            const res = await API.get(`/models/${currentBrandObj._id}`);
            return res.data?.data || res.data || [];
        },
        enabled: !!selectedBrand && brandsList.length > 0,
        staleTime: 1000 * 60 * 10,
    });
    const modelsList = modelsRes || [];

    const { isOpen: isMobileFiltersOpen, onOpen: onMobileFiltersOpen, onClose: onMobileFiltersClose } = useDisclosure();

    // Reset to page 1 when filters or URL query params change
    useEffect(() => {
        setPage(1);
    }, [search, selectedBrand, selectedModel, selectedCategory, priceMin, priceMax, mileageMax, selectedConditions]);

    const { data, isLoading: loading, isFetching } = useQuery({
        queryKey: [
            "all-products",
            { category: selectedCategory, search, brand: selectedBrand, model: selectedModel, priceMin, priceMax, mileageMax, selectedConditions, page },
        ],
        queryFn: async () => {
            const res = await API.get("/products", {
                params: {
                    category: selectedCategory || undefined,
                    search,
                    brand: selectedBrand || undefined,
                    model: selectedModel || undefined,
                    priceMin,
                    priceMax,
                    mileageMax,
                    conditions: selectedConditions.join(","),
                    page,
                    limit: 10,
                },
            });
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev,
    });

    const engines = data?.data || [];
    const pagination = data?.pagination || null;

    const activeFilterCount = [
        priceMin ? 1 : 0,
        priceMax ? 1 : 0,
        mileageMax ? 1 : 0,
        selectedConditions.length,
        selectedBrand ? 1 : 0,
        selectedModel ? 1 : 0,
        selectedCategory ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const gridEl = document.getElementById("engine-listings-container");
        if (gridEl) {
            gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const renderPageButtons = () => {
        if (!pagination) return null;
        const totalPages = pagination.pages;
        const buttons = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            buttons.push(1);
            if (page > 3) {
                buttons.push("...");
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                buttons.push(i);
            }

            if (page < totalPages - 2) {
                buttons.push("...");
            }
            buttons.push(totalPages);
        }

        return buttons.map((p, idx) => {
            if (p === "...") {
                return (
                    <Text key={`dots-${idx}`} px={1} color="gray.400" fontWeight="bold">
                        ...
                    </Text>
                );
            }
            const isCurrent = p === page;
            return (
                <Button
                    key={p}
                    size="sm"
                    onClick={() => handlePageChange(p)}
                    colorScheme={isCurrent ? "brand" : "gray"}
                    variant={isCurrent ? "solid" : "outline"}
                    borderRadius="xl"
                    fontWeight="700"
                >
                    {p}
                </Button>
            );
        });
    };

    const FilterContent = ({ isMobile }) => (
        <VStack align="stretch" spacing={6}>
            <Flex justify="space-between" align="center" display={isMobile ? "none" : "flex"}>
                <Heading size="xs" textTransform="uppercase" letterSpacing="wider" color="gray.500">
                    Filters
                </Heading>
                {activeFilterCount > 0 && (
                    <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="brand"
                        leftIcon={<Icon as={FaUndo} />}
                        onClick={() => {
                            setPriceMin("");
                            setPriceMax("");
                            setMileageMax("");
                            setSelectedConditions([]);
                            setSelectedBrand("");
                            setSelectedModel("");
                            setSelectedCategory("");
                        }}
                    >
                        Reset
                    </Button>
                )}
            </Flex>

            {/* Category Filter */}
            <VStack align="stretch" spacing={3}>
                <Text fontWeight="800" fontSize="13px" color="gray.700" textTransform="uppercase" letterSpacing="0.5px">
                    Category
                </Text>
                <Select
                    placeholder="All Categories"
                    size="md"
                    borderRadius="xl"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                    }}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: "brand.500", bg: "white" }}
                >
                    <option value="Car Engines">Car Engines</option>
                    <option value="Used Engines">Used Engines</option>
                    <option value="Reconditioned Engines">Reconditioned Engines</option>
                    <option value="Gearboxes">Gearboxes</option>
                </Select>
            </VStack>

            {/* Brand Filter */}
            <VStack align="stretch" spacing={3}>
                <Text fontWeight="800" fontSize="13px" color="gray.700" textTransform="uppercase" letterSpacing="0.5px">
                    Brand
                </Text>
                <Select
                    placeholder="All Brands"
                    size="md"
                    borderRadius="xl"
                    value={selectedBrand}
                    onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel(""); // Reset model when brand changes
                    }}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: "brand.500", bg: "white" }}
                >
                    {brandsList.map((b) => (
                        <option key={b._id} value={b.slug}>
                            {b.name}
                        </option>
                    ))}
                </Select>
            </VStack>

            {/* Model Filter */}
            {selectedBrand && (
                <VStack align="stretch" spacing={3}>
                    <Text fontWeight="800" fontSize="13px" color="gray.700" textTransform="uppercase" letterSpacing="0.5px">
                        Model
                    </Text>
                    <Select
                        placeholder="All Models"
                        size="md"
                        borderRadius="xl"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: "brand.500", bg: "white" }}
                    >
                        {modelsList.map((m) => (
                            <option key={m._id} value={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </Select>
                </VStack>
            )}

            {/* Condition Filter */}
            <VStack align="stretch" spacing={3}>
                <Text fontWeight="800" fontSize="13px" color="gray.700" textTransform="uppercase" letterSpacing="0.5px">
                    Condition
                </Text>
                <VStack align="stretch" spacing={2}>
                    {["New", "Used", "Reconditioned"].map((cond) => {
                        const isChecked = selectedConditions.includes(cond);
                        return (
                            <Box
                                key={cond}
                                border="1px solid"
                                borderColor={isChecked ? "brand.500" : "gray.100"}
                                bg={isChecked ? "brand.50" : "gray.50"}
                                borderRadius="xl"
                                px={4}
                                py={2.5}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ borderColor: "brand.300" }}
                                onClick={() => {
                                    if (isChecked) {
                                        setSelectedConditions(selectedConditions.filter((c) => c !== cond));
                                    } else {
                                        setSelectedConditions([...selectedConditions, cond]);
                                    }
                                }}
                            >
                                <Checkbox
                                    isChecked={isChecked}
                                    colorScheme="brand"
                                    size="md"
                                    spacing={3}
                                    pointerEvents="none"
                                >
                                    <Text fontSize="14px" fontWeight={isChecked ? "700" : "500"} color="gray.700">
                                        {cond}
                                    </Text>
                                </Checkbox>
                            </Box>
                        );
                    })}
                </VStack>
            </VStack>

            {/* Price Filter */}
            <VStack align="stretch" spacing={3}>
                <Text fontWeight="800" fontSize="13px" color="gray.700" textTransform="uppercase" letterSpacing="0.5px">
                    Price (£)
                </Text>
                <HStack spacing={3}>
                    <Input
                        placeholder="Min"
                        type="number"
                        size="md"
                        borderRadius="xl"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: "brand.500", bg: "white" }}
                    />
                    <Text fontSize="xs" color="gray.400" fontWeight="bold">
                        to
                    </Text>
                    <Input
                        placeholder="Max"
                        type="number"
                        size="md"
                        borderRadius="xl"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{ borderColor: "brand.500", bg: "white" }}
                    />
                </HStack>
            </VStack>

            {/* Mileage Filter */}
            <VStack align="stretch" spacing={3}>
                <Text fontWeight="800" fontSize="13px" color="gray.700" textTransform="uppercase" letterSpacing="0.5px">
                    Max Mileage
                </Text>
                <Input
                    placeholder="e.g. 50000"
                    type="number"
                    size="md"
                    borderRadius="xl"
                    value={mileageMax}
                    onChange={(e) => setMileageMax(e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: "brand.500", bg: "white" }}
                />
            </VStack>

            {isMobile ? (
                <Button
                    size="md"
                    colorScheme="brand"
                    borderRadius="xl"
                    onClick={onMobileFiltersClose}
                    fontWeight="700"
                    mt={4}
                    h="44px"
                >
                    Apply Filters
                </Button>
            ) : (
                activeFilterCount > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        colorScheme="brand"
                        borderRadius="xl"
                        onClick={() => {
                            setPriceMin("");
                            setPriceMax("");
                            setMileageMax("");
                            setSelectedConditions([]);
                            setSelectedBrand("");
                            setSelectedModel("");
                            setSelectedCategory("");
                        }}
                        fontWeight="700"
                    >
                        Clear All Filters
                    </Button>
                )
            )}
        </VStack>
    );

    return (
        <Box bg="#F8FAFC" minH="100vh" py={{ base: 8, md: 16 }}>
            <Container maxW="container.xl">
                {/* Header Hero Banner */}
                <Box
                    bgGradient="linear(to-r, #0A1927, #132A3E)"
                    color="white"
                    py={{ base: 10, md: 14 }}
                    px={{ base: 6, md: 10 }}
                    borderRadius="2xl"
                    mb={8}
                    boxShadow="md"
                    position="relative"
                    overflow="hidden"
                >
                    <Box
                        position="absolute"
                        top="-50%"
                        right="-20%"
                        w="400px"
                        h="400px"
                        borderRadius="full"
                        bg="#D90404"
                        opacity="0.1"
                        filter="blur(80px)"
                    />
                    <VStack spacing={4} align="center" textAlign="center" position="relative" zIndex={1}>
                        <HStack
                            spacing={2}
                            bg="rgba(219, 4, 4, 0.15)"
                            px={3}
                            py={1.5}
                            borderRadius="full"
                            border="1px solid"
                            borderColor="rgba(219, 4, 4, 0.3)"
                        >
                            <Box w={2} h={2} bg="#D90404" borderRadius="full" />
                            <Text
                                fontSize="11px"
                                fontWeight="800"
                                color="#ff4d4d"
                                textTransform="uppercase"
                                letterSpacing="2px"
                            >
                                OUR ENGINES
                            </Text>
                        </HStack>

                        <Heading
                            fontSize={{ base: "28px", md: "40px" }}
                            fontWeight="900"
                            letterSpacing="-0.5px"
                        >
                            All {category || "Engine Listings"}
                        </Heading>

                        <Text fontSize={{ base: "14px", md: "16px" }} color="gray.300" maxW="600px">
                            Browse high-quality new, used, and reconditioned engines for various vehicle makes and models.
                        </Text>
                    </VStack>
                </Box>

                {/* Mobile Filter Button and Stats Bar */}
                <Flex
                    justify="space-between"
                    align="center"
                    mb={6}
                    display={{ base: "flex", md: "none" }}
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <Text fontSize="sm" fontWeight="700" color="gray.600">
                        {pagination?.total || 0} Engines Found
                    </Text>
                    <Button
                        leftIcon={<Icon as={FaFilter} />}
                        onClick={onMobileFiltersOpen}
                        colorScheme="brand"
                        size="sm"
                        borderRadius="xl"
                        px={4}
                        fontWeight="700"
                    >
                        Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
                    </Button>
                </Flex>

                {/* Main Content Layout */}
                <Flex direction={{ base: "column", md: "row" }} gap={8} w="full" align="start" id="engine-listings-container">
                    {/* Left Sidebar - Desktop Filters */}
                    <Box
                        w={{ base: "100%", md: "280px" }}
                        bg="white"
                        p={6}
                        borderRadius="2xl"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                        position="sticky"
                        top="100px"
                        display={{ base: "none", md: "block" }}
                    >
                        <FilterContent isMobile={false} />
                    </Box>

                    {/* Right Panel - Listings Grid */}
                    <Box flex="1" w="full">
                        {/* Results Count Header for Desktop */}
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={6}
                            display={{ base: "none", md: "flex" }}
                        >
                            <Text fontSize="md" fontWeight="800" color="gray.700">
                                {pagination?.total || 0} Results Found
                                {activeFilterCount > 0 && (
                                    <Badge ml={2} colorScheme="brand" variant="subtle" px={2} py={0.5} borderRadius="full">
                                        {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                                    </Badge>
                                )}
                            </Text>
                        </Flex>

                        {loading || isFetching ? (
                            <SimpleGrid columns={{ base: 2, md: 2, lg: 3, xl: 4 }} spacing={5} w="full">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </SimpleGrid>
                        ) : engines.length > 0 ? (
                            <VStack spacing={8} w="full">
                                <MotionGrid
                                    columns={{ base: 2, md: 2, lg: 3, xl: 4 }}
                                    spacing={5}
                                    w="full"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {engines.map((engine) => {
                                        const badgeStyles = getConditionBadgeStyles(engine.condition);
                                        return (
                                            <MotionBox
                                                key={engine._id}
                                                as={RouterLink}
                                                to={`/products/${engine._id}`}
                                                variants={cardVariants}
                                                bg="white"
                                                borderRadius="2xl"
                                                p={4}
                                                boxShadow="sm"
                                                border="1px solid"
                                                borderColor="gray.100"
                                                cursor="pointer"
                                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                                position="relative"
                                                display="flex"
                                                flexDirection="column"
                                                justifyContent="space-between"
                                                _hover={{
                                                    transform: "translateY(-6px)",
                                                    boxShadow: "md",
                                                    borderColor: "brand.300",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                {/* Condition Badge */}
                                                <Badge
                                                    position="absolute"
                                                    top={3}
                                                    right={3}
                                                    bg={badgeStyles.bg}
                                                    color={badgeStyles.color}
                                                    border="1px solid"
                                                    borderColor={badgeStyles.borderColor}
                                                    borderRadius="full"
                                                    px={2.5}
                                                    py={0.5}
                                                    fontSize="10px"
                                                    fontWeight="bold"
                                                    textTransform="uppercase"
                                                >
                                                    {engine.condition || "Used"}
                                                </Badge>

                                                {/* Image */}
                                                <Box
                                                    h="110px"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    mb={4}
                                                    mt={3}
                                                >
                                                    <Image
                                                        src={
                                                            engine.images?.[0] ||
                                                            "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
                                                        }
                                                        alt={engine.name}
                                                        maxH="100%"
                                                        objectFit="contain"
                                                        fallbackSrc="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
                                                    />
                                                </Box>

                                                {/* Specs and Info */}
                                                <VStack align="stretch" spacing={2} flex="1">
                                                    <Text
                                                        fontWeight="800"
                                                        fontSize="14px"
                                                        color="gray.900"
                                                        noOfLines={1}
                                                        lineHeight="short"
                                                        title={engine.name}
                                                    >
                                                        {engine.name}
                                                    </Text>

                                                    <Text fontSize="12px" color="gray.500" noOfLines={1}>
                                                        {engine.model || "Universal Fit"}
                                                    </Text>

                                                    {/* Specs Grid */}
                                                    <SimpleGrid
                                                        columns={2}
                                                        spacing={2}
                                                        fontSize="10px"
                                                        color="gray.500"
                                                        mt={2}
                                                        py={2}
                                                        borderTop="1px dashed"
                                                        borderBottom="1px dashed"
                                                        borderColor="gray.100"
                                                    >
                                                        <HStack spacing={1}>
                                                            <Icon as={FaTachometerAlt} color="gray.400" />
                                                            <Text noOfLines={1}>{engine.mileage || "Low Miles"}</Text>
                                                        </HStack>
                                                        <HStack spacing={1}>
                                                            <Icon as={FaCar} color="gray.400" />
                                                            <Text noOfLines={1}>{engine.make || "Engine"}</Text>
                                                        </HStack>
                                                        <HStack spacing={1}>
                                                            <Icon as={FaCogs} color="gray.400" />
                                                            <Text noOfLines={1}>{engine.engineType || "Gas/Diesel"}</Text>
                                                        </HStack>
                                                        <HStack spacing={1}>
                                                            <Icon as={FaCalendarAlt} color="gray.400" />
                                                            <Text noOfLines={1}>{engine.year || "N/A"}</Text>
                                                        </HStack>
                                                    </SimpleGrid>
                                                </VStack>

                                                {/* Price & Action */}
                                                <VStack align="stretch" spacing={3} mt={4}>
                                                    <Text fontSize="16px" fontWeight="900" color="brand.500" textAlign="center">
                                                        {engine.price ? `£${Number(engine.price).toLocaleString()}` : "Get Quote"}
                                                    </Text>
                                                    <Button
                                                        size="sm"
                                                        w="full"
                                                        bg="gray.50"
                                                        color="gray.800"
                                                        fontSize="11px"
                                                        fontWeight="800"
                                                        borderRadius="xl"
                                                        border="1px solid"
                                                        borderColor="gray.100"
                                                        _hover={{
                                                            bg: "brand.500",
                                                            color: "white",
                                                            borderColor: "brand.500",
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </VStack>
                                            </MotionBox>
                                        );
                                    })}
                                </MotionGrid>

                                {/* Pagination Controls */}
                                {pagination && pagination.pages > 1 && (
                                    <HStack spacing={2} justify="center" mt={8} w="full">
                                        <Button
                                            size="sm"
                                            onClick={() => handlePageChange(page - 1)}
                                            isDisabled={page === 1}
                                            variant="outline"
                                            colorScheme="brand"
                                            borderRadius="xl"
                                            fontWeight="700"
                                        >
                                            Prev
                                        </Button>

                                        {renderPageButtons()}

                                        <Button
                                            size="sm"
                                            onClick={() => handlePageChange(page + 1)}
                                            isDisabled={page === pagination.pages}
                                            variant="outline"
                                            colorScheme="brand"
                                            borderRadius="xl"
                                            fontWeight="700"
                                        >
                                            Next
                                        </Button>
                                    </HStack>
                                )}
                            </VStack>
                        ) : (
                            <Center py={20} bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" w="full">
                                <VStack spacing={3}>
                                    <Text fontWeight="800" color="gray.500" fontSize="18px">
                                        No engines found
                                    </Text>
                                    <Text color="gray.400" fontSize="14px">
                                        Try adjusting your filters or search keywords.
                                    </Text>
                                </VStack>
                            </Center>
                        )}
                    </Box>
                </Flex>
            </Container>

            {/* Mobile Filters Drawer */}
            <Drawer isOpen={isMobileFiltersOpen} placement="bottom" onClose={onMobileFiltersClose}>
                <DrawerOverlay />
                <DrawerContent borderTopRadius="2xl" maxH="80vh">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" borderColor="gray.100" fontSize="16px" fontWeight="800">
                        Filter Engines
                    </DrawerHeader>
                    <DrawerBody py={6}>
                        <FilterContent isMobile={true} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}