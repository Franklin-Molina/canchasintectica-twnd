import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RepositoryProvider } from './presentation/context/RepositoryContext.jsx';
import { UseCaseProvider } from './presentation/context/UseCaseContext.jsx';
import HomePage from './presentation/pages/general/HomePage.jsx'; // Ruta actualizada
import RegisterPage from './presentation/components/Auth/RegisterPage.jsx'; // Se mantiene en components/Auth
import BookingPage from './presentation/pages/bookings/BookingPage.jsx'; // Ruta actualizada
import ProtectedRoute from './presentation/components/Auth/ProtectedRoute.jsx';
import AuthPage from './presentation/components/Auth/AuthPage.jsx';
import AdminRegisterPage from './presentation/components/Auth/AdminRegisterPage.jsx';
import Layout from './presentation/components/common/Layout.jsx';
import DashboardLayout from './presentation/components/Dashboard/DashboardLayout.jsx';
import DashboardOverviewPage from './presentation/pages/dashboard/DashboardOverviewPage.jsx'; // Ruta actualizada
import DashboardCourtsPage from './presentation/pages/dashboard/courts/DashboardCourtsPage.jsx'; // Ruta actualizada
import DashboardManageCourtsPage from './presentation/pages/dashboard/courts/DashboardManageCourtsPage.jsx'; // Ruta actualizada
import CourtDetailPage from './presentation/pages/courts/CourtDetailPage.jsx'; // Ruta actualizada
import DashboardBookingsPage from './presentation/pages/dashboard/bookings/DashboardBookingsPage.jsx'; // Ruta actualizada
import DashboardProfilePage from './presentation/pages/dashboard/users/DashboardProfilePage.jsx'; // Ruta actualizada
import DashboardUsersPage from './presentation/pages/dashboard/users/DashboardUsersPage.jsx'; // Ruta actualizada
import DashboardModifyCourtPage from './presentation/pages/dashboard/courts/DashboardModifyCourtPage.jsx'; // Ruta actualizada
import AdminGlobalDashboardPage from './presentation/pages/dashboard/admin/AdminGlobalDashboardPage.jsx'; // Ruta actualizada
import ManageAdminsTable from './presentation/components/AdminGlobalDashboard/ManageAdminsTable.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientDashboardLayout from './presentation/components/Dashboard/ClientDashboardLayout.jsx';
import MyBookingsPage from './presentation/pages/bookings/MyBookingsPage.jsx'; // Ruta actualizada
import BookingHistoryPage from './presentation/pages/bookings/BookingHistoryPage.jsx'; // Ruta actualizada
import OpenMatchesPage from './presentation/pages/Matches/OpenMatchesPage.jsx';

function App() {
  return (
    <RepositoryProvider>
      <UseCaseProvider>
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
          path="/login"
          element={
            <Layout>
              <AuthPage />
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
              <AdminGlobalDashboardPage /> {/* Este es ahora el layout */}
            </ProtectedRoute>
          }
        >
          {/* Ruta índice para el dashboard adminglobal, podría ser un resumen o la gestión de admins */}
          <Route index element={<ManageAdminsTable />} /> {/* Mostrar tabla de admins por defecto */}
          <Route path="manage-admins" element={<ManageAdminsTable />} />
          <Route path="profile" element={<DashboardProfilePage />} /> {/* Perfil dentro del layout adminglobal */}
          <Route path="register-admin" element={<AdminRegisterPage />} /> {/* Registrar admin dentro del layout adminglobal */}
        </Route>
      </Routes>
      </UseCaseProvider>
      <ToastContainer position="top-right" autoClose={1500} /> {/* Componente para mostrar las notificaciones */}
    </RepositoryProvider>
  );
}

export default App;
