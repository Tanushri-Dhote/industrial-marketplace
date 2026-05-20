import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Avatar,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MotionBox = motion(Box);

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Mark R.",
      role: "Verified Buyer",
      text: "Engine was delivered on time and looks like new. Excellent service and great communication.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "James Walker",
      role: "Operations Manager",
      text: "We sourced a reconditioned diesel generator and the performance has exceeded expectations. Excellent support and fast delivery across the UK.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      name: "Charlotte Evans",
      role: "Procurement Lead",
      text: "Professional service from start to finish. The machinery quality was outstanding and helped us reduce operational costs significantly.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Oliver Thompson",
      role: "Site Operations Director",
      text: "Purchased reconditioned construction equipment for multiple projects. Reliable machines, fair pricing, and excellent after-sales support.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/52.jpg",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box bg="#F7F8FA" py={{ base: 12, md: 8 }} overflow="hidden">
      <Container maxW="container.md">
        <VStack spacing={6} textAlign="center" mb={10}>
          <Text
            fontSize="13px"
            fontWeight="800"
            color="#E10600"
            letterSpacing="1px"
            textTransform="uppercase"
          >
            TESTIMONIALS
          </Text>
          <Heading fontSize={{ base: "26px", md: "32px", lg: "36px" }} fontWeight="800" color="#111111">
            What Our Customers Say
          </Heading>
        </VStack>

        <Box position="relative">
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentIndex}
              bg="white"
              p={{ base: 8, md: 12 }}
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(0,0,0,0.05)"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              position="relative"
            >
              {/* Quote Icon */}
              <Box position="absolute" top={{ base: 6, md: 10 }} left={{ base: 4, md: 10 }}>
                <Icon as={FaQuoteLeft} color="#E10600" boxSize={{ base: 8, md: 10 }} />
              </Box>

              <VStack spacing={8} align="center" px={{ base: 4, md: 12 }}>
                {/* Testimonial Text */}
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.6"
                  color="#444444"
                  fontStyle="italic"
                  mt={{ base: 10, md: 0 }} // push down on mobile so it doesn't overlap with quote
                  textAlign="center"
                  fontWeight="500"
                >
                  {testimonials[currentIndex].text}
                </Text>

                {/* Profile */}
                <HStack spacing={4}>
                  <Avatar src={testimonials[currentIndex].image} size="sm" />
                  <Box textAlign="left">
                    <Text fontWeight="800" fontSize="15px" color="#111111">
                      {testimonials[currentIndex].name}
                    </Text>
                    <Text fontSize="13px" color="gray.500">
                      {testimonials[currentIndex].role}
                    </Text>
                  </Box>
                </HStack>

                {/* Bottom Row - Navigation and Stars */}
                <Flex w="full" justify="space-between" align="center" mt={4}>
                  {/* Left Arrow */}
                  <IconButton
                    icon={<FaChevronLeft />}
                    aria-label="Previous Testimonial"
                    variant="ghost"
                    color="gray.600"
                    _hover={{ color: "#E10600", bg: "transparent" }}
                    onClick={handlePrev}
                  />

                  {/* Stars */}
                  <HStack spacing={1}>
                    {[...Array(5)].map((_, idx) => (
                      <Icon
                        key={idx}
                        as={FaStar}
                        color={idx < testimonials[currentIndex].rating ? "#E10600" : "gray.300"}
                        boxSize={4}
                      />
                    ))}
                  </HStack>

                  {/* Right Arrow */}
                  <IconButton
                    icon={<FaChevronRight />}
                    aria-label="Next Testimonial"
                    variant="ghost"
                    color="gray.600"
                    _hover={{ color: "#E10600", bg: "transparent" }}
                    onClick={handleNext}
                  />
                </Flex>
              </VStack>
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}
