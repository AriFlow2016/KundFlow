import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ChartData {
  name: string;
  leads?: number;
  qualified?: number;
  target?: number;
  actual?: number;
  value?: number;
}

interface RealtimeData {
  lastUpdate: Date;
  recentActivities: string[];
  stats: {
    newLeads: number;
    activeOpportunities: number;
    totalPipelineValue: number;
    averageDealSize: number;
    conversionRate: number;
    callsThisWeek: number;
  };
  charts: {
    leads: ChartData[];
    sales: ChartData[];
    conversion: ChartData[];
  };
}

const RealtimeContext = createContext<RealtimeData | undefined>(undefined);

// Simulerad data för demonstration
const generateRandomData = (): RealtimeData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun'];
  
  return {
    lastUpdate: new Date(),
    recentActivities: [
      'Ny lead skapad: Volvo AB',
      'Affärsmöjlighet uppdaterad: Scania Projekt',
      'Samtal loggat: 45 minuter med Ericsson',
      'Möte bokat: Atlas Copco nästa vecka',
      'Offert skickad: SKF Service',
    ],
    stats: {
      newLeads: Math.floor(Math.random() * 50) + 20,
      activeOpportunities: Math.floor(Math.random() * 30) + 10,
      totalPipelineValue: Math.floor(Math.random() * 5000000) + 1000000,
      averageDealSize: Math.floor(Math.random() * 500000) + 100000,
      conversionRate: Math.floor(Math.random() * 30) + 10,
      callsThisWeek: Math.floor(Math.random() * 50) + 20,
    },
    charts: {
      leads: months.map(month => ({
        name: month,
        leads: Math.floor(Math.random() * 50) + 20,
        qualified: Math.floor(Math.random() * 30) + 10,
      })),
      sales: months.map(month => ({
        name: month,
        target: 1000000,
        actual: Math.floor(Math.random() * 1200000) + 800000,
      })),
      conversion: months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 40) + 20,
      })),
    },
  };
};

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [data, setData] = useState<RealtimeData>(generateRandomData());

  useEffect(() => {
    // Uppdatera data var 30:e sekund
    const interval = setInterval(() => {
      setData(generateRandomData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RealtimeContext.Provider value={data}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime(): RealtimeData {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
