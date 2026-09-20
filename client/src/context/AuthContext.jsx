import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('craft_crumbs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('craft_crumbs_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Keep local storage synchronized
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('craft_crumbs_user', JSON.stringify(user));
      localStorage.setItem('craft_crumbs_token', token);
    } else {
      localStorage.removeItem('craft_crumbs_user');
      localStorage.removeItem('craft_crumbs_token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
      setToken(data.token);
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, phone, address }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
      setToken(data.token);
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('craft_crumbs_user');
    localStorage.removeItem('craft_crumbs_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
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
