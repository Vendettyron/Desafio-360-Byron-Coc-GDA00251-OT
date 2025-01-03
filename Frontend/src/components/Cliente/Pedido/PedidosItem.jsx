import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import VerDetallesPedido from '@/components/Cliente/Pedido/VerDetallesPedido';
import { cancelarPedidoCliente } from '@/services/pedidosService';
import Estados from '@/config/estados';

const PedidosItem = ({ order, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
    setLoading(true);
    try {
      await cancelarPedidoCliente(order.id_pedido);
      toast.success('Pedido cancelado exitosamente.');
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
      toast.error(error.response?.data?.error || 'Error al eliminar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  const estadosTexto = {
    4: 'En Proceso',
    5: 'Confirmado',
    6: 'Cancelado por un Administrador',
    7: 'Cancelado de manera voluntaria',
  };

  const estadosColor = {
    4: 'text-yellow-600', // En Proceso - Amarillo
    5: 'text-green-600',  // Confirmado - Verde
    6: 'text-red-600',    // Cancelado por Admin - Rojo
    7: 'text-red-600',    // Cancelado de manera voluntaria - Rojo
  };

  const getEstadoColor = (estadoNumero) => estadosColor[estadoNumero] || 'text-gray-600';
  
  const getEstadoTexto = (estadoNumero) => estadosTexto[estadoNumero] || 'Desconocido'

  return (
    <>
      <tr>
        <td className="px-4 py-2">{order.id_pedido}</td>
        <td className="px-4 py-2">{new Date(order.fecha_pedido).toLocaleDateString()}</td>
        <td className="px-4 py-2">Q{order.total.toLocaleString()}</td>
        <td className={`px-4 py-2 font-semibold ${getEstadoColor(order.estado)}`}> {getEstadoTexto(order.estado)} </td>
        <td className="px-4 py-2">
          <button
            onClick={toggleExpand}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            {isExpanded ? 'Ocultar' : 'Ver Detalles'}
          </button>
          {order.estado === Estados.EN_PROCESO && (
            <button
              onClick={handleEliminar}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Cancelando Pedido...' : 'Cancelar Pedido'}
            </button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="5" className="bg-gray-100">
            <VerDetallesPedido orderId={order.id_pedido} estado={order.estado} onUpdate={onUpdate} />
          </td>
        </tr>
      )}
    </>
  );
};

PedidosItem.propTypes = {
  order: PropTypes.shape({
    id_pedido: PropTypes.number.isRequired,
    fecha_pedido: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    estado: PropTypes.number.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default React.memo(PedidosItem);
