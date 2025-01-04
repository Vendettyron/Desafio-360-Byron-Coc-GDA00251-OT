import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { obtenerProductoPorId, actualizarProducto, subirImagenProducto } from '@/services/productosService';
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
import { Progress } from '@/components/ui/progress';

const ActualizarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const {
    register,
    handleSubmit,
    setValue,
    watch, // Para observar cambios en el formulario
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(productosSchema),
    defaultValues: {
      fk_categoria: '',
      fk_estado: '',
      fk_proveedor: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: null, // Campo para la nueva imagen
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

        // Obtener datos del producto
        const productoData = await obtenerProductoPorId(id);
        console.log('Datos del producto:', productoData);

        if (productoData && Array.isArray(productoData) && productoData.length > 0) {
          const producto = productoData[0];
          setValue('fk_categoria', producto.fk_categoria || '');
          setValue('fk_estado', producto.fk_estado || '');
          setValue('fk_proveedor', producto.fk_proveedor || '');
          setValue('nombre', producto.nombre || '');
          setValue('descripcion', producto.descripcion || '');
          setValue('precio', producto.precio || '');
          setValue('stock', producto.stock || '');
        } else if (productoData && typeof productoData === 'object') {
          setValue('fk_categoria', productoData.fk_categoria || '');
          setValue('fk_estado', productoData.fk_estado || '');
          setValue('fk_proveedor', productoData.fk_proveedor || '');
          setValue('nombre', productoData.nombre || '');
          setValue('descripcion', productoData.descripcion || '');
          setValue('precio', productoData.precio || '');
          setValue('stock', productoData.stock || '');
        } else {
          setError('No se encontró el producto con el ID proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('No se pudieron obtener los datos. Intenta nuevamente.');
      }
    };
    fetchDatos();
  }, []);

  // Observar el campo de imagen para detectar cambios
  const selectedImage = watch('imagen');

  // Manejo del submit
  const onSubmit = async (formData) => {
    const productoActualizado = {
      fk_categoria: parseInt(formData.fk_categoria, 10),
      fk_estado: parseInt(formData.fk_estado, 10),
      fk_proveedor: parseInt(formData.fk_proveedor, 10),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      fk_id_usuario: auth?.usuario?.id, // ID de quien actualiza (admin)
    };

    try {
      // Actualizar la información del producto
      await actualizarProducto(id, productoActualizado);

      // Si se ha seleccionado una nueva imagen, subirla
      if (formData.imagen && formData.imagen.length > 0) {
        const imagenData = new FormData();
        imagenData.append('imagen', formData.imagen[0]);

        await subirImagenProducto(id, imagenData);
        setImageTimestamp(Date.now()); // Actualizar el timestamp
        toast.success('¡Producto e imagen actualizados exitosamente!');
      } else {
        toast.success('¡Producto actualizado exitosamente!');
      }

      // Redirecciona al listado de productos
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error al actualizar producto:', error.response?.data || error.message);
      setError('Hubo un problema al actualizar el producto. Intenta nuevamente.');
      toast.error('Hubo un problema al actualizar el producto. Intenta nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Actualizar Producto">
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

            {/* Estado*/}
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

          {/* IMAGEN ACTUAL */}
          <div style={{ marginBottom: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center' }} className='mb-2'>
          <div >
            <p>Imagen Actual</p>
            <img
            src={`/assets/productos/${id}.jpg?t=${imageTimestamp}`}
            alt="Imagen actual del producto"
            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
            className='mt-4 p-3 shadow-lg bg-white rounded-lg'
            />
          </div>
          </div>
          
                {/* NUEVA IMAGEN */}
          <FormInput
            label="Nueva Imagen:"
            id="imagen"
            type="file"
            accept="image/jpeg, image/png"
            register={register('imagen')}
            error={errors.imagen?.message}
          />

          {/* BOTÓN DE ACTUALIZAR */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Guardando...' : 'Actualizar'}
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

export default ActualizarProducto;
