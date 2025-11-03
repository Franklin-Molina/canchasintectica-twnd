import React from "react";
import { useFetchClientBookings } from "../../hooks/bookings/useFetchClientBookings";
import Spinner from "../../components/common/Spinner";

const BookingHistoryPage = () => {
  const { bookings, loading, error } = useFetchClientBookings();

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-600 dark:text-red-400 font-medium">
        Error al cargar el historial de reservas: {error.message}
      </div>
    );

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.start_time) < new Date()
  );

  return (
    <div className="min-h-screen w-full px-6 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* --- Título --- */}
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Historial de Reservas
      </h2>

      {/* --- Contenido --- */}
      {pastBookings.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pastBookings.map((booking) => (
            <li
              key={booking.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  {booking.court_details.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fecha:</span>{" "}
                  {new Date(booking.start_time).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Hora:</span>{" "}
                  {new Date(booking.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Estado */}
                <div className="mt-3">
                  <span className="inline-block bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    Finalizada
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No tienes reservas pasadas.
          </p>
          <div className="mt-4 text-4xl">📅</div>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
