import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { actualizarPasswordUsuario } from '@/services/usuariosService';

// Schema de validación
import { ActualizarPasswordSchema } from '@/utils/validationSchemas';

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormLayout from '@/components/Forms/FormLayout';
import { Button } from '@/components/ui/button';

const CambiarPassword = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Acceder a la información del usuario autenticado
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(ActualizarPasswordSchema),
    defaultValues: {
      actualPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Manejo del submit
  const onSubmit = async (formData) => {
    const datosPassword = {
      pk_id_usuario: auth?.usuario?.id, // ID del usuario actual
      actualPassword: formData.actualPassword,
      newPassword: formData.newPassword,
    };

    try {
      await actualizarPasswordUsuario(datosPassword);
      toast.success('¡Contraseña actualizada exitosamente!');
      
      navigate('/cliente/perfil'); // Redirigir al perfil
    } catch (err) {
      console.error('Error al cambiar la contraseña:', err);
      setError('Hubo un problema al cambiar la contraseña. Intente nuevamente.');
      toast.error('Hubo un problema al cambiar la contraseña. Intente nuevamente.');
    }
  };

  return (
    <div className='flex flex-col items-center mt-10'>
      <FormLayout title="Cambiar Contraseña">
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* CONTRASEÑA ACTUAL */}
          <FormInput
            label="Contraseña Actual:"
            id="actualPassword"
            type="password"
            placeholder="Ingrese su contraseña actual"
            register={register('actualPassword')}
            error={errors.actualPassword?.message}
          />

          {/* NUEVA CONTRASEÑA */}
          <FormInput
            label="Nueva Contraseña:"
            id="newPassword"
            type="password"
            placeholder="Ingrese su nueva contraseña"
            register={register('newPassword')}
            error={errors.newPassword?.message}
          />

          {/* CONFIRMAR NUEVA CONTRASEÑA */}
          <FormInput
            label="Confirmar Nueva Contraseña:"
            id="confirmNewPassword"
            type="password"
            placeholder="Confirme su nueva contraseña"
            register={register('confirmNewPassword')}
            error={errors.confirmNewPassword?.message}
          />

          {/* BOTÓN DE ACTUALIZAR */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Guardando...' : 'Cambiar Contraseña'}
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

export default CambiarPassword;
