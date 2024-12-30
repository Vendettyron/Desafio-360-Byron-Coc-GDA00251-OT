import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormLayout from '@/components/Forms/FormLayout';
import FormSelect from '@/components/Forms/FormSelect';
import { registerUser } from '@/services/authService';
import Roles from '@/config/roles';

const Register = () => {
  const navigate = useNavigate();

  // Estado para manejar mensajes de error y éxito
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required('El nombre es requerido')
      .max(100, 'El nombre no puede exceder los 100 caracteres'),
    apellido: Yup.string()
      .required('El apellido es requerido')
      .max(100, 'El apellido no puede exceder los 100 caracteres'),
    correo: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es requerido')
      .max(100, 'El correo no puede exceder los 100 caracteres'),
    password: Yup.string()
      .required('La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(255, 'La contraseña no puede exceder los 255 caracteres'),
    direccion: Yup.string()
      .required('La dirección es requerida')
      .max(255, 'La dirección no puede exceder los 255 caracteres'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^\d+$/, 'El teléfono solo debe contener números')
      .min(7, 'El teléfono debe tener al menos 7 dígitos')
      .max(15, 'El teléfono no puede exceder los 15 dígitos'),
  });

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    try {
      // Agregar los campos fk_rol y fk_estado
      const userData = {
        ...data,
        fk_estado: 1, // Estado 'Activo'
      };

      const response = await registerUser(userData);
      console.log('Mi Token:', response.token); // Registrar el token en la consola

      setSuccessMessage('Registro exitoso. Puedes iniciar sesión ahora.');
      toast.success('Registro exitoso. Puedes iniciar sesión ahora.');
      setErrorMessage('');
      reset(); // Reiniciar el formulario

      // Redirigir al usuario a la página de login después de un tiempo
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMessage(error.message || 'Error al registrar el usuario.');
      toast.error('Error al registrar el usuario.');
      setSuccessMessage('');
    }
  };

  return (
    <> 
      <FormLayout>
        <h2 className='text-3xl text-center'>Registrarse</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              {...register('nombre')}
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.nombre?.message}</div>
          </div>

          {/* Apellido */}
          <div className="mb-3">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              {...register('apellido')}
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.apellido?.message}</div>
          </div>

          {/* Correo Electrónico */}
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              {...register('correo')}
              className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.correo?.message}</div>
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>

          {/* Dirección */}
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              {...register('direccion')}
              className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.direccion?.message}</div>
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              {...register('telefono')}
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.telefono?.message}</div>
          </div>

          <FormSelect
            label="Rol:"
            id="fk_rol"
            register={register('fk_rol')}
            error={errors.fk_rol?.message}
            options={[
              { label: 'Administrador', value: Roles.ADMIN },
              { label: 'Cliente', value: Roles.CLIENTE },
            ]}
          />

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Registrarse
          </button>
        </form>
        </FormLayout>
    </>
  );
};

export default Register;
