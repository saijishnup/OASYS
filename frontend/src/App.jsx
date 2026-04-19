import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Fintech from './pages/Fintech'
import RealEstate from './pages/RealEstate'
import Telecom from './pages/Telecom'
import Logistics from './pages/Logistics'
import Energy from './pages/Energy'
import Automobiles from './pages/Automobiles'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

const Layout = ({ children }) => (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </div>
)

const App = () => {
    const { user } = useAuth()

    return (
        <Routes>
            {/* Public */}
            <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* Protected */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Layout><Dashboard /></Layout>
                </PrivateRoute>
            } />
            <Route path="/fintech" element={
                <PrivateRoute>
                    <Layout><Fintech /></Layout>
                </PrivateRoute>
            } />
            <Route path="/realestate" element={
                <PrivateRoute>
                    <Layout><RealEstate /></Layout>
                </PrivateRoute>
            } />
            <Route path="/telecom" element={
                <PrivateRoute>
                    <Layout><Telecom /></Layout>
                </PrivateRoute>
            } />
            <Route path="/logistics" element={
                <PrivateRoute>
                    <Layout><Logistics /></Layout>
                </PrivateRoute>
            } />
            <Route path="/energy" element={
                <PrivateRoute>
                    <Layout><Energy /></Layout>
                </PrivateRoute>
            } />
            <Route path="/automobiles" element={
                <PrivateRoute>
                    <Layout><Automobiles /></Layout>
                </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App