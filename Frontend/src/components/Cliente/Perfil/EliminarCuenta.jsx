// src/components/EliminarCuenta.jsx

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { eliminarUsuarioElMismo } from '@/services/usuariosService';

// Schema de validación
import { EliminarUsuarioElMismoSchema } from '@/utils/validationSchemas';

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormLayout from '@/components/Forms/FormLayout';
import { Button } from '@/components/ui/button';

const EliminarCuenta = () => {
  const navigate = useNavigate();
  const { auth, logoutUser } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(EliminarUsuarioElMismoSchema),
    defaultValues: {
      correo: '',
      password: '',
      confirmarPassword: '',
    },
  });

  // Redirigir a la página de inicio de sesión 
  const handleCerrarSesion = () => {
    logoutUser();
    navigate('/login'); 
  };

  // Manejo del submit
  const onSubmit = async (formData) => {
    const usuarioInactivar ={
      correo: formData.correo,
      password: formData.password,
    }

    try {
      
      await eliminarUsuarioElMismo(usuarioInactivar);
      toast.success('Cuenta eliminada con éxito.');
      handleCerrarSesion();

    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      toast.error('Error al eliminar cuenta. Por favor, intenta de nuevo.');
    }
  };

  return (
    <>
      <FormLayout title="Eliminar Cuenta">
        <form onSubmit={handleSubmit(onSubmit)} className="eliminar-cuenta-form">
          {/* CORREO ELECTRÓNICO */}
          <FormInput
            label="Correo Electrónico:"
            id="correo"
            type="email"
            register={register('correo')}
            error={errors.correo?.message}
            placeholder="Ingresa tu correo electrónico"
          />

          {/* CONTRASEÑA */}
          <FormInput
            label="Contraseña:"
            id="password"
            type="password"
            register={register('password')}
            error={errors.password?.message}
            placeholder="Ingresa tu contraseña"
          />

          {/* CONFIRMAR CONTRASEÑA */}
          <FormInput
            label="Confirmar Contraseña:"
            id="confirmarPassword"
            type="password"
            register={register('confirmarPassword')}
            error={errors.confirmarPassword?.message}
            placeholder="Confirma tu contraseña"
          />

          {/* BOTÓN DE ELIMINAR CUENTA */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button type="submit" disabled={isSubmitting || !isDirty} className="btn-danger">
              {isSubmitting ? 'Eliminando...' : 'Eliminar Cuenta'}
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

export default EliminarCuenta;
