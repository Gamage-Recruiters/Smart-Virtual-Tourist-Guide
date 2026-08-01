import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutUs from './pages/AboutUs'
import HowItWorks from './pages/HowItWork'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="how-it-works" element={<HowItWorks />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App