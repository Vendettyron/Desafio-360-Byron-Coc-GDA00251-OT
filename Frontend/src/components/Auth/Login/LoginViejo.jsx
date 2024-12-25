import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { login } from '../../../services/authService';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Common/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    correo: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .required('La contraseña es requerida'),
  });

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    setLoading(true); // Iniciar estado de carga
    setErrorMessage('');
    try {
      const response = await login(data.correo, data.password);
      console.log('Login Response:', response); // Verificar la estructura de la respuesta

      console.log('Mi Token:', response.token); // Mostrar el token en la consola

      // Almacenar el token y los datos del usuario en el contexto
      loginUser(response);

      // Redirigir al usuario a la página principal o dashboard
      navigate('/admin'); // Cambia a la ruta protegida que deseas probar
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage(error.message || 'Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  return (
    <>
      <Navbar/>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Iniciar Sesión</h2>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
