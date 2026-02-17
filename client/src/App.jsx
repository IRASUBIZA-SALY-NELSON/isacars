import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import ImmersiveAuthPage from './pages/ImmersiveAuthPage';
import SplitAuthPage from './pages/SplitAuthPage';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RideHistory from './pages/RideHistory';
import RideDetails from './pages/RideDetails';
import WalletPayment from './pages/WalletPayment';
import Rewards from './pages/Rewards';
import DriverEarnings from './pages/DriverEarnings';
import DriverProfile from './pages/DriverProfile';
import DriverVehicle from './pages/DriverVehicle';

// Device Detection Component
const DeviceAuthPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile ? <ImmersiveAuthPage /> : <SplitAuthPage />;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#05C46B',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF3838',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <DeviceAuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <DeviceAuthPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Passenger */}
          <Route
            path="/passenger/dashboard"
            element={
              <ProtectedRoute requiredRole="passenger">
                <PassengerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passenger/ride-history"
            element={
              <ProtectedRoute requiredRole="passenger">
                <RideHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passenger/ride-details/:rideId"
            element={
              <ProtectedRoute requiredRole="passenger">
                <RideDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passenger/wallet"
            element={
              <ProtectedRoute requiredRole="passenger">
                <WalletPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passenger/rewards"
            element={
              <ProtectedRoute requiredRole="passenger">
                <Rewards />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Driver */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/history"
            element={
              <ProtectedRoute requiredRole="driver">
                <RideHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/vehicle"
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/ride-details/:rideId"
            element={
              <ProtectedRoute requiredRole="driver">
                <RideDetails />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
