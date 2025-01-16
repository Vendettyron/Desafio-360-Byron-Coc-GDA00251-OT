import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import FormLayout from "@/components/Forms/FormLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
      navigate("/cliente/eliminarCuenta"); 
  };

  return (
    <>  
        <div className='flex flex-col items-center mt-10'> 
          <FormLayout >
            <h2 className='title-table-admin text-black mt-3 mb-5'>Informacion de la cuenta</h2>  
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
                {/* Botón para modificar perfil */}
                <button className="btn-editar mx-2" onClick={handleModificarPerfil}>
                    Modificar Perfil
                </button>
                {/* Botón para eliminar cuenta y alerta*/}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                  <button className="btn-inactivar" >
                      Eliminar Cuenta
                  </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Estas seguro de elimiar tu cuenta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Al eliminar tu cuenta, perderás toda la información relacionada a ella.
                        y no podrás recuperarla.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEliminarCuenta} className="mt-2">Eliminar Cuenta</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </FormLayout>
        </div>

    </>
  );
};

export default ProfileInfo;
