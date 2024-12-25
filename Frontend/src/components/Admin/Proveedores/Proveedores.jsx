import React, { useEffect, useState } from 'react';
import { getProveedores, activarProveedor,inactivarProveedor } from '../../../services/proveedoresService';
import { Link } from 'react-router-dom';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =============== 1. Fetch de proveedores al montar el componente =============== //
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        console.log('Iniciando solicitud para obtener proveedores...');
        const data = await getProveedores();
        console.log('Proveedores obtenidos:', data);
        setProveedores(data);
      } catch (err) {
        console.error('Error al obtener proveedores:', err);
        setError('No se pudieron obtener los proveedores. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchProveedores();
  }, []);

  // =============== 2. Funciones para activar/inactivar =============== //
  const handleActivate = async (id) => {
    try {
      await activarProveedor(id);
      const updatedData = await getProveedores();
      setProveedores(updatedData);
    } catch (err) {
      console.error('Error al activar proveedor:', err);
      setError('Error al activar el proveedor.');
    }
  };

  const handleInactivate = async (id) => {
    try {
      await inactivarProveedor(id);
      const updatedData = await getProveedores();
      setProveedores(updatedData);
    } catch (err) {
      console.error('Error al inactivar proveedor:', err);
      setError('Error al inactivar el proveedor.');
    }
  };

  // =============== 3. Renderizado condicional =============== //
  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ border: '1px solid red', padding: '10px', marginTop: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <h2>Gestión de Proveedores</h2>
      <table id='tablaProveedores'
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ marginTop: '20px', width: '100%' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acción</th> {/* Nueva columna */}
            <th>Actualizar</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.pk_id_proveedor}>
              <td>{proveedor.pk_id_proveedor}</td>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.correo}</td>
              <td>{proveedor.fk_estado === 1 ? 'Activo' : 'Inactivo'}</td>
              <td>
                {proveedor.fk_estado === 1 ? (
                  <button onClick={() => handleInactivate(proveedor.pk_id_proveedor)}>
                    Inactivar
                  </button>
                ) : (
                  <button onClick={() => handleActivate(proveedor.pk_id_proveedor)}>
                    Activar
                  </button>
                )}
              </td>
              <td>
                <Link to={`/admin/proveedores/actualizar/${proveedor.pk_id_proveedor}`}>
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Proveedores;
