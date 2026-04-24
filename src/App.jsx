import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admins from './pages/Admins';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside DashboardLayout */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          
          <Route path="/admins" element={
            <RoleRoute allowedRoles={['super_admin']}>
              <Admins />
            </RoleRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
