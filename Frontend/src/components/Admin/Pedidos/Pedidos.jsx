import React, { useEffect, useState } from 'react';
import { obtenerPedidos } from '@/services/pedidosService'; 
import { obtenerUsuarios } from '@/services/usuariosService';
import Estados from '@/config/estados'; 
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import { Progress } from '@/components/ui/progress'; 
import "styled-components"

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]); 
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(20);
    const navigate = useNavigate(); 


    const [usuariosMap, setUsuariosMap] = useState({});

    // =============== 1. Fetch de pedidos y usuarios al montar el componente =============== //
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                setCargando(50);
                console.log('Iniciando solicitud para obtener pedidos y usuarios...');
                const [pedidosData, usuariosData] = await Promise.all([
                    obtenerPedidos(),
                    obtenerUsuarios(),
                ]);
                console.log('Pedidos obtenidos:', pedidosData);
                console.log('Usuarios obtenidos:', usuariosData);
                setPedidos(pedidosData);
                setUsuarios(usuariosData);
                setCargando(80);
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
                setCargando(100);
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
        <Progress value={cargando} />
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
                let className = '';
                switch (estado) {
                    case Estados.CONFIRMADO_POR_ADMIN:
                        estadoTexto = 'Confirmado por Admin';
                        className = 'badge-activo';
                        break;
                    case Estados.CANCELADO_POR_ADMIN:
                        estadoTexto = 'Cancelado por Admin';
                        className = 'badge-inactivo';
                        break;
                    case Estados.CANCELADO_POR_CLIENTE:
                        estadoTexto = 'Cancelado por Cliente';
                        className = 'badge-inactivo';
                        break;
                    case Estados.EN_PROCESO:
                        estadoTexto = 'En Proceso';
                        className = 'badge-en-proceso';
                        break;
                    default:
                        estadoTexto = Object.keys(Estados).find(key => Estados[key] === estado) || 'Desconocido';
                        className = 'badge-desconocido';
                }
                return <span className={className}>{estadoTexto}</span>;
            },
            sortable: true,
            ignoreExport: true,
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div>
                    <button
                        onClick={() => handleVerDetalles(row.fk_cliente, row.pk_id_pedido)}
                        className="btn-editar"
                        style={{ width: '10rem', marginBottom: '5px', marginTop: '5px' }}
                    >
                        Ver detalles
                    </button>
                    {row.fk_estado === Estados.EN_PROCESO && (
                        <button
                            onClick={() => handleConfirmarCancelar(row.pk_id_pedido)}
                            className="btn-ver-detalles"
                            style={{ width: '10rem' }}
                        >
                            Confirmar / Cancelar
                        </button>
                    )}
                </div>
            ),
            export:false // No exportar esta columna
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
        <div className="container-table-admin">
            <h2 className='title-table-admin'>Gestión de Pedidos</h2>

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
                    className="mt-3"
                />
            </DataTableExtensions>
        </div>
    );
};

export default Pedidos;
