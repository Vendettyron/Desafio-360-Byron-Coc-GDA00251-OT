import React from 'react';
import AdminHomeButton from './adminHomeButton';

const AdminHome = () => {
  // Definir las tarjetas en un array para facilitar la iteración
  const adminHomeButtons = [
    {
      title: 'Proveedores',
      text: 'Gestionar proveedores',
      link: 'proveedores',
      bgColor: 'primary',
    },
    {
      title: 'Estados',
      text: 'Gestionar Estados del Sistema',
      link: '/admin/estados',
      bgColor: 'secondary',
    },
    {
      title: 'Pedidos',
      text: 'Ver pedidos pendientes de confirmar o cancelar',
      link: '/admin/pedidos',
      bgColor: 'success',
    },
    {
      title: 'Productos',
      text: 'Gestionar los productos',
      link: '/admin/productos',
      bgColor: 'danger',
    },
    {
      title: 'Categorías',
      text: 'Gestiona las categorías de los productos',
      link: '/admin/categorias',
      bgColor: 'warning',
    },
    {
      title: 'Usuarios',
      text: 'Gestiona los usuarios',
      link: '/admin/usuarios',
      bgColor: 'info',
    },
  ];

  return (
    <div>
      <h1>Panel de Administración</h1>
      <div className="row mt-4">

        {adminHomeButtons.map((card, index) => (
          <AdminHomeButton
            key={index}
            title={card.title}
            text={card.text}
            link={card.link}
            bgColor={card.bgColor}
          />
        ))}
        
      </div>
    </div>
  );
};

export default AdminHome;
