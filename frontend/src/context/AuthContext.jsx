import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, updateProfileApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('newswave_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const { data } = await getMeApi();
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('[AuthContext] Session verification failed, logging out');
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    if (data.success) {
      localStorage.setItem('newswave_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  };

  const register = async (name, email, password) => {
    const { data } = await registerApi({ name, email, password });
    if (data.success) {
      localStorage.setItem('newswave_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('newswave_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await updateProfileApi(profileData);
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
