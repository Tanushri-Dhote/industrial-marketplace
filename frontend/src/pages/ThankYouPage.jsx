import React from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Icon,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ThankYouPage() {
    return (
        <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
            <Container maxW="container.md">
                <Box
                    bg="white"
                    p={10}
                    borderRadius="2xl"
                    boxShadow="lg"
                    textAlign="center"
                >
                    <VStack spacing={6}>
                        <Icon as={FaCheckCircle} boxSize={16} color="green.400" />

                        <Heading fontSize="3xl" fontWeight="900">
                            Thank You for Your Order!
                        </Heading>

                        <Text fontSize="lg" color="gray.600">
                            We'll Process It Right Away
                        </Text>

                        <Text fontSize="md" color="gray.600" lineHeight="1.8">
                            Get the Exact Fit - Pay Only After Confirmation. We don't take
                            chances or payments upfront. Submit your VRM and contact info so
                            our supplier can contact you and verify the best-fit engine for
                            your car to quickly get your car back on the road.
                        </Text>

                        <Button
                            as={Link}
                            to="/"
                            bg="#D90404"
                            color="white"
                            size="lg"
                            borderRadius="xl"
                            _hover={{ bg: "#b00303" }}
                        >
                            Back to Home
                        </Button>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
}