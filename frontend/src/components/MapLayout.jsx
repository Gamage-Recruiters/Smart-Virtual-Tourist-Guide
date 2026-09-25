import React from 'react';
import { Outlet } from 'react-router-dom';
import MapHeader from './MapHeader';
import Footer from './Footer';

export default function MapLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      <MapHeader />
      <div style={{ flex: 1, position: 'relative' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
