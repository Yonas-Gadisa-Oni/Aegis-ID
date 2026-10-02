import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

import Layout from './components/Layout';

import Login from './pages/Login';

import StudentDashboard from './pages/student/Dashboard';
import DigitalID from './pages/student/DigitalID';
import StudentPermissions from './pages/student/Permissions';

import AdminDashboard from './pages/admin/Dashboard';
import AdminPermissions from './pages/admin/Permissions';
import Students from './pages/admin/Students';
import Monitoring from './pages/admin/Monitoring';
import Access from './pages/admin/Access';
import Alerts from './pages/admin/Alerts';

import Gateway from './pages/gateway/Dashboard';
import Activity from './pages/gateway/Activity';

import RegistrarDashboard from './pages/registrar/Dashboard';

import Notifications from './pages/Notifications';

import './styles/app.css';

function Protected({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        Loading Aegis ID…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    roles &&
    !roles.includes(user.user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  if (user.user.role === 'GATEWAY') {
    return <Navigate to="/gateway" replace />;
  }

  if (user.user.role === 'REGISTRAR') {
    return <Navigate to="/registrar" replace />;
  }

  return <Navigate to="/student" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >

            {/* Student */}

            <Route
              path="/student"
              element={
                <Protected roles={['STUDENT']}>
                  <StudentDashboard />
                </Protected>
              }
            />

            <Route
              path="/student/id"
              element={
                <Protected roles={['STUDENT']}>
                  <DigitalID />
                </Protected>
              }
            />

            <Route
              path="/student/permissions"
              element={
                <Protected roles={['STUDENT']}>
                  <StudentPermissions />
                </Protected>
              }
            />

            {/* Admin */}

            <Route
              path="/admin"
              element={
                <Protected roles={['ADMIN']}>
                  <AdminDashboard />
                </Protected>
              }
            />

            <Route
              path="/admin/permissions"
              element={
                <Protected roles={['ADMIN']}>
                  <AdminPermissions />
                </Protected>
              }
            />

            <Route
              path="/admin/students"
              element={
                <Protected roles={['ADMIN']}>
                  <Students />
                </Protected>
              }
            />

            <Route
              path="/admin/monitoring"
              element={
                <Protected roles={['ADMIN']}>
                  <Monitoring />
                </Protected>
              }
            />

            <Route
              path="/admin/access"
              element={
                <Protected roles={['ADMIN']}>
                  <Access />
                </Protected>
              }
            />

            <Route
              path="/admin/alerts"
              element={
                <Protected roles={['ADMIN']}>
                  <Alerts />
                </Protected>
              }
            />

            {/* Gateway */}

            <Route
              path="/gateway"
              element={
                <Protected
                  roles={['GATEWAY', 'ADMIN']}
                >
                  <Gateway />
                </Protected>
              }
            />

            <Route
              path="/gateway/activity"
              element={
                <Protected
                  roles={['GATEWAY', 'ADMIN']}
                >
                  <Activity />
                </Protected>
              }
            />

            {/* Registrar */}

            <Route
              path="/registrar"
              element={
                <Protected roles={['REGISTRAR']}>
                  <RegistrarDashboard />
                </Protected>
              }
            />

            {/* Notifications */}

            <Route
              path="/notifications"
              element={
                <Protected>
                  <Notifications />
                </Protected>
              }
            />

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}