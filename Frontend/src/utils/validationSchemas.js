import * as Yup from 'yup';
import Roles from '@/config/roles';
import Estados from '@/config/estados';

// esquema de validación para el formulario de inicio de sesión
export const loginSchema = Yup.object().shape({

  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
    
  password: Yup.string()
    .required('La contraseña es requerida'),
});

/**
 * Schema para regsitrar un usuario nuevo.
 * Schema para actualizar un usuario existente.
 */
export const usuariosSchema = Yup.object().shape({
  nombre: Yup
    .string()
    .required('El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),
  
  apellido: Yup
    .string()
    .required('El apellido es obligatorio')
    .max(100, 'El apellido no puede exceder los 100 caracteres'),
  
  direccion: Yup
    .string()
    .required('La dirección es obligatoria')
    .max(200, 'La dirección no puede exceder los 200 caracteres'),
  
  correo: Yup
    .string()
    .required('El correo es obligatorio')
    .email('Debe ser un correo electrónico válido'),
  
  telefono: Yup
    .string()
    .required('El teléfono es obligatorio')
    .matches(/^\d{8}$/, 'El teléfono debe tener 8 dígitos'),
  
  password: Yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  
  fk_rol: Yup
    .number()
    .required('El rol es obligatorio')
    .oneOf([Roles.ADMIN, Roles.CLIENTE], 'Rol inválido'), // 1: Administrador, 2: Cliente
  
  fk_estado: Yup
    .number()
    .required('El estado es obligatorio')
    .oneOf([Estados.ACTIVO, Estados.INACTIVO], 'Estado inválido'), // 1: Activo, 2: Inactivo
});


// esquema de validación para actualizar o crear un proveedor
export const proveedorSchema = Yup.object().shape({
  nombre: Yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  telefono: Yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\d{8}$/, 'El teléfono debe tener 8 dígitos'), // Ejemplo de validación
  correo: Yup
    .string()
    .email('Debe ser un correo válido')
    .required('El correo es requerido'),
  fk_estado: Yup
    .number()
    .required('El estado es requerido')
    .oneOf([Estados.ACTIVO,Estados.INACTIVO], 'Estado inválido'),
});

// Schema para crear y actualizar categorías
export const categoriaCrearSchema = Yup.object().shape({
  nombre: Yup
    .string()
    .required('El nombre de la categoría es obligatorio')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),
  descripcion: Yup
    .string()
    .required('La descripción es obligatoria')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  fk_estado: Yup
    .number()
    .required('El estado es obligatorio')
    .oneOf([Estados.ACTIVO, Estados.INACTIVO], 'Estado inválido'), // 1: Activo, 2: Inactivo
});

// Schema para crear y actualizar un estado 
export const estadoSchema = Yup.object().shape({
  nombre: Yup
    .string()
    .required('El nombre del estado es obligatorio')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),   
});
