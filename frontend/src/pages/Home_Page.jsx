import React, { useState } from 'react';
import Header from '../components/Header';
import Main_Layout from '../components/Main_Layout';
import Footer from '../components/Footer';
import Navbar from '../components/marketplace/Navbar';
import Drivers_Card from '../components/marketplace/Drivers_Card';
import Vehicles_Card from '../components/marketplace/Vehicles_Card'; 


export default function Home_Page() {
  const [activeTab, setActiveTab] = useState('drivers');

  return (
    <div> 
        <Header /> 
          <main className="flex-1 -mt-35 p-0">
            <Main_Layout />
              <div className='mt-5 pb-15 px-16'>
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
                {activeTab === 'drivers' && <Drivers_Card />}
                {activeTab === 'vehicles' && <Vehicles_Card />}
                {activeTab === 'guides' && <div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Guides Content Coming Soon...</div>}
                {activeTab === 'hotels' && <div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Hotels Content Coming Soon...</div>}
                {activeTab === 'restaurants' && <div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Restaurants Content Coming Soon...</div>}
                {activeTab === 'activities' && <div className="p-10 bg-[#EBF1FF] rounded-b-2xl font-bold text-center">Activities Content Coming Soon...</div>}
              </div>
          </main>
        <Footer />
    </div>
  )
}