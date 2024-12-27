import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { obtenerUsuarioPorId, actualizarUsuario } from '@/services/usuariosService';

// Schema de validación
import { usuariosSchema } from '@/utils/validationSchemas';
import Estados from '@/config/estados';
import Roles from '@/config/roles';

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormSelect from '@/components/Forms/FormSelect';
import FormLayout from '@/components/Forms/FormLayout';
import { Button} from '@/components/ui/button';

const ActualizarUsuario = () => {
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
    resolver: yupResolver(usuariosSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      direccion: '',
      correo: '',
      telefono: '',
      password: '', 
      fk_rol: Roles.CLIENTE, // Cliente por defecto
      fk_estado: Estados.ACTIVO , // Activo por defecto
    },
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await obtenerUsuarioPorId(id);
        console.log('Datos del usuario:', data); // Para depuración

        if (data && Array.isArray(data) && data.length > 0) {
          // Si la API devuelve un arreglo con un usuario
          setValue('nombre', data[0].nombre || '');
          setValue('apellido', data[0].apellido || '');
          setValue('direccion', data[0].direccion || '');
          setValue('correo', data[0].correo || '');
          setValue('telefono', data[0].telefono || '');
          setValue('fk_rol', data[0].fk_rol || Roles.CLIENTE);
          setValue('fk_estado', data[0].fk_estado || Estados.ACTIVO);
        } else if (data && typeof data === 'object') {
          // Si la API devuelve un objeto único
          setValue('nombre', data.nombre || '');
          setValue('apellido', data.apellido || '');
          setValue('direccion', data.direccion || '');
          setValue('correo', data.correo || '');
          setValue('telefono', data.telefono || '');
          setValue('fk_rol', data.fk_rol || Roles.CLIENTE);
          setValue('fk_estado', data.fk_estado || Estados.ACTIVO);
        } else {
          setError('No se encontró el usuario con el ID proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        setError('No se pudo obtener el usuario. Intente nuevamente.');
      }
    };
    fetchUsuario();
  }, [id, setValue]);

  // Manejo del submit
  const onSubmit = async (formData) => {
    const usuarioActualizado = {
      pk_id_usuario: parseInt(id, 10),
      nombre: formData.nombre,
      apellido: formData.apellido,
      direccion: formData.direccion,
      correo: formData.correo,
      telefono: formData.telefono,
      password: formData.password,
      fk_rol: parseInt(formData.fk_rol, 10),
      fk_estado: parseInt(formData.fk_estado, 10),
      fk_id_usuario: auth?.usuario?.id, // ID de quien actualiza (admin)
    };

    try {
      await actualizarUsuario(id, usuarioActualizado);
      // Redirecciona al listado de usuarios
      navigate('/admin/usuarios');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError('Hubo un problema al actualizar el usuario. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Actualizar Usuario">
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

export default ActualizarUsuario;
