import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';
import Segments from './pages/Segments';
import Logs from './pages/Logs';
import MonthlyReport from './pages/MonthlyReport';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" />} />
        <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" />} />
        <Route path="/segments" element={isLoggedIn ? <Segments /> : <Navigate to="/login" />} />
        <Route path="/logs" element={isLoggedIn ? <Logs /> : <Navigate to="/login" />} />
        <Route path="/monthly-report" element={isLoggedIn ? <MonthlyReport /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
