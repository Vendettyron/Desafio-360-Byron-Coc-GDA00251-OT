// src/components/Pedidos/Pedidos.js

import React, { useEffect, useState } from 'react';
import { obtenerPedidos } from '@/services/pedidosService'; 
import { obtenerUsuarios } from '@/services/usuariosService';
import Estados from '@/config/estados'; 
import { Link, useNavigate } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import { Button } from '@/components/ui/button'; 

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]); 
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 


    const [usuariosMap, setUsuariosMap] = useState({});

    // =============== 1. Fetch de pedidos y usuarios al montar el componente =============== //
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                console.log('Iniciando solicitud para obtener pedidos y usuarios...');
                const [pedidosData, usuariosData] = await Promise.all([
                    obtenerPedidos(),
                    obtenerUsuarios(),
                ]);
                console.log('Pedidos obtenidos:', pedidosData);
                console.log('Usuarios obtenidos:', usuariosData);
                setPedidos(pedidosData);
                setUsuarios(usuariosData);

                // Crear el mapa de usuarios
                const map = {};
                usuariosData.forEach(user => {
                    map[user.pk_id_usuario] = user;
                });
                setUsuariosMap(map);
            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError('No se pudieron obtener los datos.');
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, []);

    // =============== 2. Funciones para navegar a los componentes correspondientes =============== //
    const handleVerDetalles = (idcliente, idpedido) => {
        navigate(`/admin/pedido/obtenerDetallesClientePorAdmin/${idcliente}/${idpedido}`);
    };

    const handleConfirmarCancelar = (pedidoseleccionado) => { 
        navigate(`/admin/pedido/confirmar-cancelar/${pedidoseleccionado}`); 
    };

    // =============== 3. Renderizado condicional =============== //
    if (loading) {
        return (
            <div className="text-center mt-5">
                <p>Cargando pedidos...</p>
            </div>
        );
    }

    // =============== 4. Configurar Columns de Data Tables =============== //
    const columns = [
        {
            name: 'ID Pedido',
            selector: row => row.pk_id_pedido,
            cell: row => <p>{row.pk_id_pedido}</p>,
            sortable: true,
        },
        {
            name: 'ID Cliente',
            cell: (row) => {
                const usuario = usuariosMap[row.fk_cliente];
                return usuario ? usuario.pk_id_usuario : 'Desconocido';
            },
            sortable: true,
        },
        {
            name: 'Nombre Cliente',
            cell: (row) => {
                const usuario = usuariosMap[row.fk_cliente];
                return usuario ? usuario.nombre : 'Desconocido';
            },
            sortable: true,
        },
        {
            name: 'Teléfono',
            cell: (row) => {
                const usuario = usuariosMap[row.fk_cliente];
                return usuario ? usuario.telefono : 'Desconocido';
            },
            sortable: true,
        },
        {
            name: 'Fecha Pedido',
            selector: row => row.fecha_pedido,
            cell: row => <p>{new Date(row.fecha_pedido).toLocaleString()}</p>,
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => row.total,
            cell: row => <p>Q{row.total.toLocaleString()}</p>,
            sortable: true,
        },
        {
            name: 'Estado',
            selector: row => row.fk_estado,
            cell: row => {
                const estado = row.fk_estado;
                let estadoTexto = 'Desconocido';
                switch (estado) {
                    case Estados.CONFIRMADO_POR_ADMIN:
                        estadoTexto = 'Confirmado por Admin';
                        break;
                    case Estados.CANCELADO_POR_ADMIN:
                        estadoTexto = 'Cancelado por Admin';
                        break;
                    case Estados.CANCELADO_POR_CLIENTE:
                        estadoTexto = 'Cancelado por Cliente';
                        break;
                    case Estados.DESCONTINUADO:
                        estadoTexto = 'Descontinuado';
                        break;
                    case Estados.EN_PROCESO:
                        estadoTexto = 'En Proceso';
                        break;
                    default:
                        estadoTexto = Object.keys(Estados).find(key => Estados[key] === estado) || 'Desconocido';
                }
                return <p>{estadoTexto}</p>;
            },
            sortable: true,
            ignoreExport: true,
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div>
                    <Button
                        onClick={() => handleVerDetalles(row.fk_cliente, row.pk_id_pedido)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        style={{ width: '10rem', marginBottom: '5px', marginTop: '5px' }}
                    >
                        Ver detalles
                    </Button>
                    {row.fk_estado === Estados.EN_PROCESO && (
                        <Button
                            onClick={() => handleConfirmarCancelar(row.pk_id_pedido)}
                            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                            style={{ width: '10rem' }}
                        >
                            Confirmar / Cancelar
                        </Button>
                    )}
                </div>
            ),
            ignoreExport: true,
            cellExport: row => ({}), // No exportar este campo
        },
    ];

    // =============== 5. Manejo de Errores =============== //
    if (error) {
        return (
            <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
                {error}
            </div>
        );
    }

    // =============== 6. Personalizar Tema de la Tabla =============== //
   
    configureDataTableTheme();
    // =============== 7. Mostrar los Datos en Data Tables =============== //
    const tableData = {
        columns,
        data: pedidos,
    };

    return (
        <>
            <h2 className='text-3xl'>Gestión de Pedidos</h2>

            <DataTableExtensions 
                {...tableData} 
                fileName="Pedidos Listado" 
                export={true}
                exportHeaders={true}
            >
                <DataTable
                    columns={columns}
                    data={pedidos}
                    theme='custom'
                    noHeader
                    pagination
                    highlightOnHover
                />
            </DataTableExtensions>
        </>
    );
};

export default Pedidos;
