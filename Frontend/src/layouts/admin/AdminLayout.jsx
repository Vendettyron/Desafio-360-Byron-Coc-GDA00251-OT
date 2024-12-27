import { Routes, Route } from 'react-router-dom';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import React from 'react';
import Proveedores from '../../components/Admin/Proveedores/Proveedores'; // Componente de Proveedores
import ActualizarProveedor from '../../components/Admin/Proveedores/ActualizarProveedor'; // Componente de Actualizar Proveedor
import CrearProveedor from '../../components/Admin/Proveedores/CrearProveedor'; // Componente de Crear Proveedor
import AdminHome from '../../components/Admin/AdminHome'; // Componente principal del Admin
//Componentes categorias
import Categorias from '@/components/Admin/Categorias/Categorias';
import CrearCategoria from '@/components/Admin/Categorias/CrearCategoria';
import ActualizarCategoria from '@/components/Admin/Categorias/ActualizarCategoria';

// componentes de estados
import Estados from '@/components/Admin/Estados/Estados';
import CrearEstado from '@/components/Admin/Estados/CrearEstado';
import ActualizarEstado from '@/components/Admin/Estados/ActualizarEstado';

//componentes de usuarios
import Usuarios from '@/components/Admin/Usuarios/Usuarios';
import CrearUsuario from '@/components/Admin/Usuarios/CrearUsuario';
import ActualizarUsuario from '@/components/Admin/Usuarios/ActualizarUsuario';

//componentes de productos
import Productos from '@/components/Admin/Productos/Productos';
import CrearProducto from '@/components/Admin/Productos/CrearProducto';
import ActualizarProducto from '@/components/Admin/Productos/ActualizarProducto';


const AdminLayout  = () => {
  return (
    <>
      <SidebarProvider>
        {/* componente NAV lateral*/}
        <AppSidebar />
        <SidebarInset>
          <header
            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-col  justify-center gap-4 p-4 pt-0 items-center">
            <Routes>
              <Route path='/' element={<AdminHome/>}/>

              {/* Rutas de proveedores */}
              <Route path="proveedores" element={<Proveedores/>} />
              <Route path="proveedores/crear" element={<CrearProveedor />} />
              <Route path="proveedores/actualizar/:id" element={<ActualizarProveedor />} />

              {/* Rutas de categorias */}
              <Route path="categorias" element={<Categorias/>} />
              <Route path="categorias/crear" element={<CrearCategoria />} />
              <Route path="categorias/actualizar/:id" element={<ActualizarCategoria />} />

              {/* Rutas de estados */}
              <Route path="estados" element={<Estados/>} />
              <Route path="estados/crear" element={<CrearEstado />} />
              <Route path="estados/actualizar/:id" element={<ActualizarEstado />} />

              {/* Rutas de usuarios */}
              <Route path="usuarios" element={<Usuarios/>} />
              <Route path="usuarios/crear" element={<CrearUsuario />} />
              <Route path="usuarios/actualizar/:id" element={<ActualizarUsuario />} />

              {/* Rutas de productos */}
              <Route path="productos" element={<Productos/>} />
              <Route path="productos/crear" element={<CrearProducto />} />
              <Route path="productos/actualizar/:id" element={<ActualizarProducto />} />
              
              
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export { AdminLayout };