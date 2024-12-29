import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'

// Servicios
import { aprobarPedido, cancelarPedido, obtenerPedidoPorId } from '@/services/pedidosService';
import Estados from '@/config/estados';


// Componentes reutilizables
import { Button } from '@/components/ui/button';
import FormLayout from '@/components/Forms/FormLayout';


const ConfirmarCancelarPedido = () => {
    const { idpedido } = useParams(); // Extrae el ID del pedido de la ruta
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const pedidoData = await obtenerPedidoPorId(idpedido);
                console.log('Pedido obtenido:', pedidoData);
                setPedido(pedidoData);
            } catch (err) {
                console.error('Error al obtener el pedido:', err);
                toast.error('No se pudo obtener la información del pedido. Intenta nuevamente más tarde.');
                setError('No se pudo obtener la información del pedido. Intenta nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchPedido();
    }, []);

    const handleConfirmar = async () => {
        if (!pedido) return;
        setActionLoading(true);
        try {
            await aprobarPedido(idpedido);
            toast.success('Pedido confirmado exitosamente.');
            // Opcional: Actualizar el estado local o redirigir
            navigate('/admin/pedidos'); // Redirigir al listado de pedidos
        } catch (err) {
            console.error('Error al aprobar el pedido:', err);
            toast.error('No se pudo confirmar el pedido. Intenta nuevamente.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelar = async () => {
        if (!pedido) return;
        setActionLoading(true);
        try {
            await cancelarPedido(idpedido);
            toast.success('Pedido cancelado exitosamente.');
            // Opcional: Actualizar el estado local o redirigir
            navigate('/admin/pedidos'); // Redirigir al listado de pedidos
        } catch (err) {
            console.error('Error al cancelar el pedido:', err);
            toast.error('No se pudo cancelar el pedido. Intenta nuevamente.');
        } finally {
            setActionLoading(false);
        }
    };

    // Renderizado condicional mientras se cargan los datos
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Cargando información del pedido...</p>
            </div>
        );
    }

    // Manejo de errores
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    // Si el pedido no existe
    if (!pedido) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">Pedido no encontrado.</p>
            </div>
        );
    }


    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-800">Confirmar o Cancelar Pedido</h1>
            <FormLayout>
                {/* /* Información del Pedido */}
                <div className='max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 p-4'>   
                    <p><strong>Id Pedido:</strong> {idpedido}</p>
                    <p><strong>Fecha Pedido y Hora:</strong> {pedido.length > 0 ? new Date(pedido[0].fecha_pedido).toLocaleString() : 'N/A'}</p>
                    <p><strong>Total:</strong> {pedido.length > 0 ? `Q${pedido[0].total.toLocaleString()}` : 'N/A'}</p>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        onClick={handleConfirmar}
                        disabled={actionLoading}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {actionLoading ? 'Confirmando...' : 'Confirmar'}
                    </Button>
                    <Button
                        onClick={handleCancelar}
                        disabled={actionLoading}
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {actionLoading ? 'Cancelando...' : 'Cancelar'}
                    </Button>
                </div>
            </FormLayout>
        </>
    );
};

export default ConfirmarCancelarPedido;
