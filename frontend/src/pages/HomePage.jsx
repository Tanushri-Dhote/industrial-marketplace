// src/pages/HomePage.jsx
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import HeroSection from "./HeroSection";
import ReviewsSection from "./ReviewsSection";
import TrustBar from "./TrustBar";
import EasyStepsSection from "./EasyStepsSection";
import BrandModelSelectorSection from "./BrandModelSelectorSection";
import ServiceAreasSection from "./Areabar";
import TopEnginesSection from "./TopEnginesSection";
import CuratedListingsSection from "./CuratedListingsSection";
import FAQSection from "./FAQSection";
import BuiltToHighestStandard from "./BuiltToHighestStandard";
import WarrantyBannerSection from "./WarrantyBannerSection";
import HelpBannerSection from "./HelpBannerSection";
import HomeAbout from "./HomeAbout";
import LatestBlogsSection from "./LatestBlogsSection";

export default function HomePage() {
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const categoryMap = {
		"/car-engines": "Car Engines",
		"/used-engines": "Used Engines",
		"/reconditioned-engines": "Reconditioned Engines",
		"/gearboxes": "Gearboxes",
	};

	const category = categoryMap[location.pathname] || "Engines";

	return (
		<>
			<HeroSection category={category} />
			{!searchParams.get("brand") && <BrandModelSelectorSection />}
			<BuiltToHighestStandard />
			<TrustBar />
			<HomeAbout />
			<EasyStepsSection />
			{!searchParams.get("brand") && <TopEnginesSection category={category} />}
			{!searchParams.get("brand") && <CuratedListingsSection category={category} />}
			{/* <ServiceAreasSection /> */}
			<ReviewsSection />
			<FAQSection />
			<LatestBlogsSection />
			<WarrantyBannerSection />
			<HelpBannerSection />
		</>
	);
}
