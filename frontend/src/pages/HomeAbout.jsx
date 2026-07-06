import React from "react";
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
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const HomeAbout = () => {
    return (
        <Box bg="white" py={{ base: 8, md: 10 }}>
            <Container maxW="container.xl">
                <Flex
                    direction={{ base: "column", lg: "row" }}
                    align="center"
                    justify="space-between"
                    gap={{ base: 10, lg: 16 }}
                >
                    {/* Left Content Side */}
                    <VStack align="flex-start" spacing={6} flex={1}>
                        <VStack align="flex-start" spacing={2}>
                            <Text
                                fontSize="13px"
                                fontWeight="800"
                                color="#D90404"
                                letterSpacing="1.5px"
                                textTransform="uppercase"
                            >
                                About Us
                            </Text>
                            <Heading
                                as="h2"
                                fontSize={{ base: "28px", md: "38px", lg: "42px" }}
                                fontWeight="800"
                                color="gray.900"
                                lineHeight="1.2"
                            >
                                Trusted Experts in Engine Reconditioning
                            </Heading>
                        </VStack>

                        <Text
                            fontSize={{ base: "15px", md: "16px" }}
                            color="gray.600"
                            lineHeight="1.6"
                        >
                            We are a team with years of experience reconditioning engines for all makes and models with a commitment to quality, service and reliability.
                        </Text>

                        <VStack align="flex-start" spacing={3} pt={2} pb={4}>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#D90404" boxSize={5} />
                                <Text fontWeight="600" color="gray.700">Only high quality parts used</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#D90404" boxSize={5} />
                                <Text fontWeight="600" color="gray.700">Thousands of engines supplied</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#D90404" boxSize={5} />
                                <Text fontWeight="600" color="gray.700">06 months warranty on all engines</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#D90404" boxSize={5} />
                                <Text fontWeight="600" color="gray.700">We rebuild engines (local vehicle collection & fitting).</Text>
                            </HStack>
                        </VStack>

                        <Button
                            as={RouterLink}
                            to="/about"
                            bg="#D90404"
                            color="white"
                            size="lg"
                            px={8}
                            py={6}
                            fontWeight="700"
                            borderRadius="md"
                            _hover={{ bg: "#b50303" }}
                            boxShadow="md"
                        >
                            Learn More About Us
                        </Button>
                    </VStack>

                    {/* Right Image Side */}
                    <Box
                        flex={1}
                        w="full"
                        position="relative"
                        p={3}
                    >
                        {/* Offset red gradient frame */}
                        <Box
                            position="absolute"
                            top="20px"
                            left="20px"
                            right="0px"
                            bottom="0px"
                            bgGradient="linear-gradient(135deg, #D90404 0%, #b50303 100%)"
                            borderRadius="2xl"
                            zIndex={1}
                            opacity={0.9}
                        />

                        {/* Image Box */}
                        <Box
                            position="relative"
                            zIndex={2}
                            borderRadius="2xl"
                            overflow="hidden"
                            boxShadow="2xl"
                            transition="all 0.3s ease"
                            _hover={{ transform: "translate(-6px, -6px)" }}
                        >
                            <Image
                                src="/home-about.png"
                                alt="Engine Reconditioning Experts"
                                objectFit="cover"
                                w="full"
                                h={{ base: "300px", md: "350px", lg: "450px" }}
                            />
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default HomeAbout;
