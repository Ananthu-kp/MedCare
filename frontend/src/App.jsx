import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LoginPage from './Pages/User/LoginPage';
import SignupPage from './Pages/User/SignupPage';
import "./index.css"
import OtpPage from './Pages/User/OtpPage';
import HomePage from './Pages/User/HomePage';
import ProtectedRoute from './Components/Users/Protected/ProtectedRoute';
import GuestRoute from './Components/Users/Protected/GuestRoute';
import OtpProtect from './Components/Users/Protected/OtpProtect';
import LoginPageAdmin from './Pages/Admin/LoginPageAdmin';
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage';
import ProtectAdmin from './Components/Admin/ProtectAdmin';
import UsersListPage from './Pages/Admin/UsersListPage';


function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route path="/signup" element={<GuestRoute element={SignupPage} />} />
          <Route path="/login" element={<GuestRoute element={LoginPage} />} />
          <Route path="/otp" element={<OtpProtect element={OtpPage} />} />
          <Route path='/' element={<ProtectedRoute element={HomePage} />} />


          <Route path='/admin/login' element={<LoginPageAdmin />} />
          <Route path='/admin' element={<ProtectAdmin element={AdminDashboardPage} />} />
          <Route path='/admin/users' element={<ProtectAdmin element={UsersListPage} />} />

        </Routes>
      </Router>
    </>
  )
}

export default App