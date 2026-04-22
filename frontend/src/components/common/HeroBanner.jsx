import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Image,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={{ base: 10, md: 20 }}
      position="relative"
      overflow="hidden">
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          spacing={{ base: 8, md: 10 }}>
          <Stack flex={1} spacing={{ base: 5, md: 8 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
              <Text as="span" position="relative">
                Industrial Equipment
              </Text>
              <br />
              <Text as="span" color="brand.500">
                Marketplace
              </Text>
            </Heading>
            <Text color="gray.500" fontSize={{ base: 'md', lg: 'lg' }}>
              Find the best industrial equipment and machinery from top manufacturers worldwide.
              Quality assured products with competitive prices.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                as={Link}
                to="/products"
                colorScheme="brand"
                size="lg"
                fontSize="md">
                Browse Products
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                size="lg"
                fontSize="md">
                Contact Sales
              </Button>
            </Stack>
          </Stack>
          <Flex flex={1} justify="center" align="center" position="relative" w="full">
            <Box
              position="relative"
              height={{ base: '300px', md: '400px' }}
              width="full"
              overflow="hidden">
              <Image
                alt="Hero Image"
                fit="cover"
                align="center"
                w="100%"
                h="100%"
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}