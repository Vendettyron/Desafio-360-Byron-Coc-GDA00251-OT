import React, { useEffect, useState } from 'react';
import { obtenerProductos, activarProducto, inactivarProducto } from '@/services/productosService';
import { obtenerCategorias } from '@/services/categoriasService';
import { getProveedores } from '@/services/proveedoresService';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import Estados from '@/config/estados';
import toast from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';
import "styled-components"

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(20);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  // =============== 1. Fetch de productos, categorías y proveedores al montar el componente =============== //
  useEffect(() => {
    const fetchDatos = async () => {
      try { 
        // Actualizar el timestamp
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
        setCargando(60);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudieron obtener los datos. Intenta nuevamente más tarde.');
      } finally {
        setCargando(100);
        setImageTimestamp(Date.now()); // Actualizar el timestam
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
      toast.success('¡Producto activado exitosamente!');
    } catch (err) {
      console.error('Error al activar producto:', err);
      setError('Error al activar el producto.');
      toast.error('Error al activar el producto.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarProducto(id);
      const updatedData = await obtenerProductos();
      setProductos(updatedData);
      toast.success('¡Producto inactivado exitosamente!');
    } catch (err) {
      console.error('Error al inactivar producto:', err);
      setError('Error al inactivar el producto.');
      toast.error('Error al inactivar el producto.');
    }
  };

  // =============== 3. Renderizado condicional =============== //
  if (loading) {
    return ( 
        <Progress
          value={cargando}
        />
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
      name: 'Imagen',
      selector: row => row.pk_id_producto,
      cell: row => <img src={`/assets/productos/${row.pk_id_producto}.jpg?t=${imageTimestamp}`} alt={row.nombre} />,
      export:false // No exportar esta columna
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
        case Estados.DESCONTINUADO:
          estadoTexto = 'Descontinuado';
          className = 'badge-en-proceso';
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
    {name: 'Acción',
      cell: (row) =>
      row.fk_estado === Estados.ACTIVO ? (
        <button onClick={() => handleInactivate(row.pk_id_producto)} className="btn-inactivar">Inactivar</button>
      ) : (
        <button onClick={() => handleActivate(row.pk_id_producto)} className="btn-activar">Activar</button>
      ),
      export:false // No exportar esta columna
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/productos/actualizar/${row.pk_id_producto}`} className="btn-editar">Editar</Link>
      ),
      export:false // No exportar esta columna
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
    <div className="container-table-admin">
      <h2 className='title-table-admin'>Gestión de Productos</h2>

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
          className="mt-3"
        />
      </DataTableExtensions>
      
    </div>
  );
};

export default Productos;
