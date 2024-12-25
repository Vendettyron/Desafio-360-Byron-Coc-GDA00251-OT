import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHome from '../../components/Admin/AdminHome'; // Componente principal del Admin
import Proveedores from '../../components/Admin/Proveedores/Proveedores'; // Componente de Proveedores
import ActualizarProveedor from '../../components/Admin/Proveedores/ActualizarProveedor'; // Componente de Actualizar Proveedor
import proeveedoresPrueba from '../../components/Admin/Proveedores/proeveedoresPrueba'; // Componente de Proveedores Prueba


const AdminLayout = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="proveedores" element={<Proveedores/>} />
          <Route path="proveedores/actualizar/:id" element={<ActualizarProveedor />} />
        </Routes>
      
    </>
  );
};

export default AdminLayout;
