import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import AccountPage from "./pages/AccountPage";
import CreateQuotePage from "./pages/CreateQuotePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import VerifyLoginPage from "./pages/VerifyLoginPage";
import { UserProvider } from "./context/UserContext";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import CallSellerPage from "./pages/CallSellerPage";
import ProductsPage from "./pages/ProductsPage";
import RefreshPopUp from "./components/common/RefreshPopUp";
import ScrollToTop from "./components/layout/ScrollToTop";
import AllEnginesPage from "./pages/AllEnginesPage";

function App() {
	const { pathname } = useLocation();
	const adminShellHiddenRoutes = ["/dashboard", "/admin", "/employee", "/leads", "/quotes"];
	const hideGlobalLayout = adminShellHiddenRoutes.some((route) => pathname.startsWith(route));

	return (
		<UserProvider>
			<Box minH="100vh" display="flex" flexDirection="column">
				{/* {!hideGlobalLayout && <RefreshPopUp />} */}
				{!hideGlobalLayout && <Header />}
				<ScrollToTop />

				<Box flex="1">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/car-engines" element={<HomePage />} />
						<Route path="/used-engines" element={<HomePage />} />
						<Route path="/reconditioned-engines" element={<HomePage />} />
						<Route path="/gearboxes" element={<HomePage />} />

						<Route path="/about" element={<AboutPage />} />
						<Route path="/contact" element={<ContactPage />} />
						<Route path="/terms-and-conditions" element={<TermsPage />} />
						<Route path="/privacy-policy" element={<PrivacyPage />} />

						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/verify-login" element={<VerifyLoginPage />} />

						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						<Route path="/reset-password" element={<ResetPasswordPage />} />

						<Route path="/blog" element={<BlogPage />} />
						<Route path="/blog/:slug" element={<BlogDetailPage />} />
						<Route path="/products" element={<ProductsPage />} />
						<Route path="/products/:id" element={<ProductDetailPage />} />
						<Route path="/all-engines" element={<AllEnginesPage />} />

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/account"
							element={
								<ProtectedRoute>
									<AccountPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/create-quote"
							element={
								<ProtectedRoute>
									<CreateQuotePage />
								</ProtectedRoute>
							}
						/>

						{/* Legacy Redirects to unified Dashboard */}
						<Route
							path="/leads"
							element={
								<ProtectedRoute>
									<DashboardPage defaultModule="leads" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/quotes"
							element={
								<ProtectedRoute>
									<DashboardPage defaultModule="quotes" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin"
							element={
								<ProtectedRoute>
									<DashboardPage defaultModule="inquiries" />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/employee"
							element={
								<ProtectedRoute>
									<DashboardPage defaultModule="inquiries" />
								</ProtectedRoute>
							}
						/>

						<Route path="/checkout" element={<CheckoutPage />} />
						<Route path="/thank-you" element={<ThankYouPage />} />
						<Route path="/call-seller" element={<CallSellerPage />} />
					</Routes>
				</Box>

				{!hideGlobalLayout && <Footer />}
				<Toaster position="top-center" richColors />
			</Box>
		</UserProvider>
	);
}

export default App;
