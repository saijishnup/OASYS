import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Fintech from './pages/Fintech'
import RealEstate from './pages/RealEstate'
import Telecom from './pages/Telecom'
import Logistics from './pages/Logistics'
import Energy from './pages/Energy'
import Automobiles from './pages/Automobiles'
import Users from './pages/Users'
import Logs from './pages/Logs'
import MonthlyReport from './pages/MonthlyReport'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Segments from './pages/Segments'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fintech" element={<Fintech />} />
            <Route path="/real-estate" element={<RealEstate />} />
            <Route path="/telecom" element={<Telecom />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/automobiles" element={<Automobiles />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/monthly-report" element={<MonthlyReport />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
