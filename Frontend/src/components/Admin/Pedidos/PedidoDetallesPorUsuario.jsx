import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Servicios
import { obtenerDetallesClientePorAdmin } from '@/services/pedidosService';
import { obtenerUsuarioPorId } from '@/services/usuariosService';

// Config & UI
import Estados from '@/config/estados';
import configureDataTableTheme from '@/config/dataTableTheme';
import 'react-data-table-component-extensions/dist/index.css';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { Progress } from '@/components/ui/progress';

const PedidoDetallesPorUsuario = () => {
  const { idcliente, idpedido } = useParams();
  const navigate = useNavigate();

  // INFORMACIÓN DEL PEDIDO
  const [pedidoData, setPedidoData] = useState({ 
    total: null, 
    fecha_pedido: null, 
    estado: null
  });
  // ARREGLO DE DETALLES
  const [pedidoDetalles, setPedidoDetalles] = useState([]);
  // DATOS DEL CLIENTE
  const [clienteInfo, setClienteInfo] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetallesPedido = async () => {
      try {
        setCargando(50);
        const respuesta = await obtenerDetallesClientePorAdmin(idcliente, idpedido);
        console.log('Respuesta backend:', respuesta);

        // Respuesta es { total, fecha_pedido, estado?, Detalle_Pedidos: [...] }
        const { total, fecha_pedido, estado, Detalle_Pedidos } = respuesta;
        setPedidoData({ total, fecha_pedido, estado }); 
        setPedidoDetalles(Detalle_Pedidos);

        // Obtener info del cliente:
        const clientesData = await obtenerUsuarioPorId(idcliente);
        setClienteInfo(clientesData);

        setCargando(80);
      } catch (err) {
        console.error('Error al obtener detalles del pedido:', err);
        setError('No se pudieron obtener los detalles del pedido. Intenta nuevamente más tarde.');
      } finally {
        setCargando(100);
        setLoading(false);
      }
    };
    fetchDetallesPedido();
  }, [idcliente, idpedido]);

  const handleConfirmarCancelar = () => {
    navigate(`/admin/pedido/confirmar-cancelar/${idpedido}`);
  };

  if (loading) {
    return <Progress value={cargando} />;
  }
  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }

  // Definir columnas para DataTable
  const columns = [
    {
      name: 'ID Producto',
      selector: row => row.fk_id_producto,
      sortable: true,
    },
    {
      name: 'Nombre Producto',
      selector: row => row.ProductoDetallePedido.nombre,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: row => row.ProductoDetallePedido.descripcion,
      sortable: true,
    },
    {
      name: 'Precio Unitario',
      cell: row => `Q${row.precio_unitario.toLocaleString()}`,
      sortable: true,
    },
    {
      name: 'Cantidad',
      selector: row => row.cantidad,
      sortable: true,
    },
    {
      name: 'Subtotal',
      cell: row => `Q${row.subtotal.toLocaleString()}`,
      sortable: true,
    },
  ];

  configureDataTableTheme();

  const tableData = {
    columns,
    data: pedidoDetalles,
  };

  return (
    <>
      <h2 className='title-table-admin'>Detalles del Pedido</h2>
      <div className='w-screen max-w-md bg-white p-4 ...'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-left font-bold'>
            <p>ID Cliente:</p>
            <p>ID Pedido:</p>
            <p>Nombre Cliente:</p>
            <p>Telefono:</p>
            <p>Fecha Pedido y Hora:</p>
            <p>Total:</p>
          </div>
          <div className='text-left'>
            <p>{idcliente}</p>
            <p>{idpedido}</p>
            <p>{clienteInfo.nombre || 'N/A'}</p>
            <p>{clienteInfo.telefono || 'N/A'}</p>
            <p>
              {pedidoData.fecha_pedido
                ? new Date(pedidoData.fecha_pedido).toLocaleString()
                : 'N/A'
              }
            </p>
            <p className='font-extrabold'>
              {pedidoData.total
                ? `Q${pedidoData.total.toLocaleString()}`
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Botón o Mensaje según el estado */}
      {pedidoData.estado === Estados.EN_PROCESO ? (
        <button
          onClick={handleConfirmarCancelar}
          className="bg-green-700 text-white py-2 px-5 rounded-lg ..."
          style={{ width: '10rem' }}
        >
          Confirmar / Cancelar
        </button>
      ) : (
        <p className="w-screen max-w-md bg-white p-4 ...">
          Este pedido ya ha sido Confirmado o Cancelado
        </p>
      )}

      <div className="container-table-admin">
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
            className="mt-3"
          />
        </DataTableExtensions>
      </div>
    </>
  );
};

export default PedidoDetallesPorUsuario;
