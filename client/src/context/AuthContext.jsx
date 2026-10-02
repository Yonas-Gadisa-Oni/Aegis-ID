import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '../services/api';

const C = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('aegis_user') || 'null'
      );
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('aegis_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');

        setUser(response.data);

        localStorage.setItem(
          'aegis_user',
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error('Session check failed:', error);

        localStorage.removeItem('aegis_token');
        localStorage.removeItem('aegis_user');

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      // First authenticate
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error('Login succeeded but no token was returned.');
      }

      // Save token temporarily
      localStorage.setItem('aegis_token', token);

      // Get the authenticated user's information
      const meResponse = await api.get('/auth/me');

      const authenticatedUser = meResponse.data;

      // Save user information
      localStorage.setItem(
        'aegis_user',
        JSON.stringify(authenticatedUser)
      );

      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      console.error('Login failed:', error);

      // Remove possibly invalid session
      localStorage.removeItem('aegis_token');
      localStorage.removeItem('aegis_user');

      setUser(null);

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('aegis_token');
    localStorage.removeItem('aegis_user');

    setUser(null);
  };

  return (
    <C.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);