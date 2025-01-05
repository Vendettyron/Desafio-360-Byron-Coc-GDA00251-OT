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

// Schema para crear y actualizar un producto

export const productosSchema = Yup.object().shape({
  fk_categoria: Yup
    .number()
    .required('La categoría es obligatoria')
    .integer('La categoría debe ser un número entero'),
  
  fk_estado: Yup
    .number()
    .required('El estado es obligatorio')
    .oneOf([Estados.ACTIVO, Estados.INACTIVO, Estados.DESCONTINUADO], 'Estado inválido'), // 1: Activo, 2: Inactivo 8: Descontinuado
  
  fk_proveedor: Yup
    .number()
    .required('El proveedor es obligatorio')
    .integer('El proveedor debe ser un número entero'),
  
  nombre: Yup
    .string()
    .required('El nombre del producto es obligatorio')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),
  
  descripcion: Yup
    .string()
    .required('La descripción es obligatoria')
    .max(500, 'La descripción no puede exceder los 500 caracteres'),
  
  precio: Yup
    .number()
    .required('El precio es obligatorio')
    .positive('El precio debe ser un número positivo')
    .typeError('El precio debe ser un número'),
  
  stock: Yup
    .number()
    .required('El stock es obligatorio')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .typeError('El stock debe ser un número'),
    
    imagen: Yup
    .mixed()
    .nullable() // Permite que sea null
    .test('fileSize', 'El tamaño de la imagen es demasiado grande (máximo 5MB)', value => {
      if (!value) return true; // Si no se seleccionó una imagen, es válido
      if (!value.length) return true; // No se seleccionó una imagen, así que es válido
      return value[0].size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Solo se permiten imágenes JPEG, JPG y PNG', value => {
      if (!value) return true; // Si no se seleccionó una imagen, es válido
      if (!value.length) return true; // No se seleccionó una imagen, así que es válido
      return ['image/jpeg', 'image/jpg', 'image/png'].includes(value[0].type);
    })
    .notRequired(), // Hace que el campo sea opcional
});

// Schema para que el usuario elimine su cuenta
export const EliminarUsuarioElMismoSchema = Yup.object().shape({
  correo: Yup.string()
    .email('Debe ser un correo válido')
    .required('El correo es requerido'),

  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .typeError('La contraseña debe tener al menos 6 caracteres'),

  confirmarPassword: Yup.string()
    .required('La confirmación de la contraseña es obligatoria')
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
    .typeError('La contraseña no coincide'),
});



