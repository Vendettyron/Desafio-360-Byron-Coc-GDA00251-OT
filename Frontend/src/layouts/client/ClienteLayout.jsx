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

// componentes reutilizables
import Navbar from '@/components/Common/Navbar';

const ClinteLayout = () => {
    return (
        <>  
                <Navbar/>
                <Routes>

                    {/* Rutas de productos*/}
                    <Route path="/" element={<Productos/>}/>
                    <Route path="productoId/:id" element={<ProductoPorId/>}/>
                     {/* Rutas de Carritos */}
                    <Route path="carrito" element={<Carrito/>}/>

                     {/* Rutas de Pedidos*/}
                    <Route path="pedidos" element={<Pedidos/>}/> 
                </Routes>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
        </>
        
    );
};

export default ClinteLayout;
