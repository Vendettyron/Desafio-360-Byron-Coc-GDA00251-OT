import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// Context, servicios, configs
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../services/authService';
import Roles from "@/config/roles";
import { loginSchema } from '@/utils/validationSchemas';
// UI components
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // React Hook Form con Yup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      correo: '',
      password: '',
    },
  });

  const handleClick = () => {
    window.open(
      'https://github.com/Vendettyron/Desafio-360-Byron-Coc-GDA00251-OT',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Enviamos datos al servicio "login"
      const response = await login(data.correo, data.password);
      console.log('Login Response:', response);

      // Almacenar el token y los datos del usuario en el contexto
      loginUser(response);

      // Redirigir según rol
      if (response.usuario.fk_rol === Roles.CLIENTE) {
        navigate('/cliente');
      } else {
        navigate('/admin');
      }

      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Credenciales inválidas. Por favor, intenta de nuevo.');
      setErrorMessage(error.message || 'Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className={cn("flex flex-col gap-6 shadow-lg bg-slate-200 p-5 rounded-lg", className)}
        {...props}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Bienvenido a Mi Tiendita Online</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div className="grid gap-6">
          {/* CAMPO DE CORREO */}
          <div className="grid gap-2">
            <Label htmlFor="correo">Email</Label>
            <Input
              id="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              {...register('correo')}
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correo.message}
              </p>
            )}
          </div>

          {/* CAMPO DE CONTRASEÑA */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="*****"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* BOTÓN DE LOGIN */}
          <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full" onClick={handleSubmit}>
            {loading ? 'Cargando...' : 'Login'}
          </Button>

          {/* BOTÓN A REPOSITORIO */}
          <Button variant="outline" className="w-full bg-slate-300" onClick={handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 mr-2"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12
                   0 5.303 3.438 9.8 8.205 11.385
                   .6.113.82-.258.82-.577 0-.285
                   -.01-1.04-.015-2.04-3.338.724
                   -4.042-1.61-4.042-1.61C4.422
                   18.07 3.633 17.7 3.633 17.7
                   c-1.087-.744.084-.729.084-.729
                   1.205.084 1.838 1.236 1.838 1.236
                   1.07 1.835 2.809 1.305 3.495.998
                   .108-.776.417-1.305.76-1.605
                   -2.665-.3-5.466-1.332-5.466-5.93
                   0-1.31.465-2.38 1.235-3.22
                   -.135-.303-.54-1.523.105-3.176
                   0 0 1.005-.322 3.3 1.23.96-.267
                   1.98-.399 3-.405 1.02.006 2.04.138
                   3 .405 2.28-1.552 3.285-1.23
                   3.285-1.23.645 1.653.24 2.873
                   .12 3.176.765.84 1.23 1.91
                   1.23 3.22 0 4.61-2.805 5.625
                   -5.475 5.92.42.36.81 1.096.81
                   2.22 0 1.606-.015 2.896-.015
                   3.286 0 .315.21.69.825.57
                   C20.565 22.092 24 17.592 24
                   12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Link a Repositorio
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link to="/register" className="underline underline-offset-4">
            Registrarse
          </Link>
        </div>
      </form>

    </>
  );
}