// src/pages/HomePage.jsx
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import HeroSection from "./HeroSection";
import ReviewsSection from "./ReviewsSection";
import TrustBar from "./TrustBar";
import EasyStepsSection from "./EasyStepsSection";
import VehicleSelectorSection from "./VehicleSelectorSection";
import BrandModelSelectorSection from "./BrandModelSelectorSection";
import Areacbar from "./Areabar";
import TopEnginesSection from "./TopEnginesSection";
import FAQSection from "./FAQSection";

export default function HomePage() {
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const categoryMap = {
		"/car-engines": "Car Engines",
		"/used-engines": "Used Engines",
		"/reconditioned-engines": "Reconditioned Engines",
		"/gearboxes": "Gearboxes",
	};

	const category = categoryMap[location.pathname] || "Industrial Engines";

	return (
		<>
			<HeroSection category={category} />
			<TrustBar />
			<EasyStepsSection />
			{/* <BrandModelSelectorSection /> */}
			{!searchParams.get("brand") && <TopEnginesSection category={category} />}
			{/* <Areacbar /> */}
			<ReviewsSection />
			<FAQSection />
		</>
	);
}
