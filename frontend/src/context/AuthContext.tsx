// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authServices';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    employeeId: string;
    name: string;
    email: string;
    password: string;
    department?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message: string; userId: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for testing mode - Regular Employee
const MOCK_EMPLOYEE_USER: User = {
  id: 'test-employee-123',
  name: 'Test Employee',
  email: 'employee@bozemanhealth.org',
  role: 'employee', // Regular employee - can only browse and favorite
  employeeId: 'EMP001',
  department: 'Nursing',
  verified: true,
};

// You can switch to this admin user for testing admin features
const MOCK_ADMIN_USER: User = {
  id: 'test-admin-123',
  name: 'Admin User', 
  // Can change to 'MOCK_EMPLOYEE_USER' or 'Admin User' @ ln39
  email: 'admin@bozemanhealth.org',
  role: 'admin',
  employeeId: 'ADMIN001',
  department: 'Housing Administration',
  verified: true,
};

const TESTING_MODE = import.meta.env.VITE_TESTING_MODE === 'true';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      // TESTING MODE: Automatically log in with mock user
      if (TESTING_MODE) {
        // Use admin for testing admin features
        const testUser = MOCK_ADMIN_USER; // Change to MOCK_EMPLOYEE_USER for regular user testing
        console.log(`🧪 TESTING MODE ENABLED - Auto-logged in as ${testUser.role}`);
        setUser(testUser);
        setIsLoading(false);
        return;
      }

      // Normal mode: Check for token
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (data: {
    employeeId: string;
    name: string;
    email: string;
    password: string;
    department?: string;
    phone?: string;
  }) => {
    return await authService.register(data);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
