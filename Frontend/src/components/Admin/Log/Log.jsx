import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import { Progress } from '@/components/ui/progress';
import "styled-components" 
import toast from 'react-hot-toast';

// Importa el servicio 
import { obtenerLogs } from '@/services/log.Service'; 

const Log = () => {
  // =============== 1. Estados =============== //
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [error, setError] = useState('');

  // =============== 2. useEffect para cargar la data al montar =============== //
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setCargando(50);
        console.log('Iniciando solicitud para obtener logs...');
        const logsData = await obtenerLogs(); // Llama al servicio
        console.log('Logs obtenidos:', logsData);
        setLogs(logsData);
        setCargando(80);
      } catch (err) {
        console.error('Error al obtener logs:', err);
        setError('No se pudo obtener la información del Log. Intenta nuevamente más tarde.');
        toast.error('Error al obtener Log.');
      } finally {
        setCargando(100);
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // =============== 3. Renderizado condicional si está cargando =============== //
  if (loading) {
    return <Progress value={cargando} />;
  }

  // =============== 4. Manejo de error =============== //
  if (error) {
    return (
      <div
        style={{
          border: '1px solid red',
          padding: '10px',
          marginTop: '20px',
          color: 'red',
        }}
      >
        {error}
      </div>
    );
  }

  // =============== 5. Configurar las columnas de la tabla =============== //
  const columns = [
    {
      name: 'ID Log',
      selector: row => row.pk_id_log,
      cell: row => <p>{row.pk_id_log}</p>,
      sortable: true,
    },
    {
      name: 'Fecha/Hora',
      selector: row => row.fechaHora,
      cell: row => (
        <p>
          {new Date(row.fechaHora).toLocaleString('es-ES', {
            dateStyle: 'short',
            timeStyle: 'medium',
          })}
        </p>
      ),
      sortable: true,
    },
    {
      name: 'Usuario ID',
      selector: row => row.fk_id_usuario,
      cell: row => <p>{row.fk_id_usuario ?? 'N/A'}</p>,
      sortable: true,
    },
    {
      name: 'Entidad Afectada',
      selector: row => row.entidadAfectada,
      cell: row => <p>{row.entidadAfectada}</p>,
      sortable: true,
    },
    {
      name: 'Operación',
      selector: row => row.operacion,
      cell: row => <p>{row.operacion}</p>,
      sortable: true,
    },
    {
      name: 'Detalles',
      selector: row => row.detalles,
      cell: row => <p>{row.detalles}</p>,
      sortable: false,
    },
    {
      name: 'Resultado',
      selector: row => row.resultado,
      cell: row => <p>{row.resultado}</p>,
      sortable: true,
    },
  ];

  // =============== 6. Personalizar tema de la tabla =============== //
  configureDataTableTheme(); 

  // =============== 7. Preparar data para DataTableExtensions =============== //
  const tableData = {
    columns,
    data: logs, 
  };

  // =============== 8. Renderizar =============== //
  return (
    <div className="container-table-admin">
      <h2 className="title-table-admin">Registros de Log</h2>

      <DataTableExtensions
        {...tableData}
        fileName="Log_Reciente"
        export={true}
        exportHeaders={true}
      >
        <DataTable
          columns={columns}
          data={logs}
          theme="custom"
          noHeader
          pagination
          highlightOnHover
          className="mt-3"
        />
      </DataTableExtensions>
    </div>
  );
};

export default Log;