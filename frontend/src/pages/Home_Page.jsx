import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from '../components/Header';
import Main_Layout from '../components/Main_Layout';
import Footer from '../components/Footer';
import Navbar from '../components/marketplace/Navbar';

export default function Home_Page() {
  return (
    <div> 
      <Header /> 
      <main className="flex-1 -mt-35 p-0">
        <Main_Layout />
          <div className='mt-5 pb-15 px-16'>
            <Navbar />
            <Outlet /> 
          </div>
      </main>
      <Footer />
    </div>
  );
}