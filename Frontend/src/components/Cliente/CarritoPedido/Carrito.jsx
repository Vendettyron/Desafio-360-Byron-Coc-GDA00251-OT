// src/components/Carrito/Carrito.jsx

import React, { useEffect, useState, useContext } from 'react';
import CarritoPedidoDetalle from '@/components/Cliente/CarritoPedido/CarritoPedidoDetalle';
import { obtenerDetallesCarritoPorUsuario, eliminarDetallesCarrito, confirmarCarrito } from '@/services/carritoService';
import toast from 'react-hot-toast';
import { AuthContext } from '@/context/AuthContext';

const Carrito = () => {
  const [detallesCarrito, setDetallesCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext); // Acceder al contexto de autenticación

  // Función para obtener los detalles del carrito
  const fetchDetallesCarrito = async () => {
    setLoading(true);
    try {
      const datos = await obtenerDetallesCarritoPorUsuario();
      // Asegurarse de que datos es un array
      const detalles = Array.isArray(datos) ? datos : [];
      
      // Verificar si la respuesta indica que el carrito está vacío
      if (
        detalles.length === 1 &&
        detalles[0].pk_id_carrito === null &&
        detalles[0].mensaje
      ) {
        setDetallesCarrito([]); // Tratar el carrito como vacío
        setTotal(0);
      } else {
        setDetallesCarrito(detalles);
        calcularTotal(detalles);
      }
    } catch (err) {
      console.error('Error al obtener los detalles del carrito:', err);
      setError(err.response?.data?.error || 'Error al obtener los detalles del carrito.');
      toast.error(err.response?.data?.error || 'Error al obtener los detalles del carrito.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetallesCarrito();
  }, []);

  // Función para calcular el total del carrito
  const calcularTotal = (datos) => {
    const suma = datos.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(suma);
  };

  // Función para manejar la actualización del carrito después de modificar un producto
  const handleUpdate = () => {
    fetchDetallesCarrito();
  };

  // Función para manejar la eliminación de un producto
  const handleDelete = () => {
    fetchDetallesCarrito();
  };

  // Función para eliminar todos los detalles del carrito
  const handleEliminarCarrito = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar todos los productos del carrito?')) {
      return;
    }

    try {
      await eliminarDetallesCarrito();
      toast.success('Carrito eliminado exitosamente.');
      fetchDetallesCarrito();
    } catch (err) {
      console.error('Error al eliminar el carrito:', err);
      setError(err.response?.data?.error || 'Error al eliminar el carrito.');
      toast.error(err.response?.data?.error || 'Error al eliminar el carrito.');
    }
  };

  // Función para confirmar el carrito
  const handleConfirmarCarrito = async () => {
    if (detallesCarrito.length === 0) {
      toast.error('El carrito está vacío.');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas confirmar el carrito?')) {
      return;
    }

    try {
      const respuesta = await confirmarCarrito();
      if (respuesta && respuesta.message) {
        toast.success(respuesta.message);
      } else {
        toast.success('Carrito confirmado exitosamente.');
      }
      fetchDetallesCarrito();
    } catch (err) {
      console.error('Error al confirmar el carrito:', err);
      setError(err.response?.data?.error || 'Error al confirmar el carrito.');
      toast.error(err.response?.data?.error || 'Error al confirmar el carrito.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando detalles del carrito...</p>
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
      {detallesCarrito.length === 0 ? (
        <p className="text-xl">Agrega productos al carrito.</p> // Mensaje personalizado
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Imagen</th>
                <th className="py-2">Producto</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Precio Unitario</th>
                <th className="py-2">Subtotal</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {detallesCarrito.map((item) => (
                <CarritoPedidoDetalle
                  key={item.pk_id_detalle}
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>

          {/* Resumen del Total */}
          <div className="flex justify-end mt-4">
            <p className="text-2xl font-bold">Total: Q{total.toLocaleString()}</p>
          </div>

          {/* Botones de Confirmar y Eliminar Carrito */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleConfirmarCarrito}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Confirmar Carrito
            </button>
            <button
              onClick={handleEliminarCarrito}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar Carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
