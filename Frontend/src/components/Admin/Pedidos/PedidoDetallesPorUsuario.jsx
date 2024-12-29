import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context y servicios
import { obtenerDetallesClientePorAdmin} from '@/services/pedidosService';
import { obtenerUsuarioPorId } from '@/services/usuariosService';
import Estados from '@/config/estados';

// Componentes reutilizables
import DataTable, { createTheme } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';

const PedidoDetallesPorUsuario = () => {
    const {idcliente,idpedido}= useParams(); // Extrae los parámetros de la ruta
    const [pedidoDetalles, setPedidoDetalles] = useState([]);
    const [clienteInfo, setClienteInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetallesPedido = async () => {
            try {

                // Se obtienen los detalles del pedido
                console.log('Iniciando solicitud para obtener pedidos ...');
                const detallesPedido = await obtenerDetallesClientePorAdmin(idcliente,idpedido);
                console.log('Detalles del pedido obtenidos:', detallesPedido);
                setPedidoDetalles(detallesPedido);
                // Se obtiene la información del cliente qu reaalizo el pedido
                const clientesData = await obtenerUsuarioPorId(idcliente);
                console.log('Información del cliente obtenida:', clientesData);
                setClienteInfo(clientesData);
              
            } catch (err) {
                console.error('Error al obtener detalles del pedido:', err);
                setError('No se pudieron obtener los detalles del pedido. Intenta nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetallesPedido();
    }, []);

    // =============== 2. Funciones para navegar a los componentes correspondientes =============== //
    const handleConfirmarCancelar = () => { 
        navigate(`/admin/pedido/confirmar-cancelar/${idpedido}`); 
    };

    // Renderizado condicional mientras se cargan los datos
    if (loading) {
        return (
            <div className="text-center mt-5">
                <p>Cargando detalles del pedido...</p>
            </div>
        );
    }

    // Manejo de errores
    if (error) {
        return (
            <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
                {error}
            </div>
        );
    }

    // Configuración de las columnas de la tabla
    const columns = [
        {
            name: 'ID Producto',
            selector: row => row.fk_id_producto,
            cell: row => <p>{row.fk_id_producto}</p>,
            sortable: true,
        },
        {
            name: 'Nombre Producto',
            selector: row => row.nombre_producto,
            cell: row => <p>{row.nombre_producto}</p>,
            sortable: true,
        },
        {
            name: 'Descripción Producto',
            selector: row => row.descripcion_producto,
            cell: row => <p>{row.descripcion_producto}</p>,
            sortable: true,
        },
        {
            name: 'Precio Unitario',
            cell: (row) => `Q${row.precio_unitario.toLocaleString()}`,
            sortable: true,
        },
        {
            name: 'Cantidad',
            selector: row => row.cantidad,
            cell: row => <p>{row.cantidad}</p>,
            sortable: true,
        },
        {
            name: 'Subtotal',
            cell: (row) => `Q${row.subtotal.toLocaleString()}`,
            sortable: true,
        },
    ];
    
    // Configura el tema de la tabla
    configureDataTableTheme();

    // Muestra la tabla con los detalles del pedido y la información del cliente
   
    const tableData = {
        columns,
        data: pedidoDetalles,
    };

    return (
        <>
            {/* Información del Cliente y del Pedido */}
            <h2 className='text-3xl'>Detalles del Pedido</h2>   
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 p-4'>    
                    <p><strong>ID Cliente:</strong> {idcliente}</p>
                    <p><strong>ID Pedido:</strong> {idpedido}</p>
                    <p><strong>Nombre Cliente:</strong> {clienteInfo.nombre || 'N/A'}</p>
                    <p><strong>Telefono:</strong> {clienteInfo.telefono || 'N/A'}</p>
                    <p><strong>Fecha Pedido y Hora:</strong> {pedidoDetalles.length > 0 ? new Date(pedidoDetalles[0].fecha_pedido).toLocaleString() : 'N/A'}</p>
                    <p><strong>Total:</strong> {pedidoDetalles.length > 0 ? `Q${pedidoDetalles[0].total.toLocaleString()}` : 'N/A'}</p>
                </div>
            {/* Botón o Mensaje según el estado */}
            {pedidoDetalles.length > 0 && pedidoDetalles[0].estado === Estados.EN_PROCESO ? (
                <button
                    onClick={handleConfirmarCancelar}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4"
                    style={{ width: '10rem' }}
                >
                    Confirmar / Cancelar
                </button>
            ) : (
                <p className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 p-4">Este pedido ya ha sido Confirmado o Cancelado</p>
            )}

              
            {/* Tabla de Detalles del Pedido */}
            <DataTableExtensions
                {...tableData}
                fileName={`Detalles_Pedido_${idpedido}`}
                export={true}
                exportHeaders={true}
            >
                <DataTable
                    columns={columns}
                    data={pedidoDetalles}
                    theme='custom'
                    noHeader
                    pagination
                    highlightOnHover
                />
            </DataTableExtensions>
        </>
    );
};

export default PedidoDetallesPorUsuario;
