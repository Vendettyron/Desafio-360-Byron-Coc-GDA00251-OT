import { Routes, Route } from 'react-router-dom';
import { AppSidebar } from "@/components/ui/app-sidebar"
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
import AgregarProductosCarritoAdmin from '@/components/Admin/Usuarios/AgregarProductosCarritoAdmin';

//componentes de productos
import Productos from '@/components/Admin/Productos/Productos';
import CrearProducto from '@/components/Admin/Productos/CrearProducto';
import ActualizarProducto from '@/components/Admin/Productos/ActualizarProducto';
import EditarCarritoAdmin from '@/components/Admin/Usuarios/EditarCarritoAdmin';

// componeente de pedidos
import Pedidos from '@/components/Admin/Pedidos/Pedidos';
import PedidoDetallesPorUsuario from '@/components/Admin/Pedidos/PedidoDetallesPorUsuario';
import ConfirmarCancelarPedido from '@/components/Admin/Pedidos/ConfirmarCancelarPedido';
import { Toaster } from 'react-hot-toast';


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
                <BreadcrumbItem>
                  <BreadcrumbPage>Contraer</BreadcrumbPage>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-col  justify-center gap-4 p-4 pt-0 items-center">
            <Routes>
              <Route path='/' element={<Pedidos/>}/>

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
              <Route path="usuarios/carrito/:id" element={<EditarCarritoAdmin/>}/>
              <Route path="usuarios/agregar-productos-carrito/:id" element={<AgregarProductosCarritoAdmin/>}/>

              {/* Rutas de productos */}
              <Route path="productos" element={<Productos/>} />
              <Route path="productos/crear" element={<CrearProducto />} />
              <Route path="productos/actualizar/:id" element={<ActualizarProducto />} />

              {/* Rutas de pedidos */}
              <Route path="pedido" element={<Pedidos/>} />
              <Route path="pedido/obtenerDetallesClientePorAdmin/:idcliente/:idpedido" element={<PedidoDetallesPorUsuario />} />
              <Route path="pedido/confirmar-cancelar/:idpedido" element={<ConfirmarCancelarPedido />} />
              
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster
          position="bottom-center"
          reverseOrder={false}
      />
    </>
  );
}

export { AdminLayout };