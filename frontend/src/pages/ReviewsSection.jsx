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
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      ease: "easeOut",
    },
  },
};

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "James Walker",
      role: "Operations Manager",
      company: "London Industrial Solutions, UK",
      text: "We sourced a reconditioned diesel generator and the performance has exceeded expectations. Excellent support and fast delivery across the UK.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      name: "Charlotte Evans",
      role: "Procurement Lead",
      company: "Manchester Engineering Group, UK",
      text: "Professional service from start to finish. The machinery quality was outstanding and helped us reduce operational costs significantly.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Oliver Thompson",
      role: "Site Operations Director",
      company: "Birmingham Construction Ltd, UK",
      text: "Purchased reconditioned construction equipment for multiple projects. Reliable machines, fair pricing, and excellent after-sales support.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/52.jpg",
    },


  ];

  return (
    <Box bg="gray.50" py={16} overflow="hidden">
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <MotionBox
            textAlign="center"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Text
              fontSize="14px"
              fontWeight="600"
              color="#D90404"
              letterSpacing="1px"
              mb={2}
            >
              REAL STORIES FROM REAL BUYERS
            </Text>
            <Heading fontSize={{ base: "24px", md: "28px" }} fontWeight="700">What Our Clients Say</Heading>
          </MotionBox>

          {/* Desktop Grid */}
          <MotionSimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            w="full"
            justifyItems="center"
            display={{ base: "none", md: "grid" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {testimonials.map((t, i) => (
              <MotionBox
                key={i}
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="sm"
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  borderColor: "#D9040430"
                }}
                border="1px solid transparent"
                transition={{ duration: 0.2 }}
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
              </MotionBox>
            ))}
          </MotionSimpleGrid>

          {/* Mobile Slider */}
          <Box display={{ base: "block", md: "none" }} maxW="500px" mx="auto" w="full">
            <AnimatePresence mode="wait">
              <MotionBox
                key={currentIndex}
                bg="white"
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                boxShadow="md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Icon as={FaQuoteLeft} color="#D90404" opacity={0.15} boxSize={{ base: 8, md: 10 }} mb={4} />
                <Text fontSize={{ base: "14px", md: "15px" }} lineHeight="1.7" mb={6}>"{testimonials[currentIndex].text}"</Text>

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
              </MotionBox>
            </AnimatePresence>

            <HStack justify="center" spacing={3} mt={6}>
              {testimonials.map((_, idx) => (
                <Box
                  key={idx}
                  w={currentIndex === idx ? "24px" : "8px"}
                  h="8px"
                  bg={currentIndex === idx ? "#D90404" : "gray.300"}
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => setCurrentIndex(idx)}
                  transition="all 0.3s ease"
                />
              ))}
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
