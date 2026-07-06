import React from 'react';
import { Box, HStack, Text, Icon } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const trustItems = [
  "24/7 Engine Rebuilding Support",
  "Engine rebuilt & fitted locally",
  "Satisfaction Guaranteed",
];

export default function TrustBar() {
  return (
    <Box 
      bg="rgba(255, 255, 255, 0.75)" 
      backdropFilter="blur(10px)"
      py={4} 
      overflow="hidden" 
      borderY="1px solid" 
      borderColor="rgba(217, 4, 4, 0.08)"
      position="relative"
      zIndex={6}
      boxShadow="0 10px 30px -10px rgba(0, 0, 0, 0.05)"
      mt="-20px"
      mx="auto"
      maxW="1200px"
      borderRadius="xl"
    >
      <Box 
        display="flex" 
        whiteSpace="nowrap" 
        animation="scrollLeft 25s linear infinite"
        _hover={{ animationPlayState: 'paused' }}
      >
        {/* First set */}
        <HStack spacing={12} px={8}>
          {trustItems.map((item, index) => (
            <HStack key={index} spacing={3} flexShrink={0}>
              <Icon 
                as={FaCheckCircle} 
                color="#D90404" 
                boxSize={5} 
              />
              <Text 
                fontSize="15px" 
                fontWeight="500" 
                color="gray.700"
              >
                {item}
              </Text>
            </HStack>
          ))}
        </HStack>

        {/* Duplicate set for seamless infinite scroll */}
        <HStack spacing={12} px={8}>
          {trustItems.map((item, index) => (
            <HStack key={`dup-${index}`} spacing={3} flexShrink={0}>
              <Icon 
                as={FaCheckCircle} 
                color="#D90404" 
                boxSize={5} 
              />
              <Text 
                fontSize="15px" 
                fontWeight="500" 
                color="gray.700"
              >
                {item}
              </Text>
            </HStack>
          ))}
        </HStack>
      </Box>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Box>
  );
}