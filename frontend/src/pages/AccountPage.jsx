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
import { useEffect } from "react";
import API from "../services/api";

export default function AccountPage() {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const accentColor = "#D90404";
  const [profile, setProfile] = useState(null);


  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me"); // 🔥 your protected route

        const user = res.data.data;

        // 🔥 map backend fields → frontend fields
        setProfile({
          name: user.name,
          email: user.email,
          phone: user.phone1,
          businessName: user.business_name,
          vat: user.vat_number,
          warranty: user.warranty,
          address: user.address || "",
          role: user.role,
          createdAt: user.createdAt,
        });

      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <Text p={10}>Loading...</Text>;
  }


  // 
// AFTER functions
const calculateExpiryDate = (createdAt, warranty) => {
  if (!createdAt || !warranty) return "N/A";

  const months = parseInt(warranty);
  const startDate = new Date(createdAt);
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + months);

  return expiryDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isSubscriptionActive = (createdAt, warranty) => {
  if (!createdAt || !warranty) return false;

  const months = parseInt(warranty);
  const start = new Date(createdAt);
  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + months);

  return new Date() <= expiry;
};

// AFTER profile is loaded
if (!profile) {
  return <Text p={10}>Loading...</Text>;
}

// ✅ NOW it's safe
const isActive = isSubscriptionActive(profile.createdAt, profile.warranty);

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
                      <Input fontSize="15px" height="45px" value={profile?.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
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
                    onClick={async () => {
                      try {
                        await API.put("/auth/update-profile", {
                          name: profile.name,
                          phone: profile.phone,
                        });

                        handleUpdate("Profile");

                      } catch (err) {
                        console.error(err);
                      }
                    }}
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
                    onClick={async () => {
                      try {
                        await API.put("/auth/update-business", {
                          businessName: profile.businessName,
                          vat: profile.vat,
                          warranty: profile.warranty,
                          address: profile.address,
                        });

                        handleUpdate("Business");

                      } catch (err) {
                        console.error(err);
                      }
                    }}
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
                      <Input fontSize="15px" height="45px" type="password" placeholder="••••••••" value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        } />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">New Password</FormLabel>
                      <Input fontSize="15px" height="45px" type="password" placeholder="At least 8 characters" value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        } />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="15px" fontWeight="700">Confirm New Password</FormLabel>
                      <Input fontSize="15px" height="45px" type="password" value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        } />
                    </FormControl>
                    <Button
                      alignSelf="flex-start"
                      bg={accentColor}
                      color="white"
                      px={8}
                      _hover={{ bg: "#c92c34" }}
                      onClick={async () => {
                        if (passwordData.newPassword !== passwordData.confirmPassword) {
                          return toast({
                            title: "Passwords do not match",
                            status: "error",
                          });
                        }

                        try {
                          await API.put("/auth/change-password", {
                            currentPassword: passwordData.currentPassword,
                            newPassword: passwordData.newPassword,
                          });

                          handleUpdate("Security");

                        } catch (err) {
                          console.error(err);
                        }
                      }}
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
                        <Heading fontSize="28px">
                          {profile.role === "admin" ? "Premium Dealer" : "Standard User"}
                        </Heading>
                      </VStack>
                      <Badge
                        fontSize="12px"
                        colorScheme={isActive ? "green" : "red"}
                        variant="solid"
                        px={4}
                        py={1}
                        borderRadius="full"
                      >
                        {isActive ? "ACTIVE" : "EXPIRED"}
                      </Badge>
                    </HStack>
                    <Divider my={4} opacity={0.2} />
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={0}>
                        <Text fontSize="12px" opacity={0.7}>Expiry Date</Text>
                        <Text fontSize="18px" fontWeight="700">
                          {calculateExpiryDate(profile.createdAt, profile.warranty)}
                        </Text>
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
                        <Text fontWeight="700">
                          Premium Membership - {profile.warranty}
                        </Text>
                        <Text fontSize="12px" color="gray.500">
                          VAT: {profile.vat || "N/A"}
                        </Text>
                      </VStack>
                      <VStack spacing={0} align="flex-end">
                        <Text fontWeight="800">$499.00</Text>
                        <Text fontSize="12px" color="gray.500"> {calculateExpiryDate(profile.createdAt, profile.warranty)}</Text>
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
