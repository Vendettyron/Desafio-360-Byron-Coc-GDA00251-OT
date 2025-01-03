// src/components/Pedidos/Pedidos.jsx

import React, { useEffect, useState } from 'react';
import PedidosItem from '@/components/Cliente/Pedido/PedidosItem';
import { obtenerPedidosCliente } from '@/services/pedidosService';
import toast from 'react-hot-toast';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await obtenerPedidosCliente();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener los pedidos:', err);
      setError(err.response?.data?.error || 'Error al obtener los pedidos.');
      toast.error(err.response?.data?.error || 'Error al obtener los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Cargando pedidos...</p>
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
      <h1 className="text-3xl font-bold mb-6">Tus Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-xl">No tienes pedidos aún.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID Pedido</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Total</th>
              <th className="py-2">Estado del pedido</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
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
