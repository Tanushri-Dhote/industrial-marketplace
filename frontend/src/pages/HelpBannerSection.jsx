import React from "react";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FaPhoneAlt } from "react-icons/fa";

const HelpBannerSection = () => {
    return (
        <Box bg="#F7F8FA" pt={{ base: 6, md: 4 }} pb={{ base: 8, md: 10 }}>
            <Container maxW="container.xl">
                <Box
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        justify="space-between"
                        px={{ base: 6, md: 12, lg: 16 }}
                        py={{ base: 8, md: 6 }}
                        gap={8}
                    >
                        {/* Image Side */}
                        <Box flexShrink={0} maxW={{ base: "250px", md: "350px", lg: "400px" }}>
                            <Image
                                src="/engine-hero.png" // Assuming this image is available and fits the style
                                alt="Engine"
                                objectFit="contain"
                                w="100%"
                            />
                        </Box>

                        {/* Text Content */}
                        <VStack
                            align={{ base: "center", md: "flex-start" }}
                            spacing={4}
                            textAlign={{ base: "center", md: "left" }}
                            flex={1}
                        >
                            <Heading
                                fontSize={{ base: "22px", md: "36px", lg: "42px" }}
                                fontWeight="800"
                                color="#111111"
                                lineHeight={{ base: "1.3", md: "1.2" }}
                            >
                                Need Help Finding <br />
                                the Right Engine?
                            </Heading>

                            <Text
                                color="gray.600"
                                fontSize={{ base: "15px", md: "16px" }}
                                maxW="450px"
                                lineHeight="1.6"
                            >
                                Our team is here to help you find the perfect engine for your vehicle.
                            </Text>

                            <HStack spacing={4} mt={2} flexWrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                                <Button
                                    bg="#D90404"
                                    color="white"
                                    size="lg"
                                    px={8}
                                    fontWeight="700"
                                    borderRadius="md"
                                    _hover={{ bg: "#b50303" }}
                                    boxShadow="md"
                                    onClick={() => window.location.href = '/contact'}
                                >
                                    Get in Touch
                                </Button>

                                <Button
                                    as="a"
                                    href="tel:02071129397"
                                    bg="white"
                                    color="#111111"
                                    size="lg"
                                    px={6}
                                    fontWeight="700"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    _hover={{ bg: "gray.50", textDecoration: "none" }}
                                    leftIcon={<Icon as={FaPhoneAlt} color="#D90404" boxSize={4} />}
                                    boxShadow="sm"
                                >
                                    02071129397
                                </Button>
                            </HStack>
                        </VStack>
                    </Flex>
                </Box>
            </Container>
        </Box>
    );
};

export default HelpBannerSection;
