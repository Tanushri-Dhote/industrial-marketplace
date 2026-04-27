import React, { useState, useEffect } from 'react';
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
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Flex,
  Progress,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import {
  FiUser,
  FiBriefcase,
  FiLock,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiShield,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiTrendingUp,
} from 'react-icons/fi';
import API from "../services/api";

export default function AccountPage() {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const accentColor = "#D90404";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
      position: 'top-right',
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get("/auth/me");
        const user = res.data.data;
        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone1 || "",
          businessName: user.business_name || "",
          vat: user.vat_number || "",
          warranty: user.warranty || "12",
          address: user.address || "",
          role: user.role || "user",
          createdAt: user.createdAt || new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to load profile", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

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

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="4px" />
          <Text fontSize="lg" fontWeight="500" color="gray.500">
            Loading your account...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (!profile) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Icon as={FiUser} boxSize={12} color="gray.400" />
          <Text fontSize="lg" fontWeight="500" color="gray.500">
            Unable to load profile data
          </Text>
          <Button colorScheme="red" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </VStack>
      </Flex>
    );
  }

  const isActive = isSubscriptionActive(profile.createdAt, profile.warranty);

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Modern Page Header with Gradient */}
          <Box
            bgGradient="linear(135deg, #1a1a2e 0%, #16213e 100%)"
            borderRadius="2xl"
            p={8}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="-20%"
              right="-10%"
              width="300px"
              height="300px"
              borderRadius="full"
              bg="rgba(217, 4, 4, 0.1)"
              filter="blur(60px)"
            />
            <Box
              position="absolute"
              bottom="-20%"
              left="-10%"
              width="250px"
              height="250px"
              borderRadius="full"
              bg="rgba(255, 77, 77, 0.08)"
              filter="blur(50px)"
            />
            <VStack align="flex-start" spacing={2} position="relative" zIndex={1}>
              <Badge
                bg="rgba(217, 4, 4, 0.2)"
                color={accentColor}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="12px"
              >
                Welcome Back
              </Badge>
              <Heading fontSize="36px" fontWeight="900" letterSpacing="-1px" color="white">
                My Account Details
              </Heading>
              <Text color="gray.300" fontSize="16px">
                Manage your personal and business credentials for the All Engine 4 You.
              </Text>
            </VStack>
          </Box>

          {/* Modern Profile Header Card */}
          <Card bg={cardBg} borderRadius="2xl" boxShadow="lg" overflow="hidden">
            <CardBody p={6}>
              <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={6}>
                <Flex align="center" gap={5}>
                  <Avatar
                    size="xl"
                    name={profile.name}
                    bgGradient={`linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`}
                    color="white"
                    fontWeight="bold"
                    fontSize="2xl"
                  >
                    {getInitials(profile.name)}
                  </Avatar>
                  <VStack align="flex-start" spacing={1}>
                    <Heading fontSize="24px">{profile.name}</Heading>
                    <HStack spacing={2}>
                      <Badge
                        bg={accentColor}
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="11px"
                      >
                        {profile.role === "admin" ? "Premium Dealer" : "Standard User"}
                      </Badge>
                      <HStack spacing={1}>
                        <Icon as={FiCheckCircle} color="green.400" boxSize={3} />
                        <Text fontSize="12px" color="gray.500">Verified Account</Text>
                      </HStack>
                    </HStack>
                    <HStack spacing={4} mt={2}>
                      <HStack spacing={1}>
                        <Icon as={FiMail} color={accentColor} boxSize={3.5} />
                        <Text fontSize="13px" color="gray.500">{profile.email}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiPhone} color={accentColor} boxSize={3.5} />
                        <Text fontSize="13px" color="gray.500">{profile.phone}</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Flex>
                <StatGroup gap={6}>
                  <Stat>
                    <StatLabel fontSize="12px" color="gray.500">Member Since</StatLabel>
                    <StatNumber fontSize="18px">
                      {new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="12px" color="gray.500">Account Status</StatLabel>
                    <StatNumber>
                      <Badge
                        colorScheme={isActive ? "green" : "red"}
                        fontSize="14px"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {isActive ? "Active" : "Expired"}
                      </Badge>
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </Flex>
            </CardBody>
          </Card>

          {/* Modern Tabs */}
          <Tabs variant="unstyled" isFitted>
            <TabList
              bg={cardBg}
              borderRadius="xl"
              p={1.5}
              gap={2}
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Tab
                fontWeight="600"
                fontSize="14px"
                borderRadius="lg"
                py={3}
                transition="all 0.3s"
                _selected={{
                  bgGradient: `linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`,
                  color: "white",
                  boxShadow: "lg",
                }}
                _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
              >
                <Icon as={FiUser} mr={2} /> Profile
              </Tab>
              <Tab
                fontWeight="600"
                fontSize="14px"
                borderRadius="lg"
                py={3}
                transition="all 0.3s"
                _selected={{
                  bgGradient: `linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`,
                  color: "white",
                  boxShadow: "lg",
                }}
                _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
              >
                <Icon as={FiBriefcase} mr={2} /> Business
              </Tab>
              <Tab
                fontWeight="600"
                fontSize="14px"
                borderRadius="lg"
                py={3}
                transition="all 0.3s"
                _selected={{
                  bgGradient: `linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`,
                  color: "white",
                  boxShadow: "lg",
                }}
                _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
              >
                <Icon as={FiLock} mr={2} /> Security
              </Tab>
              <Tab
                fontWeight="600"
                fontSize="14px"
                borderRadius="lg"
                py={3}
                transition="all 0.3s"
                _selected={{
                  bgGradient: `linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`,
                  color: "white",
                  boxShadow: "lg",
                }}
                _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
              >
                <Icon as={FiCreditCard} mr={2} /> Subscription
              </Tab>
            </TabList>

            <TabPanels mt={6}>
              {/* Profile Settings Tab */}
              <TabPanel p={0}>
                <Card bg={cardBg} borderRadius="2xl" boxShadow="lg">
                  <CardHeader pb={0}>
                    <HStack spacing={3}>
                      <Icon as={FiUser} boxSize={6} color={accentColor} />
                      <Box>
                        <Heading fontSize="22px">Profile Information</Heading>
                        <Text fontSize="14px" color="gray.500">
                          Update your personal contact information used for business communication.
                        </Text>
                      </Box>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Full Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiUser} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            value={profile?.name || ""}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Email Address</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiMail} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            type="email"
                            value={profile.email}
                            isReadOnly
                            opacity={0.7}
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Phone Number</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiPhone} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                    </SimpleGrid>
                    <Button
                      mt={8}
                      bgGradient={`linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`}
                      color="white"
                      px={8}
                      height="50px"
                      isLoading={savingProfile}
                      loadingText="Saving..."
                      _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                      transition="all 0.3s"
                      boxShadow="lg"
                      onClick={async () => {
                        try {
                          setSavingProfile(true);
                          await API.put("/auth/update-profile", {
                            name: profile.name,
                            phone: profile.phone,
                          });
                          handleUpdate("Profile");
                        } catch (err) {
                          console.error(err);
                          toast({
                            title: "Error",
                            description: "Failed to update profile",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                        } finally {
                          setSavingProfile(false);
                        }
                      }}
                    >
                      Save Profile Changes
                    </Button>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Business Details Tab */}
              <TabPanel p={0}>
                <Card bg={cardBg} borderRadius="2xl" boxShadow="lg">
                  <CardHeader pb={0}>
                    <HStack spacing={3}>
                      <Icon as={FiBriefcase} boxSize={6} color={accentColor} />
                      <Box>
                        <Heading fontSize="22px">Business Details</Heading>
                        <Text fontSize="14px" color="gray.500">
                          Manage your tenant's institutional information and default marketplace settings.
                        </Text>
                      </Box>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Business Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiBriefcase} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            value={profile.businessName}
                            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">VAT Number</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiCreditCard} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            value={profile.vat}
                            onChange={(e) => setProfile({ ...profile, vat: e.target.value })}
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Warranty Period</FormLabel>
                        <Select
                          fontSize="15px"
                          height="50px"
                          value={profile.warranty}
                          onChange={(e) => setProfile({ ...profile, warranty: e.target.value })}
                          bg={useColorModeValue('gray.50', 'gray.900')}
                          borderColor={borderColor}
                          _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                        >
                          <option value="6">6 Months</option>
                          <option value="12">12 Months</option>
                          <option value="18">18 Months</option>
                          <option value="24">24 Months</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Business Address</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiMapPin} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                        </InputGroup>
                      </FormControl>
                    </SimpleGrid>
                    <Button
                      mt={8}
                      bgGradient={`linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`}
                      color="white"
                      px={8}
                      height="50px"
                      isLoading={savingBusiness}
                      loadingText="Saving..."
                      _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                      transition="all 0.3s"
                      boxShadow="lg"
                      onClick={async () => {
                        try {
                          setSavingBusiness(true);
                          await API.put("/auth/update-business", {
                            businessName: profile.businessName,
                            vat: profile.vat,
                            warranty: profile.warranty,
                            address: profile.address,
                          });
                          handleUpdate("Business");
                        } catch (err) {
                          console.error(err);
                          toast({
                            title: "Error",
                            description: "Failed to update business information",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          });
                        } finally {
                          setSavingBusiness(false);
                        }
                      }}
                    >
                      Update Business Information
                    </Button>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel p={0}>
                <Card bg={cardBg} borderRadius="2xl" boxShadow="lg">
                  <CardHeader pb={0}>
                    <HStack spacing={3}>
                      <Icon as={FiLock} boxSize={6} color={accentColor} />
                      <Box>
                        <Heading fontSize="22px">Security & Password</Heading>
                        <Text fontSize="14px" color="gray.500">
                          Keep your account secure by updating your password and monitoring activity.
                        </Text>
                      </Box>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={6} maxW="600px">
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Current Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiShield} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                          <InputRightElement>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              aria-label="Toggle password visibility"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">New Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiLock} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                          <InputRightElement>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={showNewPassword ? <FiEyeOff /> : <FiEye />}
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              aria-label="Toggle password visibility"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <Text fontSize="12px" color="gray.500" mt={1}>
                          Password must be at least 8 characters long
                        </Text>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600">Confirm New Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiCheckCircle} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            fontSize="15px"
                            height="50px"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                          />
                          <InputRightElement>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              aria-label="Toggle password visibility"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                      <Button
                        alignSelf="flex-start"
                        bgGradient={`linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`}
                        color="white"
                        px={8}
                        height="50px"
                        isLoading={changingPassword}
                        loadingText="Changing..."
                        _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                        transition="all 0.3s"
                        boxShadow="lg"
                        onClick={async () => {
                          if (passwordData.newPassword !== passwordData.confirmPassword) {
                            return toast({
                              title: "Passwords do not match",
                              description: "Please make sure your passwords match",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                          if (passwordData.newPassword.length < 8) {
                            return toast({
                              title: "Password too short",
                              description: "Password must be at least 8 characters",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                          try {
                            setChangingPassword(true);
                            await API.put("/auth/change-password", {
                              currentPassword: passwordData.currentPassword,
                              newPassword: passwordData.newPassword,
                            });
                            handleUpdate("Security");
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          } catch (err) {
                            console.error(err);
                            toast({
                              title: "Error",
                              description: "Failed to change password",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          } finally {
                            setChangingPassword(false);
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Subscription Tab */}
              <TabPanel p={0}>
                <Card bg={cardBg} borderRadius="2xl" boxShadow="lg" overflow="hidden">
                  {/* Premium Subscription Card */}
                  <Box
                    bgGradient="linear(135deg, #1a1a2e 0%, #0f3460 100%)"
                    p={8}
                    color="white"
                  >
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="flex-start" gap={4}>
                      <VStack align="flex-start" spacing={3}>
                        <Badge
                          colorScheme="yellow"
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="11px"
                        >
                          CURRENT PLAN
                        </Badge>
                        <Heading fontSize="32px" letterSpacing="-1px">
                          {profile.role === "admin" ? "Premium Dealer" : "Standard User"}
                        </Heading>
                        <HStack spacing={4}>
                          <HStack spacing={1}>
                            <Icon as={FiCalendar} boxSize={4} opacity={0.7} />
                            <Text fontSize="14px" opacity={0.9}>
                              Expires: {calculateExpiryDate(profile.createdAt, profile.warranty)}
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FiTrendingUp} boxSize={4} opacity={0.7} />
                            <Text fontSize="14px" opacity={0.9}>
                              {profile.warranty} Month Plan
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                      <VStack align={{ base: "flex-start", md: "flex-end" }} spacing={3}>
                        <Badge
                          fontSize="14px"
                          colorScheme={isActive ? "green" : "red"}
                          variant="solid"
                          px={4}
                          py={1.5}
                          borderRadius="full"
                        >
                          {isActive ? "ACTIVE" : "EXPIRED"}
                        </Badge>
                        {!isActive && (
                          <Button
                            size="sm"
                            colorScheme="whiteAlpha"
                            variant="outline"
                            _hover={{ bg: "whiteAlpha.200" }}
                          >
                            Renew Subscription
                          </Button>
                        )}
                      </VStack>
                    </Flex>
                    {isActive && (
                      <Box mt={6}>
                        <Flex justify="space-between" fontSize="14px" mb={2}>
                          <Text opacity={0.9}>Time remaining</Text>
                          <Text fontWeight="bold">Active</Text>
                        </Flex>
                        <Progress
                          value={75}
                          size="lg"
                          borderRadius="full"
                          bg="rgba(255,255,255,0.2)"
                          sx={{
                            "& > div": {
                              bgGradient: `linear(135deg, ${accentColor} 0%, #ff4d4d 100%)`,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <CardBody>
                    <Heading fontSize="22px" mb={6}>Payment History</Heading>
                    <VStack align="stretch" spacing={3}>
                      <Flex
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.900')}
                        borderRadius="xl"
                        justify="space-between"
                        align="center"
                        flexWrap="wrap"
                        gap={3}
                        transition="all 0.3s"
                        _hover={{ transform: "translateX(5px)" }}
                      >
                        <Flex align="center" gap={3}>
                          <Icon as={FiCreditCard} color={accentColor} boxSize={5} />
                          <Box>
                            <Text fontWeight="700">
                              Premium Membership - {profile.warranty} Months
                            </Text>
                            <Text fontSize="12px" color="gray.500">
                              VAT: {profile.vat || "N/A"}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex align="center" gap={4}>
                          <Text fontWeight="800" fontSize="lg">$499.00</Text>
                          <Badge colorScheme="green" variant="subtle" px={2} py={1}>
                            Paid
                          </Badge>
                          <Text fontSize="12px" color="gray.500">
                            {calculateExpiryDate(profile.createdAt, profile.warranty)}
                          </Text>
                        </Flex>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}