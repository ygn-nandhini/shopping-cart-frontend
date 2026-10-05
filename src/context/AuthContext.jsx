import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  const [name, setName] = useState(localStorage.getItem('name'));

  const login = ({ access_token, user_id, name }) => {
    localStorage.setItem('token', access_token);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('name', name);

    setToken(access_token);
    setUserId(String(user_id));
    setName(name);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setName(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, name, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}