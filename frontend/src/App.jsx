import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import H_ProfilePage from './pages/H_ProfilePage';
import T_ProfilePage from './pages/T_ProfilePage';
import R_ProfilePage from './pages/R_ProfilePage';
import G_ProfilePage from './pages/G_ProfilePage';
import VA_ProfilePage from './pages/VA_ProfilePage';
import D_ProfilePage from './pages/D_ProfilePage';

function WithNavbar({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/driver-profile" element={<D_ProfilePage />} />
        <Route path="/" element={<WithNavbar><H_ProfilePage /></WithNavbar>} />
        <Route path="/hotel-profile" element={<WithNavbar><H_ProfilePage /></WithNavbar>} />
        <Route path="/tourist-profile" element={<WithNavbar><T_ProfilePage /></WithNavbar>} />
        <Route path="/restaurant-profile" element={<WithNavbar><R_ProfilePage /></WithNavbar>} />
        <Route path="/guide-profile" element={<WithNavbar><G_ProfilePage /></WithNavbar>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
