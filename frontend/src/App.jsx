import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RepositoryProvider } from './presentation/context/RepositoryContext.jsx';
import { UseCaseProvider } from './presentation/context/UseCaseContext.jsx';
import { NotificationProvider, useNotification } from './presentation/context/NotificationContext.jsx';
import { useBookingNotifier } from './presentation/hooks/bookings/useBookingNotifier.js';
import Notification from './presentation/components/common/Notification.jsx';
import HomePage from './presentation/pages/general/HomePage.jsx'; // Ruta actualizada
import RegisterPage from './presentation/components/Auth/RegisterPage.jsx'; // Se mantiene en components/Auth
import BookingPage from './presentation/pages/bookings/BookingPage.jsx'; // Ruta actualizada
import ProtectedRoute from './presentation/components/Auth/ProtectedRoute.jsx';
import AuthPage from './presentation/components/Auth/AuthPage.jsx';
import AdminRegisterPage from './presentation/components/Auth/AdminRegisterPage.jsx';
import Layout from './presentation/components/common/Layout.jsx';
import DashboardLayout from './presentation/components/Dashboard/DashboardLayout.jsx';
import DashboardOverviewPage from './presentation/pages/dashboard/overview/DashboardOverviewPage.jsx'; // Ruta actualizada
import DashboardCourtsPage from './presentation/pages/dashboard/courts/DashboardCourtsPage.jsx'; // Ruta actualizada
import DashboardManageCourtsPage from './presentation/pages/dashboard/courts/DashboardManageCourtsPage.jsx'; // Ruta actualizada
import CourtDetailPage from './presentation/pages/courts/CourtDetailPage.jsx'; // Ruta actualizada
import DashboardBookingsPage from './presentation/pages/dashboard/bookings/DashboardBookingsPage.jsx'; // Ruta actualizada
import BookingHistoryPage from './presentation/pages/dashboard/bookings/BookingHistoryPage.jsx'; // Nueva importación
import DashboardProfilePage from './presentation/pages/dashboard/users/DashboardProfilePage.jsx'; // Ruta actualizada
import DashboardUsersPage from './presentation/pages/dashboard/users/DashboardUsersPage.jsx'; // Ruta actualizada
import DashboardModifyCourtPage from './presentation/pages/dashboard/courts/DashboardModifyCourtPage.jsx'; // Ruta actualizada
import AdminGlobalDashboardPage from './presentation/pages/dashboard/admin/AdminGlobalDashboardPage.jsx'; // Ruta actualizada
import ManageAdminsTable from './presentation/components/AdminGlobalDashboard/ManageAdminsTable.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientDashboardLayout from './presentation/components/Dashboard/ClientDashboardLayout.jsx';
import MyBookingsPage from './presentation/pages/bookings/MyBookingsPage.jsx'; // Ruta actualizada
import OpenMatchesPage from './presentation/pages/Matches/OpenMatchesPage.jsx';
import { AuthProvider, useAuth } from './presentation/context/AuthContext.jsx'; // Importar AuthProvider y useAuth
import Spinner from './presentation/components/common/Spinner.jsx'; // Importar Spinner

function App() {
  return (
    <RepositoryProvider>
      <UseCaseProvider>
        <NotificationProvider>
          <AuthProvider>
            <GlobalNotificationHandler />
            <AuthContent />
          </AuthProvider>
        </NotificationProvider>
      </UseCaseProvider>
      <ToastContainer position="top-right" autoClose={1500} />
    </RepositoryProvider>
  );
}

// Componente para manejar la lógica de notificaciones globales
function GlobalNotificationHandler() {
  useBookingNotifier(); // Este hook ejecuta la lógica de notificación en segundo plano
  const { notification } = useNotification();
  return <Notification message={notification} />;
}

// Componente auxiliar para manejar el contenido condicional basado en el estado de carga de autenticación
function AuthContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="canchas/manage" element={<DashboardManageCourtsPage />} />
        <Route path="canchas/create" element={<DashboardCourtsPage />} />
        <Route path="reservas" element={<DashboardBookingsPage />} />
        <Route path="reservas/historial" element={<BookingHistoryPage />} />
        <Route path="usuarios" element={<DashboardUsersPage />} />
        <Route path="perfil" element={<DashboardProfilePage />} /> {/* Usar DashboardProfilePage */}
        {/* Ruta para la página de modificación de canchas */}
        <Route path="manage-courts/:id" element={<DashboardModifyCourtPage />} />
      </Route>

      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <ClientDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MyBookingsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="history" element={<BookingHistoryPage />} />
        <Route path="matches" element={<OpenMatchesPage />} />
        <Route path="profile" element={<DashboardProfilePage />} />
      </Route>

      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/courts/:courtId"
        element={
          <Layout>
            <CourtDetailPage />
          </Layout>
        }
      />
      <Route
        path="/booking/:courtId"
        element={
          <ProtectedRoute>
            <Layout>
              <BookingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminglobal"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path=""
          element={<AdminGlobalDashboardPage />}
        >
          <Route index element={<ManageAdminsTable />} />
          <Route path="manage-admins" element={<ManageAdminsTable />} />
          <Route path="register-admin" element={<AdminRegisterPage />} />
        </Route>
        <Route path="profile" element={<DashboardProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
