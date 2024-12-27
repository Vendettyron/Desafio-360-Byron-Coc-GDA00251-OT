import React, { useEffect, useState } from 'react';
import { getProveedores, activarProveedor,inactivarProveedor } from '../../../services/proveedoresService';
import { Link } from 'react-router-dom';
import DataTable, {createTheme} from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =============== 1. Fetch de proveedores al montar el componente =============== //
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        console.log('Iniciando solicitud para obtener proveedores...');
        const proveedoresData = await getProveedores();
        console.log('Proveedores obtenidos:', proveedoresData);
        setProveedores(proveedoresData);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
        setError('No se pudieron obtener los proveedores. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchProveedores();
  }, []);

  // =============== 2. Funciones para activar/inactivar =============== //
  const handleActivate = async (id) => {
    try {
      await activarProveedor(id);
      const updatedData = await getProveedores();
      setProveedores(updatedData);
    } catch (err) {
      console.error('Error al activar proveedor:', err);
      setError('Error al activar el proveedor.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarProveedor(id);
      const updatedData = await getProveedores();
      setProveedores(updatedData);
    } catch (err) {
      console.error('Error al inactivar proveedor:', err);
      setError('Error al inactivar el proveedor.');
    }
  };

  // =============== 3. Renderizado condicional =============== //
  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  // =============== 4. Cofigurar Colums de Data Tables =============== //
  const columns = [
    {
      name: 'ID',
      selector: row => row.pk_id_proveedor,
      cell: row => <p>{row.pk_id_proveedor}</p>,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      cell: row => <p>{row.nombre}</p>,
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: row => row.telefono,
      cell: row => <p>{row.telefono}</p>,
      sortable: true,
    },
    {
      name: 'Correo',
      selector: row => row.correo,
      sortable: true,
      cell: row => <p>{row.correo}</p>,
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
          <button onClick={() => handleInactivate(row.pk_id_proveedor)}>Inactivar</button>
        ) : (
          <button onClick={() => handleActivate(row.pk_id_proveedor)}>Activar</button>
        ),
        ignoreExport: true,
    },
    {
      name: 'Actualizar',
      cell: (row) => (
       <Link to={`/admin/proveedores/actualizar/${row.pk_id_proveedor}`}>Editar</Link>
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
    data: proveedores,
  }
// =============== 6. Mostrar los datos en Data Tables =============== //
  return (
    <>
      <h2 className='text-3xl'>Gestión de Proveedores</h2>

      <DataTableExtensions 
        {...tableData} 
        fileName="Proveedores Listado" 
        export={true}
        exportHeaders={true}
      >
        <DataTable
          columns={columns}
          data={proveedores}
          theme='custom'
          noHeader
          pagination
          highlightOnHover
        />
      </DataTableExtensions>

    </>
  );
};

export default Proveedores;
