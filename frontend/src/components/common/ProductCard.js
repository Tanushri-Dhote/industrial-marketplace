import React, { useState } from 'react';
import {
  Box,
  Image,
  Badge,
  Text,
  Button,
  Heading,
  Flex,
  HStack,
  VStack,
  Divider,
  Tooltip,
  IconButton,
  useColorModeValue,
  Circle,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { StarIcon, AddIcon } from '@chakra-ui/icons';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const { id, name, price, image, category, condition, power, rating, reviews, discount, originalPrice, badge } = product;

  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 1500);
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      rounded="3xl"
      shadow="sm"
      position="relative"
      overflow="hidden"
      transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      _hover={{
        transform: 'translateY(-12px) scale(1.02)',
        shadow: '2xl',
        borderColor: 'brand.300',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with Smooth Zoom */}
      <Box position="relative" height="260px" overflow="hidden">
        <Image
          src={image || 'https://via.placeholder.com/400x300'}
          alt={name}
          height="100%"
          width="100%"
          objectFit="cover"
          transition="transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
          _hover={{ transform: 'scale(1.12)' }}
        />

        {/* Dark Gradient Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.65) 100%)"
          opacity={isHovered ? 0.75 : 0.35}
          transition="opacity 0.4s ease"
        />

        {/* Floating Wishlist Button */}
       

        {/* Badges */}
        <Flex position="absolute" top={4} left={4} gap={2} zIndex={2}>
          {discount > 0 && (
            <Badge
              bg="red.500"
              color="white"
              fontSize="13px"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="full"
              boxShadow="md"
            >
              -{discount}% OFF
            </Badge>
          )}

          {badge && (
            <Badge
              bg="orange.500"
              color="white"
              fontSize="13px"
              fontWeight="bold"
              px={3}
              py={1}
              borderRadius="full"
              boxShadow="md"
            >
              {badge}
            </Badge>
          )}
        </Flex>

        {/* Condition Badge */}
        <Badge
          position="absolute"
          bottom={4}
          left={4}
          bg="blackAlpha.800"
          color="white"
          fontSize="12px"
          px={3}
          py={0.5}
          borderRadius="full"
          backdropFilter="blur(10px)"
        >
          {condition || 'New'}
        </Badge>
      </Box>

      {/* Content Section */}
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={3}>
          <Badge
            variant="solid"
            colorScheme="purple"
            fontSize="12px"
            px={3}
            py={1}
            borderRadius="full"
          >
            {category}
          </Badge>

          <HStack spacing={1}>
            <StarIcon color="yellow.400" w={4} h={4} />
            <Text fontWeight="semibold" fontSize="15px" color="gray.700">
              {rating?.toFixed(1) || '4.8'}
            </Text>
            <Text fontSize="13px" color="gray.400">
              ({reviews || '124'})
            </Text>
          </HStack>
        </Flex>

        <Heading
          as="h3"
          fontSize="18px"
          fontWeight="600"
          lineHeight="1.35"
          noOfLines={2}
          mb={3}
          _hover={{ color: 'brand.500' }}
          transition="color 0.2s"
        >
          {name}
        </Heading>

        {power && (
          <Text fontSize="14px" color="gray.500" mb={4}>
            ⚡ Power: {power}
          </Text>
        )}

        <Divider my={4} />

        {/* Price & Details Button */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontSize="24px" fontWeight="800" color="brand.600" lineHeight="1">
              ${price?.toLocaleString()}
            </Text>
            {originalPrice && (
              <Text
                fontSize="14px"
                color="gray.400"
                textDecoration="line-through"
              >
                ${originalPrice?.toLocaleString()}
              </Text>
            )}
          </VStack>

          <Button
            as={Link}
            to={`/products/${id}`}
            colorScheme="brand"
            size="md"
            fontWeight="600"
            rightIcon={<AddIcon />}
            px={6}
            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
            transition="all 0.3s ease"
          >
            View Details
          </Button>
        </Flex>
      </Box>

      {/* Bottom Accent Line */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="4px"
        bg="brand.500"
        opacity={isHovered ? 1 : 0.7}
        transition="opacity 0.3s ease"
      />
    </Box>
  );
}