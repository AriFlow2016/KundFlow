import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Customers } from './pages/Customers';
import { Leads } from './pages/Leads';
import { Settings } from './pages/Settings';
import { Opportunities } from './pages/Opportunities';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SiteLogin } from './pages/SiteLogin';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Något gick fel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {error.message}
        </p>
      </div>
      <div className="mt-8 space-y-6">
        <button
          onClick={resetErrorBoundary}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Försök igen
        </button>
      </div>
    </div>
  </div>
);

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <SiteLogin />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <RealtimeProvider>
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
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-blue-600">KundFlow</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/customers"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Kunder
                    </Link>
                    <Link
                      to="/leads"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Leads
                    </Link>
                    <Link
                      to="/opportunities"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Affärsmöjligheter
                    </Link>
                    <Link
                      to="/settings"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Inställningar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="py-10">
            <main>
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/" element={<Navigate to="/customers" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </RealtimeProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
