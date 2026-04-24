// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Input,
  Flex,
  Badge,  // ← ADD THIS IMPORT
} from '@chakra-ui/react';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupplierStats = () => {
  const stats = [
    { type: 'Supply Only', delivery: 'Free delivery', warranty: '3-18 months', condition: 'Used & Recon', count: 162 },
    { type: 'Supply & Fitted', recovery: 'Incl. recovery', warranty: '12-60 months', condition: 'Used & Recon', count: 72 },
    { type: 'Rebuild or repair', recovery: 'Incl. Recovery', warranty: '12-24 months', condition: 'Repair', count: 49 },
  ];

  return (
    <VStack w="full" spacing={0} bg="white" borderRadius="md" overflow="hidden" border="1px solid" borderColor="gray.100">
      <Box w="full" py={2} bg="gray.50" textAlign="center" borderBottom="1px solid" borderColor="gray.200">
        <Text fontSize="sm" fontWeight="bold" color="gray.700">Suppliers ready to quote you</Text>
      </Box>
      {stats.map((stat, index) => (
        <Box key={index} w="full" px={4} py={2} borderBottom={index !== stats.length - 1 ? "1px solid" : "none"} borderColor="gray.100">
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="xs" fontWeight="bold" color="gray.800">{stat.type}</Text>
              <Text fontSize="10px" color="gray.500">{stat.delivery || stat.recovery}</Text>
            </VStack>
            <VStack align="center" spacing={0} flex={1}>
              <Text fontSize="10px" fontWeight="600" color="gray.600">{stat.warranty}</Text>
              <Text fontSize="10px" color="gray.400">warranty</Text>
            </VStack>
            <VStack align="center" spacing={0} flex={1}>
              <Text fontSize="10px" fontWeight="600" color="gray.600">{stat.condition}</Text>
            </VStack>
            <HStack spacing={1} flex={1} justify="flex-end">
              <Badge colorScheme="green" borderRadius="full" px={2} fontSize="10px">{stat.count}</Badge>
              <Text fontSize="10px" color="gray.500">Suppliers</Text>
            </HStack>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};

export default function HeroSection({ category }) {
  const navigate = useNavigate();
  const toast = useToast();
  const API = import.meta.env.VITE_API_URL;

  // Shared States
  const [vrm, setVrm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Manual Selector States
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [types, setTypes] = useState([]);
  const [partTypes, setPartTypes] = useState([]);  // ← Keep this for VRM card

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [allPartTypes, setAllPartTypes] = useState([]);   // for VRM card
  const [loadingAllParts, setLoadingAllParts] = useState(false);
  const [loadingParts, setLoadingParts] = useState(false);

  const isCategoryPage = category && category !== 'Industrial Engines';

  // Define fetchPartTypes function ← ADD THIS
  const fetchPartTypes = async () => {
    try {
      setLoadingParts(true);
      const res = await axios.get(`${API}/part-types`);
      const data = res.data?.data || res.data || [];
      setPartTypes(data);
    } catch (error) {
      console.error("Error fetching part types:", error);
    } finally {
      setLoadingParts(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchBrands();
    fetchAllPartTypes();
    fetchPartTypes();  // ← Now this function exists
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API}/brands`);
      setBrands(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchAllPartTypes = async () => {
    try {
      setLoadingAllParts(true);
      const res = await axios.get(`${API}/part-types`);
      const data = res.data?.data || res.data || [];
      setAllPartTypes(data);
    } catch (error) {
      console.error("Error fetching all part types:", error);
    } finally {
      setLoadingAllParts(false);
    }
  };

  // Handlers
  const handleBrandChange = async (brandId) => {
    setSelectedBrand(brandId);
    setSelectedModel(""); 
    setSelectedYear(""); 
    setSelectedType("");
    setModels([]); 
    setYears([]); 
    setTypes([]);

    if (brandId) {
      try {
        const res = await axios.get(`${API}/models/${brandId}`);
        setModels(res.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleModelChange = async (modelId) => {
    setSelectedModel(modelId);
    setSelectedYear(""); 
    setSelectedType("");
    setYears([]); 
    setTypes([]);

    if (modelId) {
      try {
        const res = await axios.get(`${API}/years/${modelId}`);
        setYears(res.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleYearChange = async (year) => {
    setSelectedYear(year);
    setSelectedType("");
    setTypes([]);

    if (year) {
      try {
        const res = await axios.get(`${API}/types/${year}`);
        setTypes(res.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // VRM Submit
  const handleVRMSubmit = () => {
    if (!vrm.trim()) {
      return toast({ title: "Enter registration number", status: "warning" });
    }

    const cleanedVRM = vrm.replace(/\s+/g, "").toUpperCase();
    const ukVrmRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;

    if (!ukVrmRegex.test(cleanedVRM)) {
      return toast({ title: "Invalid Registration", description: "Please enter a valid UK number plate", status: "error" });
    }

    if (!selectedCategory) {
      return toast({ title: "Please select a part", status: "warning" });
    }

    navigate("/call-seller", {
      state: { vrm: cleanedVRM, category: selectedCategory, searchType: "vrm" },
    });
  };

  // Manual Submit
  const handleManualSubmit = () => {
    if (!selectedBrand || !selectedModel || !selectedYear || !selectedType || !selectedCategory) {
      return toast({
        title: "Incomplete Selection",
        description: "Please fill all fields: Make, Model, Year, Type & Part",
        status: "warning",
      });
    }

    navigate("/call-seller", {
      state: {
        brand: selectedBrand,
        model: selectedModel,
        year: selectedYear,
        type: selectedType,
        category: selectedCategory,
        searchType: "manual",
      },
    });
  };

  // Manual Selector Component
  const ManualSelector = () => (
    <VStack spacing={3} w="full">
      <HStack w="full" spacing={3}>
        <select
          style={{ flex: 1, padding: "12px", borderRadius: "6px", fontSize: "15px", border: "1px solid #ddd" }}
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
        >
          <option value="">Select Make</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
        </select>

        <select
          style={{ flex: 1, padding: "12px", borderRadius: "6px", fontSize: "15px", border: "1px solid #ddd" }}
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model._id} value={model._id}>{model.modelName}</option>
          ))}
        </select>
      </HStack>

      <HStack w="full" spacing={3}>
        <select
          style={{ flex: 1, padding: "12px", borderRadius: "6px", fontSize: "15px", border: "1px solid #ddd" }}
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((item, i) => (
            <option key={i} value={item.name}>{item.name}</option>
          ))}
        </select>

        <select
          style={{ flex: 1, padding: "12px", borderRadius: "6px", fontSize: "15px", border: "1px solid #ddd" }}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Select Type</option>
          {types.map((item, i) => (
            <option key={i} value={item.name}>{item.name}</option>
          ))}
        </select>
      </HStack>

      {/* Part Type Dropdown - using partTypes */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          width: "100%",
          backgroundColor: "#fff"
        }}
      >
        {loadingAllParts ? (
          <option>Loading parts...</option>
        ) : allPartTypes.length === 0 ? (
          <option>No parts available</option>
        ) : (
          <>
            <option value="">Select Part</option>
            {allPartTypes.map((item) => (
              <option key={item._id || item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </>
        )}
      </select>
    </VStack>
  );

  return (
    <Box position="relative" minH={{ base: "70vh", lg: "650px" }} overflow="hidden" display="flex" alignItems="center">
      <Box
        position="absolute"
        inset={0}
        bgImage="url('/car-engine-banner.jpg')"
        bgSize="cover"
        bgPosition="center"
      >
        <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)" />
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={2} py={{ base: 6, md: 10 }}>
        <VStack spacing={8} align="center" textAlign="center">
          <Heading
            color="white"
            fontSize={{ base: "26px", md: "38px", lg: "48px" }}
            fontWeight="800"
            lineHeight="1.2"
            textShadow="0 2px 10px rgba(0,0,0,0.4)"
          >
            {isCategoryPage ? `Find ${category} for Sale in the UK` : "Compare local car & van engine reconditioners & breakers"}
          </Heading>

          <Flex
            direction={{ base: "column", lg: "row" }}
            align="stretch"
            justify="center"
            gap={isCategoryPage ? 0 : 8}
            w="full"
            maxW={isCategoryPage ? "1100px" : "550px"}
          >
            {/* LEFT CARD - VRM */}
            <Box
              bg="#001F3F"
              borderRadius={isCategoryPage ? { base: "2xl", lg: "2xl 0 0 2xl" } : "2xl"}
              boxShadow="xl"
              flex="1"
              p={{ base: 4, md: 6 }}
              position="relative"
            >
              <VStack spacing={5} align="stretch">
                <Box>
                  <Flex bg="#FFD700" borderRadius="md" overflow="hidden" h="54px" align="stretch" border="2px solid" borderColor="#FFD700">
                    <VStack bg="#003399" w="45px" justify="center" spacing={0} px={1}>
                      <Text fontSize="10px" lineHeight="1">🇬🇧</Text>
                      <Text color="white" fontSize="12px" fontWeight="bold">UK</Text>
                    </VStack>
                    <Input
                      placeholder="ENTER YOUR REG"
                      value={vrm}
                      onChange={(e) => setVrm(e.target.value.toUpperCase())}
                      variant="unstyled"
                      bg="transparent"
                      color="#333"
                      _placeholder={{ color: 'rgba(0,0,0,0.3)' }}
                      h="full"
                      fontSize="22px"
                      fontWeight="800"
                      textAlign="center"
                      letterSpacing="1px"
                    />
                  </Flex>
                </Box>

                {/* Part Type Dropdown for VRM Card - using partTypes */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "100%",
                    backgroundColor: "#fff"
                  }}
                >
                  {loadingParts ? (
                    <option>Loading parts...</option>
                  ) : partTypes.length === 0 ? (
                    <option>No parts available</option>
                  ) : (
                    <>
                      <option value="">Select Part</option>
                      {partTypes.map((item) => (
                        <option key={item._id} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>

                <Button
                  w="full"
                  size="lg"
                  bg="#D90404"
                  color="white"
                  h="56px"
                  fontSize="18px"
                  fontWeight="bold"
                  rightIcon={<FaArrowRight />}
                  _hover={{ bg: "#B70303" }}
                  onClick={handleVRMSubmit}
                >
                  Get Free Quotes →
                </Button>

                <VStack align="start" spacing={2} color="white" fontSize="14px">
                  <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Trusted by 1,000s Across the UK</Text></HStack>
                  <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Up to 50% Savings on Used & Recon Engines</Text></HStack>
                  <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">No Upfront Payment - You're In Control</Text></HStack>
                </VStack>

                {!isCategoryPage && <SupplierStats />}
              </VStack>

              {isCategoryPage && (
                <Box
                  display={{ base: "none", lg: "flex" }}
                  position="absolute"
                  right="-15px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={3}
                  color="white"
                  fontWeight="900"
                  fontSize="20px"
                >
                  OR
                </Box>
              )}
            </Box>

            {/* RIGHT CARD - MANUAL */}
            {isCategoryPage && (
              <Box
                bg="#002D5C"
                borderRadius={{ base: "2xl", lg: "0 2xl 2xl 0" }}
                boxShadow="xl"
                flex="1"
                p={{ base: 4, md: 6 }}
                mt={{ base: 4, lg: 0 }}
              >
                <VStack spacing={5} align="stretch">
                  <ManualSelector />

                  <Button
                    w="full"
                    size="lg"
                    bg="#D90404"
                    color="white"
                    h="56px"
                    fontSize="18px"
                    fontWeight="bold"
                    rightIcon={<FaArrowRight />}
                    _hover={{ bg: "#B70303" }}
                    onClick={handleManualSubmit}
                  >
                    Get Free Quotes →
                  </Button>

                  <VStack align="start" spacing={2} color="white" fontSize="14px">
                    <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Supply and Fitting Offered</Text></HStack>
                    <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">Unlimited Mileage Warranty*</Text></HStack>
                    <HStack spacing={2}><Icon as={FaCheckCircle} color="green.400" /><Text fontWeight="500">It Only Takes a Minute</Text></HStack>
                  </VStack>
                </VStack>
              </Box>
            )}
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}