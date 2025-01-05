// src/components/ProductoPorId.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerProductoPorId } from '@/services/productosService';
import { obtenerProveedorPorId } from '@/services/proveedoresService';
import { agregarProductoAlCarrito } from '@/services/carritoService';
import toast from 'react-hot-toast';
import { AuthContext } from '@/context/AuthContext';

const ProductoPorId = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la ruta
  const [producto, setProducto] = useState({});
  const [proveedor, setProveedor] = useState({});
  const [cantidad, setCantidad] = useState(1); // Cantidad inicial
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext); // Acceder al contexto de autenticación

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener detalles del producto
        const productoData = await obtenerProductoPorId(id);
        setProducto(productoData);
        console.log("Datos del producto obtenidos:", productoData);

        // Verificar si el producto tiene un proveedor asociado
        if (productoData.fk_proveedor) {
          const proveedorData = await obtenerProveedorPorId(productoData.fk_proveedor);
          setProveedor(proveedorData);
          console.log("Datos del proveedor obtenidos:", proveedorData);
        } else {
          setProveedor({});
          console.log("No se encontró proveedor para este producto.");
        }
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del producto.');
        toast.error(err.message || 'Error al cargar los datos del producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Funciones para incrementar y decrementar la cantidad
  const incrementarCantidad = () => {
    setCantidad((prev) => (prev < producto.stock ? prev + 1 : prev));
  };

  const decrementarCantidad = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Función para agregar al carrito
  const handleAgregarAlCarrito = async () => {
    if (!auth.token) {
      toast.error('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    try {
      await agregarProductoAlCarrito(producto.pk_id_producto, cantidad);
      toast.success('Producto agregado al carrito exitosamente.');
    } catch (err) {
      toast.error(err.message || 'Error al agregar el producto al carrito.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  // Verificar el stock del producto
  const estaDisponible = producto.stock > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        {/* Imagen del Producto */}
        <div className="md:w-1/2">
          <img
            src={`/assets/productos/${id}.jpg`}
            alt={producto.nombre || 'Imagen del producto'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información del Producto */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
            <p className="text-gray-700 mb-4">{producto.descripcion}</p>
            {proveedor.nombre && (
              <p className="text-gray-800 mb-2">
                <strong>Proveedor:</strong> {proveedor.nombre}
              </p>
            )}
            <p className="text-gray-800 mb-4">
              <strong>Precio:</strong> Q{producto.precio.toLocaleString()}
            </p>
            <p className="text-gray-800 mb-4">
              <strong>Stock:</strong> {producto.stock}
            </p>
          </div>

          {/* Renderizado Condicional basado en el Stock */}
          {estaDisponible ? (
            <>
              {/* Gestión de Cantidad */}
              <div className="flex items-center mb-4">
                <button
                  onClick={decrementarCantidad}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
                  aria-label="Decrementar cantidad"
                >
                  -
                </button>
                <input
                  type="text"
                  value={cantidad}
                  readOnly
                  className="w-12 text-center border-t border-b border-gray-200"
                  aria-label="Cantidad"
                />
                <button
                  onClick={incrementarCantidad}
                  className={`px-3 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 ${cantidad >= producto.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Incrementar cantidad"
                  disabled={cantidad >= producto.stock}
                >
                  +
                </button>
              </div>

              {/* Botón de Añadir al Carrito */}
              <button
                onClick={handleAgregarAlCarrito}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Añadir al carrito
              </button>
            </>
          ) : (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              Producto No disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoPorId;
