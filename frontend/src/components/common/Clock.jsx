import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, useColorModeValue, Icon } from '@chakra-ui/react';
import { FaClock, FaCalendar } from 'react-icons/fa';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const s = seconds < 10 ? `0${seconds}` : seconds;
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return {
      time: `${h}:${m}:${s} ${ampm}`,
      date: `${day} ${month} ${year}`
    };
  };

  const formatted = formatTime(time);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = "#D90404";

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      px={4}
      py={2}
      boxShadow="sm"
      transition="all 0.3s"
      _hover={{ boxShadow: "md", borderColor: accentColor }}
    >
      <VStack spacing={1} align="center">
        <HStack spacing={2} justify="center">
          <Icon as={FaClock} color={accentColor} boxSize={4} />
          <Text
            fontSize="16px"
            fontWeight="700"
            fontFamily="monospace"
            color={useColorModeValue("gray.900", "white")}
            letterSpacing="0.5px"
          >
            {formatted.time}
          </Text>
        </HStack>
        <HStack spacing={1} justify="center">
          <Icon as={FaCalendar} color="gray.400" boxSize={3} />
          <Text
            fontSize="12px"
            fontWeight="600"
            color={useColorModeValue("gray.600", "gray.400")}
            letterSpacing="0.3px"
          >
            {formatted.date}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
