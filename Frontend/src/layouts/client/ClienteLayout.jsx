import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Usa Route para rutas internas si es necesario
import Productos from '@/components/Cliente/Productos';

// componentes reutilizables
import Navbar from '@/components/Common/Navbar';

const ClinteLayout = () => {
    return (
        <>  
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Productos/>}/>
                    <Route path="/cliente/productoId/:id"/>
                    <Route path="/cliente/carrito"/>
                </Routes>
        </>
        
    );
};

export default ClinteLayout;
