import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LoginPage from './Pages/User/LoginPage';
import SignupPage from './Pages/User/SignupPage';
import "./index.css"
import OtpPage from './Pages/User/OtpPage';
import HomePage from './Pages/User/HomePage';

function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route path='/login' element={<LoginPage />} />

          <Route path='/signup' element={<SignupPage />} />

          <Route path='/otp' element={<OtpPage />} />

          <Route path='/' element={<HomePage />} />

        </Routes>
      </Router>
    </>
  )
}

export default App