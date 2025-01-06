import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const AuthContext = createContext();

// Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    usuario: null,
  });

  // Cargar el estado de autenticación desde localStorage al iniciar
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    if (storedAuth && storedAuth.token) {
      setAuth(storedAuth);
    }
  }, []);

  // Función para iniciar sesión
  const loginUser = (data) => {
    setAuth({
      token: data.token,
      usuario: data.usuario,
    });
    localStorage.setItem('auth', JSON.stringify({
      token: data.token,
      usuario: data.usuario,
    }));
  };

  // Función para cerrar sesión
  const logoutUser = () => {
    setAuth({
      token: null,
      usuario: null,
    });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, loginUser, logoutUser, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
