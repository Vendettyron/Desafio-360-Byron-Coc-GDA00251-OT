import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { actualizarDetalleCarrito, eliminarDetalleCarrito } from '@/services/carritoService';

const CarritoPedidoDetalle = ({ item, onUpdate, onDelete }) => {
  const [cantidad, setCantidad] = useState(item.cantidad);
  const [loading, setLoading] = useState(false);

  // Función para manejar la actualización de la cantidad
  const handleActualizarCantidad = async (nuevaCantidad) => {
    if (nuevaCantidad < 0) return; // Evita cantidades negativas

    setLoading(true);
    try {
      await actualizarDetalleCarrito(item.fk_id_producto, nuevaCantidad);
      setCantidad(nuevaCantidad);
      onUpdate(); // Actualiza el total del carrito en el componente padre
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      toast.error(error.message || 'Error al actualizar la cantidad.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la eliminación del producto
  const handleEliminarProducto = async () => {
    setLoading(true);
    try {
      await eliminarDetalleCarrito(item.fk_id_producto);
      toast.success('Producto eliminado del carrito.');
      onDelete(); // Actualiza el estado del carrito en el componente padre
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      toast.error(error.message || 'Error al eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      {/* Imagen del Producto */}
      <td className="px-4 py-2">
        <img
          src={`/productos/${item.fk_id_producto}.jpg`}
          alt={item.nombre_producto}
          className="w-16 h-16 object-cover"
        />
      </td>

      {/* Nombre del Producto */}
      <td className="px-4 py-2">{item.nombre_producto}</td>

      {/* Cantidad con botones + y - */}
      <td className="px-4 py-2">
        <div className="flex items-center">
          <button
            onClick={() => handleActualizarCantidad(cantidad - 1)}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
            disabled={loading || cantidad === 0}
          >
            -
          </button>
          <input
            type="text"
            value={cantidad}
            readOnly
            className="w-12 text-center border-t border-b border-gray-200"
          />
          <button
            onClick={() => handleActualizarCantidad(cantidad + 1)}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
            disabled={loading}
          >
            +
          </button>
        </div>
      </td>
      {/* Precio Unitario */}
      <td className="px-4 py-2">Q{item.precio_unitario.toLocaleString()}</td>

      {/* Subtotal */}
      <td className="px-4 py-2">Q{item.subtotal.toLocaleString()}</td>

      {/* Botón Eliminar Producto */}
      <td className="px-4 py-2">
        <button
          onClick={handleEliminarProducto}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          disabled={loading}
        >
          Eliminar Producto
        </button>
      </td>
    </tr>
  );
};

CarritoPedidoDetalle.propTypes = {
  item: PropTypes.shape({
    fk_id_producto: PropTypes.number.isRequired,
    fk_id_producto: PropTypes.number.isRequired,
    nombre_producto: PropTypes.string.isRequired,
    precio_unitario: PropTypes.number.isRequired,
    cantidad: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired, // Función para actualizar el total del carrito
  onDelete: PropTypes.func.isRequired, // Función para actualizar el estado del carrito después de eliminar un producto
};

export default CarritoPedidoDetalle;
