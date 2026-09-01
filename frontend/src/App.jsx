import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import DirectionPage from './pages/DirectionPage';
import NavigationPage from './pages/NavigationPage';
import DirectionOne from './pages/DirectionOne';
import EtaPage from './pages/EtaPage';
import SafetyAlertTemplate from './pages/SafetyAlertTemplate';
import Footer from './components/Footer';
import Header from './components/Header';
import { LocationProvider } from './contexts/LocationContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { UIProvider } from './contexts/UIContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white', fontFamily: 'monospace' }}>
          <h2>React Crash</h2>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        <NavigationProvider>
          <UIProvider>
        <ErrorBoundary>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div style={{ flex: 1, position: 'relative' }}>
              <Routes>
                <Route path="/" element={<Explore />} />
                <Route path="/direction/setup" element={<DirectionOne />} />
                <Route path="/direction" element={<DirectionPage />} />
                <Route path="/navigation" element={<NavigationPage />} />
                <Route path="/eta" element={<EtaPage />} />
                <Route path="/route-alerts" element={<SafetyAlertTemplate />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </ErrorBoundary>
          </UIProvider>
        </NavigationProvider>
      </LocationProvider>
    </BrowserRouter>
  );
}
