import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Usa Route para rutas internas si es necesario
import Productos from '@/components/Cliente/Productos/Productos';
import ProductoPorId from '@/components/Cliente/Productos/ProductoPorID';
import Carrito from '@/components/Cliente/CarritoPedido/Carrito';
import { Toaster } from 'react-hot-toast';

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
                </Routes>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
        </>
        
    );
};

export default ClinteLayout;
