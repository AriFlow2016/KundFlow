import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaUsers, FaChartLine, FaCalendar, FaCog } from 'react-icons/fa';
import { RealtimeProvider } from './contexts/RealtimeContext';
import Prospects from './pages/Prospects';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <RealtimeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 bg-gray-900">
                <h1 className="text-white text-xl font-bold">KundFlow</h1>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-white bg-gray-900 rounded-md"
                >
                  <FaUsers className="mr-3" />
                  Prospekt
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <FaChartLine className="mr-3" />
                  Analys
                </Link>
                <Link
                  to="/calendar"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <FaCalendar className="mr-3" />
                  Kalender
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <FaCog className="mr-3" />
                  Inställningar
                </Link>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="pl-64">
            <Routes>
              <Route path="/" element={<Prospects />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </RealtimeProvider>
  );
}

export default App;
