import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import configureDataTableTheme from '@/config/dataTableTheme';
import toast from 'react-hot-toast';

import {
  obtenerCategorias,
  activarCategoria,
  inactivarCategoria,
} from '@/services/categoriasService';

import Estados from '@/config/estados';
import { Progress } from '@/components/ui/progress';
import "styled-components"

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(20);
  // =============== 1. Fetch de categorías al montar el componente =============== //
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCargando(50);
        console.log('Iniciando solicitud para obtener categorías...');
        const categoriasData = await obtenerCategorias();
        console.log('Categorías obtenidas:', categoriasData);
        setCategorias(categoriasData);
        setCargando(80);
      } catch (err) {
        console.error('Error al obtener categorías:', err);
        setError('No se pudieron obtener las categorías. Intenta nuevamente más tarde.');
      } finally {
        setCargando(100);
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  // =============== 2. Funciones para activar/inactivar =============== //
  const handleActivate = async (id) => {
    try {
      await activarCategoria(id);
      const updatedData = await obtenerCategorias();
      setCategorias(updatedData);
      toast.success('Categoría activada exitosamente.');
    } catch (err) {
      toast.error('Error al activar la categoría.');
      setError('Error al activar la categoría.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarCategoria(id);
      const updatedData = await obtenerCategorias();
      setCategorias(updatedData);
      toast.success('Categoría inactivada exitosamente.');
    } catch (err) {
      toast.error('Error al inactivar la categoría.');
      setError('Error al inactivar la categoría.');
    }
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
      name: 'ID',
      selector: row => row.pk_id_categoria,
      cell: row => <p>{row.pk_id_categoria}</p>,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      cell: row => <p>{row.nombre}</p>,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      cell: row => <p>{row.descripcion}</p>,
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
          case Estados.ACTIVO:
            estadoTexto = 'Activo';
            className = 'badge-activo';
            break;
          case Estados.INACTIVO:
            estadoTexto = 'Inactivo';
            className = 'badge-inactivo';
            break;
          default:
            estadoTexto = Object.keys(Estados).find(key => Estados[key] === estado) || 'Desconocido';
            className = 'badge-desconocido';
        }
        return <span className={className}>{estadoTexto}</span>;
      },
      sortable: true,
    },
    {
      name: 'Acción',
      cell: (row) =>
        row.fk_estado === Estados.ACTIVO ? (
          <button onClick={() => handleInactivate(row.pk_id_categoria)} className="btn-inactivar">Inactivar</button>
        ) : (
          <button onClick={() => handleActivate(row.pk_id_categoria)} className="btn-activar">Activar</button>
        ),
        export:false // No exportar esta columna
    },
    {
      name: 'Actualizar',
      cell: (row) => (
        <Link to={`/admin/categorias/actualizar/${row.pk_id_categoria}`} className="btn-editar">Editar</Link>
      ),
      export:false // No exportar esta columna
    },
  ];

  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }


  // =============== 5. Personalizar Tema =============== //

  configureDataTableTheme();

  // =============== 6. Mostrar los datos en Data Tables con Exportación =============== //
  const tableData = {
    columns,
    data: categorias,
  };

  return (
    <div className="container-table-admin">
      <h2 className="title-table-admin">Gestión de Categorías</h2>

      <DataTableExtensions 
      {...tableData}
      fileName="Categorias Listado" 
      export={true}
      exportHeaders={true}
      >
        <DataTable
          columns={columns}
          data={categorias}
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

export default Categorias;
