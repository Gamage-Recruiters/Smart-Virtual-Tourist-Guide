import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RenterLoginPage } from './pages/loginPage'
import RegisterPage from './pages/registerPage'

function App() {

  return (
   <Router>
      <Routes>
          <Route path="/login" element={<RenterLoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </Router>
  )
}

export default App
