import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoriaCrearSchema } from "@/utils/validationSchemas";
import { crearCategoria } from "@/services/categoriasService";
import toast from "react-hot-toast";

// Componentes reutilizables

import { Button } from "@/components/ui/button";
import FormLayout from "@/components/Forms/FormLayout";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import Estados from "@/config/estados";

const CrearCategoria = () => {
  const [error, setError] = useState("");

  // esquema de validación para el formulario de Crear Categoría
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(categoriaCrearSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      fk_estado: Estados.ACTIVO, // Por defecto, asignamos 1 (Activo)
    },
  });

  const onSubmit = async (formData) => {
    try {
      const categoriaCreada = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fk_estado: formData.fk_estado,
      };

      // Llamar al servicio para crear la categoría
      await crearCategoria(categoriaCreada);

      // Limpia el formulario
      reset();
      setError("");
      toast.success("¡Categoría creada exitosamente!");
    } catch (err) {
      console.error("Error al crear categoría:", err);
      setError("Hubo un problema al crear la categoría. Intente nuevamente.");
      toast.error(
        "Hubo un problema al crear la categoría. Intente nuevamente."
      );
    }
  };

  return (
    <>
      <FormLayout title="Crear Categoría">
        <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: "auto" }}>
          {/* NOMBRE */}
          <FormInput
            label="Nombre:"
            id="nombre"
            placeholder="Ingrese el nombre de la categoría"
            register={register("nombre")}
            error={errors.nombre?.message}
          />

          {/* DESCRIPCIÓN */}
          <FormInput
            label="Descripción:"
            id="descripcion"
            placeholder="Ingrese la descripción de la categoría"
            register={register("descripcion")}
            error={errors.descripcion?.message}
          />

          {/* ESTADO */}
          <FormSelect
            label="Estado:"
            id="fk_estado"
            placeholder="Seleccione el estado de la categoría"
            register={register("fk_estado")}
            error={errors.fk_estado?.message}
            options={[
              { label: "Activo", value: Estados.ACTIVO },
              { label: "Inactivo", value: Estados.INACTIVO },
            ]}
          />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Creando..." : "Crear Categoría"}
            </Button>
          </div>
        </form>
      </FormLayout>
      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div
          style={{
            border: "1px solid red",
            padding: "10px",
            marginTop: "20px",
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </>
  );
};

export default CrearCategoria;
