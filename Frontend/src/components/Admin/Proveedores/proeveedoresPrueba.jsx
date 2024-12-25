import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Importa la librería:
import DataTable from 'react-data-table-component';

import {
  getProveedores,
  activarProveedor,
  inactivarProveedor,
} from '../../../services/proveedoresService';

const proeveedoresPrueba = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Obtener la lista de proveedores al montar
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        console.log('Iniciando solicitud para obtener proveedores...');
        const data = await getProveedores();
        console.log('Proveedores obtenidos:', data);
        setProveedores(data);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
        setError('No se pudieron obtener los proveedores. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchProveedores();
  }, []);

  // 2. Funciones para activar/inactivar un proveedor
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

  // 3. Definir las columnas para React Data Table Component
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.pk_id_proveedor,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: (row) => row.telefono,
    },
    {
      name: 'Correo',
      selector: (row) => row.correo,
    },
    {
      name: 'Estado',
      cell: (row) => (row.fk_estado === 1 ? 'Activo' : 'Inactivo'),
    },
    {
      name: 'Acción',
      cell: (row) => {
        if (row.fk_estado === 1) {
          // Proveedor activo => botón para inactivar
          return (
            <button onClick={() => handleInactivate(row.pk_id_proveedor)}>
              Inactivar
            </button>
          );
        } else {
          // Proveedor inactivo => botón para activar
          return (
            <button onClick={() => handleActivate(row.pk_id_proveedor)}>
              Activar
            </button>
          );
        }
      },
      ignoreRowClick: true, // Para que no se dispare un "onRowClicked" accidental
      allowOverflow: true, // Para evitar problemas de layout
      button: true,        // Indica que es una columna de acción con un botón
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/proveedores/actualizar/${row.pk_id_proveedor}`}>
          Editar
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // 4. Manejo de estados de carga/error
  if (loading) {
    // Puedes usar el "progressPending" de DataTable,
    // pero también está bien retornar un mensaje condicional como antes.
    return (
      <div className="text-center mt-5">
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          border: '1px solid red',
          padding: '10px',
          marginTop: '20px',
          color: 'red',
        }}
      >
        {error}
      </div>
    );
  }

  // 5. Render del componente DataTable
  return (
    <>
      <h2>Gestión de Proveedores</h2>
      <DataTable
        title="Lista de Proveedores"
        columns={columns}
        data={proveedores}
        pagination // activa la paginación
        highlightOnHover
        pointerOnHover
        responsive
        // Opcional: si quieres un indicador de carga
        progressPending={loading}
        progressComponent={
          <div className="text-center mt-5">
            <p>Cargando proveedores...</p>
          </div>
        }
        noDataComponent={<div>No hay proveedores</div>}
      />
    </>
  );
};

export default proeveedoresPrueba;
