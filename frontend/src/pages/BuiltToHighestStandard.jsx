import React, { useState } from "react";
import {
    Box,
    Container,
    Text,
    Grid,
    VStack,
    HStack,
    Icon,
    Image,
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    AspectRatio,
} from "@chakra-ui/react";
import {
    FaUserCog,
    FaCogs,
    FaTools,
    FaAward,
    FaPlay,
} from "react-icons/fa";

const RED = "#E10600";

const features = [
    {
        icon: FaUserCog,
        title: "Expert Technicians",
        text: "Skilled engineers with years of experience.",
    },
    {
        icon: FaCogs,
        title: "Quality Parts",
        text: "We use high quality parts for long-lasting reliability.",
    },
    {
        icon: FaTools,
        title: "Rigorous Testing",
        text: "All engines are tested for maximum performance.",
    },
    {
        icon: FaAward,
        title: "Great Value",
        text: "Premium quality engines at competitive prices.",
    },
];

const BuiltToHighestStandard = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const videoThumbnailUrl = "https://img.youtube.com/vi/mJfnRV5QOz0/maxresdefault.jpg";

    return (
        <Box bg="#f7f7f7" py={{ base: 12, md: 16 }}>
            <Container maxW="1200px" px={{ base: 4, md: 6, lg: 8 }}>

                {/* ── HEADING ── */}
                <VStack gap={4} textAlign="center" mb={12}>
                    <Text
                        fontSize={{ base: "14px", md: "16px" }}
                        fontWeight="800"
                        textTransform="uppercase"
                        color="#111111"
                        mb={2}
                    >
                        Built to the Highest Standard
                    </Text>
                    <Text
                        maxW="650px"
                        color="#666666"
                        fontSize={{ base: "14px", md: "15px" }}
                        lineHeight="1.6"
                        fontWeight="400"
                    >
                        Every engine is reconditioned by our experienced technicians using
                        quality parts and tested to ensure peak performance.
                    </Text>
                </VStack>

                {/* ── FEATURE CARDS ── */}
                <Grid
                    templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                    gap={{ base: 4, md: 6 }}
                    mb={10}
                >
                    {features.map((feature, index) => (
                        <Box
                            key={index}
                            bg="white"
                            p={{ base: 4, md: 6 }}
                            borderRadius="16px"
                            boxShadow="0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)"
                            transition="transform 0.2s, box-shadow 0.2s"
                            _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
                        >
                            <VStack gap={4} align="flex-start">
                                <Icon as={feature.icon} boxSize={6} color={RED} />
                                <Text fontWeight="700" fontSize="16px" color="#111111" lineHeight="1.3">
                                    {feature.title}
                                </Text>
                                <Text fontSize="13px" color="#777777" lineHeight="1.5">
                                    {feature.text}
                                </Text>
                            </VStack>
                        </Box>
                    ))}
                </Grid>

                {/* ── BOTTOM ROW: Video Card + 3 Stat Cards ── */}
                {/* ── VIDEO + STATS SECTION ── */}
                <Box
                    bg="white"
                    borderRadius="20px"
                    overflow="hidden"
                    boxShadow="0 4px 14px rgba(0,0,0,0.06)"
                >
                    {/* Video Card */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        cursor="pointer"
                        onClick={() => setIsVideoOpen(true)}
                    >
                        {/* Thumbnail */}
                        <Box
                            position="relative"
                            w={{ base: "100%", md: "220px", lg: "260px" }}
                            minW={{ base: "100%", md: "220px", lg: "260px" }}
                            h={{ base: "180px", md: "auto" }}
                            flexShrink={0}
                        >
                            <Image
                                src={videoThumbnailUrl}
                                alt="Engine Process"
                                objectFit="cover"
                                w="100%"
                                h="100%"
                            />

                            <Box
                                position="absolute"
                                inset={0}
                                bg="blackAlpha.500"
                            />

                            {/* Play Button */}
                            <Flex
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                w="58px"
                                h="58px"
                                borderRadius="full"
                                bg={RED}
                                align="center"
                                justifyContent="center"
                                boxShadow="0 10px 25px rgba(0,0,0,0.25)"
                                _hover={{
                                    transform: "translate(-50%, -50%) scale(1.08)",
                                }}
                            >
                                <Icon as={FaPlay} color="white" boxSize={4} ml="2px" />
                            </Flex>
                        </Box>

                        {/* Content */}
                        <VStack
                            align="flex-start"
                            justify="center"
                            spacing={3}
                            p={{ base: 5, md: 8, lg: 10 }}
                            flex={1}
                        >
                            <Text
                                fontSize={{ base: "20px", md: "22px" }}
                                fontWeight="800"
                                color="#111"
                            >
                                Watch Our Process
                            </Text>

                            <Text
                                color="#666"
                                fontSize={{ base: "14px", md: "15px" }}
                                lineHeight="1.7"
                                maxW={{ base: "100%", lg: "620px" }}
                            >
                                See how we professionally recondition engines using
                                advanced testing and premium quality components.
                            </Text>

                            <Button
                                bg={RED}
                                color="white"
                                size="sm"
                                borderRadius="10px"
                                px={5}
                                _hover={{ bg: "#c40000" }}
                                leftIcon={<FaPlay />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVideoOpen(true);
                                }}
                            >
                                Play Video
                            </Button>
                        </VStack>
                    </Flex>

                    {/* Stats */}
                    <Grid
                        templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
                        borderTop="1px solid #ECECEC"
                    >
                        {[
                            {
                                number: "10,000+",
                                label: "Engines Supplied",
                            },
                            {
                                number: "20+",
                                label: "Years Experience",
                            },
                            {
                                number: "99%",
                                label: "Customer Satisfaction",
                            },
                        ].map((item, index) => (
                            <Flex
                                key={index}
                                direction="column"
                                align="center"
                                justify="center"
                                py={{ base: 6, md: 8 }}
                                px={4}
                                borderRight={{
                                    base: "none",
                                    sm: index !== 2 ? "1px solid #ECECEC" : "none",
                                }}
                                borderBottom={{
                                    base: index !== 2 ? "1px solid #ECECEC" : "none",
                                    sm: "none",
                                }}
                            >
                                <Text
                                    fontSize={{ base: "28px", md: "32px", lg: "36px" }}
                                    fontWeight="900"
                                    lineHeight="1"
                                    color="#111"
                                    whiteSpace="nowrap"
                                >
                                    {item.number}
                                </Text>

                                <Text
                                    mt={2}
                                    fontSize="11px"
                                    fontWeight="700"
                                    letterSpacing="1px"
                                    textTransform="uppercase"
                                    color="#777"
                                    textAlign="center"
                                >
                                    {item.label}
                                </Text>
                            </Flex>
                        ))}
                    </Grid>
                </Box>

            </Container>

            {/* Video Modal */}
            <Modal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} size="xl" isCentered>
                <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
                <ModalContent bg="black" borderRadius="20px" overflow="hidden" maxW="min(90vw, 800px)">
                    <ModalCloseButton color="white" zIndex={2} />
                    <ModalBody p={0}>
                        <AspectRatio ratio={16 / 9}>
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/mJfnRV5QOz0?autoplay=1"
                                title="Engine Reconditioning Process"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ border: "none", width: "100%", height: "100%" }}
                            />
                        </AspectRatio>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default BuiltToHighestStandard;