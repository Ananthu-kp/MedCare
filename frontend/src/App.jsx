import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LoginPage from './Pages/User/LoginPage';
import SignupPage from './Pages/User/SignupPage';
import "./index.css"
import OtpPage from './Pages/User/OtpPage';
import HomePage from './Pages/User/HomePage';
import ProtectedRoute from './Components/Users/Protected/ProtectedRoute';
import GuestRoute from './Components/Users/Protected/GuestRoute';
import OtpProtect from './Components/Users/Protected/OtpProtect';


function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route path="/signup" element={<GuestRoute element={SignupPage} />} />
          <Route path="/login" element={<GuestRoute element={LoginPage} />} />
          <Route path="/otp" element={<OtpProtect element={OtpPage} />} />
          <Route path='/' element={<ProtectedRoute element={HomePage} />} />

        </Routes>
      </Router>
    </>
  )
}

export default App