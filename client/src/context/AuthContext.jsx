import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('interviewiq_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize or verify session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('interviewiq_token');
      const storedUser = localStorage.getItem('interviewiq_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Try validating with /api/auth/me if online
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('interviewiq_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification fallback to stored user:', err.message);
        }
      } else {
        // Fallback default guest profile if no login exists yet, allowing instant testing
        const defaultGuest = {
          id: 1,
          name: 'Alex Mercer',
          email: 'alex.mercer@example.com',
          role: 'candidate',
          headline: 'Full Stack & Cloud Engineer in Training',
          target_domain: 'Full Stack Development',
          experience_level: 'Mid-Level',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          webcam_consent: true,
          mic_consent: true,
        };
        setUser(defaultGuest);
        localStorage.setItem('interviewiq_user', JSON.stringify(defaultGuest));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, token: authToken } = res.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('interviewiq_token', authToken);
      localStorage.setItem('interviewiq_user', JSON.stringify(loggedInUser));
      return { success: true, user: loggedInUser };
    } catch (err) {
      // Local demo fallback if backend is offline during initial test
      if (err.message.includes('Network Error') || !err.response) {
        const demoUser = {
          id: 1,
          name: email.split('@')[0],
          email,
          role: 'candidate',
          target_domain: 'Full Stack Development',
          experience_level: 'Mid-Level',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        };
        setUser(demoUser);
        localStorage.setItem('interviewiq_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      }
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed. Please verify credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { user: newUser, token: authToken } = res.data;
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('interviewiq_token', authToken);
      localStorage.setItem('interviewiq_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (err) {
      if (err.message.includes('Network Error') || !err.response) {
        const fallbackUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: 'candidate',
          target_domain: userData.target_domain || 'Full Stack Development',
          experience_level: 'Entry',
        };
        setUser(fallbackUser);
        localStorage.setItem('interviewiq_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser };
      }
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('interviewiq_token');
    localStorage.removeItem('interviewiq_user');
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('interviewiq_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
