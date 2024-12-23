// esquema de validación para el formulario de inicio de sesión

import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({

  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
    
  password: Yup.string()
    .required('La contraseña es requerida'),
});
