import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Customers } from './pages/Customers';
import { Leads } from './pages/Leads';
import { Settings } from './pages/Settings';
import { RealtimeProvider } from './contexts/RealtimeContext';
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
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/" element={<Customers />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </RealtimeProvider>
  );
}

export default App;
