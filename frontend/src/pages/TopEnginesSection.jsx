import React, { useRef } from "react";
import {
	Box,
	Button,
	Center,
	Container,
	Heading,
	Image,
	Spinner,
	Text,
	VStack,
	IconButton,
	HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import API from "../services/api";

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(72, 187, 120, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
`;

const PulsingDot = () => (
	<Box
		w="6px"
		h="6px"
		borderRadius="full"
		bg="green.500"
		animation={`${pulse} 2s infinite`}
	/>
);

// Swiper imports - CORRECTED
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Icons
import { ChevronLeft, ChevronRight } from "lucide-react";

const MotionBox = motion(Box);

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
		},
	},
};

export default function TopEnginesSection({ category }) {
	const accentColor = "#D90404";
	const swiperRef = useRef(null);

	const { data: engines = [], isLoading: loading } = useQuery({
		queryKey: ["products", { category }],
		queryFn: async () => {
			const res = await API.get("/products");
			const products = res.data.data || res.data || [];

			let filtered = products;

			if (category && category !== "Engines") {
				filtered = products.filter(
					(p) =>
						p.category?.name === category ||
						(category === "Used Engines" &&
							p.condition?.toLowerCase() === "used") ||
						(category === "Reconditioned Engines" &&
							p.condition?.toLowerCase() === "reconditioned")
				);
			}

			return filtered.slice(0, 12);
		},
		staleTime: 1000 * 60 * 5,
	});

	if (loading) {
		return (
			<Center py={20}>
				<Spinner size="xl" color={accentColor} />
			</Center>
		);
	}

	// Swiper breakpoints configuration (inline object, no separate import needed)
	const swiperBreakpoints = {
		320: {
			slidesPerView: 2,
			spaceBetween: 12,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 16,
		},
		640: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		768: {
			slidesPerView: 4,
			spaceBetween: 20,
		},
		1024: {
			slidesPerView: 5,
			spaceBetween: 20,
		},
		1280: {
			slidesPerView: 6,
			spaceBetween: 20,
		},
	};

	return (
		<Box bg="#F7F8FA" pt={{ base: 8, md: 10 }} pb={{ base: 4, md: 4 }}>
			<Container maxW="container.xl">
				<VStack spacing={10}>
					{/* Header */}
					<VStack spacing={3} textAlign="center">
						<Text
							fontSize="13px"
							fontWeight="800"
							color={accentColor}
							textTransform="uppercase"
							letterSpacing="1.5px"
						>
							Our Engines
						</Text>

						<Heading
							as="h2"
							fontSize={{ base: "28px", md: "38px", lg: "42px" }}
							fontWeight="800"
							color="gray.900"
						>
							Popular {category}
						</Heading>

						<Text
							fontSize="15px"
							color="gray.600"
							maxW="600px"
						>
							High quality reconditioned engines for a wide range of makes
							and models.
						</Text>
					</VStack>

					{/* Swiper Carousel */}
					{engines.length > 0 ? (
						<Box position="relative" w="full" px={{ base: 0, md: 4 }}>
							<Swiper
								modules={[Navigation, Autoplay]}
								spaceBetween={20}
								slidesPerView={6}
								navigation={{
									nextEl: ".swiper-button-next-custom",
									prevEl: ".swiper-button-prev-custom",
								}}
								autoplay={{
									delay: 3000,
									disableOnInteraction: false,
									pauseOnMouseEnter: true,
								}}
								breakpoints={swiperBreakpoints}
								loop={engines.length >= 6}
								onBeforeInit={(swiper) => {
									swiperRef.current = swiper;
								}}
								style={{ padding: "4px 0 8px 0" }}
							>
								{engines.map((engine) => (
									<SwiperSlide key={engine._id}>
										<MotionBox
											as={RouterLink}
											to={`/products/${engine._id}`}
											variants={cardVariants}
											initial="hidden"
											whileInView="visible"
											viewport={{ once: true }}
											bg="white"
											borderRadius="xl"
											p={4}
											boxShadow="0 4px 10px rgba(0, 0, 0, 0.02)"
											border="1px solid"
											borderColor="gray.100"
											cursor="pointer"
											transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
											_hover={{
												transform: "translateY(-6px)",
												borderColor: "rgba(217, 4, 4, 0.3)",
												boxShadow: "0 15px 30px rgba(217, 4, 4, 0.08)",
												textDecoration: "none",
											}}
											display="block"
										>
											{/* Image */}
											<Box
												h="90px"
												display="flex"
												alignItems="center"
												justifyContent="center"
												mb={3}
											>
												<Image
													src={
														engine.images?.[0] ||
														"https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=400&q=80"
													}
													alt={engine.name}
													maxH="100%"
													objectFit="contain"
												/>
											</Box>

											{/* Name */}
											<Text
												fontWeight="800"
												fontSize="14px"
												color="gray.900"
												noOfLines={1}
												textAlign="left"
											>
												{engine.name}
											</Text>

											{/* Fits & In Stock Row */}
											<HStack spacing={1.5} fontSize="11px" color="gray.600" mt={1.5} w="full" justify="space-between">
												<Text noOfLines={1} fontWeight="600">
													Fits: {engine.model || "Universal"}
												</Text>
												<HStack spacing={1} align="center">
													<PulsingDot />
													<Text color="green.600" fontWeight="700">
														Stock
													</Text>
												</HStack>
											</HStack>

											{/* Button */}
											<Button
												size="sm"
												mt={4}
												w="full"
												bg="gray.100"
												color="gray.800"
												fontSize="12px"
												fontWeight="700"
												_hover={{
													bg: accentColor,
													color: "white",
												}}
											>
												View Details
											</Button>
										</MotionBox>
									</SwiperSlide>
								))}
							</Swiper>

							{/* Custom Navigation Buttons */}
							{engines.length > 6 && (
								<>
									<IconButton
										className="swiper-button-prev-custom"
										aria-label="Previous"
										icon={<ChevronLeft size={20} />}
										position="absolute"
										left="-8px"
										top="50%"
										transform="translateY(-50%)"
										zIndex={10}
										bg="white"
										color="gray.700"
										borderRadius="full"
										boxShadow="md"
										size="sm"
										_hover={{
											bg: accentColor,
											color: "white",
										}}
										onClick={() => swiperRef.current?.slidePrev()}
										display={{ base: "none", md: "flex" }}
									/>
									<IconButton
										className="swiper-button-next-custom"
										aria-label="Next"
										icon={<ChevronRight size={20} />}
										position="absolute"
										right="-8px"
										top="50%"
										transform="translateY(-50%)"
										zIndex={10}
										bg="white"
										color="gray.700"
										borderRadius="full"
										boxShadow="md"
										size="sm"
										_hover={{
											bg: accentColor,
											color: "white",
										}}
										onClick={() => swiperRef.current?.slideNext()}
										display={{ base: "none", md: "flex" }}
									/>
								</>
							)}
						</Box>
					) : (
						<Text color="gray.500">
							No {category?.toLowerCase()} found.
						</Text>
					)}

					{/* View All Button */}
					<Button
						as={RouterLink}
						to="/all-engines"
						bg={accentColor}
						color="white"
						size="lg"
						px={10}
						fontWeight="700"
						_hover={{
							bg: "#b50303",
						}}
					>
						View All Engines
					</Button>
				</VStack>
			</Container>
		</Box>
	);
}