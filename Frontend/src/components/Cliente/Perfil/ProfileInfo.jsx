import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import FormLayout from "@/components/Forms/FormLayout";


const ProfileInfo = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  // Verifica si el usuario está autenticado
  const usuarioAutenticado = auth?.usuario;

  // Maneja la navegación a Modificar Perfil
  const handleModificarPerfil = () => {
      navigate("/cliente/modificarPerfil");
    };

  // Maneja la navegación a Eliminar Cuenta con confirmación
  const handleEliminarCuenta = () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (confirmacion) {
      navigate("/cliente/eliminarCuenta"); 
    }
  };

  return (
    <>
        <h2 className='title-table-admin text-black mt-3 mb-5'>Informacion de la cuenta</h2>  
        <FormLayout>
                <div className='grid grid-cols-2 gap-1'>
                    <div className='text-left font-bold'>
                        <p>Nombre:</p>
                        <p>Apellido:</p>
                        <p>Direccion:</p>
                        <p>Correo:</p>
                        <p>Telefono:</p>
                    </div>
                    <div className='text-left'>
                        <p>{usuarioAutenticado.nombre}</p>
                        <p>{usuarioAutenticado.apellido}</p>
                        <p>{usuarioAutenticado.direccion}</p>
                        <p>{usuarioAutenticado.correo}</p>
                        <p>{usuarioAutenticado.telefono}</p>
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <button className="btn-editar mx-2" onClick={handleModificarPerfil}>
                        Modificar Perfil
                    </button>
                    <button className="btn-inactivar" onClick={handleEliminarCuenta}>
                        Eliminar Cuenta
                    </button>
                </div>

        </FormLayout>
    </>
  );
};

export default ProfileInfo;
