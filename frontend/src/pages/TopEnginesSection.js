import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTruck, FaWrench, FaFire } from 'react-icons/fa';
import Slider from 'react-slick';          // Make sure to install: npm install react-slick slick-carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const bestSellingEngines = [
  {
    title: "Land Rover Range Rover Sport 2013",
    engineCode: "30DDTX 3.0 Diesel",
    condition: "Reconditioned",
    price: 2795,
    fits: "Range Rover Sport",
  },
  {
    title: "Audi A7 Sportback 2010",
    engineCode: "CLAA 3.0 TDI",
    condition: "Reconditioned",
    price: 2495,
    fits: "Audi A7 Sportback",
  },
  {
    title: "Volkswagen Golf VII 2013",
    engineCode: "CUNA Diesel",
    condition: "Used",
    price: 2400,
    fits: "Volkswagen Golf VII",
  },
  {
    title: "Volkswagen Crafter 2011",
    engineCode: "CKTC 2.0L Diesel",
    condition: "Used",
    price: 2200,
    fits: "Volkswagen Crafter",
  },
];

const topEnginesUK = [
  {
    title: "Jaguar F Pace V6 S AWD 2016",
    engineCode: "306PS",
    condition: "Reconditioned",
    price: 4695,
    fits: "Jaguar F-Pace",
  },
  {
    title: "Land Rover Range Rover Evoque 2015",
    engineCode: "204DTD 2.0 Diesel",
    condition: "Reconditioned",
    price: 1795,
    fits: "Range Rover Evoque",
  },
  {
    title: "Audi A7 Sportback 2010",
    engineCode: "CLAA 3.0 TDI",
    condition: "Reconditioned",
    price: 2495,
    fits: "Audi A7 Sportback",
  },
  {
    title: "Land Rover Range Rover Sport 2013",
    engineCode: "30DDTX 3.0 Diesel",
    condition: "Reconditioned",
    price: 2795,
    fits: "Range Rover Sport",
  },
  {
    title: "Volkswagen Crafter 30 35 Bus 2011",
    engineCode: "CKTC 2.0L Diesel",
    condition: "Used",
    price: 2200,
    fits: "Volkswagen Crafter",
  },
];

export default function BestSellingEnginesSection({ category }) {
  const accentColor = "#D90404";

  // Filtering logic based on category
  const filterEngines = (engines) => {
    if (category === 'Used Engines') {
      return engines.filter(e => e.condition === 'Used');
    }
    if (category === 'Reconditioned Engines') {
      return engines.filter(e => e.condition === 'Reconditioned');
    }
    // For other categories, we show all for now as the data is limited
    return engines;
  };

  const filteredBestSelling = filterEngines(bestSellingEngines);
  const filteredTopEngines = filterEngines(topEnginesUK);

  const settings = {
    dots: true,
    infinite: filteredBestSelling.length > 3,
    speed: 600,
    slidesToShow: Math.min(filteredBestSelling.length, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(filteredBestSelling.length, 2) }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const EngineCard = ({ engine, isBestSelling = false }) => (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      mx={2}                    // Important for slider spacing
      transition="all 0.3s ease"
      _hover={{
        borderColor: accentColor,
        boxShadow: "0 12px 30px rgba(255, 107, 0, 0.12)",
      }}
    >
      {/* Image Area */}
      <Box 
        h="170px" 
        bg="gray.100" 
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Text fontSize="6xl" color="gray.300">🛠️</Text>
        
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorScheme={engine.condition === "Reconditioned" ? "orange" : "blue"}
          fontSize="xs"
          px={3}
          py={1}
          borderRadius="full"
        >
          {engine.condition}
        </Badge>

        {isBestSelling && (
          <Badge
            position="absolute"
            top={4}
            left={4}
            bg={accentColor}
            color="white"
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <FaFire /> Best Seller
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Box>
            <Heading size="sm" color="gray.800" lineHeight="1.35" noOfLines={2}>
              {engine.title}
            </Heading>
            <Text fontSize="13px" color="gray.500" mt={1}>
              {engine.engineCode}
            </Text>
          </Box>

          <HStack fontSize="14px" color="gray.600">
            <Icon as={FaWrench} color={accentColor} />
            <Text>Fits {engine.fits}</Text>
          </HStack>

          <Text 
            fontSize="26px" 
            fontWeight="700" 
            color={accentColor}
          >
            £{engine.price}
          </Text>
        </VStack>
      </Box>

      {/* Bottom Bar */}
      <Box 
        px={6} 
        py={4} 
        bg="gray.50" 
        borderTop="1px solid" 
        borderColor="gray.100"
        fontSize="13px"
      >
        <HStack justify="space-between" color="gray.600">
          <HStack>
            <Icon as={FaCheckCircle} color="green.500" />
            <Text>Supplied & Fitted</Text>
          </HStack>
          <HStack>
            <Icon as={FaTruck} color={accentColor} />
            <Text>Shipping Available</Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );

  return (
    <Box bg="#F8FAFC" py={14}>
      <Container maxW="container.xl">
        <VStack spacing={14} align="center">

          {/* Best Selling This Month */}
          <VStack spacing={8} w="full">
            <VStack spacing={3} textAlign="center">
              <HStack spacing={2}>
                <Icon as={FaFire} color="#D90404" fontSize="24px" />
                <Text 
                  fontSize="14px" 
                  fontWeight="700" 
                  color={accentColor} 
                  letterSpacing="1.5px"
                  textTransform="uppercase"
                >
                  THIS MONTH
                </Text>
              </HStack>
              <Heading fontSize={{ base: "26px", md: "32px" }} fontWeight="700" color="gray.800">
                Best Selling {category} This Month
              </Heading>
            </VStack>

            <Box w="full" px={2.5}>
              {filteredBestSelling.length > 0 ? (
                <Slider {...settings}>
                  {filteredBestSelling.map((engine, index) => (
                    <EngineCard key={index} engine={engine} isBestSelling={true} />
                  ))}
                </Slider>
              ) : (
                <Text color="gray.500">No {category.toLowerCase()} currently featured.</Text>
              )}
            </Box>
          </VStack>

          <Divider w="full" maxW="900px" borderColor="gray.300" />

          {/* Top Engines for Sale in the UK */}
          <VStack spacing={8} w="full">
            <VStack spacing={3} textAlign="center">
              <Text 
                fontSize="14px" 
                fontWeight="700" 
                color={accentColor} 
                letterSpacing="1.5px"
                textTransform="uppercase"
              >
                MARKET OVERVIEW
              </Text>
              <Heading fontSize={{ base: "26px", md: "32px" }} fontWeight="700" color="gray.800">
                Top {category} for Sale
              </Heading>
              <Text fontSize="16px" color="gray.600" maxW="580px">
                High quality products with supply & fitting service across our network
              </Text>
            </VStack>

            <Box w="full" px={2.5}>
              {filteredTopEngines.length > 0 ? (
                <Slider {...settings}>
                  {filteredTopEngines.map((engine, index) => (
                    <EngineCard key={index} engine={engine} />
                  ))}
                </Slider>
              ) : (
                <Text color="gray.500">No listings found for this category.</Text>
              )}
            </Box>
          </VStack>

        </VStack>
      </Container>
    </Box>
  );
}