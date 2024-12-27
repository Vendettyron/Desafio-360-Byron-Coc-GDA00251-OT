import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { registerUser } from '@/services/authService';
import Roles from '@/config/roles';
import Estados from '@/config/estados';

// Schema de validación
import { usuariosSchema } from '@/utils/validationSchemas';

// Componentes reutilizables
import { Button } from '@/components/ui/button';
import FormLayout from '@/components/Forms/FormLayout';
import FormInput from '@/components/Forms/FormInput';
import FormSelect from '@/components/Forms/FormSelect';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Datos de autenticación
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(usuariosSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      direccion: '',
      correo: '',
      telefono: '',
      password: '',
      fk_rol: Roles.CLIENTE, // Cliente por defecto
      fk_estado: Estados.ACTIVO, // Activo por defecto
    },
  });

  // Manejo del submit
  const onSubmit = async (formData) => {
    const nuevoUsuario = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      direccion: formData.direccion,
      correo: formData.correo,
      telefono: formData.telefono,
      password: formData.password, // Se encripta en el backend
      fk_rol: parseInt(formData.fk_rol, 10),
      fk_estado: parseInt(formData.fk_estado, 10),
    };

    try {
      await registerUser(nuevoUsuario);
      // Redirecciona al listado de usuarios
      navigate('/admin/usuarios');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setError('Hubo un problema al crear el usuario. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Crear Usuario">
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            register={register('nombre')}
            error={errors.nombre?.message}
          />

          {/* APELLIDO */}
          <FormInput
            label="Apellido:"
            id="apellido"
            register={register('apellido')}
            error={errors.apellido?.message}
          />

          {/* DIRECCIÓN */}
          <FormInput
            label="Dirección:"
            id="direccion"
            register={register('direccion')}
            error={errors.direccion?.message}
          />

          {/* CORREO */}
          <FormInput
            label="Correo:"
            id="correo"
            type="email"
            register={register('correo')}
            error={errors.correo?.message}
          />

          {/* TELÉFONO */}
          <FormInput
            label="Teléfono:"
            id="telefono"
            register={register('telefono')}
            error={errors.telefono?.message}
          />

          {/* CONTRASEÑA */}
          <FormInput
            label="Contraseña:"
            id="password"
            type="password"
            register={register('password')}
            error={errors.password?.message}
          />

          {/* ROL */}
          <FormSelect
            label="Rol:"
            id="fk_rol"
            register={register('fk_rol')}
            error={errors.fk_rol?.message}
            options={[
              { label: 'Administrador', value: 1 },
              { label: 'Cliente', value: 2 },
            ]}
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

export default CrearUsuario;
