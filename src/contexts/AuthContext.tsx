import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export type User = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profileCompleted: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Mock: In a real app, verify the token with the backend
        const decoded = jwtDecode(token) as { user: User };
        setUser(decoded.user);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call: In a real app, this would call your backend API
      // const response = await api.post('/auth/login', { email, password });
      // const { token } = response.data;
      
      // Mock login response
      const mockResponse = await mockLoginAPI(email, password);
      const { token } = mockResponse;
      
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token) as { user: User };
      setUser(decoded.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      // const response = await api.post('/auth/register', { username, email, password });
      // const { token } = response.data;
      
      // Mock register response
      const mockResponse = await mockRegisterAPI(username, email, password);
      const { token } = mockResponse;
      
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token) as { user: User };
      setUser(decoded.user);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const completeProfile = async () => {
    if (!user) return;
    
    try {
      // Mock API call: In a real app, call your backend API
      // await api.put('/users/complete-profile');
      
      // Mock user update
      setUser({ ...user, profileCompleted: true });
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  // Mock API functions (replace with real API calls)
  const mockLoginAPI = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'admin@example.com' && password === 'password') {
      return {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicHJvZmlsZUNvbXBsZXRlZCI6dHJ1ZX19.8yF7MN5XnVJCTxBIHsLjtFXhBiGDgZoGKyM9HSRiGE4'
      };
    } else if (email === 'user@example.com' && password === 'password') {
      return {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMiIsInVzZXJuYW1lIjoidXNlciIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwicHJvZmlsZUNvbXBsZXRlZCI6ZmFsc2V9fQ.hIB1dohPmNa_D1zRDxQv0qZOHAZTR-Gj0C2lQYTlbZY'
      };
    } else {
      throw new Error('Invalid credentials');
    }
  };
  
  const mockRegisterAPI = async (username: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMyIsInVzZXJuYW1lIjoidXNlcm5hbWUiLCJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJwcm9maWxlQ29tcGxldGVkIjpmYWxzZX19.8yF7MN5XnVJCTxBIHsLjtFXhBiGDgZoGKyM9HSRiGE4'
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      completeProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};