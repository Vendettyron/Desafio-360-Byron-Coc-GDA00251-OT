import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Servicios ya existentes
import { obtenerProductosActivos, obtenerProductosPorCategoria } from '@/services/productosService';
import { getProveedores } from '@/services/proveedoresService';
import { obtenerCategoriasActivas } from '@/services/categoriasService'; 
// Componentes
import ProductosCard from '@/components/Cliente/Productos/ProductosCard';
import { Progress } from '@/components/ui/progress';

// Función auxiliar para ordenar en frontend
function ordenarArrayPorPrecio(productos, modo) {
  if (modo === 'asc') {
    // Ascendente
    return productos.slice().sort((a, b) => a.precio - b.precio);
  } else if (modo === 'desc') {
    // Descendente
    return productos.slice().sort((a, b) => b.precio - a.precio);
  } else {
    return productos; // sin cambios
  }
}

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedoresMap, setProveedoresMap] = useState({});
  const [categorias, setCategorias] = useState([]);            
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('0');

  // Nuevo estado para el select de precio:
  const [ordenPrecio, setOrdenPrecio] = useState(''); // '' = sin orden, 'asc', 'desc'

  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [error, setError] = useState('');
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  
  const navigate = useNavigate();

  // 1. Cargar categorías, proveedores y luego productos
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setCargando(30);
        // Obtener categorías y proveedores 
        const [categoriasData, proveedoresData] = await Promise.all([
          obtenerCategoriasActivas(), 
          getProveedores(),
        ]);
        setCategorias(categoriasData);
        // Crear mapa de proveedores
        const mapProv = {};
        proveedoresData.forEach(prov => {
          mapProv[prov.pk_id_proveedor] = prov.nombre;
        });
        setProveedoresMap(mapProv);

        setCargando(60);
        // Obtener productos activos
        const productosData = await obtenerProductosActivos();
        setProductos(productosData);

        setCargando(90);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudieron obtener los datos.');
      } finally {
        setImageTimestamp(Date.now());
        setCargando(100);
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  // 2. Handler para filtrar productos por categoría
  const handleFiltrarPorCategoria = async (idCat) => {
    try {
      setLoading(true);
      setError('');

      if (idCat === '0') {
        // "0" => todas las categorías
        const todosProductos = await obtenerProductosActivos();
        setProductos(ordenarArrayPorPrecio(todosProductos, ordenPrecio));
      } else {
        // Productos de una categoría
        const productosFiltrados = await obtenerProductosPorCategoria(idCat);
        setProductos(ordenarArrayPorPrecio(productosFiltrados, ordenPrecio));
      }
    } catch (err) {
      console.error('Error al filtrar productos:', err);
      setError('Error al filtrar productos.');
    } finally {
      setLoading(false);
    }
  };

  // 2.1 onChange del <select> de categoría
  const handleChangeCategoria = (e) => {
    const idCat = e.target.value;
    setCategoriaSeleccionada(idCat);
    handleFiltrarPorCategoria(idCat);
  };

  // 3. Handler para ordenar por precio
  const handleOrdenarPorPrecio = (modo) => {
    setOrdenPrecio(modo);
    // Reordenar los productos existentes en el state
    setProductos(prev => ordenarArrayPorPrecio(prev, modo));
  };

  // 3.1 onChange del <select> de precio
  const handleChangePrecio = (e) => {
    const modo = e.target.value; // 'asc', 'desc', ''
    handleOrdenarPorPrecio(modo);
  };

  // 4. Ir a la vista de producto por ID
  const handleVerProductoPorId = (id) => {
    navigate(`/cliente/productoId/${id}`);
  };

  // 5. Render condicional
  if (loading) {
    return <Progress value={cargando} />;
  }

  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }

  // Render principal
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-10 text-black font-bold text-3xl">
        Catálogo de Productos
      </h2>

      {/* Filtros */}
      <div className="mb-6 rounded-md bg-white shadow-sm p-4 flex items-center justify-between">

        {/* FILTRO POR CATEGORÍA */}
        <div>
          <label htmlFor="selectCategoria" className="font-semibold mr-2">
            Filtrar por Categoría:
          </label>
          <select
            id="selectCategoria"
            value={categoriaSeleccionada}
            onChange={handleChangeCategoria}
            className="border border-gray-300 px-3 py-1 rounded-md bg-gray-100"
          >
            <option value="0">Todas</option>
            {categorias.map(cat => (
              <option key={cat.pk_id_categoria} value={cat.pk_id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* ORDENAR POR PRECIO */}
        <div>
          <label htmlFor="selectPrecio" className="font-semibold mr-2">
            Ordenar por Precio:
          </label>
          <select
            id="selectPrecio"
            value={ordenPrecio}
            onChange={handleChangePrecio}
            className="border border-gray-300 px-3 py-1 rounded-md bg-gray-100"
          >
            <option value="">Ninguno</option>
            <option value="asc">Menor a Mayor</option>
            <option value="desc">Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div id="catalogo" >
        {productos.map(producto => (
          <ProductosCard
            key={producto.pk_id_producto}
            nombre={producto.nombre}
            precio={producto.precio}
            proveedor={proveedoresMap[producto.fk_proveedor] || 'Desconocido'}
            pk_id_producto={producto.pk_id_producto}
            stock={producto.stock}
            onClick={() => handleVerProductoPorId(producto.pk_id_producto)}
            imageTimestamp={imageTimestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default Productos;
