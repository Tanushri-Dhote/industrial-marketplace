import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AccountPage from './pages/AccountPage';
import CreateQuotePage from './pages/CreateQuotePage';
import EmployeePage from './pages/EmployeePage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car-engines" element={<HomePage />} />
          <Route path="/used-engines" element={<HomePage />} />
          <Route path="/reconditioned-engines" element={<HomePage />} />
          <Route path="/gearboxes" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
          <Route path="/create-quote" element={
            <ProtectedRoute>
              <CreateQuotePage />
            </ProtectedRoute>
          } />
          <Route path="/employee" element={
            <ProtectedRoute>
              <EmployeePage />
            </ProtectedRoute>
          } />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;