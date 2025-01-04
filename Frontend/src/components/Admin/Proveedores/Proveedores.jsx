import React, { useEffect, useState } from 'react';
import { getProveedores, activarProveedor, inactivarProveedor } from '@/services/proveedoresService';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import toast from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';
import "styled-components"

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [error, setError] = useState('');

  // =============== 1. Fetch de proveedores al montar el componente =============== //
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        setCargando(50);
        console.log('Iniciando solicitud para obtener proveedores...');
        const proveedoresData = await getProveedores();
        console.log('Proveedores obtenidos:', proveedoresData);
        setProveedores(proveedoresData);

        setCargando(80);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
        setError('No se pudieron obtener los proveedores. Intenta nuevamente más tarde.');
      } finally {
        setCargando(100);
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
      toast.success('¡Proveedor activado exitosamente!');
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
      toast.success('¡Proveedor inactivado exitosamente!');
    } catch (err) {
      console.error('Error al inactivar proveedor:', err);
      setError('Error al inactivar el proveedor.');
    }
  };

  // =============== 3. Configurar Columns de Data Tables =============== //
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
      cell: row => (
        <span
          className={` ${
            row.fk_estado === 1
              ? 'badge-activo'
              : 'badge-inactivo'
          }`}
        >
          {row.fk_estado === 1 ? 'Activo' : 'Inactivo'}
        </span>
      ),
      sortable: true,
      ignoreExport: true,
    },
    {
      name: 'Acción',
      cell: (row) =>
        row.fk_estado === 1 ? (
          <button 
            onClick={() => handleInactivate(row.pk_id_proveedor)} 
            className="btn-inactivar"
          >
            Inactivar
          </button>
        ) : (
          <button 
            onClick={() => handleActivate(row.pk_id_proveedor)} 
            className="btn-activar"
          >
            Activar
          </button>
        ),
      export:false // No exportar esta columna
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link 
          to={`/admin/proveedores/actualizar/${row.pk_id_proveedor}`} 
          className="btn-editar"
        >
          Editar
        </Link>
      ),
      export:false
    },
  ];

  // =============== 4. Manejar Errores =============== //
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div style={{ border: '1px solid red', padding: '10px', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  // =============== 5. Personalizar Tema de la Tabla =============== //
  configureDataTableTheme();

  // =============== 6. Configurar Datos de la Tabla =============== //
  const tableData = {
    columns,
    data: proveedores,
  };

  // =============== 7. Renderización Condicional =============== //
  if (loading) {
    return (
        <Progress value={cargando} />
    );
  }

  // =============== 8. Renderizar la Tabla =============== //
  return (
    <div className="container-table-admin">
      <h2 className='title-table-admin'>Gestión de Proveedores</h2>
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
          className="mt-3"
        />
      </DataTableExtensions>
    </div>
  );
};

export default Proveedores;
