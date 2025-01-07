import React, { useEffect, useState } from 'react';
import PedidosItem from '@/components/Cliente/Pedido/PedidosItem';
import { obtenerPedidosCliente } from '@/services/pedidosService';
import toast from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(20);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      setCargando(50);
      const data = await obtenerPedidosCliente();
      setPedidos(Array.isArray(data) ? data : []);
      setCargando(80);
    } catch (err) {
      console.error('Error al obtener los pedidos:', err);
      setError(err.response?.data?.error || 'Error al obtener los pedidos.');
      toast.error(err.response?.data?.error || 'Error al obtener los pedidos.');
    } finally {
      setCargando(100);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

    // ===============  Renderizado condicional =============== //
    if (loading) {
       return (
           <Progress value={cargando} />
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
      <h1 className=" flex flex-row items-center text-center text-3xl font-bold mb-6">Tus Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-xl">No tienes pedidos aún.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2">ID Pedido</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Total</th>
              <th className="py-2">Estado del pedido</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {pedidos.map((pedido) => (
              <PedidosItem key={pedido.id_pedido} order={pedido} onUpdate={fetchPedidos} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Pedidos;
