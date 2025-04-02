import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/leads', icon: '🔍', label: 'Leads' },
    { path: '/contacts', icon: '👤', label: 'Kontakter' },
    { path: '/accounts', icon: '🏢', label: 'Konton' },
    { path: '/opportunities', icon: '💰', label: 'Affärsmöjligheter' },
    { path: '/cases', icon: '📝', label: 'Ärenden' },
    { path: '/call-logs', icon: '📞', label: 'Samtalslogg' },
    { path: '/reports', icon: '📈', label: 'Rapporter' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
