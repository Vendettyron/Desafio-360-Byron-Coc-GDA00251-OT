import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import DataTable , {createTheme} from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import {
  obtenerCategorias,
  activarCategoria,
  inactivarCategoria,
} from '@/services/categoriasService';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =============== 1. Fetch de categorías al montar el componente =============== //
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        console.log('Iniciando solicitud para obtener categorías...');
        const categoriasData = await obtenerCategorias();
        console.log('Categorías obtenidas:', categoriasData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError('No se pudieron obtener las categorías. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  // =============== 2. Funciones para activar/inactivar =============== //
  const handleActivate = async (id) => {
    try {
      await activarCategoria(id);
      const updatedData = await obtenerCategorias();
      setCategorias(updatedData);
    } catch (err) {
      console.error('Error al activar categoría:', err);
      setError('Error al activar la categoría.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarCategoria(id);
      const updatedData = await obtenerCategorias();
      setCategorias(updatedData);
    } catch (err) {
      console.error('Error al inactivar categoría:', err);
      setError('Error al inactivar la categoría.');
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

  // =============== 4. Configurar Columns de Data Tables =============== //
  const columns = [
    {
      name: 'ID',
      selector: row => row.pk_id_categoria,
      cell: row => <p>{row.pk_id_categoria}</p>,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      cell: row => <p>{row.nombre}</p>,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      cell: row => <p>{row.descripcion}</p>,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: row => row.fk_estado,
      cell: (row) => (row.fk_estado === 1 ? 'Activo' : 'Inactivo'), // Para mostrar en la tabla
      sortable: true,
      ignoreExport: true, 
    },
    {
      name: 'Acción',
      cell: (row) =>
        row.fk_estado === 1 ? (
          <button onClick={() => handleInactivate(row.pk_id_categoria)}>Inactivar</button>
        ) : (
          <button onClick={() => handleActivate(row.pk_id_categoria)}>Activar</button>
        ),
      ignoreExport: true, // Ignorar en la exportación
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/categorias/actualizar/${row.pk_id_categoria}`}>Editar</Link>
      ),
      ignoreExport: true, // Ignorar en la exportación
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


  // =============== 5. Personalizar Tema =============== //

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

  // =============== 6. Mostrar los datos en Data Tables con Exportación =============== //
  const tableData = {
    columns,
    data: categorias,
  };

  return (
    <>
      <h2 className="text-3xl">Gestión de Categorías</h2>

      <DataTableExtensions {...tableData}>
        <DataTable
          columns={columns}
          data={categorias}
          theme="custom"
          noHeader
          pagination
          highlightOnHover
        />
      </DataTableExtensions>
    </>
  );
};

export default Categorias;
