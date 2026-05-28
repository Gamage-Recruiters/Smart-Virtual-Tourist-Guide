import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/mainPage'
import { RenterLoginPage } from './pages/loginPage'

function App() {

  return (
   <Router>
      <Routes>
        <Route element={<MainPage />}>
          <Route path="/" element={<RenterLoginPage/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
