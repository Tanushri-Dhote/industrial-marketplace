import React from 'react';
import { Box, HStack, Text, Icon } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const trustItems = [
  // "Compare Free Quotes",
  "24/7 Delivery and Collection",
  "Get engine delivered or fitted locally",
  "Satisfaction Guaranteed",
];

export default function TrustBar() {
  return (
    <Box 
      bg="#f8f9fa" 
      py={3} 
      overflow="hidden" 
      borderBottom="1px solid" 
      borderColor="gray.100"
      position="relative"
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