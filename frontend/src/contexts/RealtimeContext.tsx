import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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

interface RealtimeContextValue {
  data: RealtimeData;
  isLoading: boolean;
  error: Error | null;
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

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

export const RealtimeProvider = ({ children }: RealtimeProviderProps) => {
  const [data, setData] = useState<RealtimeData>(generateRandomData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const newData = generateRandomData();
        setData(newData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialData();

    // Uppdatera data var 30:e sekund
    const interval = setInterval(() => {
      void loadInitialData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Ett fel uppstod</h3>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <RealtimeContext.Provider value={{ data, isLoading, error }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (): RealtimeContextValue => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
