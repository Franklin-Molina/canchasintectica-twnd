import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import CourtTable from '../../components/dashboard/CourtTable.jsx'; // Importar el nuevo componente CourtTable
import Spinner from '../../components/common/Spinner.jsx'; // Importar Spinner
import { useManageCourtsLogic } from '../../hooks/courts/useManageCourtsLogic.js'; // Importar el hook de lógica

function DashboardOverviewPage() {
  const { courts, loading, error, handleOpenModal } = useManageCourtsLogic();
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleCreateCourtClick = () => {
    navigate('/dashboard/canchas/create'); // Redirigir a la ruta de creación de cancha
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error.message}</div>;

  return (
    <>
      {/* Stats */}
      <div className="stats-row">
          <div className="stat-card">
              <div className="stat-header">
                  <div className="stat-title">INGRESOS TOTALES</div>
                  <div className="stat-icon icon-revenue">
                      <i className="fas fa-dollar-sign"></i>
                  </div>
              </div>
              <div className="stat-value">$24,580</div>
              <div className="stat-change">
                  <span className="stat-up"><i className="fas fa-arrow-up"></i> 8.5%</span>
                  desde el mes pasado
              </div>
          </div>

          <div className="stat-card">
              <div className="stat-header">
                  <div className="stat-title">NUEVOS USUARIOS</div>
                  <div className="stat-icon icon-users">
                      <i className="fas fa-users"></i>
                  </div>
              </div>
              <div className="stat-value">1,245</div>
              <div className="stat-change">
                  <span className="stat-up"><i className="fas fa-arrow-up"></i> 12.3%</span>
                  desde el mes pasado
              </div>
          </div>

          <div className="stat-card">
              <div className="stat-header">
                  <div className="stat-title">ÓRDENES</div>
                  <div className="stat-icon icon-orders">
                      <i className="fas fa-shopping-bag"></i>
                  </div>
              </div>
              <div className="stat-value">586</div>
              <div className="stat-change">
                  <span className="stat-down"><i className="fas fa-arrow-down"></i> 3.2%</span>
                  desde el mes pasado
              </div>
          </div>

          <div className="stat-card">
              <div className="stat-header">
                  <div className="stat-title">CRECIMIENTO</div>
                  <div className="stat-icon icon-growth">
                      <i className="fas fa-chart-line"></i>
                  </div>
              </div>
              <div className="stat-value">15.8%</div>
              <div className="stat-change">
                  <span className="stat-up"><i className="fas fa-arrow-up"></i> 5.7%</span>
                  desde el mes pasado
              </div>
          </div>
      </div>

      {/* Sección de Gestión de Canchas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Gestión de Canchas</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Administra y controla tus espacios deportivos</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filtrar
            </button>
            <button
              onClick={handleCreateCourtClick} // Asignar la función al botón
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nueva Cancha
            </button>
          </div>
        </div>
        <CourtTable courts={courts} onOpenModal={handleOpenModal} />
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Mostrando {courts.length} de {courts.length} canchas</p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Anterior
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardOverviewPage;
