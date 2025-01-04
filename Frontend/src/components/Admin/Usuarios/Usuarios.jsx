import React, { useEffect, useState } from 'react';
import { obtenerUsuarios, activarUsuario, inactivarUsuario } from '@/services/usuariosService';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Estados from '@/config/estados';
import Roles from '@/config/roles';
import configureDataTableTheme from '@/config/dataTableTheme';
import toast from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';
import "styled-components"

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(20);

  // =============== 1. Fetch de usuarios al montar el componente =============== //
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setCargando(50);
        console.log('Iniciando solicitud para obtener usuarios...');
        const usuariosData = await obtenerUsuarios();
        console.log('Usuarios obtenidos:', usuariosData);
        setUsuarios(usuariosData);
        setCargando(80);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setError('No se pudieron obtener los usuarios. Intenta nuevamente más tarde.');
      } finally {
        setCargando(100);
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
      toast.success('¡Usuario activado exitosamente!');
    } catch (err) {
      console.error('Error al activar usuario:', err);
      setError('Error al activar el usuario.');
      toast.error('Error al activar el usuario.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarUsuario(id);
      const updatedData = await obtenerUsuarios();
      setUsuarios(updatedData);
      toast.success('¡Usuario inactivado exitosamente!');
    } catch (err) {
      console.error('Error al inactivar usuario:', err);
      setError('Error al inactivar el usuario.');
      toast.error('Error al inactivar el usuario.');
    }
  };

  // =============== 3. Renderizado condicional =============== //
  if (loading) {
     return (
         <Progress value={cargando} />
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
      selector: row => (row.fk_rol === Roles.ADMIN ? 'Administrador' : 'Cliente'),
      cell: row => (row.fk_rol === Roles.ADMIN ? 'Administrador' : 'Cliente'),
      sortable: true,
    },
    {
      name: 'Estado',
      selector: row => row.fk_estado,
      cell: row => {
        const estado = row.fk_estado;
        let estadoTexto = 'Desconocido';
        let className = '';
        switch (estado) {
          case Estados.ACTIVO:
            estadoTexto = 'Activo';
            className = 'badge-activo';
            break;
          case Estados.INACTIVO:
            estadoTexto = 'Inactivo';
            className = 'badge-inactivo';
            break;
          default:
            estadoTexto = Object.keys(Estados).find(key => Estados[key] === estado) || 'Desconocido';
            className = 'badge-desconocido';
        }
        return <span className={className}>{estadoTexto}</span>;
      },
      sortable: true,
    },
    {
      name: 'Acción',
      cell: (row) =>
        row.fk_estado === 1 ? (
          <button onClick={() => handleInactivate(row.pk_id_usuario)} className="btn-inactivar">Inactivar</button>
        ) : (
          <button onClick={() => handleActivate(row.pk_id_usuario)} className="btn-activar">Activar</button>
        ),
        export:false
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/usuarios/actualizar/${row.pk_id_usuario}`} className="btn-editar">Editar</Link>
      ),
      export:false
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
  
  configureDataTableTheme();

  // =============== 6. Mostrar los datos en Data Tables =============== //

    const tableData = {
    columns,
    data: usuarios,
  };

  return (
    <div className="container-table-admin">
      <h2 className='title-table-admin'>Gestión de Usuarios</h2>
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
          className="mt-3"
        />
      </DataTableExtensions>
    </div>
  );
};

export default Usuarios;
