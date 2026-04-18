// src/components/ReviewsSection.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Plant Manager",
      company: "SteelTech Industries, Pune",
      text: "We purchased a 500kVA reconditioned generator from IndustrialMarket. Excellent quality and outstanding technical support.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Malhotra",
      role: "Procurement Head",
      company: "Aqua Pumps & Systems, Ahmedabad",
      text: "Saved almost 35% compared to direct pricing. Very transparent process and reliable suppliers.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Sanjay Verma",
      role: "Operations Director",
      company: "Bharat Construction Pvt Ltd, Delhi",
      text: "Bought a reconditioned excavator. Delivered in perfect condition with full documentation.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  return (
    <Box bg="gray.50" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Text
              fontSize="14px"
              fontWeight="600"
              color="#D90404"
              letterSpacing="1px"
              mb={2}
            >
              REAL STORIES FROM REAL BUYERS
            </Text>
            <Heading fontSize="28px" fontWeight="700">What Our Clients Say</Heading>
          </Box>

          {/* Desktop Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            w="full"
            display={{ base: "none", md: "grid" }}
          >
            {testimonials.map((t, i) => (
              <Box
                key={i}
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="sm"
              >
                <HStack spacing={4} mb={4}>
                  <Avatar src={t.image} size="sm" />
                  <Box>
                    <Text fontWeight="600" fontSize="15px">{t.name}</Text>
                    <Text fontSize="13px" color="gray.500">{t.role}</Text>
                  </Box>
                </HStack>

                <Text fontSize="14px" lineHeight="1.6" color="gray.700" mb={4}>
                  "{t.text}"
                </Text>

                <HStack>
                  {[...Array(5)].map((_, idx) => (
                    <Icon
                      key={idx}
                      as={FaStar}
                      color={idx < t.rating ? "#D90404" : "gray.300"}
                      boxSize={3.5}
                    />
                  ))}
                </HStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Mobile Slider */}
          <Box display={{ base: "block", md: "none" }} maxW="500px" mx="auto">
            <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
              <Icon as={FaQuoteLeft} color="#D90404" opacity={0.15} boxSize={10} mb={4} />
              <Text fontSize="15px" lineHeight="1.7" mb={6}>"{testimonials[currentIndex].text}"</Text>

              <HStack>
                <Avatar src={testimonials[currentIndex].image} size="md" />
                <Box>
                  <Text fontWeight="600">{testimonials[currentIndex].name}</Text>
                  <Text fontSize="14px" color="gray.500">{testimonials[currentIndex].role}</Text>
                  <Text fontSize="13px" color="gray.500">{testimonials[currentIndex].company}</Text>
                </Box>
              </HStack>

              <HStack mt={4}>
                {[...Array(5)].map((_, idx) => (
                  <Icon
                    key={idx}
                    as={FaStar}
                    color={idx < testimonials[currentIndex].rating ? "#D90404" : "gray.300"}
                  />
                ))}
              </HStack>
            </Box>

            <HStack justify="center" spacing={3} mt={6}>
              {testimonials.map((_, idx) => (
                <Box
                  key={idx}
                  w={currentIndex === idx ? "12px" : "8px"}
                  h="8px"
                  bg={currentIndex === idx ? "#D90404" : "gray.300"}
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}