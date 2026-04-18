import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Divider,
  Icon,
  HStack,
  Select,
  Badge,
} from '@chakra-ui/react';
import { FiUser, FiBriefcase, FiLock, FiCreditCard } from 'react-icons/fi';
import ProfileHeader from '../components/account/ProfileHeader';
import ModuleFrame from '../components/dashboard/ModuleFrame';

export default function AccountPage() {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const accentColor = "#D90404";

  // Mock initial data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'admin@globalindustrial.com',
    phone: '+44 20 7946 0958',
    businessName: 'Global Industrial Solutions',
    vat: 'GB123456789',
    warranty: '12',
    address: '123 Industry Lane, London, UK'
  });

  const handleUpdate = (section) => {
    toast({
      title: `${section} Updated`,
      description: "Your changes have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    });
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Page Title */}
          <VStack align="flex-start" spacing={1}>
            <Heading fontSize="36px" fontWeight="900" letterSpacing="-1px">
              My Account
            </Heading>
            <Text color="gray.500" fontSize="16px">
              Manage your personal and business credentials for the marketplace.
            </Text>
          </VStack>

          {/* Profile Quick Overview */}
          <ProfileHeader user={profile} />

          {/* Settings Tabs */}
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList bg={useColorModeValue("white", "gray.800")} borderRadius="xl" p={1} border="none" boxShadow="sm">
              <Tab fontWeight="700" fontSize="14px" borderRadius="lg" _selected={{ bg: "blue.50", color: "blue.600" }}>
                <Icon as={FiUser} mr={2} /> Profile
              </Tab>
              <Tab fontWeight="700" fontSize="14px" borderRadius="lg" _selected={{ bg: "blue.50", color: "blue.600" }}>
                <Icon as={FiBriefcase} mr={2} /> Business
              </Tab>
              <Tab fontWeight="700" fontSize="14px" borderRadius="lg" _selected={{ bg: "blue.50", color: "blue.600" }}>
                <Icon as={FiLock} mr={2} /> Security
              </Tab>
              <Tab fontWeight="700" fontSize="14px" borderRadius="lg" _selected={{ bg: "blue.50", color: "blue.600" }}>
                <Icon as={FiCreditCard} mr={2} /> Subscription
              </Tab>
            </TabList>

            <TabPanels mt={6}>
              {/* Profile Settings */}
              <TabPanel p={0}>
                <ModuleFrame
                  icon={FiUser}
                  title="Profile Information"
                  description="Update your personal contact information used for business communication."
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Full Name</FormLabel>
                      <Input fontSize="15px" height="45px" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Email Address</FormLabel>
                      <Input fontSize="15px" height="45px" type="email" value={profile.email} isReadOnly opacity={0.7} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Phone Number</FormLabel>
                      <Input fontSize="15px" height="45px" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                    </FormControl>
                  </SimpleGrid>
                  <Button
                    mt={8}
                    bg={accentColor}
                    color="white"
                    px={8}
                    _hover={{ bg: "#c92c34" }}
                    onClick={() => handleUpdate('Profile')}
                  >
                    Save Changes
                  </Button>
                </ModuleFrame>
              </TabPanel>

              {/* Business Details */}
              <TabPanel p={0}>
                <ModuleFrame
                  icon={FiBriefcase}
                  title="Business Details"
                  description="Manage your tenant's institutional information and default marketplace settings."
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Business Name</FormLabel>
                      <Input fontSize="15px" height="45px" value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">VAT Number</FormLabel>
                      <Input fontSize="15px" height="45px" value={profile.vat} onChange={(e) => setProfile({ ...profile, vat: e.target.value })} />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Default Warranty</FormLabel>
                      <Select fontSize="15px" height="45px" value={profile.warranty} onChange={(e) => setProfile({ ...profile, warranty: e.target.value })}>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                        <option value="18">18 Months</option>
                        <option value="24">24 Months</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Business Address</FormLabel>
                      <Input fontSize="15px" height="45px" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                    </FormControl>
                  </SimpleGrid>
                  <Button
                    mt={8}
                    bg={accentColor}
                    color="white"
                    px={8}
                    _hover={{ bg: "#c92c34" }}
                    onClick={() => handleUpdate('Business')}
                  >
                    Update Business
                  </Button>
                </ModuleFrame>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel p={0}>
                <ModuleFrame
                  icon={FiLock}
                  title="Security & Password"
                  description="Keep your account secure by updating your password and monitoring activity."
                >
                  <VStack spacing={6} mt={4} maxW="500px">
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Current Password</FormLabel>
                      <Input fontSize="15px" height="45px" type="password" placeholder="••••••••" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">New Password</FormLabel>
                      <Input fontSize="15px" height="45px" type="password" placeholder="At least 8 characters" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Confirm New Password</FormLabel>
                      <Input fontSize="15px" height="45px" type="password" />
                    </FormControl>
                    <Button
                      alignSelf="flex-start"
                      bg={accentColor}
                      color="white"
                      px={8}
                      _hover={{ bg: "#c92c34" }}
                      onClick={() => handleUpdate('Security')}
                    >
                      Change Password
                    </Button>
                  </VStack>
                </ModuleFrame>
              </TabPanel>

              {/* Subscription Tab */}
              <TabPanel p={0}>
                <ModuleFrame
                  icon={FiCreditCard}
                  title="Subscription & Billing"
                  description="Manage your industrial marketplace membership and view payment history."
                >
                  <Box p={6} bg="blue.900" borderRadius="xl" color="white" mb={8}>
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={0}>
                        <Text fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="1px" opacity={0.7}>Current Plan</Text>
                        <Heading fontSize="28px">Premium Dealer</Heading>
                      </VStack>
                      <Badge fontSize="12px" colorScheme="green" variant="solid" px={4} py={1} borderRadius="full">ACTIVE</Badge>
                    </HStack>
                    <Divider my={4} opacity={0.2} />
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={0}>
                        <Text fontSize="12px" opacity={0.7}>Expiry Date</Text>
                        <Text fontSize="18px" fontWeight="700">16 Apr, 2026</Text>
                      </VStack>
                      <Button size="sm" colorScheme="whiteAlpha" variant="outline">
                        Renew Now
                      </Button>
                    </HStack>
                  </Box>

                  <Heading fontSize="22px" mb={4}>Payment History</Heading>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between" p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.100">
                      <VStack spacing={0} align="flex-start">
                        <Text fontWeight="700">Premium Membership - 1 Year</Text>
                        <Text fontSize="12px" color="gray.500">Invoice #INV-90210</Text>
                      </VStack>
                      <VStack spacing={0} align="flex-end">
                        <Text fontWeight="800">$499.00</Text>
                        <Text fontSize="12px" color="gray.500">16 Apr 2025</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </ModuleFrame>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}
