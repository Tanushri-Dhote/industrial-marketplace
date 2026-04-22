import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  Image,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTruck } from 'react-icons/fa';
import API from '../services/api';

export default function TopEnginesSection({ category }) {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const accentColor = "#D90404";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/products');
        
        // Filter by category if needed
        // Assuming backend returns products with category.name or similar
        // For now, filtering based on matching the 'category' prop if it's not 'Industrial Engines'
        let filtered = data;
        if (category && category !== 'Industrial Engines') {
          filtered = data.filter(p => 
            p.category?.name === category || 
            (category === 'Used Engines' && p.condition?.toLowerCase() === 'used') ||
            (category === 'Reconditioned Engines' && p.condition?.toLowerCase() === 'reconditioned')
          );
        }
        
        setEngines(filtered.slice(0, 10)); // Show top 10
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const EngineCard = ({ engine }) => (
    <VStack 
      align="start" 
      spacing={2} 
      bg="white" 
      p={2} 
      borderRadius="lg" 
      boxShadow="sm" 
      border="1px solid" 
      borderColor="gray.100" 
      _hover={{ boxShadow: "md", borderColor: "blue.200" }}
      transition="all 0.2s"
    >
      <Box w="full" h="120px" borderRadius="md" overflow="hidden" bg="gray.50">
        <Image 
          src={engine.images?.[0] || 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80'} 
          alt={engine.name} 
          w="full" 
          h="full" 
          objectFit="cover" 
        />
      </Box>
      <VStack align="start" spacing={1} w="full">
        <Text fontSize="12px" fontWeight="700" color="blue.700" noOfLines={2} lineHeight="1.2" h="28px">
          {engine.name}
        </Text>
        <HStack spacing={1} fontSize="11px" color="gray.600">
          <Text fontWeight="bold">Fits:</Text>
          <Text>{engine.model}</Text>
        </HStack>
        
        <Badge 
          fontSize="9px" 
          px={2} 
          borderRadius="full" 
          colorScheme={engine.condition?.toLowerCase() === 'reconditioned' ? 'orange' : 'blue'}
          textTransform="uppercase"
        >
          {engine.condition}
        </Badge>

        <Text fontSize="16px" fontWeight="800" color="gray.900" mt={1}>
          £{engine.price}
        </Text>
        
        <VStack align="start" spacing={0.5} mt={1} w="full" borderTop="1px solid" borderColor="gray.50" pt={1}>
          <HStack spacing={1} fontSize="10px" color="green.600" fontWeight="bold">
            <Icon as={FaCheckCircle} />
            <Text>Supplied & Fitted</Text>
          </HStack>
          <HStack spacing={1} fontSize="10px" color="gray.500">
            <Icon as={FaTruck} color={accentColor} />
            <Text>Shipping Available</Text>
          </HStack>
        </VStack>
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
    <Box bg="#F8FAFC" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="start">
          <Heading fontSize={{ base: "22px", md: "28px" }} fontWeight="800" color="gray.900">
            Top {category.toLowerCase()} for Sale in the UK
          </Heading>

          {engines.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={4} w="full">
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