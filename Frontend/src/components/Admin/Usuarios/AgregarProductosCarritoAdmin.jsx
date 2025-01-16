import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Servicios
import {
  obtenerProductosActivos
} from '@/services/productosService';
import { agregarProductoAlCarritoAdmin } from '@/services/usuariosService';
import { obtenerCategorias } from '@/services/categoriasService';
import { getProveedores } from '@/services/proveedoresService';

// Configuraciones y Utilidades
import configureDataTableTheme from '@/config/dataTableTheme';

// Componentes Reutilizables
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';
import {CirclePlus, CircleMinus, ShoppingCart } from 'lucide-react';


const AgregarProductosCarritoAdmin = () => {
  const { id } = useParams(); // Extrae el ID del usuario desde la ruta
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(20);
  const [cantidadPorProducto, setCantidadPorProducto] = useState({});
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const navigate = useNavigate();

  // =============== 1. Fetch de productos, categorías y proveedores al montar el componente =============== //
  useEffect(() => {
    const fetchDatos = async () => {
      try { 
        console.log('Iniciando solicitud para obtener productos, categorías y proveedores...');
        const [productosData, categoriasData, proveedoresData] = await Promise.all([
          obtenerProductosActivos(),
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
        toast.error('No se pudieron obtener los datos. Intenta nuevamente más tarde.');
      } finally {
        setImageTimestamp(Date.now()); // Actualizar el timestamp
        setCargando(100);
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  // =============== 2. Funciones para manejar cantidad y agregar al carrito =============== //

  // Función para incrementar la cantidad de un producto
  const handleIncrementar = (idProducto) => {
    setCantidadPorProducto(prev => ({
      ...prev,
      [idProducto]: prev[idProducto] ? prev[idProducto] + 1 : 2
    }));
  };

  // Función para decrementar la cantidad de un producto
  const handleDecrementar = (idProducto) => {
    setCantidadPorProducto(prev => {
      const currentCantidad = prev[idProducto] || 1;
      if (currentCantidad > 1) {
        return { ...prev, [idProducto]: currentCantidad - 1 };
      } else {
        // Si la cantidad es 1, eliminar el producto de la selección
        const { [idProducto]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  // Función para agregar un producto al carrito
  const handleAgregarAlCarrito = async (idProducto) => {
    const cantidad = cantidadPorProducto[idProducto] || 1;
    const idUsuario = id;
    try {
      await agregarProductoAlCarritoAdmin(idUsuario, idProducto, { cantidad });
      toast.success('¡Producto agregado al carrito exitosamente!');
      // Opcional: Resetear la cantidad seleccionada
      setCantidadPorProducto(prev => {
        const { [idProducto]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      console.error(`Error al agregar el producto al carrito del usuario con ID ${id}:`, err);
      toast.error('Error al agregar el producto al carrito. Intenta nuevamente.');
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

  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
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
      name: 'Imagen',
      selector: row => row.pk_id_producto,
      cell: row => (
        <img 
          src={`/assets/productos/${row.pk_id_producto}.jpg?t=${imageTimestamp}`} 
          alt="Producto" 
          onError={(e) => e.target.src = '/assets/productos/default.jpg'} 
        />
      ),
      export: false // No exportar esta columna
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
      name: 'Cantidad',
      selector: row => cantidadPorProducto[row.pk_id_producto] || 1,
      cell: row => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDecrementar(row.pk_id_producto)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            aria-label={`Decrementar cantidad de ${row.nombre}`}
          >
            <CircleMinus></CircleMinus>
          </button>
          <span className='bg-white py-1 px-3'>{cantidadPorProducto[row.pk_id_producto] || 1}</span>
          <button
            onClick={() => handleIncrementar(row.pk_id_producto)}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            aria-label={`Incrementar cantidad de ${row.nombre}`}
          >
            <CirclePlus></CirclePlus>
          </button>
        </div>
      ),
      export: false // No exportar esta columna
    },
    {
      name: 'Agrgar al carrito',
      cell: row => (
        <button
          onClick={() => handleAgregarAlCarrito(row.pk_id_producto)}
          className="px-3 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          aria-label={`Agregar ${row.nombre} al carrito`}
        >
          <ShoppingCart/>
        </button>
      ),
      export: false // No exportar esta columna
    },
  ];

  // =============== 5. Personalizar Tabla =============== //
  configureDataTableTheme();

  // =============== 6. Mostrar los datos en Data Tables =============== //
  const tableData = {
    columns,
    data: productos,
  };

  return (
    <div className="container-table-admin">
      <h2 className='title-table-admin'>Agregar Productos al Carrito del Cliente ID: {id}</h2>

      {/* Tabla de Productos */}
      <DataTableExtensions 
        {...tableData} 
        fileName={`Productos_Agregar_Carrito_${id}`} 
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

export default AgregarProductosCarritoAdmin;
