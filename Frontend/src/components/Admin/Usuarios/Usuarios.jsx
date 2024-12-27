import React, { useEffect, useState } from 'react';
import { obtenerUsuarios, activarUsuario, inactivarUsuario } from '@/services/usuariosService';
import { Link } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =============== 1. Fetch de usuarios al montar el componente =============== //
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        console.log('Iniciando solicitud para obtener usuarios...');
        const usuariosData = await obtenerUsuarios();
        console.log('Usuarios obtenidos:', usuariosData);
        setUsuarios(usuariosData);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('No se pudieron obtener los usuarios. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // =============== 2. Funciones para activar/inactivar =============== //
  const handleActivate = async (id) => {
    try {
      await activarUsuario(id);
      const updatedData = await obtenerUsuarios();
      setUsuarios(updatedData);
    } catch (err) {
      console.error('Error al activar usuario:', err);
      setError('Error al activar el usuario.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarUsuario(id);
      const updatedData = await obtenerUsuarios();
      setUsuarios(updatedData);
    } catch (err) {
      console.error('Error al inactivar usuario:', err);
      setError('Error al inactivar el usuario.');
    }
  };

  // =============== 3. Renderizado condicional =============== //
  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  // =============== 4. Configurar Columns de Data Tables =============== //
  const columns = [
    {
      name: 'ID',
      selector: row => row.pk_id_usuario,
      cell: row => <p>{row.pk_id_usuario}</p>,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      cell: row => <p>{row.nombre}</p>,
      sortable: true,
    },
    {
      name: 'Apellido',
      selector: row => row.apellido,
      cell: row => <p>{row.apellido}</p>,
      sortable: true,
    },
    {
      name: 'Dirección',
      selector: row => row.direccion,
      cell: row => <p>{row.direccion}</p>,
      sortable: true,
    },
    {
      name: 'Correo',
      selector: row => row.correo,
      cell: row => <p>{row.correo}</p>,
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: row => row.telefono,
      cell: row => <p>{row.telefono}</p>,
      sortable: true,
    },
    {
      name: 'Rol',
      selector: row => (row.fk_rol === 1 ? 'Administrador' : 'Cliente'),
      cell: row => (row.fk_rol === 1 ? 'Administrador' : 'Cliente'),
      sortable: true,
    },
    {
      name: 'Estado',
      selector: row => (row.fk_estado === 1 ? 'Activo' : 'Inactivo'),
      cell: row => (row.fk_estado === 1 ? 'Activo' : 'Inactivo'),
      sortable: true,
      ignoreExport: true,
    },
    {
      name: 'Acción',
      cell: (row) =>
        row.fk_estado === 1 ? (
          <button onClick={() => handleInactivate(row.pk_id_usuario)}>Inactivar</button>
        ) : (
          <button onClick={() => handleActivate(row.pk_id_usuario)}>Activar</button>
        ),
      ignoreExport: true,
      cellExport: row => ({}), // No exportar este campo
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/usuarios/actualizar/${row.pk_id_usuario}`}>Editar</Link>
      ),
      cellExport: row => ({}), // No exportar este campo
    },
  ];

  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }

  // =============== 5. Personalizar Tabla =============== //
  createTheme(
    'custom',
    {
      text: {
        primary: '#268bd2',
        secondary: '#2aa198',
      },
      background: {
        default: '#002b36',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      button: {
        default: '#2aa198',
        hover: 'rgba(0,0,0,.08)',
        focus: 'rgba(255,255,255,.12)',
        disabled: 'rgba(255, 255, 255, .34)',
      },
      sortFocus: {
        default: '#2aa198',
      },
    },
    'dark',
  );

  const tableData = {
    columns,
    data: usuarios,
  };

  // =============== 6. Mostrar los datos en Data Tables =============== //
  return (
    <>
      <h2 className='text-3xl'>Gestión de Usuarios</h2>

      <DataTableExtensions 
        {...tableData} 
        fileName="Usuarios Listado" 
        export={true}
        exportHeaders={true}
      >
        <DataTable
          columns={columns}
          data={usuarios}
          theme='custom'
          noHeader
          pagination
          highlightOnHover
        />
      </DataTableExtensions>
    </>
  );
};

export default Usuarios;
