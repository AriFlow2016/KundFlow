import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBuilding, FaChartLine } from 'react-icons/fa';

// Importera AdminLTE CSS och JS
import 'admin-lte/dist/css/adminlte.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AdminLayout.css';

// Importera jQuery globalt
import $ from 'jquery';
window.jQuery = window.$ = $;

// Importera AdminLTE
import 'admin-lte';

export default function AdminLayout() {
  useEffect(() => {
    // Lägg till AdminLTE-klasser på body-elementet
    document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed');

    // Initiera AdminLTE när komponenten monteras
    const initAdminLTE = async () => {
      try {
        const pushMenu = $('[data-widget="pushmenu"]');
        if (pushMenu.length) {
          pushMenu.on('click', function(e) {
            e.preventDefault();
            $('body').toggleClass('sidebar-collapse');
          });
        }
      } catch (error) {
        console.error('Error initializing AdminLTE:', error);
      }
    };

    initAdminLTE();

    // Cleanup när komponenten unmountas
    return () => {
      document.body.classList.remove('hold-transition', 'sidebar-mini', 'layout-fixed');
    };
  }, []);

  return (
    <div className="wrapper">
      {/* Huvudnavigering */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
      </nav>

      {/* Sidomenyn */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <Link to="/" className="brand-link">
          <span className="brand-text font-weight-light">KundFlow CRM</span>
        </Link>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <FaTachometerAlt className="nav-icon" />
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contacts" className="nav-link">
                  <FaUsers className="nav-icon" />
                  <p>Kontakter</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/accounts" className="nav-link">
                  <FaBuilding className="nav-icon" />
                  <p>Konton</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/opportunities" className="nav-link">
                  <FaChartLine className="nav-icon" />
                  <p>Affärsmöjligheter</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Huvudinnehåll */}
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
