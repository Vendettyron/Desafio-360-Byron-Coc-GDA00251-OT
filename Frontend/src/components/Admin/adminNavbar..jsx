import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin">Admin Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" 
                aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/proveedores">Proveedores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/estados">Estados</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/pedidos">Pedidos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/categorias">Categorías</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/usuarios">Usuarios</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
