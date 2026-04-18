import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';
import Segments from './pages/Segments';
import Logs from './pages/Logs';
import MonthlyReport from './pages/MonthlyReport';
import Fintech from './pages/Fintech';
import RealEstate from './pages/RealEstate';
import Telecom from './pages/Telecom';
import Logistics from './pages/Logistics';
import Energy from './pages/Energy';
import Automobiles from './pages/Automobiles';

function AppContent() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <div className="w-full">
        <div className="w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
              <Route path="/segments" element={<PrivateRoute><Segments /></PrivateRoute>} />
              <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
              <Route path="/monthly-report" element={<PrivateRoute><MonthlyReport /></PrivateRoute>} />
              <Route path="/fintech" element={<PrivateRoute><Fintech /></PrivateRoute>} />
              <Route path="/realestate" element={<PrivateRoute><RealEstate /></PrivateRoute>} />
              <Route path="/telecom" element={<PrivateRoute><Telecom /></PrivateRoute>} />
              <Route path="/logistics" element={<PrivateRoute><Logistics /></PrivateRoute>} />
              <Route path="/energy" element={<PrivateRoute><Energy /></PrivateRoute>} />
              <Route path="/automobiles" element={<PrivateRoute><Automobiles /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
  
  function App() {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }
  
  export default App;
