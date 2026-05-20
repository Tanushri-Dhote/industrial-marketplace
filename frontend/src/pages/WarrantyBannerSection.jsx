import React from "react";
import {
    Box,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    FaShieldAlt,
    FaTruck,
    FaBoxOpen,
    FaUserCheck,
    FaHeadset,
} from "react-icons/fa";

const WarrantyBannerSection = () => {
    return (
        <Box bg="#F7F8FA" pt={2} pb={{ base: 4, md: 4 }}>
            <Container maxW="container.xl">
                <VStack spacing={6} w="full" align="stretch">
                    {/* Top Red Banner */}
                    <Box
                        bg="#E10600"
                        borderRadius="2xl"
                        px={{ base: 6, md: 8 }}
                        py={{ base: 2, md: 4 }}
                        color="white"
                        boxShadow="lg"
                    >
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            align={{ base: "flex-start", md: "center" }}
                            gap={{ base: 6, md: 8 }}
                        >
                            <Box flexShrink={0}>
                                <Icon as={FaShieldAlt} boxSize={{ base: "60px", md: "40px" }} />
                            </Box>

                            <VStack align="start" spacing={2} flex={1}>
                                <Text
                                    fontSize="12px"
                                    fontWeight="700"
                                    textTransform="uppercase"
                                    letterSpacing="0.05em"
                                >
                                    12 MONTHS WARRANTY
                                </Text>
                                <Heading
                                    fontSize={{ base: "26px", md: "22px", lg: "28px" }}
                                    fontWeight="800"
                                >
                                    Peace of Mind with Every Engine
                                </Heading>
                                <Text fontSize={{ base: "14px", md: "14px" }} mt={0}>
                                    All our engines come with a 12 months warranty for your peace of mind.
                                </Text>
                            </VStack>
                        </Flex>
                    </Box>

                    {/* Bottom White Features Bar */}
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        p={{ base: 2, md: 4 }}
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            justify="space-between"
                            align="center"
                            gap={6}
                        >
                            <FeatureItem icon={FaTruck} title="Nationwide Delivery" />
                            <Divider />
                            <FeatureItem icon={FaBoxOpen} title="Secure Packaging" />
                            <Divider />
                            <FeatureItem icon={FaUserCheck} title="Trusted by Garages" />
                            <Divider />
                            <FeatureItem icon={FaHeadset} title="Dedicated Support" />
                        </Flex>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

// Helper for the features and dividers
const FeatureItem = ({ icon, title }) => {
    const parts = title.split(" ");
    return (
        <VStack spacing={3} flex={1} textAlign="center" w="full">
            <Icon as={icon} boxSize={8} color="#E10600" />
            <Text fontWeight="800" fontSize="15px" color="#111111" lineHeight="1.3">
                {parts[0]} <br /> {parts.slice(1).join(" ")}
            </Text>
        </VStack>
    );
};

const Divider = () => (
    <Box
        display={{ base: "none", md: "block" }}
        w="1px"
        bg="gray.200"
        alignSelf="stretch"
        minH="60px"
    />
);

export default WarrantyBannerSection;
