import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Enkla komponentimportationer
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/Leads/LeadsList';
import ContactsList from './pages/Contacts/ContactsList';
import AccountsList from './pages/Accounts/AccountsList';
import OpportunitiesList from './pages/Opportunities/OpportunitiesList';
import NotFound from './pages/NotFound';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsList />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/accounts" element={<AccountsList />} />
            <Route path="/opportunities" element={<OpportunitiesList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
