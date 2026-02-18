import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import ImageSlider from './ImageSlider';
import OurCollection from './OurCollection';
import CategoryFilter from './CategoryFilter';
import JewelryStore from './JewelryStore';
import FeaturedSection from './FeaturedSection';
import ProductDetail from './ProductDetail';
import ProductListPage from './ProductListPage';
import Footer from './Footer';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductsManager from './admin/ProductsManager';
import OrdersManager from './admin/OrdersManager';
import ContactsManager from './admin/ContactsManager';
import Login from './admin/Login';
import ProtectedRoute from './admin/ProtectedRoute';

function HomePageContent() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <>
      <ImageSlider />
      <OurCollection />
      <CategoryFilter onFilterChange={setSelectedFilter} />
      <JewelryStore filter={selectedFilter} searchQuery={searchQuery} />
      <FeaturedSection />
    </>
  );
}

function HomePage() {
  return <HomePageContent />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="contacts" element={<ContactsManager />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
