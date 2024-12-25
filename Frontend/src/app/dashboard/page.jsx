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

const Page = () => {
  return (
    <>
      <SidebarProvider>
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
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Routes>
              <Route path='/' element={<AdminHome/>}/>
              <Route path="proveedores" element={<Proveedores/>} />
              <Route path="proveedores/actualizar/:id" element={<ActualizarProveedor />} />
              <Route path="proveedores/crear" element={<CrearProveedor />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export { Page };