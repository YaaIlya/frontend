import Home from './components/home'
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import VirtualCard from './components/home';
import AdminDashboard from './components/admin-dashboard';
import SuperAdminDashboard from './components/superadmin-dashboard';
import axios from "axios";

function App() {
  console.log('API_SERVER_URL', process.env.REACT_APP_API_SERVER_URL)
  axios.defaults.baseURL = process.env.REACT_APP_API_SERVER_URL
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<VirtualCard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
        {/* <Route element={<PrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route> */}
        <Route path="login" element={<AuthRootComponent />} />
        <Route path="register" element={<AuthRootComponent />} />
      </Routes>
    </div>
  );
}

export default App;
