import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';

const carMakes = [
  { name: "Alfa Romeo",     slug: "alfa-romeo" },
  { name: "Audi",           slug: "audi" },
  { name: "BMW",            slug: "bmw" },
  { name: "Citroen",        slug: "citroen" },
  { name: "Fiat",           slug: "fiat" },
  { name: "Ford",           slug: "ford" },
  { name: "Honda",          slug: "honda" },
  { name: "Hyundai",        slug: "hyundai" },
  { name: "Isuzu",          slug: "isuzu" },
  { name: "Iveco",          slug: "iveco" },
  { name: "Jaguar",         slug: "jaguar" },
  { name: "Kia",            slug: "kia" },
  { name: "Land Rover",     slug: "land-rover" },
  { name: "Lexus",          slug: "lexus" },
  { name: "Mazda",          slug: "mazda" },
  { name: "Mercedes-Benz",  slug: "mercedes-benz" },
  { name: "MINI",           slug: "mini" },
  { name: "Mitsubishi",     slug: "mitsubishi" },
  { name: "Nissan",         slug: "nissan" },
  { name: "Peugeot",        slug: "peugeot" },
  { name: "Porsche",        slug: "porsche" },
  { name: "Range Rover",    slug: "land-rover" },
  { name: "Renault",        slug: "renault" },
  { name: "Seat",           slug: "seat" },
  { name: "Skoda",          slug: "skoda" },
  { name: "Subaru",         slug: "subaru" },
  { name: "Suzuki",         slug: "suzuki" },
  { name: "Toyota",         slug: "toyota" },
  { name: "Vauxhall",       slug: "vauxhall" },
  { name: "Volvo",          slug: "volvo" },
  { name: "Volkswagen",     slug: "volkswagen" },
];

export default function CarMakeSelectorSection() {
  const navigate = useNavigate();
  const accentColor = "#D90404";

  const handleClick = (slug) => {
    navigate(`/brand/${slug}`);   // This will go to details page like /brand/toyota
  };

  return (
    <Box bg="white" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="center">
          {/* Header */}
          <VStack spacing={3} textAlign="center" maxW="800px">
            <Heading 
              fontSize="28px" 
              fontWeight="700" 
              color="gray.800"
              lineHeight="1.2"
            >
              Select the Make of Your Car to{" "}
              <Text as="span" color="#D90404" fontWeight="700">Compare Engine Prices</Text>
            </Heading>
          </VStack>

          {/* Logo Grid - Clean & Clickable */}
          <SimpleGrid 
            columns={{ base: 3, sm: 4, md: 5, lg: 6 }} 
            spacing={8}
            w="full"
            maxW="1150px"
          >
            {carMakes.map((make, index) => {
              const logoUrl = `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/${make.slug}.png`;

              return (
                <Box
                  key={index}
                  onClick={() => handleClick(make.slug)}
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-6px)",
                  }}
                  textAlign="center"
                >
                  <Image 
                    src={logoUrl}
                    alt={make.name}
                    height="68px"
                    mx="auto"
                    objectFit="contain"
                    mb={4}
                    fallback={
                      <Box 
                        height="68px" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        bg="gray.100"
                        borderRadius="md"
                        fontSize="13px"
                        fontWeight="600"
                        color="gray.600"
                      >
                        {make.name}
                      </Box>
                    }
                  />
                  <Text 
                    fontSize="15px" 
                    fontWeight="600" 
                    color="gray.700"
                  >
                    {make.name}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          
        </VStack>
      </Container>
    </Box>
  );
}