import React from 'react';
import { 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Box, 
  Badge, 
  Divider, 
  UnorderedList, 
  ListItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { FaShieldAlt, FaLock, FaCookie, FaEye, FaUserSecret } from 'react-icons/fa';
import { MdGavel, MdPrivacyTip } from 'react-icons/md';

export default function PrivacyPage() {
  const accentColor = "#D90404";
  const darkBg = "#0F172A";
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const sections = [
    { id: 1, title: "Before you proceed" },
    { id: 2, title: "Summary" },
    { id: 3, title: "1-Who we are?" },
    { id: 4, title: "2- How do we collect personal information?" },
    { id: 5, title: "3- What personal information do we collect?" },
    { id: 6, title: "4- How do we use your personal information?" },
    { id: 7, title: "5- Why do we process your personal information?" },
    { id: 8, title: "6- Who do we share your personal information with?" },
    { id: 9, title: "7- What cookies do we use?" },
    { id: 10, title: "8- What advertisement do we show on our website?" },
    { id: 11, title: "9- How secure is our website and what steps we take to keep you safe?" },
    { id: 12, title: "10- How can you amend your preferences?" },
    { id: 13, title: "11- Your personal data rights and how to contact us?" },
    { id: 14, title: "12- How long do we keep your personal information?" },
    { id: 15, title: "Changes to this privacy policy" },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy -  All Engine 4 You  Trust | UK's Leading  All Engine 4 You  Price Comparison</title>
        <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your personal information when using  All Engine 4 You  Trust price comparison services." />
      </Helmet>

      {/* Hero Section */}
      <Box bg={darkBg} color="white" py={12} mb={8}>
        <Container maxW="container.xl">
          <VStack spacing={3} textAlign="center">
            <Badge bg={accentColor} color="white" px={3} py={1} borderRadius="full" fontSize="12px">
              Legal & Privacy
            </Badge>
            <Heading fontSize="36px" fontWeight="800">
              Privacy Policy
            </Heading>
            <Text fontSize="16px" maxW="2xl" opacity={0.9}>
              Your privacy is important to us. Read how we protect your data.
            </Text>
            <Text fontSize="14px" opacity={0.7}>Last updated: April, 2026</Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={4} mb={12}>
        <VStack align="stretch" spacing={6}>
          
          {/* Warning Banner */}
          <Box 
            bg="red.50" 
            p={5} 
            borderRadius="lg" 
            borderLeft="4px solid red"
            mb={4}>
            <HStack spacing={3}>
              <Icon as={MdGavel} boxSize={6} color="red.500" />
              <Text fontSize="14px" color="red.800" fontWeight="500">
                Before you proceed, please read our privacy policy carefully. If you do not accept this 
                privacy policy and terms of use, you must exit from our website and do not use our website 
                or any part of the website.
              </Text>
            </HStack>
          </Box>

          {/* How  All Engine 4 You  Trust Helps - Highlight Box */}
          <Box 
            bg="orange.50" 
            p={6} 
            borderRadius="lg" 
            border="1px solid"
            borderColor={accentColor}
            mb={4}>
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={FaShieldAlt} boxSize={6} color={accentColor} />
                <Heading fontSize="20px" color={darkBg}>How can  All Engine 4 You  Trust help me save on my car parts price comparison?</Heading>
              </HStack>
              <Text fontSize="15px" lineHeight="1.6">
                We are UK's first price comparison website that is focused on comparing used and reconditioned  All Engine 4 You s 
                as well as ancillaries. Once you enter your reg number, we check our database and give you the cheapest 
                online quotes in just few clicks. Get multiple quotes from carefully vetted suppliers and get your 
                 All Engine 4 You s and ancillaries within no time. Choose  All Engine 4 You  Trust as we only have trusted suppliers who 
                don't compromise on quality. We offer an unmatchable  All Engine 4 You  and ancillaries price comparison service 
                where you pay the cheapest price. Get free online quotes in few clicks. Compare prices and buy with 
                confidence with  All Engine 4 You  Trust.
              </Text>
            </VStack>
          </Box>

          {/* Main Content with Accordion */}
          <Box>
            {sections.map((section, index) => (
              <Accordion key={index} allowToggle mb={4} defaultIndex={index === 0 ? [0] : []}>
                <AccordionItem border="1px solid" borderColor={borderColor} borderRadius="lg" mb={3}>
                  <AccordionButton 
                    _expanded={{ bg: accentColor, color: 'white' }}
                    _hover={{ bg: 'orange.50' }}
                    borderRadius="lg"
                    py={4}>
                    <Box flex="1" textAlign="left">
                      <Heading size="md" fontSize="18px">{section.title}</Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} pt={4}>
                    {section.id === 1 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        Before you proceed, please read our privacy policy carefully. If you do not accept this 
                        privacy policy and terms of use, you must exit from our website and do not use our website 
                        or any part of the website.
                      </Text>
                    )}

                    {section.id === 2 && (
                      <VStack align="stretch" spacing={4}>
                        <Text fontSize="15px" lineHeight="1.7">
                          As a price comparison business, we are committed to protect all of your information, we collect 
                          at our website. We want you to be confident when you use our website that your personal 
                          information is safe with us as we do not practice any spamming activities.
                        </Text>
                        <Text fontSize="15px" lineHeight="1.7">
                          This privacy policy describes the following points:
                        </Text>
                        <UnorderedList spacing={2} pl={4}>
                          <ListItem>How do we collect your information?</ListItem>
                          <ListItem>What information do we collect?</ListItem>
                          <ListItem>How we use your information?</ListItem>
                          <ListItem>Who we share your information with?</ListItem>
                          <ListItem>And the rights and options you have; when it comes to your personal information.</ListItem>
                        </UnorderedList>
                      </VStack>
                    )}

                    {section.id === 3 && (
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="15px" lineHeight="1.7">
                          Autoonlinemarketing UK is working under the trade name of  All Engine 4 You trust.co.uk (both operating in 
                          the UK) and we all take your privacy very seriously.
                        </Text>
                        <Box bg="gray.50" p={4} borderRadius="md">
                          <Text fontWeight="bold">Company Information:</Text>
                          <Text fontSize="14px">Company number: +44 20 8133 4040</Text>
                          <Text fontSize="14px">Registered address: 38 Fowler Rd, Ilford IG6 3UT, UK</Text>
                          <Text fontSize="14px">Email: info@allengine4you.co.uk</Text>
                        </Box>
                      </VStack>
                    )}

                    {section.id === 4 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        We may gather your personal information through our website, or other digital media or social 
                        media channels operated by or on behalf of the company referred to collectively as the "Site" 
                         All Engine 4 You trust.co.uk.
                      </Text>
                    )}

                    {section.id === 5 && (
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="15px" lineHeight="1.7">
                          We collect information about you only when you give this to us at our website for receiving 
                          price quotes only, for example, we may collect your name, email address, telephone number 
                          and postcode.
                        </Text>
                        <Box bg="orange.50" p={3} borderRadius="md">
                          <Text fontSize="14px" fontWeight="500">✓ We do NOT collect:</Text>
                          <UnorderedList spacing={1}>
                            <ListItem>Bank details or payment information</ListItem>
                            <ListItem>Sensitive personal data</ListItem>
                            <ListItem>Identification numbers (Driving license, etc.)</ListItem>
                          </UnorderedList>
                        </Box>
                      </VStack>
                    )}

                    {section.id === 6 && (
                      <UnorderedList spacing={2}>
                        <ListItem>To give you access to use the Services</ListItem>
                        <ListItem>To personalise and improve your price quotes and Services</ListItem>
                        <ListItem>For research, such as analysing market trends and customer behaviours</ListItem>
                        <ListItem>To communicate with you about your quotes</ListItem>
                        <ListItem>To search the websites of our partners to obtain the best quotes available to you</ListItem>
                        <ListItem>To track sales and improve our service quality</ListItem>
                      </UnorderedList>
                    )}

                    {section.id === 7 && (
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="15px" fontWeight="bold">Consent:</Text>
                        <Text fontSize="14px">We will only collect and process your personal information if you have given your consent.</Text>
                        <Text fontSize="15px" fontWeight="bold" mt={2}>Legitimate Interests:</Text>
                        <Text fontSize="14px">We may use your information to enable you to access and use the Services, communicate with you regarding your quotes, and improve our Services.</Text>
                      </VStack>
                    )}

                    {section.id === 8 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        As a price comparison service, we need to disclose some of your information to our members 
                        (garages,  All Engine 4 You  reconditioners, workshops, and retailers) to make the best possible price 
                        quote for you.
                      </Text>
                    )}

                    {section.id === 9 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        We usually don't use cookies on our websites, but planning to do so very soon. Cookies help us 
                        understand browsing habits and improve your experience.
                      </Text>
                    )}

                    {section.id === 10 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        The advertisements that you see on our website are delivered on our behalf by third parties 
                        like Google Adsense. No identifiable information is used to provide these ads.
                      </Text>
                    )}

                    {section.id === 11 && (
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="15px">Our Sites use HTTPS or secure protocols to help keep information about you secure.</Text>
                        <Box bg="green.50" p={3} borderRadius="md">
                          <Text fontSize="14px" fontWeight="500">Security Features:</Text>
                          <UnorderedList spacing={1}>
                            <ListItem>✓ HTTPS encryption</ListItem>
                            <ListItem>✓ No sensitive data collection</ListItem>
                            <ListItem>✓ No financial transactions on site</ListItem>
                            <ListItem>✓ No account creation required</ListItem>
                          </UnorderedList>
                        </Box>
                      </VStack>
                    )}

                    {section.id === 12 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        Any electronic communication will include an unsubscribe link. You can unsubscribe your 
                        information from our system at any time by emailing info@industrialmarket.co.uk.
                      </Text>
                    )}

                    {section.id === 13 && (
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="15px">Under GDPR, you have the following rights:</Text>
                        <UnorderedList spacing={2}>
                          <ListItem>Right to access your personal information</ListItem>
                          <ListItem>Right to correct inaccurate information</ListItem>
                          <ListItem>Right to erase your information (Right to be forgotten)</ListItem>
                          <ListItem>Right to restrict our use of your information</ListItem>
                          <ListItem>Right to data portability</ListItem>
                          <ListItem>Right to object to our use of your information</ListItem>
                        </UnorderedList>
                        <Text fontSize="14px" mt={2}>Contact: info@industrialmarket.co.uk</Text>
                      </VStack>
                    )}

                    {section.id === 14 && (
                      <VStack align="stretch" spacing={3}>
                        <Text fontSize="15px">We do not hold your personal information for longer than necessary:</Text>
                        <Box bg="gray.50" p={3} borderRadius="md">
                          <Text>• Until you request deletion (processed within 30 days)</Text>
                          <Text>• Automatically deleted after 120 days</Text>
                          <Text>• If inactive for 120 days, information is removed</Text>
                        </Box>
                      </VStack>
                    )}

                    {section.id === 15 && (
                      <Text fontSize="15px" lineHeight="1.7">
                        We reserve the right to change and amend our privacy policy at any time. Any changes will be 
                        published on the sites. If there are significant changes, we may contact you by email or phone.
                      </Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ))}
          </Box>

          {/* Contact Section */}
          <Box 
            bg={darkBg} 
            color="white" 
            p={6} 
            borderRadius="lg" 
            textAlign="center"
            mt={6}>
            <VStack spacing={3}>
              <Icon as={MdPrivacyTip} boxSize={10} color={accentColor} />
              <Heading fontSize="22px">Questions About Your Privacy?</Heading>
              <Text fontSize="14px" opacity={0.9}>
                Contact our Data Protection Officer at:
              </Text>
              <Text fontSize="16px" fontWeight="bold" color={accentColor}>
                info@allengine4you.co.uk
              </Text>
              <Text fontSize="12px" opacity={0.7}>
                Response time: 48-72 hours on working days
              </Text>
            </VStack>
          </Box>

          {/* Footer Note */}
          <Text fontSize="12px" color="gray.500" textAlign="center" mt={4}>
            This privacy policy is constructed and governed in all aspects in accordance with UK and Wales laws.
          </Text>
        </VStack>
      </Container>
    </>
  );
}