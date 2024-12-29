import React, { useEffect, useState } from 'react';
import { obtenerProductos, activarProducto, inactivarProducto } from '@/services/productosService';
import { obtenerCategorias } from '@/services/categoriasService';
import { getProveedores } from '@/services/proveedoresService';
import { Link } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import Estados from '@/config/estados';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =============== 1. Fetch de productos, categorías y proveedores al montar el componente =============== //
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        console.log('Iniciando solicitud para obtener productos...');
        const [productosData, categoriasData, proveedoresData] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
          getProveedores(),
        ]);
        console.log('Productos obtenidos:', productosData);
        console.log('Categorías obtenidas:', categoriasData);
        console.log('Proveedores obtenidos:', proveedoresData);
        setProductos(productosData);
        setCategorias(categoriasData);
        setProveedores(proveedoresData);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudieron obtener los datos. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  // =============== 2. Funciones para activar/inactivar =============== //
  const handleActivate = async (id) => {
    try {
      await activarProducto(id);
      const updatedData = await obtenerProductos();
      setProductos(updatedData);
    } catch (err) {
      console.error('Error al activar producto:', err);
      setError('Error al activar el producto.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarProducto(id);
      const updatedData = await obtenerProductos();
      setProductos(updatedData);
    } catch (err) {
      console.error('Error al inactivar producto:', err);
      setError('Error al inactivar el producto.');
    }
  };

  // =============== 3. Renderizado condicional =============== //
  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Cargando productos...</p>
      </div>
    );
  }

  // =============== 4. Configurar Columns de Data Tables =============== //
  const columns = [
    {
      name: 'ID',
      selector: row => row.pk_id_producto,
      cell: row => <p>{row.pk_id_producto}</p>,
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
      name: 'Categoría',
      cell: (row) => {
        const categoria = categorias.find(cat => cat.pk_id_categoria === row.fk_categoria);
        return categoria ? categoria.nombre : 'N/A';
      },
      sortable: true,
    },
    {
      name: 'Proveedor',
      cell: (row) => {
        const proveedor = proveedores.find(prov => prov.pk_id_proveedor === row.fk_proveedor);
        return proveedor ? proveedor.nombre : 'N/A';
          },
          sortable: true,
    },
    {
      name: 'Precio',
      cell: (row) => `Q${row.precio.toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Stock',
      selector: row => row.stock,
      cell: row => <p>{row.stock}</p>,
      sortable: true,
    },
    {
      name: 'Estado',
      cell: (row) => {
    switch (row.fk_estado) {
      case Estados.ACTIVO:
        return 'Activo';
      case Estados.DESACTIVADO:
        return 'Descontinuado';
      case Estados.INACTIVO:
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
      },
      sortable: true,
      ignoreExport: true,
    },
    {
      name: 'Acción',
      cell: (row) =>
    row.fk_estado === Estados.ACTIVO ? (
      <button onClick={() => handleInactivate(row.pk_id_producto)}>Inactivar</button>
    ) : (
      <button onClick={() => handleActivate(row.pk_id_producto)}>Activar</button>
    ),
      ignoreExport: true,
      cellExport: row => ({}), // No exportar este campo
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/productos/actualizar/${row.pk_id_producto}`}>Editar</Link>
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
  
  configureDataTableTheme();

  // =============== 6. Mostrar los datos en Data Tables =============== //
  const tableData = {
    columns,
    data: productos,
  };
  return (
    <>
      <h2 className='text-3xl'>Gestión de Productos</h2>

      <DataTableExtensions 
        {...tableData} 
        fileName="Productos Listado" 
        export={true}
        exportHeaders={true}
      >
        <DataTable
          columns={columns}
          data={productos}
          theme='custom'
          noHeader
          pagination
          highlightOnHover
        />
      </DataTableExtensions>
      
    </>
  );
};

export default Productos;
