import React from 'react';
import Explore from './Explore';
import Direction from './Direction';
import DirectionOne from './DirectionOne';
import EtaPage from './EtaPage';
import SafetyAlertTemplate from './SafetyAlertTemplate';
import Footer from '../../components/NavigationAndMapping/Footer';
import Header from '../../components/NavigationAndMapping/Header';
import { usePageTitle } from '../../context/PageTitleContext';

const PAGES = {
  explore:      <Explore />,
  direction:    <Direction />,
  directionOne: <DirectionOne />,
  eta:          <EtaPage />,
  safety:       <SafetyAlertTemplate />,
  start:        <Direction showDetailsPanel={false} />,
};

export default function NavigationMain() {
  const { activePage } = usePageTitle();
  const page = PAGES[activePage] ?? <Explore />;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1, position: 'relative' }}>
        {page}
      </div>
      <Footer />
    </div>
  );
}
