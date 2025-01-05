import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { estadoSchema } from '@/utils/validationSchemas';
import { crearEstado } from '@/services/estadosService';
import toast from 'react-hot-toast';

// Componentes reutilizables
import { Button } from '@/components/ui/button';
import FormLayout from '@/components/Forms/FormLayout';
import FormInput from '@/components/Forms/FormInput';

const CrearEstado = () => {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(estadoSchema),
    defaultValues: {
      nombre: '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      const estadoCreado = {
        nombre: formData.nombre,
      };

      // Llamar al servicio para crear el estado
      await crearEstado(estadoCreado);

      // Limpia el formulario
      reset();
      setError('');
      toast.success('¡Estado creado exitosamente!');
    } catch (err) {
      console.error('Error al crear estado:', err);
      setError('Hubo un problema al crear el estado. Intente nuevamente.');
      toast.error('Hubo un problema al crear el estado. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Crear Estado">

        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            register={register('nombre')}
            error={errors.nombre?.message}
            placeholder="Ingrese el nombre del estado"
          />

          {/* Mensaje de Error */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Creando...' : 'Crear Estado'}
            </Button>
          </div>

        </form>

      </FormLayout>
    </>
  );
};

export default CrearEstado;
