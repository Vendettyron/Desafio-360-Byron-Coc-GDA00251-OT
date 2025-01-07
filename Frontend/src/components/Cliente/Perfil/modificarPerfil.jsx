import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { actualizarUsuarioElMismo } from '@/services/usuariosService';

// Schema de validación
import { usuariosElMismoSchema } from '@/utils/validationSchemas'; 

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormLayout from '@/components/Forms/FormLayout';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const ModificarPerfil = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(usuariosElMismoSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      direccion: '',
      correo: '',
      telefono: '',
    },
  });

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      try {
        if (auth?.usuario) {
          setValue('nombre', auth.usuario.nombre || '');
          setValue('apellido', auth.usuario.apellido || '');
          setValue('direccion', auth.usuario.direccion || '');
          setValue('correo', auth.usuario.correo || '');
          setValue('telefono', auth.usuario.telefono || '');
        } else {
          setError('No se encontró información del usuario.');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError('No se pudo cargar la información del usuario. Intente nuevamente.');
      }
    };
    fetchDatosUsuario();
  }, [auth, setValue]);

  // Manejo del submit
  const onSubmit = async (formData) => {

    const datosActualizados = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      direccion: formData.direccion,
      correo: formData.correo,
      telefono: formData.telefono,
    };

    try {
      const resultado = await actualizarUsuarioElMismo(datosActualizados);
      toast.success(resultado.Mensaje || '¡Perfil actualizado exitosamente!');

      // Actualizar el contexto de autenticación con los nuevos datos del usuario
      setAuth({
        ...auth,
        usuario: {
          ...auth.usuario,
          nombre: formData.nombre,  
          apellido: formData.apellido,
          direccion: formData.direccion,
          correo: formData.correo,
          telefono: formData.telefono,
        },
      });

        // Redirigir al perfil

        navigate('/cliente/perfil');
      

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError('Hubo un problema al actualizar el perfil. Intente nuevamente.');
      toast.error('Hubo un problema al actualizar el perfil. Intente nuevamente.');
    }
  };

  return (
    <div className='flex flex-col items-center mt-10'>
      <FormLayout title="Modificar Perfil">
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            placeholder="Ingrese su nombre"
            register={register('nombre')}
            error={errors.nombre?.message}
          />

          {/* APELLIDO */}
          <FormInput
            label="Apellido:"
            id="apellido"
            placeholder="Ingrese su apellido"
            register={register('apellido')}
            error={errors.apellido?.message}
          />

          {/* DIRECCIÓN */}
          <FormInput
            label="Dirección:"
            id="direccion"
            placeholder="Ingrese su dirección"
            register={register('direccion')}
            error={errors.direccion?.message}
          />

          {/* CORREO */}
          <FormInput
            label="Correo:"
            id="correo"
            type="email"
            placeholder="Ingrese su correo"
            register={register('correo')}
            error={errors.correo?.message}
          />

          {/* TELÉFONO */}
          <FormInput
            label="Teléfono:"
            id="telefono"
            placeholder="Ingrese su teléfono"
            register={register('telefono')}
            error={errors.telefono?.message}
          />

          {/* BOTÓN DE ACTUALIZAR */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Guardando...' : 'Actualizar Perfil'}
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
    </div>
  );
};

export default ModificarPerfil;
