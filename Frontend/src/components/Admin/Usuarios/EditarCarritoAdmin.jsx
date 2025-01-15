import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Context y servicios
import { obtenerDetallesCarritoPorUsuarioAdmin,
        actualizarDetalleCarritoAdmin, 
        eliminarDetalleCarritoAdmin, 
        eliminarDetallesCarritoAdmin 
} from '@/services/usuariosService';
import { obtenerUsuarioPorId } from '@/services/usuariosService';

// Componentes reutilizables
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast'; 
import {CirclePlus, CircleMinus,Trash2   } from 'lucide-react';
// Estilos
import "styled-components";

const EditarCarritoAdmin = () => {
    const { id } = useParams(); // Extrae el ID del cliente desde la ruta
    const [carritoDetalles, setCarritoDetalles] = useState([]);
    const [clienteInfo, setClienteInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetallesCarrito = async () => {
            try {
                setCargando(50);
                // Obtener los detalles del carrito del cliente
                console.log('Iniciando solicitud para obtener detalles del carrito...');
                const detallesCarrito = await obtenerDetallesCarritoPorUsuarioAdmin(id);
                console.log('Detalles del carrito obtenidos:', detallesCarrito);
                setCarritoDetalles(detallesCarrito);
                // Obtener la información del cliente
                const clienteData = await obtenerUsuarioPorId(id);
                console.log('Información del cliente obtenida:', clienteData);
                setClienteInfo(clienteData);
                setCargando(80);
            } catch (err) {
                console.error('Error al obtener detalles del carrito:', err);
                setError('No se pudieron obtener los detalles del carrito. Intenta nuevamente más tarde.');
                toast.error('No se pudieron obtener los detalles del carrito. Intenta nuevamente más tarde.');
            } finally {
                setCargando(100);
                setLoading(false);
            }
        };
        fetchDetallesCarrito();
    }, [id]);

    // Función para incrementar la cantidad de un producto en el carrito
    const handleIncrementar = async (idProducto, cantidadActual) => {
        const nuevaCantidad = cantidadActual + 1;
        try {
            await actualizarDetalleCarritoAdmin(id, idProducto, { nueva_cantidad: nuevaCantidad });
            toast.success('Cantidad actualizada exitosamente.');
            // Actualizar el estado local
            setCarritoDetalles(prevDetalles =>
                prevDetalles.map(detalle =>
                    detalle.fk_id_producto === idProducto
                        ? { ...detalle, cantidad: nuevaCantidad, subtotal: nuevaCantidad * detalle.precio_unitario }
                        : detalle
                )
            );
        } catch (err) {
            console.error('Error al actualizar la cantidad:', err);
            toast.error('No se pudo actualizar la cantidad. Intenta nuevamente.');
        }
    };

    // Función para decrementar la cantidad de un producto en el carrito
    const handleDecrementar = async (idProducto, cantidadActual) => {
        if (cantidadActual === 1) {
            // Confirmar eliminación del detalle
            if (window.confirm('La cantidad es 1. ¿Deseas eliminar este producto del carrito?')) {
                try {
                    await eliminarDetalleCarritoAdmin(id, idProducto);
                    toast.success('Producto eliminado del carrito.');
                    // Actualizar el estado local
                    setCarritoDetalles(prevDetalles =>
                        prevDetalles.filter(detalle => detalle.fk_id_producto !== idProducto)
                    );
                } catch (err) {
                    console.error('Error al eliminar el producto:', err);
                    toast.error('No se pudo eliminar el producto. Intenta nuevamente.');
                }
            }
        } else {
            const nuevaCantidad = cantidadActual - 1;
            try {
                await actualizarDetalleCarritoAdmin(id, idProducto, { nueva_cantidad: nuevaCantidad });
                toast.success('Cantidad actualizada exitosamente.');
                // Actualizar el estado local
                setCarritoDetalles(prevDetalles =>
                    prevDetalles.map(detalle =>
                        detalle.fk_id_producto === idProducto
                            ? { ...detalle, cantidad: nuevaCantidad, subtotal: nuevaCantidad * detalle.precio_unitario }
                            : detalle
                    )
                );
            } catch (err) {
                console.error('Error al actualizar la cantidad:', err);
                toast.error('No se pudo actualizar la cantidad. Intenta nuevamente.');
            }
        }
    };

    // Función para eliminar un producto específico del carrito
    const handleEliminarProducto = async (idProducto) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
            try {
                await eliminarDetalleCarritoAdmin(id, idProducto);
                toast.success('Producto eliminado del carrito.');
                // Actualizar el estado local
                setCarritoDetalles(prevDetalles =>
                    prevDetalles.filter(detalle => detalle.fk_id_producto !== idProducto)
                );
            } catch (err) {
                console.error('Error al eliminar el producto:', err);
                toast.error('No se pudo eliminar el producto. Intenta nuevamente.');
            }
        }
    };

    // Función para vaciar todo el carrito
    const handleVaciarCarrito = async () => {
        if (window.confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
            try {
                await eliminarDetallesCarritoAdmin(id);
                toast.success('Carrito vaciado exitosamente.');
                setCarritoDetalles([]);
            } catch (err) {
                console.error('Error al vaciar el carrito:', err);
                toast.error('No se pudo vaciar el carrito. Intenta nuevamente.');
            }
        }
    };

    // Función para agregar nuevos productos al carrito
    const handleAgregarProductos = () => {
        navigate(`/admin/usuarios/agregar-productos-carrito/${id}`);
    };

    // Renderizado condicional mientras se cargan los datos
    if (loading) {
        return (
            <Progress value={cargando} />
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

    // Calcular el total de los subtotales
    const total = carritoDetalles.reduce((acc, detalle) => acc + detalle.subtotal, 0);

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
            selector: row => row.ProductoDetalleCarrito.nombre,
            cell: row => <p>{row.ProductoDetalleCarrito.nombre}</p>,
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
            cell: row => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleDecrementar(row.fk_id_producto, row.cantidad)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        aria-label={`Decrementar cantidad de ${row.nombre_producto}`}
                    >
                        <CircleMinus></CircleMinus>
                    </button>
                    <span>{row.cantidad}</span>
                    <button
                        onClick={() => handleIncrementar(row.fk_id_producto, row.cantidad)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        aria-label={`Incrementar cantidad de ${row.nombre_producto}`}
                    >
                        <CirclePlus></CirclePlus>
                    </button>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Subtotal',
            cell: (row) => `Q${row.subtotal.toLocaleString()}`,
            sortable: true,
        },
        {
            name: 'Eliminar Detalle',
            cell: row => (
                <button
                    onClick={() => handleEliminarProducto(row.fk_id_producto)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    aria-label={`Eliminar ${row.nombre_producto} del carrito`}
                >
                    <Trash2></Trash2>
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // Configura el tema de la tabla
    configureDataTableTheme();

    // Muestra la tabla con los detalles del carrito y la información del cliente
    const tableData = {
        columns,
        data: carritoDetalles,
    };

    return (
        <>
            <h2 className='title-table-admin'>Editar Carrito del Cliente</h2>
            <div className='w-screen max-w-md flex-auto rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 p-4 mb-6'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='text-left font-bold'>
                        <p>ID Cliente:</p>
                        <p>Nombre Cliente:</p>
                        <p>Teléfono:</p>
                        <p>Email:</p>      
                        <p>Total</p>
                    </div>
                    <div className='text-left'>
                        <p>{id}</p>
                        <p>{clienteInfo.nombre || 'N/A'}</p>
                        <p>{clienteInfo.telefono || 'N/A'}</p>
                        <p>{clienteInfo.correo || 'N/A'}</p>
                        <p className='font-bold'>Q{total.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className='flex space-x-4 mb-6'>
                <button
                    onClick={handleVaciarCarrito}
                    className="focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Vaciar Carrito
                </button>
                <button
                    onClick={handleAgregarProductos}
                    className="focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Agregar Productos
                </button>
            </div>

            {/* Tabla de Detalles del Carrito */}
            <div className="container-table-admin">
                <DataTableExtensions
                    {...tableData}
                    fileName={`Detalles_Carrito_${id}`}
                    export={true}
                    exportHeaders={true}
                >
                    <DataTable
                        columns={columns}
                        data={carritoDetalles}
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

export default EditarCarritoAdmin;
