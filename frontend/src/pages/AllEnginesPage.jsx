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
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter, FaCar, FaCogs, FaCalendarAlt, FaTachometerAlt, FaUndo, FaSearch } from "react-icons/fa";
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
    <Box bg="white" borderRadius="24px" p={4} border="1px solid" borderColor="gray.100" boxShadow="sm">
        <Skeleton h="130px" borderRadius="20px" mb={4} />
        <Skeleton h="18px" w="75%" mb={2} borderRadius="md" />
        <Skeleton h="12px" w="45%" mb={4} borderRadius="md" />
        <Skeleton h="18px" w="30%" mx="auto" mb={3} mt={4} borderRadius="md" />
        <Skeleton h="36px" w="full" borderRadius="xl" />
    </Box>
);

export default function AllEnginesPage({ category }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

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

    const [searchInput, setSearchInput] = useState(search);
    const [searchVal, setSearchVal] = useState(search);

    useEffect(() => {
        setSelectedBrand(brand);
        setSelectedModel(model);
    }, [brand, model]);

    useEffect(() => {
        setSelectedCategory(category || "");
    }, [category]);

    useEffect(() => {
        setSearchInput(search);
        setSearchVal(search);
    }, [search]);

    // Load active brands using optimized parameter all=true
    const { data: brandsRes } = useQuery({
        queryKey: ["brands-list"],
        queryFn: async () => {
            const res = await API.get("/brands", { params: { all: true } });
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

    // Reset page on search or filter updates
    useEffect(() => {
        setPage(1);
    }, [searchVal, selectedBrand, selectedModel, selectedCategory, priceMin, priceMax, mileageMax, selectedConditions]);

    const { data, isLoading: loading, isFetching } = useQuery({
        queryKey: [
            "all-products",
            { category: selectedCategory, search: searchVal, brand: selectedBrand, model: selectedModel, priceMin, priceMax, mileageMax, selectedConditions, page },
        ],
        queryFn: async () => {
            const res = await API.get("/products", {
                params: {
                    category: selectedCategory || undefined,
                    search: searchVal || undefined,
                    brand: selectedBrand || undefined,
                    model: selectedModel || undefined,
                    priceMin,
                    priceMax,
                    mileageMax,
                    conditions: selectedConditions.join(","),
                    page,
                    limit: 12, // Grid layout fits 12 items perfectly (3x4 or 4x3)
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

    const triggerSearch = () => {
        setSearchVal(searchInput);
        setPage(1);
        const newParams = new URLSearchParams(location.search);
        if (searchInput) {
            newParams.set("search", searchInput);
        } else {
            newParams.delete("search");
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
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
                    bg={isCurrent ? "#D90404" : "gray.50"}
                    color={isCurrent ? "white" : "gray.700"}
                    border="1px solid"
                    borderColor={isCurrent ? "#D90404" : "gray.250"}
                    _hover={{ bg: isCurrent ? "#D90404" : "gray.100" }}
                    borderRadius="xl"
                    fontWeight="800"
                >
                    {p}
                </Button>
            );
        });
    };

    const FilterContent = ({ isMobile }) => (
        <VStack align="stretch" spacing={6}>
            <Flex justify="space-between" align="center" display={isMobile ? "none" : "flex"}>
                <Heading fontSize="14px" fontWeight="900" textTransform="uppercase" letterSpacing="wider" color="gray.800">
                    Filters
                </Heading>
                {activeFilterCount > 0 && (
                    <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        leftIcon={<Icon as={FaUndo} />}
                        onClick={() => {
                            setPriceMin("");
                            setPriceMax("");
                            setMileageMax("");
                            setSelectedConditions([]);
                            setSelectedBrand("");
                            setSelectedModel("");
                            setSelectedCategory("");
                            setSearchInput("");
                            setSearchVal("");
                            navigate("/all-engines");
                        }}
                    >
                        Reset All
                    </Button>
                )}
            </Flex>

            {/* Category Filter */}
            <VStack align="stretch" spacing={2.5}>
                <Text fontWeight="800" fontSize="12px" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
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
                    _focus={{ borderColor: "#D90404", bg: "white" }}
                    fontSize="14px"
                    fontWeight="600"
                    color="gray.700"
                >
                    <option value="Car Engines">Car Engines</option>
                    <option value="Used Engines">Used Engines</option>
                    <option value="Reconditioned Engines">Reconditioned Engines</option>
                    <option value="Gearboxes">Gearboxes</option>
                </Select>
            </VStack>

            {/* Brand Filter */}
            <VStack align="stretch" spacing={2.5}>
                <Text fontWeight="800" fontSize="12px" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
                    Brand
                </Text>
                <Select
                    placeholder="All Brands"
                    size="md"
                    borderRadius="xl"
                    value={selectedBrand}
                    onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel("");
                    }}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: "#D90404", bg: "white" }}
                    fontSize="14px"
                    fontWeight="600"
                    color="gray.700"
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
                <VStack align="stretch" spacing={2.5}>
                    <Text fontWeight="800" fontSize="12px" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
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
                        _focus={{ borderColor: "#D90404", bg: "white" }}
                        fontSize="14px"
                        fontWeight="600"
                        color="gray.700"
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
            <VStack align="stretch" spacing={2.5}>
                <Text fontWeight="800" fontSize="12px" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
                    Condition
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                    {["New", "Used", "Reconditioned"].map((cond) => {
                        const isChecked = selectedConditions.includes(cond);
                        return (
                            <Box
                                key={cond}
                                border="1px solid"
                                borderColor={isChecked ? "#D90404" : "gray.200"}
                                bg={isChecked ? "rgba(217, 4, 4, 0.06)" : "white"}
                                color={isChecked ? "#D90404" : "gray.600"}
                                borderRadius="full"
                                px={3.5}
                                py={1.5}
                                cursor="pointer"
                                transition="all 0.2s"
                                fontSize="12px"
                                fontWeight="750"
                                _hover={{ borderColor: isChecked ? "#D90404" : "gray.300" }}
                                onClick={() => {
                                    if (isChecked) {
                                        setSelectedConditions(selectedConditions.filter((c) => c !== cond));
                                    } else {
                                        setSelectedConditions([...selectedConditions, cond]);
                                    }
                                }}
                            >
                                {cond}
                            </Box>
                        );
                    })}
                </HStack>
            </VStack>

            {/* Price Filter */}
            <VStack align="stretch" spacing={2.5}>
                <Text fontWeight="800" fontSize="12px" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
                    Price Range (£)
                </Text>
                <HStack spacing={2}>
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
                        _focus={{ borderColor: "#D90404", bg: "white" }}
                        fontSize="13px"
                        flex={1}
                    />
                    <Text fontSize="sm" color="gray.400" fontWeight="bold" flexShrink={0}>
                        -
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
                        _focus={{ borderColor: "#D90404", bg: "white" }}
                        fontSize="13px"
                        flex={1}
                    />
                </HStack>
            </VStack>

            {/* Mileage Filter */}
            <VStack align="stretch" spacing={2.5}>
                <Text fontWeight="800" fontSize="12px" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
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
                    _focus={{ borderColor: "#D90404", bg: "white" }}
                    fontSize="13px"
                />
            </VStack>

            {isMobile ? (
                <Button
                    size="md"
                    bg="#D90404"
                    color="white"
                    _hover={{ bg: "red.600" }}
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
                        colorScheme="red"
                        borderRadius="xl"
                        onClick={() => {
                            setPriceMin("");
                            setPriceMax("");
                            setMileageMax("");
                            setSelectedConditions([]);
                            setSelectedBrand("");
                            setSelectedModel("");
                            setSelectedCategory("");
                            setSearchInput("");
                            setSearchVal("");
                            navigate("/all-engines");
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
        <Box bg="#F8FAFC" minH="100vh" py={{ base: 8, md: 12 }}>
            <Container maxW="container.xl">
                {/* Header Hero Banner Redesigned */}
                <Box
                    bgGradient="linear(to-br, #0B1520 0%, #162A45 100%)"
                    color="white"
                    py={{ base: 12, md: 16 }}
                    px={{ base: 6, md: 12 }}
                    borderRadius="3xl"
                    mb={10}
                    boxShadow="xl"
                    position="relative"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                >
                    {/* Glowing Decorative Orbs */}
                    <Box
                        position="absolute"
                        top="-20%"
                        right="-10%"
                        w="380px"
                        h="380px"
                        borderRadius="full"
                        bg="#D90404"
                        opacity="0.18"
                        filter="blur(80px)"
                        pointerEvents="none"
                    />
                    <Box
                        position="absolute"
                        bottom="-10%"
                        left="-10%"
                        w="250px"
                        h="250px"
                        borderRadius="full"
                        bg="blue.500"
                        opacity="0.1"
                        filter="blur(75px)"
                        pointerEvents="none"
                    />

                    <VStack spacing={6} align="center" textAlign="center" position="relative" zIndex={2}>
                        <HStack
                            spacing={2.5}
                            bg="whiteAlpha.100"
                            backdropFilter="blur(8px)"
                            px={4}
                            py={1.5}
                            borderRadius="full"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        >
                            <Box w={2} h={2} bg="#D90404" borderRadius="full" />
                            <Text fontSize="11px" fontWeight="800" color="red.400" letterSpacing="2px" textTransform="uppercase">
                                Verified Inventory
                            </Text>
                        </HStack>

                        <Heading fontSize={{ base: "32px", md: "46px" }} fontWeight="900" letterSpacing="-1px" lineHeight="1.15">
                            All {selectedCategory || "Engine Listings"}
                        </Heading>

                        <Text fontSize={{ base: "14px", md: "16px" }} color="slate.300" maxW="600px" opacity={0.85}>
                            Browse our extensive inventory of high-performance new, reconditioned, and fully tested used engines.
                        </Text>

                        {/* Interactive Search Bar */}
                        <Box as="form" onSubmit={(e) => { e.preventDefault(); triggerSearch(); }} w="full" maxW="550px" mt={2}>
                            <HStack
                                bg="white"
                                p={1.5}
                                borderRadius="2xl"
                                boxShadow="lg"
                                border="1px solid"
                                borderColor="gray.200"
                                spacing={0}
                            >
                                <Input
                                    placeholder="Search by make, model, engine code..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    border="none"
                                    color="gray.800"
                                    _focus={{ boxShadow: "none" }}
                                    fontSize="14px"
                                    h="46px"
                                    pl={4}
                                />
                                <Button
                                    leftIcon={<Icon as={FaSearch} />}
                                    onClick={triggerSearch}
                                    bg="gray.950"
                                    color="white"
                                    px={6}
                                    h="46px"
                                    borderRadius="xl"
                                    fontSize="13px"
                                    fontWeight="800"
                                    _hover={{ bg: "#D90404" }}
                                    transition="all 0.2s"
                                >
                                    Search
                                </Button>
                            </HStack>
                        </Box>
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
                    borderRadius="2xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <Text fontSize="14px" fontWeight="800" color="gray.700">
                        {pagination?.total || 0} Engines Found
                    </Text>
                    <Button
                        leftIcon={<Icon as={FaFilter} />}
                        onClick={onMobileFiltersOpen}
                        bg="#D90404"
                        color="white"
                        _hover={{ bg: "red.600" }}
                        size="sm"
                        borderRadius="xl"
                        px={4}
                        fontWeight="800"
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
                        borderRadius="24px"
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
                            <Text fontSize="16px" fontWeight="800" color="gray.800">
                                {pagination?.total || 0} Engines Found
                                {activeFilterCount > 0 && (
                                    <Badge ml={2} colorScheme="red" variant="subtle" px={2.5} py={0.5} borderRadius="full">
                                        {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
                                    </Badge>
                                )}
                            </Text>
                        </Flex>

                        {/* Loading States & Grid */}
                        {loading && !engines.length ? (
                            <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} spacing={5} w="full">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </SimpleGrid>
                        ) : engines.length > 0 ? (
                            <VStack spacing={10} w="full">
                                <MotionGrid
                                    columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
                                    spacing={5}
                                    w="full"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    opacity={isFetching ? 0.7 : 1}
                                    transition="opacity 0.2s ease"
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
                                                borderRadius="24px"
                                                p={4}
                                                boxShadow="sm"
                                                border="1px solid"
                                                borderColor="gray.100"
                                                cursor="pointer"
                                                transition="all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                                                position="relative"
                                                display="flex"
                                                flexDirection="column"
                                                justifyContent="space-between"
                                                role="group"
                                                _hover={{
                                                    transform: "translateY(-4px)",
                                                    boxShadow: "md",
                                                    borderColor: "gray.200",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                <Box>
                                                    {/* Condition Badge */}
                                                    <Badge
                                                        position="absolute"
                                                        top={3.5}
                                                        right={3.5}
                                                        bg={badgeStyles.bg}
                                                        color={badgeStyles.color}
                                                        border="1px solid"
                                                        borderColor={badgeStyles.borderColor}
                                                        borderRadius="full"
                                                        px={3}
                                                        py={0.5}
                                                        fontSize="10px"
                                                        fontWeight="800"
                                                        textTransform="uppercase"
                                                        zIndex={1}
                                                    >
                                                        {engine.condition || "Used"}
                                                    </Badge>
                                                    {/* Image Container with zoom-on-hover */}
                                                    <Box
                                                        bg="gray.50"
                                                        borderRadius="20px"
                                                        h="140px"
                                                        w="full"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        mb={4}
                                                        mt={2}
                                                        overflow="hidden"
                                                        position="relative"
                                                        border="1px solid"
                                                        borderColor="gray.100"
                                                    >
                                                        <Image
                                                            src={
                                                                engine.images?.[0] ||
                                                                "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
                                                            }
                                                            alt={engine.name}
                                                            maxH="90%"
                                                            maxW="90%"
                                                            objectFit="contain"
                                                            transition="transform 0.5s ease"
                                                            _groupHover={{ transform: "scale(1.06)" }}
                                                            fallbackSrc="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
                                                        />
                                                    </Box>

                                                    {/* Info Section */}
                                                    <VStack align="stretch" spacing={1.5}>
                                                        <Text
                                                            fontWeight="800"
                                                            fontSize="14px"
                                                            color="gray.900"
                                                            noOfLines={1}
                                                            lineHeight="shorter"
                                                            title={engine.name}
                                                        >
                                                            {engine.name}
                                                        </Text>

                                                        <Text fontSize="11px" fontWeight="700" color="gray.400" noOfLines={1}>
                                                            {engine.model || "Universal Fit"}
                                                        </Text>
                                                     </VStack> 
                                                </Box>

                                                {/* Price & Action CTA */}
                                                <VStack align="stretch" spacing={2.5} mt={4}>
                                                    <Text fontSize="18px" fontWeight="900" color="#D90404" textAlign="center">
                                                        {engine.price ? `£${Number(engine.price).toLocaleString()}` : "Get Quote"}
                                                    </Text>
                                                    <Box
                                                        py={2}
                                                        px={4}
                                                        bg="#D90404"
                                                        color="white"
                                                        fontSize="11px"
                                                        fontWeight="800"
                                                        borderRadius="xl"
                                                        textAlign="center"
                                                        h="36px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        _hover={{
                                                            bg: "#b30303",
                                                            transform: "scale(1.03)",
                                                            boxShadow: "0 4px 14px rgba(217,4,4,0.45)",
                                                        }}
                                                        transition="all 0.18s ease"
                                                    >
                                                        View Details
                                                    </Box>
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
                                            colorScheme="gray"
                                            borderRadius="xl"
                                            fontWeight="800"
                                        >
                                            Prev
                                        </Button>

                                        {renderPageButtons()}

                                        <Button
                                            size="sm"
                                            onClick={() => handlePageChange(page + 1)}
                                            isDisabled={page === pagination.pages}
                                            variant="outline"
                                            colorScheme="gray"
                                            borderRadius="xl"
                                            fontWeight="800"
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