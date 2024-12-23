import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { auth,loading } = useContext(AuthContext);

  if (loading) {
    // Puedes mostrar un spinner o un mensaje de carga mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }

  if (roles && !roles.includes(auth.usuario.fk_rol)) {
    // Si el usuario no tiene el rol adecuado, redirigir al inicio o mostrar un error
    return <Navigate to="/rol eequivocado" replace />;
  }

  // Si cumple con los requisitos, renderizar el componente hijo
  return <Outlet />;
};

export default ProtectedRoute;

