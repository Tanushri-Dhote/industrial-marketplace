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
                    gap={6}
                    mb={10}
                >
                    {features.map((feature, index) => (
                        <Box
                            key={index}
                            bg="white"
                            p={6}
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
                <Flex
                    direction={{ base: "column", md: "row" }}
                    borderRadius="16px"
                    overflow="hidden"
                    boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                    bg="white"
                    align="stretch"
                >
                    {/* Watch Our Process card */}
                    <Box
                        flex="1.8"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => setIsVideoOpen(true)}
                        minH="130px"
                    >
                        <HStack gap={0} align="stretch" h="100%">
                            {/* Thumbnail with overlay + play button */}
                            <Box
                                position="relative"
                                w={{ base: "120px", md: "145px" }}
                                minW={{ base: "120px", md: "145px" }}
                                flexShrink={0}
                            >
                                <Image
                                    src={videoThumbnailUrl}
                                    alt="Engine Reconditioning Process"
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                    fallbackSrc="https://placehold.co/400x300/222/555?text=Engine"
                                />
                                {/* Dark overlay */}
                                <Box
                                    position="absolute"
                                    inset={0}
                                    bg="blackAlpha.500"
                                />
                                {/* Red play button */}
                                <Flex
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    w="44px"
                                    h="44px"
                                    borderRadius="full"
                                    bg={RED}
                                    align="center"
                                    justify="center"
                                    transition="all 0.2s ease"
                                    _hover={{ bg: "#c40000", transform: "translate(-50%, -50%) scale(1.08)" }}
                                    boxShadow="0 4px 12px rgba(0,0,0,0.25)"
                                >
                                    <Icon as={FaPlay} color="white" boxSize={3.5} ml="2px" />
                                </Flex>
                            </Box>

                            {/* Text side */}
                            <VStack align="flex-start" gap={2} p={4} justify="center" flex={1}>
                                <Text fontWeight="700" fontSize="15px" color="#111111">
                                    Watch Our Process
                                </Text>
                                <Text color="#777777" fontSize="12px" lineHeight="1.5">
                                    See how we recondition engines to the highest standards.
                                </Text>
                                <Button
                                    size="xs"
                                    bg={RED}
                                    color="white"
                                    _hover={{ bg: "#c40000" }}
                                    borderRadius="6px"
                                    fontSize="11px"
                                    px={3}
                                    leftIcon={<Icon as={FaPlay} boxSize={2} />}
                                    onClick={(e) => { e.stopPropagation(); setIsVideoOpen(true); }}
                                >
                                    Play Video
                                </Button>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* Inset grey divider */}
                    <Box display={{ base: "none", md: "flex" }} alignSelf="stretch" alignItems="stretch">
                        <Box w="1px" bg="#D9D9D9" my={5} />
                    </Box>

                    {/* Stat 1 */}
                    <Box
                        flex="1"
                        py={6}
                        px={3}
                        textAlign="center"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <VStack gap={1}>
                            <Text fontSize={{ base: "28px", md: "34px" }} fontWeight="800" color="#111111" lineHeight="1.2">
                                10,000+
                            </Text>
                            <Text color="#777777" fontWeight="600" fontSize={{ base: "11px", md: "12px" }} textTransform="uppercase">
                                Engines Supplied
                            </Text>
                        </VStack>
                    </Box>

                    {/* Inset grey divider */}
                    <Box display={{ base: "none", md: "flex" }} alignSelf="stretch" alignItems="stretch">
                        <Box w="1px" bg="#D9D9D9" my={5} />
                    </Box>

                    {/* Stat 2 */}
                    <Box
                        flex="1"
                        py={6}
                        px={3}
                        textAlign="center"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <VStack gap={1}>
                            <Text fontSize={{ base: "28px", md: "34px" }} fontWeight="800" color="#111111" lineHeight="1.2">
                                20+
                            </Text>
                            <Text color="#777777" fontWeight="600" fontSize={{ base: "11px", md: "12px" }} textTransform="uppercase">
                                Years Experience
                            </Text>
                        </VStack>
                    </Box>

                    {/* Inset grey divider */}
                    <Box display={{ base: "none", md: "flex" }} alignSelf="stretch" alignItems="stretch">
                        <Box w="1px" bg="#D9D9D9" my={5} />
                    </Box>

                    {/* Stat 3 */}
                    <Box
                        flex="1"
                        py={6}
                        px={3}
                        textAlign="center"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <VStack gap={1}>
                            <Text fontSize={{ base: "28px", md: "34px" }} fontWeight="800" color="#111111" lineHeight="1.2">
                                99%
                            </Text>
                            <Text color="#777777" fontWeight="600" fontSize={{ base: "11px", md: "12px" }} textTransform="uppercase">
                                Customer Satisfaction
                            </Text>
                        </VStack>
                    </Box>
                </Flex>

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