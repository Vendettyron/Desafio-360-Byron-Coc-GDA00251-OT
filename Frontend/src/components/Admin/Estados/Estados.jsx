import React, { useEffect, useState } from 'react';
import { obtenerEstados} from '@/services/estadosService';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import { Progress } from '@/components/ui/progress';
import "styled-components"


const Estados = () => {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargando, setCargando] = useState(20);
  const [error, setError] = useState('');

  // =============== 1. Fetch de estados al montar el componente =============== //
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        setCargando(50);
        console.log('Iniciando solicitud para obtener estados...');
        const estadosData = await obtenerEstados();
        console.log('Estados obtenidos:', estadosData);
        setEstados(estadosData);
        setCargando(80);
      } catch (err) {
        console.error('Error al obtener estados:', err);
        setError('No se pudieron obtener los estados. Intenta nuevamente más tarde.');
      } finally {
        setCargando(100);
        setLoading(false);
      }
    };
    fetchEstados();
  }, []);

    // =============== 3. Renderizado condicional =============== //
  if (loading) {
    return (
        <Progress value={cargando} />
    );
  }


  // =============== 2. Configurar Columns de Data Tables =============== //
  const columns = [
    {
      name: 'ID',
      selector: row => row.pk_id_estado,
      cell: row => <p>{row.pk_id_estado}</p>,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,  
      cell: row => <p>{row.nombre}</p>,
      sortable: true,
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/estados/actualizar/${row.pk_id_estado}`}  className="btn-editar">Editar</Link>
      ),
      export:false // No exportar este campo
    },
  ];

  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }

  // =============== 5. Personalizar Tabla =============== //
  configureDataTableTheme();

  // =============== 7. Mostrar los datos en Data Tables con Exportación =============== //
  const tableData = {
    columns,
    data: estados,
  };

  return (
    <div className="container-table-admin">
      <h2 className="title-table-admin">Gestión de Estados</h2>

      <DataTableExtensions
        {...tableData}
        export={true}
        exportHeaders={true}
        fileName="Estados Listado"
      >
        <DataTable
          columns={columns}
          data={estados}
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

export default Estados;
