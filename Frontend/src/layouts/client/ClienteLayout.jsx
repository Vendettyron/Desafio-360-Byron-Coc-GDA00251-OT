import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast';

//Componenetes Productos
import Productos from '@/components/Cliente/Productos/Productos';
import ProductoPorId from '@/components/Cliente/Productos/ProductoPorID';
// componentes Pedidos
import Pedidos from '@/components/Cliente/Pedido/Pedidos';

//componentes de carrito
import Carrito from '@/components/Cliente/Carrito/Carrito';

// compoenentes de perfil
import ProfileInfo from '@/components/Cliente/Perfil/ProfileInfo';
import EliminarCuenta from '@/components/Cliente/Perfil/EliminarCuenta';
import ModificarPerfil from '@/components/Cliente/Perfil/ModificarPerfil';
import CambiarPassword from '@/components/Cliente/Perfil/CambiarPassword';

// componentes reutilizables
import Navbar from '@/components/Common/Navbar';


const ClinteLayout = () => {
    return (
        <div id='clienteLayout'>      
                <Navbar/>
                <Routes>

                    {/* Rutas de productos*/}
                    <Route path="/" element={<Productos/>}/>
                    <Route path="productoId/:id" element={<ProductoPorId/>}/>
                     {/* Rutas de Carritos */}
                    <Route path="carrito" element={<Carrito/>}/>

                     {/* Rutas de Pedidos*/}
                    <Route path="pedidos" element={<Pedidos/>}/> 
                    
                    {/* Rutas de perfil*/}
                    <Route path="perfil" element={<ProfileInfo/>}/>
                    <Route path="eliminarCuenta" element={<EliminarCuenta/>}/>
                    <Route path="modificarPerfil" element={<ModificarPerfil/>}/>
                    <Route path="cambiarPassword" element={<CambiarPassword/>}/>

                </Routes>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
        </div>
        
    );
};

export default ClinteLayout;
