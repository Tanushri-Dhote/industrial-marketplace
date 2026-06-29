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
        <Box bg="white" py={{ base: 12, md: 16 }}>
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
                                fontSize="14px"
                                fontWeight="800"
                                color="#E10600"
                                letterSpacing="1px"
                                textTransform="uppercase"
                            >
                                ABOUT US —
                            </Text>
                            <Heading
                                fontSize={{ base: "32px", md: "40px", lg: "46px" }}
                                fontWeight="800"
                                color="#111111"
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
                                <Icon as={FaCheckCircle} color="#E10600" boxSize={5} />
                                <Text fontWeight="600" color="#333333">Only high quality parts used</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#E10600" boxSize={5} />
                                <Text fontWeight="600" color="#333333">Thousands of engines supplied</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#E10600" boxSize={5} />
                                <Text fontWeight="600" color="#333333">06 months warranty on all engines</Text>
                            </HStack>
                            <HStack spacing={3}>
                                <Icon as={FaCheckCircle} color="#E10600" boxSize={5} />
                                <Text fontWeight="600" color="#333333">Nationwide collection and delivery available.</Text>
                            </HStack>
                        </VStack>

                        <Button
                            as={RouterLink}
                            to="/about"
                            bg="#E10600"
                            color="white"
                            size="lg"
                            px={8}
                            py={6}
                            fontWeight="700"
                            borderRadius="md"
                            _hover={{ bg: "#c40000" }}
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
                        borderRadius="2xl"
                        overflow="hidden"
                        boxShadow="lg"
                    >
                        <Image
                            src="/home-about.png"
                            alt="Engine Reconditioning Experts"
                            objectFit="cover"
                            w="full"
                            h={{ base: "300px", md: "350px", lg: "450px" }}
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default HomeAbout;
