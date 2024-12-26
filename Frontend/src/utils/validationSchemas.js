import * as Yup from 'yup';

// esquema de validación para el formulario de inicio de sesión
export const loginSchema = Yup.object().shape({

  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
    
  password: Yup.string()
    .required('La contraseña es requerida'),
});

// esquema de validación para el formulario de Actualizar Proveedor
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
    .oneOf([1,2], 'Estado inválido'),
});

// esquema de validación para el formulario de Crear Proveedor

export const proveedorCrearSchema = Yup.object().shape({
  nombre: Yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  telefono: Yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\d{8}$/, 'El teléfono debe tener 8 dígitos'),
  correo: Yup
    .string()
    .required('El correo es requerido')
    .email('Debe ser un correo válido'),
  fk_estado: Yup
    .number()
    .required('El estado es requerido')
    .oneOf([1, 2], 'Estado inválido'), // 1 = Activo, 2 = Inactivo
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
    .oneOf([1, 2], 'Estado inválido'), // 1: Activo, 2: Inactivo
});
