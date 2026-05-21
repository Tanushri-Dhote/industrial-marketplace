import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  Icon,
  Grid,
  SimpleGrid,
  Badge,
  Circle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { MdLibraryBooks } from "react-icons/md";
import { keyframes } from "@emotion/react";
import CallSellerPage from "./CallSellerPage";

import {
  FaCheckCircle,
  FaTools,
  FaShieldAlt,
  FaTruck,
  FaUsers,
  FaAward,
  FaPhoneAlt,
  FaCogs,
  FaQuoteRight,
  FaStar,
  FaThumbsUp,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";

import { Link as RouterLink } from "react-router-dom";
import ReviewSection from "./ReviewsSection";

const RED = "#E10600";

// Animation keyframes
const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const features = [
  {
    icon: FaTools,
    title: "Expert Engine Reconditioning",
    text: "Every engine is carefully rebuilt and tested by experienced technicians using state-of-the-art equipment.",
  },
  {
    icon: FaShieldAlt,
    title: "12 Months Warranty",
    text: "All engines come with comprehensive warranty coverage for complete peace of mind and protection.",
  },
  {
    icon: FaTruck,
    title: "Nationwide Delivery",
    text: "Fast and secure delivery available across the UK with real-time tracking and insurance.",
  },
  {
    icon: FaUsers,
    title: "Trusted By Thousands",
    text: "Join thousands of satisfied customers who rely on our quality, service, and expertise.",
  },
];

const stats = [
  {
    number: "10,000+",
    label: "Engines Supplied",
    target: 10000,
    icon: FaCogs,
  },
  {
    number: "20+",
    label: "Years Experience",
    target: 20,
    icon: FaAward,
  },
  {
    number: "99%",
    label: "Satisfaction Rate",
    target: 99,
    icon: FaThumbsUp,
  },
  {
    number: "24/7",
    label: "Customer Support",
    target: 24,
    icon: FaHeadset,
  },
];

// Counter component
const AnimatedCounter = ({ target, finalText, icon: IconComponent, label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  const displayValue = () => {
    if (count === target) {
      return finalText;
    }
    if (target === 10000) {
      return `${count.toLocaleString()}+`;
    }
    if (target === 99) {
      return `${count}%`;
    }
    if (target === 20) {
      return `${count}+`;
    }
    if (target === 24) {
      return count === 24 ? "24/7" : `${count}`;
    }
    return count;
  };

  return (
    <VStack ref={ref} spacing={2}>
      <Circle size="60px" bg="rgba(225,6,0,0.15)" mb={1}>
        <Icon as={IconComponent} color={RED} boxSize={7} />
      </Circle>
      <Text fontSize={{ base: "28px", md: "36px" }} fontWeight="900" color={RED} lineHeight="1">
        {displayValue()}
      </Text>
      <Text fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="1px" fontSize="11px">
        {label}
      </Text>
    </VStack>
  );
};

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    stats: false,
    cta: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Trigger hero animations on mount
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "features") {
              setIsVisible((prev) => ({ ...prev, features: true }));
            }
            if (entry.target.id === "stats") {
              setIsVisible((prev) => ({ ...prev, stats: true }));
            }
            if (entry.target.id === "cta") {
              setIsVisible((prev) => ({ ...prev, cta: true }));
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Box bg="#F7F8FA" overflowX="hidden">
      {/* ================= HERO SECTION ================= */}
      <Box
        bg="linear-gradient(135deg, #FFFFFF 0%, #FEF2F0 100%)"
        py={{ base: 12, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* Animated Background Elements */}
        <Box
          position="absolute"
          top="-200px"
          right="-100px"
          w="400px"
          h="400px"
          bg="radial-gradient(circle, rgba(225,6,0,0.06) 0%, rgba(225,6,0,0) 70%)"
          borderRadius="full"
          animation={`${rotate} 20s linear infinite`}
        />
        <Box
          position="absolute"
          bottom="-150px"
          left="-100px"
          w="350px"
          h="350px"
          bg="radial-gradient(circle, rgba(225,6,0,0.04) 0%, rgba(225,6,0,0) 70%)"
          borderRadius="full"
          animation={`${rotate} 25s linear infinite reverse`}
        />

        <Container maxW="container.xl" position="relative" zIndex={2}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            justify="space-between"
            gap={{ base: 10, lg: 14 }}
          >
            {/* LEFT CONTENT */}
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge
                bg={RED}
                color="white"
                px={4}
                py={1.5}
                borderRadius="full"
                fontSize="11px"
                fontWeight="800"
                letterSpacing="1px"
                textTransform="uppercase"
                animation={isVisible.hero ? `${fadeUp} 0.6s ease forwards` : "none"}
                opacity={isVisible.hero ? 1 : 0}
                _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
              >
                ✦ Industry Leaders Since 2003 ✦
              </Badge>

              <Heading
                fontSize={{ base: "32px", md: "44px", lg: "52px" }}
                lineHeight="1.2"
                fontWeight="900"
                color="#1A1A1A"
                animation={isVisible.hero ? `${fadeUp} 0.6s ease 0.1s forwards` : "none"}
                opacity={isVisible.hero ? 1 : 0}
              >
                Your Trusted Partner for
                <Text as="span" color={RED} display="block">
                  Quality Engines
                </Text>
              </Heading>

              <Text
                fontSize={{ base: "15px", md: "16px" }}
                color="gray.600"
                lineHeight="1.7"
                maxW="600px"
                animation={isVisible.hero ? `${fadeUp} 0.6s ease 0.2s forwards` : "none"}
                opacity={isVisible.hero ? 1 : 0}
              >
                With over two decades of expertise, we deliver premium reconditioned engines
                backed by warranty. Every engine undergoes rigorous testing to ensure
                reliability and peak performance.
              </Text>

              {/* FEATURE HIGHLIGHTS */}
              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                spacing={3}
                w="full"
                pt={3}
                animation={isVisible.hero ? `${fadeUp} 0.6s ease 0.3s forwards` : "none"}
                opacity={isVisible.hero ? 1 : 0}
              >
                {[
                  "Premium quality parts",
                  "Fully tested & certified",
                  "12 months warranty",
                  "Free technical support",
                ].map((item, idx) => (
                  <HStack key={idx} spacing={2}>
                    <Circle size="20px" bg="red.100">
                      <Icon as={FaCheckCircle} color={RED} boxSize={3} />
                    </Circle>
                    <Text fontWeight="600" color="#2D3748" fontSize="13px">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>

              {/* BUTTONS */}
              <HStack
                spacing={4}
                pt={5}
                flexWrap="wrap"
                animation={isVisible.hero ? `${fadeUp} 0.6s ease 0.4s forwards` : "none"}
                opacity={isVisible.hero ? 1 : 0}
              >
                <Button
                  as={RouterLink}
                  to="/all-engines"
                  bg={RED}
                  color="white"
                  size="lg"
                  px={8}
                  h="52px"
                  fontWeight="700"
                  borderRadius="full"
                  fontSize="14px"
                  rightIcon={<FaArrowRight />}
                  _hover={{
                    bg: "#c40000",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(225,6,0,0.3)"
                  }}
                  transition="all 0.3s"
                >
                  Browse Engines
                </Button>

                <Button
                  variant="outline"
                  color={RED}
                  size="lg"
                  px={7}
                  h="52px"
                  fontWeight="700"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={RED}
                  leftIcon={<MdLibraryBooks />}
                  onClick={onOpen}
                  _hover={{
                    bg: RED,
                    color: "white",
                    borderColor: RED,
                    transform: "translateY(-2px)",
                    boxShadow: "md"
                  }}
                  transition="all 0.3s"
                >
                  Get Free Quote
                </Button>
              </HStack>

              {/* TRUST BADGES */}
              <HStack spacing={5} pt={3}>
                <HStack spacing={1}>
                  <Icon as={FaStar} color="#FFB800" boxSize={3.5} />
                  <Icon as={FaStar} color="#FFB800" boxSize={3.5} />
                  <Icon as={FaStar} color="#FFB800" boxSize={3.5} />
                  <Icon as={FaStar} color="#FFB800" boxSize={3.5} />
                  <Icon as={FaStar} color="#FFB800" boxSize={3.5} />
                  <Text fontSize="13px" fontWeight="600" ml={1}>4.9/5</Text>
                </HStack>
                <Text color="gray.400" fontSize="12px">|</Text>
                <Text fontSize="13px" fontWeight="500">⭐ 2,500+ Reviews</Text>
              </HStack>
            </VStack>

            {/* RIGHT IMAGE */}
            <Box
              flex={1}
              position="relative"
              w="full"
              maxW="550px"
              animation={isVisible.hero ? `${fadeInRight} 0.8s ease forwards` : "none"}
              opacity={isVisible.hero ? 1 : 0}
            >
              <Box
                borderRadius="30px"
                overflow="hidden"
                boxShadow="0 25px 50px rgba(0,0,0,0.12)"
                position="relative"
                _hover={{ transform: "scale(1.01)", transition: "0.4s" }}
              >
                <Image
                  src="/home-about.png"
                  alt="Engine Reconditioning Expert"
                  objectFit="cover"
                  w="100%"
                  h={{ base: "300px", md: "480px" }}
                  fallbackSrc="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop"
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  h="120px"
                  bg="linear-gradient(to top, rgba(0,0,0,0.2), transparent)"
                />
              </Box>

              {/* FLOATING CERTIFICATION CARD */}
              <Box
                position="absolute"
                bottom={{ base: "-15px", md: "30px" }}
                right={{ base: "15px", md: "-20px" }}
                bg="white"
                borderRadius="16px"
                p={4}
                boxShadow="0 15px 30px rgba(0,0,0,0.1)"
                maxW="230px"
                animation={`${float} 4s ease-in-out infinite`}
                _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
                backdropFilter="blur(10px)"
                bgColor="rgba(255,255,255,0.95)"
              >
                <HStack spacing={2}>
                  <Circle size="45px" bg={RED}>
                    <Icon as={FaAward} color="white" boxSize={5} />
                  </Circle>
                  <Box>
                    <Text fontSize="20px" fontWeight="900" color={RED} lineHeight="1">
                      ISO 9001
                    </Text>
                    <Text fontSize="11px" color="gray.600" fontWeight="600">
                      Certified Quality
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* SECOND FLOATING CARD */}
              <Box
                position="absolute"
                top={{ base: "15px", md: "40px" }}
                left={{ base: "15px", md: "-20px" }}
                bg="white"
                borderRadius="16px"
                p={3}
                boxShadow="0 12px 25px rgba(0,0,0,0.08)"
                maxW="170px"
                animation={`${float} 5s ease-in-out infinite reverse`}
                backdropFilter="blur(10px)"
                bgColor="rgba(255,255,255,0.95)"
              >
                <VStack spacing={1}>
                  <Text fontSize="28px" fontWeight="900" color={RED}>20+</Text>
                  <Text fontSize="10px" fontWeight="700" color="gray.600" textAlign="center">
                    Years of Excellence
                  </Text>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* FEATURES SECTION  */}
      <Box py={{ base: 4, md: 6 }} ref={featuresRef} id="features" bg="white">
        <Container maxW="container.xl">
          <VStack spacing={3} textAlign="center" mb={12}>
            <Badge
              bg="red.50"
              color={RED}
              px={3}
              py={1.5}
              borderRadius="full"
              fontSize="11px"
              fontWeight="800"
            >
              WHY CHOOSE US
            </Badge>

            <Heading
              fontSize={{ base: "30px", md: "38px" }}
              fontWeight="900"
              color="#1A1A1A"
              lineHeight="1.3"
            >
              Setting the Standard in
              <Text as="span" color={RED} display="block">
                Engine Excellence
              </Text>
            </Heading>

            <Text
              maxW="650px"
              color="gray.600"
              fontSize="15px"
              lineHeight="1.7"
              mt={2}
            >
              We combine decades of experience with cutting-edge technology to deliver
              engines that you can rely on.
            </Text>
          </VStack>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {features.map((item, index) => (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="24px"
                boxShadow="0 8px 20px rgba(0,0,0,0.04)"
                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "0 15px 30px rgba(225,6,0,0.08)",
                  borderBottom: `2px solid ${RED}`,
                }}
                animation={isVisible.features ? `${fadeUp} 0.6s ease ${index * 0.15}s forwards` : "none"}
                opacity={isVisible.features ? 1 : 0}
              >
                <Circle
                  size="60px"
                  bg="linear-gradient(135deg, #FFE5E3 0%, #FFD1CC 100%)"
                  mb={5}
                >
                  <Icon as={item.icon} color={RED} boxSize={7} />
                </Circle>

                <Heading fontSize="18px" fontWeight="800" mb={3} color="#1A1A1A">
                  {item.title}
                </Heading>

                <Text fontSize="14px" color="gray.600" lineHeight="1.6">
                  {item.text}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* STATS SECTION  */}
      <Box py={{ base: 4, md: 6 }} bg="linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)" ref={statsRef} id="stats">
        <Container maxW="container.xl">
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {stats.map((item, index) => (
              <Box
                key={index}
                textAlign="center"
                p={5}
                borderRadius="20px"
                bg="rgba(255,255,255,0.05)"
                backdropFilter="blur(10px)"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-4px)",
                  bg: "rgba(255,255,255,0.08)",
                }}
                animation={isVisible.stats ? `${fadeUp} 0.6s ease ${index * 0.1}s forwards` : "none"}
                opacity={isVisible.stats ? 1 : 0}
              >
                <AnimatedCounter
                  target={item.target}
                  finalText={item.number}
                  icon={item.icon}
                  label={item.label}
                />
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TESTIMONIALS SECTION  */}
      <Box py={{ base: 4, md: 6 }} bg="white">
        <Container maxW="container.xl">
          <ReviewSection />
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box py={{ base: 4, md: 6 }} ref={ctaRef} id="cta">
        <Container maxW="container.xl">
          <Box
            bg="linear-gradient(135deg, #E10600 0%, #B80500 100%)"
            borderRadius="40px"
            py={{ base: 4, md: 6 }}
            px={{ base: 4, md: 6 }}
            textAlign="center"
            position="relative"
            overflow="hidden"
            boxShadow="0 15px 35px rgba(225,6,0,0.25)"
          >
            <Box
              position="absolute"
              top="-80px"
              right="-80px"
              w="250px"
              h="250px"
              bg="rgba(255,255,255,0.08)"
              borderRadius="full"
              animation={`${float} 6s ease-in-out infinite`}
            />
            <Box
              position="absolute"
              bottom="-60px"
              left="-60px"
              w="200px"
              h="200px"
              bg="rgba(255,255,255,0.06)"
              borderRadius="full"
              animation={`${float} 7s ease-in-out infinite reverse`}
            />

            <VStack spacing={5} position="relative" zIndex={2}>
              <Circle size="70px" bg="rgba(255,255,255,0.15)" backdropFilter="blur(10px)">
                <Icon as={FaQuoteRight} color="white" boxSize={8} />
              </Circle>

              <Heading
                color="white"
                fontSize={{ base: "28px", md: "40px" }}
                fontWeight="900"
                maxW="700px"
                lineHeight="1.3"
              >
                Ready to Get Your Engine?
              </Heading>

              <Text
                color="rgba(255,255,255,0.9)"
                fontSize={{ base: "14px", md: "16px" }}
                maxW="600px"
                lineHeight="1.7"
              >
                Contact our expert team today for a free consultation and quote.
                We're here to help you find the perfect engine solution.
              </Text>

              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  bg="white"
                  color={RED}
                  size="lg"
                  px={8}
                  h="52px"
                  fontWeight="700"
                  borderRadius="full"
                  fontSize="14px"
                  rightIcon={<MdLibraryBooks />}
                  onClick={onOpen}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  }}
                  transition="all 0.3s"
                >
                  Get Free Quote
                </Button>

                <Button
                  as={RouterLink}
                  to="/contact"
                  variant="outline"
                  color="white"
                  size="lg"
                  px={7}
                  h="52px"
                  fontWeight="700"
                  borderRadius="full"
                  border="2px solid"
                  borderColor="white"
                  leftIcon={<FaPhoneAlt />}
                  _hover={{
                    bg: "white",
                    color: RED,
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s"
                >
                  Call Us Now
                </Button>
              </HStack>

              <Text color="rgba(255,255,255,0.7)" fontSize="12px" mt={3}>
                ✦ Free consultation ✦ No obligation ✦ Expert advice ✦
              </Text>
            </VStack>
          </Box>
        </Container>
      </Box>

      {/* MODAL FOR GET FREE QUOTE */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
          <ModalCloseButton
            zIndex={10}
            top={4}
            right={4}
            bg="white"
            rounded="full"
            shadow="sm"
            _hover={{ bg: "gray.100" }}
          />
          <ModalBody p={0} bg="#F8FAFC">
            <CallSellerPage isModal={true} onCloseModal={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AboutPage;