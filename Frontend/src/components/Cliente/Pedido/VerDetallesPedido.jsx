import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ObtenerDetallesPedidoCliente } from '@/services/pedidosService';
import toast from 'react-hot-toast';

const VerDetallesPedido = ({ orderId}) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchDetalles = async () => {
    setLoading(true);
    try {
      const data = await ObtenerDetallesPedidoCliente(orderId);
      setDetails(data);
    } catch (error) {
      console.error('Error al obtener detalles del pedido:', error);
      toast.error(error.response?.data?.error || 'Error al obtener detalles del pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalles();
  }, [orderId]);


  if (loading) {
    return <p>Cargando detalles...</p>;
  }

  return (
    <div className="p-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Producto</th>
              <th className="py-2">Precio Unitario</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item) => (
              <tr key={item.id_detalle}>
                <td className="px-4 py-2">{item.nombre_producto}</td>
                <td className="px-4 py-2">Q{item.precio_unitario.toLocaleString()}</td>
                <td className="px-4 py-2">{item.cantidad}</td>
                <td className="px-4 py-2">Q{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
     
    </div>
  );
};

VerDetallesPedido.propTypes = {
  orderId: PropTypes.number.isRequired,
  estado: PropTypes.number.isRequired,
};

export default VerDetallesPedido;
