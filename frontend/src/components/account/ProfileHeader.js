import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiCheckCircle, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import { useUser } from "../../context/UserContext";

export default function ProfileHeader({ user }) {
  // const { user } = useUser();
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("blue.900", "white");
  const accentColor = "#D90404";
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      bg={bg}
      p={8}
      borderRadius="2xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background element */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        w="200px"
        h="200px"
        bg={accentColor}
        opacity={0.05}
        borderRadius="full"
      />

      <Flex direction={{ base: "column", md: "row" }} align="center" gap={8}>
        <Box position="relative">
          <Avatar
            size="2xl"
            name={user?.name || "Admin"}
            src={user?.avatar}
            border="4px solid"
            borderColor={accentColor}
          />
          <Box
            position="absolute"
            bottom="2"
            right="2"
            bg="green.400"
            w="20px"
            h="20px"
            borderRadius="full"
            border="3px solid white"
          />
        </Box>

        <VStack align={{ base: "center", md: "flex-start" }} spacing={2}>
          <HStack>
            <Text fontSize="28px" fontWeight="900" color={textColor} letterSpacing="-1px">
              {user?.name || "John Doe"}
            </Text>
            <Badge
              colorScheme={user?.role === "admin" ? "red" : "green"}
              borderRadius="full"
              px={3}
              fontSize="12px"
              fontWeight="800"
            >
              {user?.role?.toUpperCase() || ""}
            </Badge>
            <Icon as={FiCheckCircle} color="blue.500" boxSize={5} />
          </HStack>

          <Text fontSize="18px" color="gray.500" fontWeight="600">
            {user?.businessName || ""}
          </Text>
          <Flex gap={6} pt={2} wrap="wrap">
            <HStack spacing={2} color="gray.400">
              <Icon as={FiMail} />
              <Text fontSize="14px" fontWeight="600">
                {user?.email}
              </Text>
            </HStack>

            <HStack spacing={2} color="gray.400">
              <Icon as={FiPhone} />
              <Text fontSize="14px" fontWeight="600">
               {user?.phone}
              </Text>
            </HStack>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
}
