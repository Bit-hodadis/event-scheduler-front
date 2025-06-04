import { useState, useCallback } from 'react';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  id: string;
  session: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem('user');
    const storedSession = localStorage.getItem('session');
    
    if (storedUser && storedSession) {
      const user = JSON.parse(storedUser);
      return {
        user,
        isAuthenticated: true,
      };
    }
    
    return {
      user: null,
      isAuthenticated: false,
    };
  });

  const login = useCallback(async (userData: User) => {
    try {
      // Store session in localStorage for persistence
      localStorage.setItem('session', userData.session);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setAuthState({ user: userData, isAuthenticated: true });
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear stored session and user data
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
  };
};
