import React from "react";
import {
	Box,
	Container,
	VStack,
	Text,
	Heading,
	Circle,
	Icon,
	Flex,
	useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import {
	FaSearch,
	FaTools,
	FaCogs,
	FaCheckCircle,
	FaCar,
} from "react-icons/fa";

const MotionBox = motion(Box);

const moveDash = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 120px 0;
  }
`;

const processSteps = [
	{
		icon: FaSearch,
		title: "Inspection",
		description: "Engine is fully inspected and assessed",
	},
	{
		icon: FaTools,
		title: "Disassembly",
		description: "Carefully stripped down and all parts checked",
	},
	{
		icon: FaCogs,
		title: "Reconditioning",
		description: "Parts are machined, refurbished or replaced as needed",
	},
	{
		icon: FaCheckCircle,
		title: "Testing",
		description: "Engine is tested under load for maximum reliability",
	},
	{
		icon: FaCar,
		title: "Ready to Go",
		description: "Fully reassembled and ready for safe vehicle use",
	},
];

export default function EngineProcessSection() {
	const accentColor = "#D90404";

	const sectionBg = useColorModeValue(
		"linear-gradient(180deg, #fff8f7 0%, #ffffff 100%)",
		"gray.900"
	);

	return (
		<Box
			bgGradient={sectionBg}
			py={{ base: 8, md: 10 }}
			position="relative"
			overflow="hidden"
		>
			{/* Decorative circles */}
			<Circle
				position="absolute"
				top="-80px"
				left="-80px"
				size="250px"
				bg="red.50"
				opacity={0.5}
			/>
			<Circle
				position="absolute"
				bottom="-100px"
				right="-80px"
				size="280px"
				bg="red.50"
				opacity={0.4}
			/>

			<Container maxW="1300px" position="relative" zIndex={2}>
				<VStack spacing={16}>
					{/* Header */}
					<MotionBox
						initial={{ opacity: 0, y: 25 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7 }}
						textAlign="center"
					>
						<VStack spacing={5}>
							<Text
								fontSize="13px"
								fontWeight="800"
								color={accentColor}
								letterSpacing="1.5px"
								textTransform="uppercase"
							>
								Our Process
							</Text>

							<Heading
								as="h2"
								fontSize={{ base: "28px", md: "38px", lg: "42px" }}
								fontWeight="800"
								color="gray.900"
								lineHeight="1.2"
							>
								Engine Reconditioning Process
							</Heading>

							<Text
								maxW="700px"
								color="gray.600"
								fontSize="15px"
								lineHeight="1.8"
							>
								Our trusted process ensures every engine meets the highest
								standards of quality and performance.
							</Text>
						</VStack>
					</MotionBox>

					{/* Timeline */}
					<Box position="relative" w="full" role="group">
						{/* Desktop animated dashed line */}
						<MotionBox
							position="absolute"
							top="42px"
							left="10%"
							right="10%"
							h="2px"
							zIndex={1}
							display={{ base: "none", md: "block" }}
							bgImage={`
                repeating-linear-gradient(
                  to right,
                  #D90404 0px,
                  #D90404 36px,
                  transparent 36px,
                  transparent 52px
                )
              `}
							bgSize="120px 2px"
							borderRadius="full"
							_groupHover={{
								animation: `${moveDash} 1s linear infinite`,
							}}
						/>

						{/* Steps */}
						<Flex
							direction={{ base: "column", md: "row" }}
							justify="space-between"
							align="flex-start"
							gap={{ base: 8, md: 4 }}
							position="relative"
							zIndex={2}
						>
							{processSteps.map((step, index) => (
								<MotionBox
									key={index}
									flex="1"
									w="full"
									textAlign={{ base: "left", md: "center" }}
									initial={{ opacity: 0, y: 40 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.6,
										delay: index * 0.15,
									}}
									position="relative"
								>
									{/* Mobile vertical line */}
									{index !== processSteps.length - 1 && (
										<Box
											display={{ base: "block", md: "none" }}
											position="absolute"
											left="27px"
											top="55px"
											bottom="-32px"
											w="2px"
											bg="red.100"
										/>
									)}

									<Flex
										direction={{ base: "row", md: "column" }}
										align={{ base: "flex-start", md: "center" }}
										gap={{ base: 4, md: 0 }}
									>
										{/* Icon */}
										<Box position="relative" zIndex={2}>
											<Circle
												size={{ base: "56px", md: "84px" }}
												bg="white"
												border="3px solid"
												borderColor="red.100"
												boxShadow="0 12px 28px rgba(0,0,0,0.08)"
												flexShrink={0}
												transition="all 0.3s ease"
												_hover={{
													transform: "translateY(-8px)",
													boxShadow: "0 20px 35px rgba(217,4,4,0.18)",
													borderColor: "red.300",
												}}
											>
												<Circle size={{ base: "34px", md: "50px" }} bg="red.50">
													<Icon
														as={step.icon}
														boxSize={{ base: 4, md: 6 }}
														color={accentColor}
													/>
												</Circle>
											</Circle>
										</Box>

										{/* Content */}
										<Box
											pt={{ base: 1, md: 0 }}
											textAlign={{ base: "left", md: "center" }}
										>
											{/* Desktop connector */}
											<Box
												w="2px"
												h="16px"
												bg="gray.300"
												mx="auto"
												mt={4}
												mb={4}
												display={{ base: "none", md: "block" }}
											/>

											<Text
												fontSize={{ base: "17px", md: "19px" }}
												fontWeight="700"
												color="gray.900"
											>
												{step.title}
											</Text>

											<Text
												fontSize={{ base: "13px", md: "14px" }}
												color="gray.600"
												lineHeight="1.7"
												maxW={{ base: "full", md: "180px" }}
												mt={2}
											>
												{step.description}
											</Text>
										</Box>
									</Flex>
								</MotionBox>
							))}
						</Flex>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
}