
import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// react-hook-form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Context y servicios
import { AuthContext } from '@/context/AuthContext';
import { obtenerProveedorPorId, actualizarProveedor } from '@/services/proveedoresService';
import Estados from '@/config/estados';

// Schema de validación
import { proveedorSchema } from '@/utils/validationSchemas';

// Componentes reutilizables
import FormInput from '@/components/Forms/FormInput';
import FormSelect from '@/components/Forms/FormSelect';
import FormLayout from '@/components/Forms/FormLayout';
import { Button} from '@/components/ui/button';


const EditarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext); // Datos de autenticación


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(proveedorSchema),
    defaultValues: {
      nombre: '',
      telefono: '',
      correo: '',
      fk_estado: Estados.ACTIVO, // Activo por defecto
    },
  });

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const data = await obtenerProveedorPorId(id);
        if (data) {
          // Llenar los campos con los datos del proveedor
          setValue('nombre', data.nombre || '');
          setValue('telefono', data.telefono || '');
          setValue('correo', data.correo || '');
          setValue('fk_estado', data.fk_estado || Estados.ACTIVO);
        }
      } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        // Manejo de error (redirección o mostrar mensaje)
      }
    };
    fetchProveedor();
  }, [id, setValue]);

  // Manejo del submit
  const onSubmit = async (formData) => {
    // formData ya pasa las validaciones de Yup
    const proveedorActualizado = {
      pk_id_proveedor: parseInt(id, 10),
      nombre: formData.nombre,
      telefono: formData.telefono,
      correo: formData.correo,
      fk_estado: parseInt(formData.fk_estado, 10),
      fk_id_usuario: auth?.usuario?.id, // ID de quien actualiza (admin)
    };

    try {
      await actualizarProveedor(proveedorActualizado);
      toast.success('¡Proveedor actualizado exitosamente!');
      // Redirecciona al listado
      navigate('/admin/proveedores');
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      toast.error('Hubo un problema al actualizar el proveedor. Intente nuevamente.');
      // Manejo de error
    }
  };

  return (
    <>
      <FormLayout title="Actualizar proveedor">
      <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 'auto' }}>
      <FormInput
      label="Nombre:"
      id="nombre"
      register={register('nombre')}
      error={errors.nombre?.message}
      placeholder="Ingrese el nombre del proveedor"
      />

      <FormInput
      label="Teléfono:"
      id="telefono"
      register={register('telefono')}
      error={errors.telefono?.message}
      placeholder="Ingrese el teléfono del proveedor"
      />

      <FormInput
      label="Correo:"
      id="correo"
      type="email"
      register={register('correo')}
      error={errors.correo?.message}
      placeholder="Ingrese el correo del proveedor"
      />

      <FormSelect
      label="Estado:"
      id="fk_estado"
      register={register('fk_estado')}
      error={errors.fk_estado?.message}
      options={[
        { label: 'Activo', value: Estados.ACTIVO },
        { label: 'Inactivo', value: Estados.INACTIVO },
      ]}
      />

      <div style={{ display: 'flex', justifyContent: 'center', }}>
        <Button className="" type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Guardando...' : 'Actualizar'}
        </Button>
      </div>
      </form>
      </FormLayout >
    </>
    );
};

export default EditarProveedor;
