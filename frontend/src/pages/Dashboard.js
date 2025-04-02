import React from 'react';

const Dashboard = () => {
  // Mockdata som normalt skulle hämtas från backend
  const stats = {
    leads: 12,
    contacts: 45,
    opportunities: 8,
    totalRevenue: 145000,
    todaysCalls: 5
  };

  const recentActivities = [
    { id: 1, type: 'call', title: 'Samtal med Sven Svensson', time: '10:23' },
    { id: 2, type: 'opportunity', title: 'Ny affärsmöjlighet: Konsulttjänster AB', time: '09:15' },
    { id: 3, type: 'lead', title: 'Ny lead: Teknikbolaget', time: 'Igår 16:45' },
  ];

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="card">
          <h2>Leads</h2>
          <div className="stat-number">{stats.leads}</div>
        </div>
        
        <div className="card">
          <h2>Kontakter</h2>
          <div className="stat-number">{stats.contacts}</div>
        </div>
        
        <div className="card">
          <h2>Affärsmöjligheter</h2>
          <div className="stat-number">{stats.opportunities}</div>
        </div>
        
        <div className="card">
          <h2>Säljvärde</h2>
          <div className="stat-number">{stats.totalRevenue.toLocaleString()} kr</div>
        </div>
      </div>
      
      <div className="card">
        <h2>Senaste aktiviteter</h2>
        <ul className="activity-list">
          {recentActivities.map(activity => (
            <li key={activity.id} className="list-item">
              {activity.type === 'call' && '📞 '}
              {activity.type === 'opportunity' && '💰 '}
              {activity.type === 'lead' && '🔍 '}
              {activity.title} - <small>{activity.time}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
