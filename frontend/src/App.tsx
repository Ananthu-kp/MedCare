import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './Pages/User/LoginPage';
import SignupPage from './Pages/User/SignupPage';
import './index.css';
import OtpPage from './Pages/User/OtpPage';
import HomePage from './Pages/User/HomePage';
import ProtectedRoute from './Components/Users/Protected/ProtectedRoute';
import GuestRoute from './Components/Users/Protected/GuestRoute';
import OtpProtect from './Components/Users/Protected/OtpProtect';
import LoginPageAdmin from './Pages/Admin/LoginPageAdmin';
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage';
import ProtectAdmin from './Components/Admin/AdminProtectors/ProtectAdmin';
import UsersListPage from './Pages/Admin/UsersListPage';
import DoctorLoginPage from './Pages/Doctor/DoctorLoginPage';
import DoctorRegisterPage from './Pages/Doctor/DoctorRegisterPage';
import Otp_Page from './Pages/Doctor/Otp_Page';
import DoctorsRequestPage from './Pages/Admin/DoctorsRequestPage';
import DoctorProfilePage from './Pages/Doctor/DoctorProfilePage';
import ProtectDoctor from './Components/Doctors/DoctorProtectors/ProtectDoctor';

// styles
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "sonner"
import DoctorsListPage from './Pages/Admin/DoctorsListPage';
import SpecializationPage from './Pages/Admin/SpecializationPage';
import UserForgotPass from './Components/Users/UserForgotPass';
import RecoverPassword from './Components/Users/RecoverPassword';
import DoctorForgotPage from './Pages/Doctor/DoctorForgotPage';
import RecoverPasswordPage from './Pages/Doctor/RecoverPasswordPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<GuestRoute element={SignupPage} />} />
          <Route path="/login" element={<GuestRoute element={LoginPage} />} />
          <Route path="/otp" element={<OtpProtect element={OtpPage} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot-password" element={<UserForgotPass />} />
          <Route path="/recover-password" element={<RecoverPassword />} />

          <Route path="/admin/login" element={<LoginPageAdmin />} />
          <Route path="/admin" element={<ProtectAdmin element={AdminDashboardPage} />} />
          <Route path="/admin/users" element={<ProtectAdmin element={UsersListPage} />} />
          <Route path="/admin/doctor-requests" element={<ProtectAdmin element={DoctorsRequestPage} />} />
          <Route path="/admin/doctors" element={<ProtectAdmin element={DoctorsListPage} />} />
          <Route path="/admin/categories" element={<ProtectAdmin element={SpecializationPage} />} />z

          <Route path="/doctor/login" element={<DoctorLoginPage />} />
          <Route path="/doctor/register" element={<DoctorRegisterPage />} />
          <Route path="/doctor/otp" element={<Otp_Page />} />
          <Route path="/doctor" element={<ProtectDoctor element={DoctorProfilePage} />} />
          <Route path="/doctor/forgot-password" element={<DoctorForgotPage />} />
          <Route path="/doctor/recover-password" element={<RecoverPasswordPage />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
