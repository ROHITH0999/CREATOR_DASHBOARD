import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

type CreditHistoryItem = {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  timestamp: Date;
};

type CreditContextType = {
  credits: number;
  creditHistory: CreditHistoryItem[];
  addCredits: (amount: number, reason: string) => void;
  earnDailyLoginCredits: () => void;
  earnProfileCompletionCredits: () => void;
  earnFeedInteractionCredits: () => void;
};

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [creditHistory, setCreditHistory] = useState<CreditHistoryItem[]>([]);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load credits from localStorage or initialize
      const savedCredits = localStorage.getItem(`credits_${user.id}`);
      if (savedCredits) {
        setCredits(JSON.parse(savedCredits));
      }

      // Load credit history from localStorage or initialize
      const savedHistory = localStorage.getItem(`creditHistory_${user.id}`);
      if (savedHistory) {
        setCreditHistory(JSON.parse(savedHistory));
      }

      // Check for daily login bonus
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem(`lastLogin_${user.id}`);
      setLastLoginDate(lastLogin);
      
      if (lastLogin !== today) {
        earnDailyLoginCredits();
        localStorage.setItem(`lastLogin_${user.id}`, today);
        setLastLoginDate(today);
      }
    }
  }, [isAuthenticated, user]);

  // Save changes to localStorage whenever credits or history changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`credits_${user.id}`, JSON.stringify(credits));
      localStorage.setItem(`creditHistory_${user.id}`, JSON.stringify(creditHistory));
    }
  }, [credits, creditHistory, user]);

  const addCredits = (amount: number, reason: string) => {
    if (!user) return;

    setCredits(prev => prev + amount);
    
    const historyItem: CreditHistoryItem = {
      id: Date.now().toString(),
      userId: user.id,
      amount,
      reason,
      timestamp: new Date()
    };
    
    setCreditHistory(prev => [historyItem, ...prev]);
  };

  const earnDailyLoginCredits = () => {
    addCredits(10, 'Daily login bonus');
  };

  const earnProfileCompletionCredits = () => {
    addCredits(50, 'Profile completion bonus');
  };

  const earnFeedInteractionCredits = () => {
    addCredits(5, 'Feed interaction');
  };

  return (
    <CreditContext.Provider value={{
      credits,
      creditHistory,
      addCredits,
      earnDailyLoginCredits,
      earnProfileCompletionCredits,
      earnFeedInteractionCredits
    }}>
      {children}
    </CreditContext.Provider>
  );
};