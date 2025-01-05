import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { obtenerEstadoPorId, actualizarEstado } from '@/services/estadosService';

// Schema de validación
import { estadoSchema } from '@/utils/validationSchemas';

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormLayout from '@/components/Forms/FormLayout';
import { Button} from '@/components/ui/button';


const ActualizarEstado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(estadoSchema),
    defaultValues: {
      nombre: '',
    },
  });

  useEffect(() => {
    const fetchEstado = async () => {
      try {
        const data = await obtenerEstadoPorId(id);
       

        if (Array.isArray(data) && data.length > 0) {
          // Si data es un arreglo con al menos un elemento
          setValue('nombre', data[0].nombre || '');
        } else if (data && typeof data === 'object') {
          // Si data es un objeto único
          setValue('nombre', data.nombre || '');
        } else {
          setError('No se encontró el estado con el ID proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener estado por ID:', error);
        setError('No se pudo obtener el estado. Intente nuevamente.');
      }
    };
    fetchEstado();
  }, [id, setValue]);

  // Manejo del submit
  const onSubmit = async (formData) => {
    const estadoActualizado = {
      pk_id_estado: parseInt(id, 10),
      nombre: formData.nombre,
    };

    try {
      await actualizarEstado(id, estadoActualizado);
      // Redirecciona al listado
      navigate('/admin/estados');
      toast.success('¡Estado actualizado exitosamente!');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setError('Hubo un problema al actualizar el estado. Intente nuevamente.');
      toast.error('Hubo un problema al actualizar el estado. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Actualizar Estado">
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            register={register('nombre')}
            error={errors.nombre?.message}
            placeholder="Ingrese el nombre del estado"
          />

          {/* BOTÓN DE ACTUALIZAR */}
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

export default ActualizarEstado;
