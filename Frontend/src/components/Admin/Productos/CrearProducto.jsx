import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { crearProducto } from '@/services/productosService';
import { obtenerCategorias } from '@/services/categoriasService';
import { getProveedores } from '@/services/proveedoresService';
import Estados from '@/config/estados';
// Schema de validación
import { productosSchema } from '@/utils/validationSchemas';

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormSelect from '@/components/Forms/FormSelect';
import FormLayout from '@/components/Forms/FormLayout';
import { Button } from '@/components/ui/button';

const CrearProducto = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(productosSchema),
    defaultValues: {
      fk_categoria: '',
      fk_estado: Estados.ACTIVO, // Activo por defecto
      fk_proveedor: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
    },
  });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Obtener categorías y proveedores
        const [categoriasData, proveedoresData] = await Promise.all([
          obtenerCategorias(),
          getProveedores(),
        ]);
        setCategorias(categoriasData);
        setProveedores(proveedoresData);
      } catch (err) {
        console.error('Error al obtener categorías o proveedores:', err);
        setError('No se pudieron obtener las categorías o proveedores. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  // Manejo del submit
  const onSubmit = async (formData) => {
    const nuevoProducto = {
      fk_categoria: parseInt(formData.fk_categoria, 10),
      fk_estado: parseInt(formData.fk_estado, 10),
      fk_proveedor: parseInt(formData.fk_proveedor, 10),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      fk_id_usuario: auth?.usuario?.id, // ID de quien crea (admin)
    };

    try {
      await crearProducto(nuevoProducto);
      // Resetear el formulario después de una creación exitosa
      reset();
      // Redirecciona al listado de productos
      navigate('/admin/productos');
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError('Hubo un problema al crear el producto. Intenta nuevamente.');
    }
  };

  // Renderizado condicional mientras se cargan categorías y proveedores
  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Cargando datos necesarios...</p>
      </div>
    );
  }

  return (
    <>
      <FormLayout title="Crear Producto">
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            register={register('nombre')}
            error={errors.nombre?.message}
          />

          {/* DESCRIPCIÓN */}
          <FormInput
            label="Descripción:"
            id="descripcion"
            register={register('descripcion')}
            error={errors.descripcion?.message}
          />

          {/* PRECIO */}
          <FormInput
            label="Precio:"
            id="precio"
            type="number"
            step="0.01"
            register={register('precio')}
            error={errors.precio?.message}
          />

          {/* STOCK */}
          <FormInput
            label="Stock:"
            id="stock"
            type="number"
            register={register('stock')}
            error={errors.stock?.message}
          />

          {/* CATEGORÍA */}
          <FormSelect
            label="Categoría:"
            id="fk_categoria"
            register={register('fk_categoria')}
            error={errors.fk_categoria?.message}
            options={[
              { label: 'Seleccione una categoría', value: '' },
              ...categorias.map(cat => ({ label: cat.nombre, value: cat.pk_id_categoria })),
            ]}
          />

          {/* PROVEEDOR */}
          <FormSelect
            label="Proveedor:"
            id="fk_proveedor"
            register={register('fk_proveedor')}
            error={errors.fk_proveedor?.message}
            options={[
              { label: 'Seleccione un proveedor', value: '' },
              ...proveedores.map(prov => ({ label: prov.nombre, value: prov.pk_id_proveedor })),
            ]}
          />

          {/* ESTADO */}
          <FormSelect
            label="Estado:"
            id="fk_estado"
            register={register('fk_estado')}
            error={errors.fk_estado?.message}
            options={[
              { label: 'Activo', value: Estados.ACTIVO },
              { label: 'Inactivo', value: Estados.INACTIVO },
              { label: 'Descontinuado', value: Estados.DESCONTINUADO },
            ]}
          />

          {/* BOTÓN DE CREAR */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </form>
      </FormLayout>

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div
          style={{
            border: '1px solid red',
            padding: '10px',
            marginTop: '20px',
            color: 'red',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
    </>
  );
};

export default CrearProducto;
