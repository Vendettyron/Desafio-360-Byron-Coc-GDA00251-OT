import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { proveedorSchema } from '@/utils/validationSchemas';
import { crearProveedor } from '@/services/proveedoresService';
import Estados from '@/config/estados';
import { toast } from 'react-hot-toast';

// Componentes reutilizables
import { Button } from '@/components/ui/button';
import FormLayout from '@/components/Forms/FormLayout';
import FormInput from '@/components/Forms/FormInput';
import FormSelect from '@/components/Forms/FormSelect';


const CrearProveedor = () => {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(proveedorSchema),
    defaultValues: {
      nombre: '',
      telefono: '',
      correo: '',
      fk_estado: Estados.ACTIVO, // Por defecto, asignamos 1 (Activo)
    },
  });

  const onSubmit = async (formData) => {

    try {
        const ProveedorCreado = {
            nombre: formData.nombre,
            telefono: formData.telefono,
            correo: formData.correo,
            fk_estado: formData.fk_estado,
        }

      // Llamar al servicio para crear el proveedor
      await crearProveedor(ProveedorCreado);

      // Limpia el formulario
      reset();
      setError('');
      toast.success('¡Proveedor creado exitosamente!');
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      setError('Hubo un problema al crear el proveedor. Intente nuevamente.');
    }
  };

  return (
    <>
      <FormLayout title="Crear Proveedor">

        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            placeholder="Ingrese el nombre del proveedor"
            register={register('nombre')}
            error={errors.nombre?.message}
          />

          {/* TELEFONO */}
          <FormInput
            label="Teléfono:"
            id="telefono"
            placeholder="Ingrese el teléfono del proveedor"
            register={register('telefono')}
            error={errors.telefono?.message}
          />

          {/* CORREO */}
          <FormInput
            label="Correo:"
            id="correo"
            type="email"
            placeholder="Ingrese el correo del proveedor"
            register={register('correo')}
            error={errors.correo?.message}
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
        
          <div style={{ display: 'flex', justifyContent: 'center', }}>
            <Button type="submit" disabled={isSubmitting || !isDirty} variant="default">
              {isSubmitting ? 'Creando...' : 'Crear Proveedor'}
            </Button>
          </div>

          </form>
      
      </FormLayout>
    </>
  );
};

export default CrearProveedor;