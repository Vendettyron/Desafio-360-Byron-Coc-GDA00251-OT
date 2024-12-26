import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoriaCrearSchema } from '../../../utils/validationSchemas'; // Asegúrate de tener este schema
import { crearCategoria } from '../../../services/categoriasService'; // Importa el servicio correspondiente

import { Button } from '@/components/ui/button';
import FormLayout from '@/components/Forms/FormLayout';
import FormInput from '../../Forms/FormInput';
import FormSelect from '../../Forms/FormSelect';

const CrearCategoria = () => {
  const [error, setError] = useState('');

  // esquema de validación para el formulario de Crear Categoría
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(categoriaCrearSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      fk_estado: 1, // Por defecto, asignamos 1 (Activo)
    },
  });

  const onSubmit = async (formData) => {
    try {
      const categoriaCreada = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fk_estado: formData.fk_estado,
      };

      // Llamar al servicio para crear la categoría
      await crearCategoria(categoriaCreada);

      // Limpia el formulario
      reset();
      setError('');
      alert('¡Categoría creada exitosamente!');
    } catch (err) {
      console.error('Error al crear categoría:', err);
      setError('Hubo un problema al crear la categoría. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Crear Categoría">
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
              {isSubmitting ? 'Creando...' : 'Crear Categoría'}
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

export default CrearCategoria;
