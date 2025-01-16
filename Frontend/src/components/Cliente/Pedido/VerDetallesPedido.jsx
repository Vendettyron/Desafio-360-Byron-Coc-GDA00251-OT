import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ObtenerDetallesPedidoCliente } from '@/services/pedidosService';
import { obtenerProductos } from '@/services/productosService';
import toast from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';

const VerDetallesPedido = ({ orderId }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchDetalles = async () => {
    setLoading(true);
    try {
      setCargando(50);
      const data = await ObtenerDetallesPedidoCliente(orderId);
      const products = await obtenerProductos();
      setDetails(data);
      const totalAmount = data.reduce((acc, item) => acc + item.subtotal, 0);
      setTotal(totalAmount);
      setCargando(80);
    } catch (error) {
      console.error('Error al obtener detalles del pedido:', error);
      toast.error(error.response?.data?.error || 'Error al obtener detalles del pedido.');
    } finally {
      setCargando(100);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalles();
  }, [orderId]);

    // =============== Renderizado condicional =============== //
    if (loading) {
       return (
           <Progress value={cargando} />
       );
     }

  return (
    <div className="p-4">
      <div className='w-fit p-3 bg-white rounded-lg shadow-lg mb-4'> 
        <h3 className='text-3xl text-black mb-3'>Informacion del pedido Id: {orderId}</h3>
      </div>
      <table className="min-w-full bg-white rounded-lg p-3 shadow-lg">     
        <thead >
          <tr className='border border-r-slate-600'> 
            <th className='py-2'>Imagen</th>
            <th className="py-2">Producto</th>
            <th className="py-2">Precio Unitario</th>
            <th className="py-2">Cantidad</th>
            <th className="py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {details.map((item) => (
            <tr key={item.id_detalle}>
              <td className="px-4 py-2">
                <img src={`/assets/productos/${item.fk_id_producto}.jpg?t=${Date.now()}`} alt={item.nombre_producto} className=" w-24 h-auto object-cover" onError={(e) => e.target.src = '/assets/productos/default.jpg'}  />
              </td>
              <td className="px-4 py-2">{item.ProductoDetallePedido.nombre}</td>
              <td className="px-4 py-2">Q{item.precio_unitario.toLocaleString()}</td>
              <td className="px-4 py-2">{item.cantidad}</td>
              <td className="px-4 py-2">Q{item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full p-4 mt-4 bg-white rounded-lg shadow-lg">
        <p className='flex flex-row-reverse font-bold'>Total: Q{total.toLocaleString()} </p>
      </div>
    </div>
  );
};

VerDetallesPedido.propTypes = {
  orderId: PropTypes.number.isRequired,
  estado: PropTypes.number.isRequired,
};

export default VerDetallesPedido;
