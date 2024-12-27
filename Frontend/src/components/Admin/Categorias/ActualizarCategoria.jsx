import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '../../../context/AuthContext';
import { obtenerCategoriaPorId, actualizarCategoria } from '../../../services/categoriasService';

// Schema de validación
import { categoriaCrearSchema } from '../../../utils/validationSchemas'; // Reutiliza el mismo schema si no hay diferencias

// Componentes reutilizables
import FormInput from '../../Forms/FormInput';
import FormSelect from '../../Forms/FormSelect';
import FormLayout from '@/components/Forms/FormLayout';
import { Button } from '@/components/ui/button';

const ActualizarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');

  // esquema de validación para el formulario de Actualizar Categoría
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(categoriaCrearSchema), 
    defaultValues: {
      nombre: '',
      descripcion: '',
      fk_estado: 1, // Activo por defecto
    },
  });

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await obtenerCategoriaPorId(id);
        if (data) {
          // Llenar los campos con los datos de la categoría
          setValue('nombre', data.nombre || '');
          setValue('descripcion', data.descripcion || '');
          setValue('fk_estado', data.fk_estado || 1);
        }
      } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        setError('No se pudo obtener la categoría. Intente nuevamente.');
      }
    };
    fetchCategoria();
  }, [id, setValue]);

  // Manejo del submit
  const onSubmit = async (formData) => {
    const categoriaActualizada = {
      pk_id_categoria: parseInt(id, 10),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fk_estado: parseInt(formData.fk_estado, 10),
      fk_id_usuario: auth?.usuario?.id, // ID de quien actualiza (admin)
    };

    try {
      await actualizarCategoria(id, categoriaActualizada);
      // Redirecciona al listado
      navigate('/admin/categorias');
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      setError('Hubo un problema al actualizar la categoría. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Actualizar Categoría">
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

          {/* ESTADO */}
          <FormSelect
            label="Estado:"
            id="fk_estado"
            register={register('fk_estado')}
            error={errors.fk_estado?.message}
            options={[
              { label: 'Activo', value: 1 },
              { label: 'Inactivo', value: 2 },
            ]}
          />

          <div style={{ display: 'flex', justifyContent: 'center' }}>
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

export default ActualizarCategoria;