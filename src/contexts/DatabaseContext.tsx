import React, { createContext, useContext, useState, useEffect } from 'react';

export type DatabaseType = 'shahi' | 'elite';

interface DatabaseContextType {
  databaseType: DatabaseType;
  setDatabaseType: (type: DatabaseType) => void;
  getTablePrefix: () => string;
  getTableName: (baseTable: string) => string;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [databaseType, setDatabaseType] = useState<DatabaseType>('elite');

  // Load database type from localStorage on mount
  useEffect(() => {
    const savedType = localStorage.getItem('databaseType') as DatabaseType;
    if (savedType && (savedType === 'shahi' || savedType === 'elite')) {
      setDatabaseType(savedType);
    }
  }, []);

  // Save database type to localStorage when it changes
  const handleSetDatabaseType = (type: DatabaseType) => {
    setDatabaseType(type);
    localStorage.setItem('databaseType', type);
  };

  const getTablePrefix = () => {
    return databaseType === 'elite' ? 'elite_' : '';
  };

  const getTableName = (baseTable: string) => {
    return `${getTablePrefix()}${baseTable}`;
  };

  const value: DatabaseContextType = {
    databaseType,
    setDatabaseType: handleSetDatabaseType,
    getTablePrefix,
    getTableName,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
