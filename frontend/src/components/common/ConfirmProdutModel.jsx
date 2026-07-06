import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    HStack,
    Box,
    Flex,
    VStack,
    Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import API from '../../services/api';

const ConfirmProdutModel = ({ isOpen, onClose }) => {
    const [regNumber, setRegNumber] = useState("");
    const navigate = useNavigate();

    // ✅ Basic UK REG validation
    const isValidReg = (reg) => /^[A-Z0-9]{5,8}$/.test(reg);

    // ✅ Proceed handler
    const handleProceed = async () => {
        try {
            const res = await API.post("/collect-registation", {
                registration_number: regNumber,
            });

            console.log(res.data);

            onClose();

            // navigate("/create-quote", {
            //     state: { regNumber },
            // });

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay />
            <ModalContent borderRadius="2xl" overflow="hidden">
                <ModalCloseButton />

                <ModalBody p={6}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Confirm your vehicle.
                    </Text>

                    <Text fontSize="sm" color="gray.600" mb={5}>
                        This will confirm compatibility and allow our team to quote you.
                    </Text>

                    {/* ✅ INPUT + BUTTON IN ONE LINE */}
                    <HStack spacing={3}>

                        {/* UK PLATE INPUT */}
                        <Flex
                            flex={2}
                            bg="#FFD700"
                            borderRadius="md"
                            overflow="hidden"
                            h="54px"
                            align="stretch"
                            border="2px solid"
                            borderColor="#FFD700"
                        >
                            {/* LEFT UK STRIP */}
                            <VStack bg="#003399" w="45px" justify="center" spacing={0} px={1}>
                                <Text fontSize="10px" lineHeight="1">
                                    🇬🇧
                                </Text>
                                <Text color="white" fontSize="12px" fontWeight="bold">
                                    UK
                                </Text>
                            </VStack>

                            {/* INPUT */}
                            <Input
                                placeholder="ENTER YOUR REG"
                                value={regNumber}
                                onChange={(e) =>
                                    setRegNumber(e.target.value.toUpperCase())
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleProceed();
                                }}
                                variant="unstyled"
                                bg="transparent"
                                color="#333"
                                _placeholder={{ color: "rgba(0,0,0,0.3)" }}
                                h="full"
                                fontSize="16px"
                                fontWeight="800"
                                textAlign="center"
                                letterSpacing="2px"
                                textTransform="uppercase"
                            />
                        </Flex>

                        {/* PROCEED BUTTON */}
                        <Button
                            flex={1}
                            bg="#0F172A"
                            color="white"
                            fontWeight="bold"
                            borderRadius="md"
                            h="54px"
                            _hover={{ bg: "#1E293B" }}
                            isDisabled={!isValidReg(regNumber)}
                            onClick={handleProceed}
                        >
                            Proceed
                        </Button>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmProdutModel;